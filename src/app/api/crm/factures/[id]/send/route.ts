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
        select:  { titre: true, adresse: true, lead: true },
      },
    },
  })
  if (!facture) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  const client = facture.chantier?.lead ?? null
  if (!client?.email) return NextResponse.json({ error: "Pas d'email client" }, { status: 400 })

  const ht  = facture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const ttc = ht * (1 + facture.tva)
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)
  const fmtDate = (d: Date | null) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : null

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
      notes:           facture.notes,
      type:            facture.type,
    })
  )

  const typeLabel = facture.type === "ACOMPTE" ? "facture d'acompte" : "facture"

  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await t.sendMail({
    from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      client.email,
    subject: `Votre ${typeLabel} ${facture.numero} — Travaux Centre`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:22px">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${client.nom},</h3>
          <p>Veuillez trouver ci-joint votre ${typeLabel} <strong>${facture.numero}</strong>${facture.chantier ? ` concernant le chantier <strong>${facture.chantier.titre}</strong>` : ""}.</p>

          <div style="background:#F8F7F4;border-left:4px solid #22c55e;padding:20px 24px;border-radius:0 8px 8px 0;margin:24px 0">
            <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#0F2C5E">🧾 ${facture.numero}</p>
            <p style="margin:0 0 4px;font-size:20px;font-weight:bold;color:#22c55e">${fmt(ttc)} TTC</p>
            ${facture.dateEcheance ? `<p style="margin:4px 0 0;color:#dc2626;font-size:13px">⚠️ À régler avant le ${fmtDate(facture.dateEcheance)}</p>` : ""}
          </div>

          <p style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;font-size:13px;color:#1e40af">
            💳 Règlement par virement bancaire<br/>
            IBAN : FR76 XXXX XXXX XXXX XXXX XXXX XXX
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="color:#aaa;font-size:12px;text-align:center">
            Travaux Centre — Longuenesse (62219) — contact@travauxcentre.fr
          </p>
        </div>
      </div>
    `,
    attachments: [{
      filename:    `${facture.numero}.pdf`,
      content:     pdfBuffer,
      contentType: "application/pdf",
    }],
  })

  await prisma.factureCrm.update({
    where: { id },
    data:  { statut: "ENVOYEE", emailEnvoye: true },
  })

  return NextResponse.json({ success: true })
}
