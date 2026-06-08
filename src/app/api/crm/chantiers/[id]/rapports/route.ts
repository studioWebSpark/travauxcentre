import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { date, heures, description, meteo, envoyer } = await request.json()
  if (!description) return NextResponse.json({ error: "Description requise" }, { status: 400 })

  const rapport = await prisma.rapportJournalier.create({
    data: { chantierId: id, date: date ? new Date(date) : new Date(), heures: Number(heures) || 0, description, meteo: meteo || null, envoye: !!envoyer },
  })

  if (envoyer) {
    const chantier = await prisma.chantierCrm.findUnique({
      where:   { id },
      include: { lead: { select: { nom: true, email: true } } },
    })
    const email = chantier?.lead?.email
    if (email) {
      const t = nodemailer.createTransport({
        host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
      const dateStr = new Date(date || Date.now()).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
      await t.sendMail({
        from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
        to:      email,
        subject: `📋 Rapport journalier — ${chantier?.titre} — ${dateStr}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
              <h2 style="color:white;margin:0;font-size:18px">📋 Rapport de chantier</h2>
            </div>
            <div style="padding:28px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
              <p>Bonjour <strong>${chantier?.lead?.nom}</strong>,</p>
              <p>Voici le compte-rendu des travaux effectués aujourd'hui sur votre chantier.</p>
              <div style="background:#F8F7F4;border-left:4px solid #0F2C5E;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0">
                <p style="margin:0 0 6px;font-weight:bold;color:#0F2C5E">🏗️ ${chantier?.titre}</p>
                <p style="margin:0 0 4px;font-size:13px;color:#555">📅 ${dateStr}</p>
                ${heures ? `<p style="margin:0 0 4px;font-size:13px;color:#555">⏱️ ${heures}h de travail</p>` : ""}
                ${meteo ? `<p style="margin:0 0 4px;font-size:13px;color:#888">🌤️ Météo : ${meteo}</p>` : ""}
              </div>
              <p style="font-weight:bold;color:#0F2C5E">Travaux réalisés :</p>
              <p style="color:#374151;line-height:1.7">${description.replace(/\n/g, "<br/>")}</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
              <p style="color:#aaa;font-size:12px;text-align:center">Travaux Centre — Longuenesse (62219)</p>
            </div>
          </div>
        `,
      })
      await prisma.rapportJournalier.update({ where: { id: rapport.id }, data: { envoye: true } })
    }
  }

  return NextResponse.json(rapport)
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }    = await params
  const rapports  = await prisma.rapportJournalier.findMany({ where: { chantierId: id }, orderBy: { date: "desc" } })
  return NextResponse.json(rapports)
}
