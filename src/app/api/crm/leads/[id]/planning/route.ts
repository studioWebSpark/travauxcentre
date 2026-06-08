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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id }   = await params
  const body     = await request.json()
  const { date, heure, duree, typeRdv, adresse, notes } = body

  if (!date || !heure || !typeRdv) {
    return NextResponse.json({ error: "Date, heure et type requis" }, { status: 400 })
  }

  const lead = await prisma.lead.findUnique({ where: { id } })
  if (!lead) return NextResponse.json({ error: "Lead introuvable" }, { status: 404 })

  // Construire la date complète
  const debut = new Date(`${date}T${heure}:00`)
  const fin   = new Date(debut.getTime() + (duree ?? 60) * 60_000)

  const planning = await prisma.planning.create({
    data: { leadId: id, date: debut, duree: duree ?? 60, typeRdv, adresse: adresse ?? null, notes: notes ?? null },
  })

  const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const confirmUrl = `${siteUrl}/planning/${planning.token}`

  const dateStr = debut.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  const heureStr = debut.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  // Email au CLIENT — demande de confirmation
  const t = transporter()
  await t.sendMail({
    from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      lead.email,
    subject: `Confirmation de votre rendez-vous — ${dateStr}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:20px">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${lead.nom},</h3>
          <p>Nous vous proposons un rendez-vous <strong>${typeRdv}</strong> :</p>

          <div style="background:#F8F7F4;border-left:4px solid #0F2C5E;padding:20px 24px;border-radius:0 8px 8px 0;margin:24px 0">
            <p style="margin:0 0 8px;font-size:16px;font-weight:bold;color:#0F2C5E">📅 ${dateStr}</p>
            <p style="margin:0 0 8px;color:#555">🕐 ${heureStr} — durée : ${duree ?? 60} min</p>
            ${adresse ? `<p style="margin:0;color:#555">📍 ${adresse}</p>` : ""}
            ${notes   ? `<p style="margin:8px 0 0;color:#888;font-size:13px">${notes}</p>` : ""}
          </div>

          <div style="text-align:center;margin:32px 0">
            <a href="${confirmUrl}" style="display:inline-block;background:#22c55e;color:white;font-weight:bold;font-size:16px;padding:14px 32px;border-radius:12px;text-decoration:none">
              ✅ Confirmer mon rendez-vous
            </a>
          </div>

          <p style="color:#888;font-size:13px;text-align:center">
            Si ce créneau ne vous convient pas, répondez à cet email ou appelez-nous.<br/>
            <strong>07 67 17 57 24</strong>
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="color:#aaa;font-size:12px;text-align:center">Travaux Centre — Longuenesse (62219) — travauxcentre.fr</p>
        </div>
      </div>
    `,
  })

  // Note automatique dans la fiche
  await prisma.noteLead.create({
    data: {
      leadId:  id,
      contenu: `📅 RDV planifié : ${typeRdv} le ${dateStr} à ${heureStr}${adresse ? ` — ${adresse}` : ""} — Email de confirmation envoyé`,
      auteur:  "Système",
    },
  })

  return NextResponse.json({ success: true, planningId: planning.id, token: planning.token })
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const plannings = await prisma.planning.findMany({
    where:   { leadId: id },
    orderBy: { date: "asc" },
  })
  return NextResponse.json(plannings)
}
