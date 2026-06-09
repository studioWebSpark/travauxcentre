import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { FacturePDF } from "@/lib/pdf-templates"
import nodemailer from "nodemailer"
import { createElement } from "react"

const fmt     = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)
const fmtDate = (d: Date | null) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : null

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const facture = await prisma.factureCrm.findUnique({
    where:   { id },
    include: {
      lignes:   true,
      chantier: {
        include: { lead: { select: { nom: true, email: true, telephone: true, ville: true, codePostal: true } } },
      },
      devis: {
        include: { etapesPaiement: { where: { statut: "PAYEE" }, orderBy: { ordre: "asc" } }, lignes: true },
      },
    },
  })
  if (!facture) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  const client = facture.chantier?.lead ?? null
  if (!client?.email) return NextResponse.json({ error: "Pas d'email client" }, { status: 400 })

  const ht  = facture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const ttc = ht * (1 + facture.tva)

  // Historique des paiements — basé sur le TTC de la facture (source de vérité)
  const historiquesPaiements = facture.devis?.etapesPaiement.map(e => ({
    pourcentage:  e.pourcentage,
    description:  e.description,
    datePaiement: e.datePaiement,
    montantTTC:   Math.round((e.pourcentage / 100) * ttc * 100) / 100,
  })) ?? []

  const estAcquittee = facture.statut === "PAYEE" || historiquesPaiements.length > 0

  const pdfBuffer = await renderToBuffer(
    createElement(FacturePDF, {
      numero:               facture.numero,
      dateEmission:         facture.dateEmission,
      dateEcheance:         facture.dateEcheance,
      client,
      chantierTitre:        facture.chantier?.titre   ?? null,
      chantierAdresse:      facture.chantier?.adresse ?? null,
      lignes:               facture.lignes,
      tva:                  facture.tva,
      notes:                estAcquittee ? "ACQUITTÉE — Paiement intégral reçu. Merci de votre confiance." : facture.notes,
      type:                 facture.type,
      historiquesPaiements: historiquesPaiements.length > 0 ? historiquesPaiements : undefined,
    }) as any
  )

  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await t.sendMail({
    from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      client.email,
    subject: estAcquittee
      ? `✅ Facture acquittée ${facture.numero} — Travaux Centre`
      : `Votre facture ${facture.numero} — Travaux Centre`,
    html: estAcquittee ? `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#16a34a;padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:20px">✅ Facture acquittée</h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${client.nom},</h3>
          <p>Veuillez trouver ci-joint votre facture acquittée <strong>${facture.numero}</strong>. L'intégralité du règlement a bien été reçue.</p>

          ${historiquesPaiements.length > 0 ? `
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:24px 0">
            <p style="margin:0 0 16px;font-weight:bold;color:#166534;font-size:15px">Récapitulatif des paiements</p>
            <table style="width:100%;border-collapse:collapse">
              ${historiquesPaiements.map((p, i) => `
              <tr style="border-bottom:1px solid #bbf7d0">
                <td style="padding:10px 8px 10px 0;vertical-align:top">
                  <strong style="color:#15803d;font-size:14px">Acompte ${i + 1} — ${p.pourcentage}%${p.description ? ` (${p.description})` : ""}</strong><br/>
                  <span style="font-size:12px;color:#6b7280">Reçu le : ${p.datePaiement ? fmtDate(p.datePaiement as Date) : "—"}</span>
                </td>
                <td style="padding:10px 0;text-align:right;vertical-align:top;font-weight:bold;color:#15803d;font-size:15px;white-space:nowrap">
                  ${fmt(p.montantTTC)}
                </td>
              </tr>`).join("")}
              <tr>
                <td style="padding:14px 0 0;font-weight:bold;color:#166534;font-size:15px">TOTAL RÉGLÉ</td>
                <td style="padding:14px 0 0;text-align:right;font-weight:bold;color:#166534;font-size:15px;white-space:nowrap">${fmt(ttc)}</td>
              </tr>
            </table>
          </div>
          ` : `
          <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0">
            <p style="margin:0;font-size:22px;font-weight:bold;color:#15803d">${fmt(ttc)} TTC</p>
            <p style="margin:4px 0 0;font-size:13px;color:#6b7280">Paiement intégral reçu</p>
          </div>
          `}

          <p style="color:#888;font-size:13px">Merci de votre confiance.<br/><strong>L'équipe Travaux Centre</strong></p>
        </div>
      </div>` : `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:22px">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${client.nom},</h3>
          <p>Veuillez trouver ci-joint votre facture <strong>${facture.numero}</strong>.</p>
          <div style="background:#F8F7F4;border-left:4px solid #22c55e;padding:20px 24px;border-radius:0 8px 8px 0;margin:24px 0">
            <p style="margin:0 0 4px;font-size:20px;font-weight:bold;color:#22c55e">${fmt(ttc)} TTC</p>
            ${facture.dateEcheance ? `<p style="margin:4px 0 0;color:#dc2626;font-size:13px">À régler avant le ${fmtDate(facture.dateEcheance)}</p>` : ""}
          </div>
          <p style="color:#888;font-size:13px">Cordialement,<br/><strong>L'équipe Travaux Centre</strong></p>
        </div>
      </div>`,
    attachments: [{
      filename:    `${facture.numero}.pdf`,
      content:     pdfBuffer as any,
      contentType: "application/pdf",
    }],
  })

  await prisma.factureCrm.update({
    where: { id },
    data:  { emailEnvoye: true, statut: estAcquittee ? "PAYEE" : "ENVOYEE" },
  })

  return NextResponse.json({ success: true })
}
