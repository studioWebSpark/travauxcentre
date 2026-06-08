import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params
  const lead    = await prisma.lead.findUnique({ where: { id } })
  if (!lead?.email) return NextResponse.json({ error: "Pas d'email" }, { status: 400 })

  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await t.sendMail({
    from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      lead.email,
    subject: `Votre projet de ${lead.typeTravaux} — Travaux Centre`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:28px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <p>Bonjour <strong>${lead.nom}</strong>,</p>
          <p>Je reviens vers vous au sujet de votre projet de <strong>${lead.typeTravaux}</strong>.</p>
          <p>Avez-vous avancé dans votre réflexion ? Je suis disponible pour répondre à vos questions et établir un devis gratuit.</p>
          <div style="text-align:center;margin:28px 0">
            <a href="tel:+33767175724" style="display:inline-block;background:#0F2C5E;color:white;font-weight:bold;padding:12px 28px;border-radius:10px;text-decoration:none">
              📞 Me rappeler
            </a>
          </div>
          <p style="color:#888;font-size:13px">N'hésitez pas à répondre directement à cet email.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#aaa;font-size:12px;text-align:center">Travaux Centre — Longuenesse (62219)</p>
        </div>
      </div>
    `,
  })

  await prisma.noteLead.create({ data: { leadId: id, contenu: "📧 Email de relance envoyé", auteur: "CRM" } })
  await prisma.lead.update({ where: { id }, data: { statut: "CONTACTE" } })

  return NextResponse.json({ success: true })
}
