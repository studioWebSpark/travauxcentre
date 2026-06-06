import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { DevisPDF } from "@/lib/pdf-templates"
import nodemailer from "nodemailer"
import React from "react"

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const devis  = await prisma.devisCrm.findUnique({
    where:   { id },
    include: {
      lignes:   true,
      lead:     { select: { nom: true, email: true, telephone: true, ville: true, codePostal: true } },
      chantier: { select: { titre: true, adresse: true } },
    },
  })
  if (!devis) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  const client = devis.lead
  if (!client?.email) return NextResponse.json({ error: "Pas d'email client" }, { status: 400 })

  const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const devisUrl   = `${siteUrl}/devis/${devis.token}`

  // Générer le PDF
  const pdfBuffer = await renderToBuffer(
    React.createElement(DevisPDF, {
      numero:          devis.numero,
      dateEmission:    devis.dateEmission,
      dateValidite:    devis.dateValidite,
      client,
      chantierTitre:   devis.chantier?.titre   ?? null,
      chantierAdresse: devis.chantier?.adresse ?? null,
      lignes:          devis.lignes,
      tva:             devis.tva,
      notes:           devis.notes,
    })
  )

  const ht  = devis.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const ttc = ht * (1 + devis.tva)
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)
  const fmtDate = (d: Date | null) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : null

  const t = transporter()
  await t.sendMail({
    from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      client.email,
    subject: `Votre devis ${devis.numero} — Travaux Centre`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:22px">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${client.nom},</h3>
          <p>Veuillez trouver ci-joint votre devis <strong>${devis.numero}</strong> pour votre projet de travaux.</p>

          <div style="background:#F8F7F4;border-left:4px solid #0F2C5E;padding:20px 24px;border-radius:0 8px 8px 0;margin:24px 0">
            <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#0F2C5E">📋 ${devis.numero}</p>
            ${devis.chantier ? `<p style="margin:0 0 4px;color:#555">🏗️ ${devis.chantier.titre}</p>` : ""}
            ${devis.dateValidite ? `<p style="margin:0 0 4px;color:#888;font-size:13px">Valable jusqu'au ${fmtDate(devis.dateValidite)}</p>` : ""}
            <p style="margin:0;font-size:20px;font-weight:bold;color:#F97316">${fmt(ttc)} TTC</p>
          </div>

          <p>Pour consulter votre devis en ligne ou l'accepter :</p>
          <div style="text-align:center;margin:28px 0">
            <a href="${devisUrl}" style="display:inline-block;background:#0F2C5E;color:white;font-weight:bold;font-size:15px;padding:14px 36px;border-radius:12px;text-decoration:none">
              Voir et accepter mon devis
            </a>
          </div>
          <p style="color:#888;font-size:13px">Vous pouvez également télécharger le PDF en pièce jointe.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="color:#aaa;font-size:12px;text-align:center">
            Travaux Centre — Longuenesse (62219)<br/>
            03 XX XX XX XX — contact@travauxcentre.fr
          </p>
        </div>
      </div>
    `,
    attachments: [{
      filename:    `${devis.numero}.pdf`,
      content:     pdfBuffer,
      contentType: "application/pdf",
    }],
  })

  // Marquer comme envoyé
  await prisma.devisCrm.update({
    where: { id },
    data:  { statut: "ENVOYE", emailEnvoye: true },
  })

  return NextResponse.json({ success: true, devisUrl })
}
