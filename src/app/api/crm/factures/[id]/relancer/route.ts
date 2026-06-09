import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import { calcTotaux, formatEuro } from "@/lib/chantier"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params
  const facture = await prisma.factureCrm.findUnique({
    where: { id }, include: {
      lignes: true,
      chantier: { include: { lead: { select: { nom: true, email: true } } } },
    },
  })
  const email = facture?.chantier?.lead?.email
  const nom   = facture?.chantier?.lead?.nom
  if (!email) return NextResponse.json({ error: "Pas d'email" }, { status: 400 })

  const { ttc } = calcTotaux(facture!.lignes, facture!.tva)
  const echeance = facture!.dateEcheance
    ? new Date(facture!.dateEcheance).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null

  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await t.sendMail({
    from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      email,
    subject: `⚠️ Rappel règlement — Facture ${facture!.numero} — Travaux Centre`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:28px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <p>Bonjour <strong>${nom}</strong>,</p>
          <p>Sauf erreur de notre part, la facture suivante reste en attente de règlement :</p>
          <div style="background:#fff8f0;border:2px solid #F97316;border-radius:10px;padding:20px;margin:20px 0;text-align:center">
            <p style="margin:0 0 4px;font-weight:bold;color:#0F2C5E;font-size:16px">${facture!.numero}</p>
            <p style="margin:0;font-size:28px;font-weight:bold;color:#dc2626">${formatEuro(ttc)}</p>
            ${echeance ? `<p style="margin:8px 0 0;color:#dc2626;font-size:13px">⚠️ Échéance : ${echeance}</p>` : ""}
          </div>
          <p>En cas de difficulté, n'hésitez pas à nous contacter pour convenir d'un arrangement.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#aaa;font-size:12px;text-align:center">Travaux Centre — Longuenesse (62219)</p>
        </div>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
