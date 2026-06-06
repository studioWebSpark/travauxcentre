import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateIcal } from "@/lib/ical"
import nodemailer from "nodemailer"

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

export async function POST(
  _: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const planning = await prisma.planning.findUnique({
    where:   { token },
    include: { lead: true },
  })

  if (!planning) return NextResponse.json({ error: "Lien invalide" }, { status: 404 })
  if (planning.statut === "CONFIRME") return NextResponse.json({ alreadyConfirmed: true })
  if (planning.statut === "ANNULE")   return NextResponse.json({ cancelled: true })

  // Marquer comme confirmé
  await prisma.planning.update({ where: { token }, data: { statut: "CONFIRME" } })

  const lead  = planning.lead
  const debut = planning.date
  const fin   = new Date(debut.getTime() + planning.duree * 60_000)

  const dateStr  = debut.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  const heureStr = debut.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  // Générer le fichier .ics
  const icsContent = generateIcal({
    uid:         planning.id,
    titre:       `RDV ${planning.typeRdv} — ${lead.nom}`,
    description: `Client : ${lead.nom}\nProjet : ${lead.typeTravaux}\nTél : ${lead.telephone}${planning.notes ? `\nNotes : ${planning.notes}` : ""}`,
    lieu:        planning.adresse ?? "Longuenesse",
    debut,
    fin,
  })

  // Email à l'ARTISAN avec .ics en pièce jointe
  const t = transporter()
  await t.sendMail({
    from:    `CRM Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      process.env.EMAIL_TO,
    subject: `✅ RDV confirmé — ${lead.nom} — ${dateStr} à ${heureStr}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <div style="background:#22c55e;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0">✅ Rendez-vous confirmé !</h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">${lead.nom} a confirmé son rendez-vous.</h3>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px;color:#888">Type</td><td style="font-weight:bold">${planning.typeRdv}</td></tr>
            <tr><td style="padding:6px;color:#888">Date</td><td style="font-weight:bold">${dateStr}</td></tr>
            <tr><td style="padding:6px;color:#888">Heure</td><td style="font-weight:bold">${heureStr} (${planning.duree} min)</td></tr>
            <tr><td style="padding:6px;color:#888">Adresse</td><td>${planning.adresse ?? "—"}</td></tr>
            <tr><td style="padding:6px;color:#888">Téléphone</td><td><a href="tel:${lead.telephone}">${lead.telephone}</a></td></tr>
            <tr><td style="padding:6px;color:#888">Projet</td><td>${lead.typeTravaux}</td></tr>
          </table>
          <p style="margin-top:16px;color:#888;font-size:13px">📎 Le fichier calendrier (.ics) est en pièce jointe — ouvrez-le pour l'ajouter à votre agenda.</p>
        </div>
      </div>
    `,
    attachments: [{
      filename:    `rdv-${lead.nom.toLowerCase().replace(/\s+/g, "-")}.ics`,
      content:     Buffer.from(icsContent, "utf-8"),
      contentType: "text/calendar; charset=utf-8; method=REQUEST",
    }],
  })

  // Note dans la fiche
  await prisma.noteLead.create({
    data: {
      leadId:  lead.id,
      contenu: `✅ ${lead.nom} a confirmé le RDV du ${dateStr} à ${heureStr}`,
      auteur:  "Système",
    },
  })

  return NextResponse.json({ success: true })
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const planning  = await prisma.planning.findUnique({
    where:   { token },
    include: { lead: { select: { nom: true, typeTravaux: true } } },
  })
  if (!planning) return NextResponse.json({ error: "Introuvable" }, { status: 404 })
  return NextResponse.json(planning)
}
