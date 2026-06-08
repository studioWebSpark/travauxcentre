import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import { calcTotaux, formatEuro } from "@/lib/chantier"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const devis  = await prisma.devisCrm.findUnique({
    where: { id }, include: { lignes: true, lead: { select: { nom: true, email: true } } },
  })
  if (!devis?.lead?.email) return NextResponse.json({ error: "Pas d'email" }, { status: 400 })

  const { ttc } = calcTotaux(devis.lignes, devis.tva)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await t.sendMail({
    from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      devis.lead.email,
    subject: `Rappel : votre devis ${devis.numero} est en attente — Travaux Centre`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:28px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <p>Bonjour <strong>${devis.lead.nom}</strong>,</p>
          <p>Je vous contacte au sujet de votre devis <strong>${devis.numero}</strong> que je vous ai adressé.</p>
          <div style="background:#F8F7F4;border-left:4px solid #F97316;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0">
            <p style="margin:0 0 4px;font-weight:bold;color:#0F2C5E">${devis.numero}</p>
            <p style="margin:0;font-size:22px;font-weight:bold;color:#F97316">${formatEuro(ttc)} TTC</p>
          </div>
          <p>Avez-vous des questions ou souhaitez-vous modifier quelque chose ? Je suis à votre disposition.</p>
          <div style="text-align:center;margin:24px 0">
            <a href="${siteUrl}/devis/${devis.token}" style="display:inline-block;background:#0F2C5E;color:white;font-weight:bold;padding:12px 28px;border-radius:10px;text-decoration:none">
              Consulter et accepter mon devis
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#aaa;font-size:12px;text-align:center">Travaux Centre — Longuenesse (62219)</p>
        </div>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
