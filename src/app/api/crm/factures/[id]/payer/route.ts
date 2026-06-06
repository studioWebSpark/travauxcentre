import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { FacturePDF } from "@/lib/pdf-templates"
import nodemailer from "nodemailer"
import React from "react"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const facture = await prisma.factureCrm.findUnique({
    where:   { id },
    include: {
      lignes:   true,
      chantier: {
        include: { lead: { select: { nom: true, email: true, telephone: true, ville: true, codePostal: true } } },
      },
    },
  })
  if (!facture) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  // Marquer comme payée
  await prisma.factureCrm.update({ where: { id }, data: { statut: "PAYEE" } })

  const client = facture.chantier?.lead ?? null
  if (!client?.email) return NextResponse.json({ success: true, emailSent: false })

  const ht  = facture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const ttc = ht * (1 + facture.tva)
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)

  // Générer le PDF de la facture acquittée
  const pdfBuffer = await renderToBuffer(
    React.createElement(FacturePDF, {
      numero:          facture.numero,
      dateEmission:    facture.dateEmission,
      dateEcheance:    facture.dateEcheance,
      client,
      chantierTitre:   facture.chantier?.titre   ?? null,
      chantierAdresse: facture.chantier?.adresse ?? null,
      lignes:          facture.lignes,
      tva:             facture.tva,
      notes:           "ACQUITTÉE — Paiement reçu. Merci de votre confiance.",
      type:            facture.type,
    })
  )

  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await t.sendMail({
    from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      client.email,
    subject: `✅ Reçu de paiement — ${facture.numero} — Travaux Centre`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#22c55e;padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:20px">✅ Paiement reçu — Merci !</h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${client.nom},</h3>
          <p>Nous avons bien reçu votre règlement pour la facture <strong>${facture.numero}</strong>.</p>

          <div style="background:#F8F7F4;border-left:4px solid #22c55e;padding:20px 24px;border-radius:0 8px 8px 0;margin:24px 0">
            <p style="margin:0 0 4px;color:#555;font-size:13px">Facture</p>
            <p style="margin:0 0 6px;font-size:16px;font-weight:bold;color:#0F2C5E">${facture.numero}</p>
            ${facture.chantier ? `<p style="margin:0 0 4px;color:#555;font-size:13px">🏗️ ${facture.chantier.titre}</p>` : ""}
            <p style="margin:8px 0 0;font-size:22px;font-weight:bold;color:#22c55e">${fmt(ttc)} TTC</p>
            <p style="margin:4px 0 0;color:#888;font-size:12px;font-weight:bold">ACQUITTÉE</p>
          </div>

          <p>Vous trouverez votre facture acquittée en pièce jointe pour vos archives.</p>
          <p>Merci de votre confiance. C'était un plaisir de travailler pour vous !</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="color:#aaa;font-size:12px;text-align:center">
            Travaux Centre — Longuenesse (62219)<br/>
            03 XX XX XX XX — contact@travauxcentre.fr
          </p>
        </div>
      </div>
    `,
    attachments: [{
      filename:    `${facture.numero}-acquittee.pdf`,
      content:     pdfBuffer,
      contentType: "application/pdf",
    }],
  })

  return NextResponse.json({ success: true, emailSent: true })
}
