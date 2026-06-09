import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { genNumeroFacture } from "@/lib/chantier"
import nodemailer from "nodemailer"
import { renderToBuffer } from "@react-pdf/renderer"
import { FacturePDF } from "@/lib/pdf-templates"
import { createElement } from "react"

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

const fmt     = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)
const fmtDate = (d: string | Date) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; etapeId: string }> }
) {
  const { id, etapeId } = await params
  const { devisNumero, devisTotal, devistva, leadEmail, leadNom, datePaiement } = await request.json()

  try {
    const datePayee = datePaiement ? new Date(datePaiement) : new Date()

    // 1. Marquer l'étape comme payée avec la date saisie
    await prisma.etapePaiementDevis.update({
      where: { id: etapeId },
      data:  { statut: "PAYEE", datePaiement: datePayee },
    })

    // 2. Recharger toutes les étapes du devis
    const devis = await prisma.devisCrm.findUnique({
      where:   { id },
      include: {
        etapesPaiement: { orderBy: { ordre: "asc" } },
        lignes:         true,
        lead:           { select: { nom: true, email: true } },
        chantier:       { select: { id: true, titre: true, adresse: true } },
        factures:       true,
      },
    })
    if (!devis) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 })

    const clientEmail = leadEmail || devis.lead?.email
    const clientNom   = leadNom   || devis.lead?.nom || "Client"
    const ttc = devis.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0) * (1 + devis.tva)

    // 3. Calculer les pourcentages
    const totalEtapes  = devis.etapesPaiement.reduce((s, e) => s + e.pourcentage, 0)
    const etapesPayees = devis.etapesPaiement.filter(e => e.statut === "PAYEE")
    const pctPaye      = etapesPayees.reduce((s, e) => s + e.pourcentage, 0)
    const toutPaye     = totalEtapes === 100 && pctPaye === 100

    // Étape courante
    const etapeCourante = devis.etapesPaiement.find(e => e.id === etapeId)!
    const montantEtape  = Math.round((etapeCourante.pourcentage / 100) * ttc * 100) / 100

    const t = transporter()

    if (toutPaye && (!devis.factures || devis.factures.length === 0)) {
      // ─── 4a. 100% payé → générer la facture acquittée et l'envoyer ───

      const historiquesPaiements = etapesPayees.map(e => ({
        pourcentage:  e.pourcentage,
        description:  e.description,
        datePaiement: e.id === etapeId ? datePayee : e.datePaiement,
        montantTTC:   Math.round((e.pourcentage / 100) * ttc * 100) / 100,
      }))

      // Créer la facture en base
      const facture = await prisma.factureCrm.create({
        data: {
          numero:       genNumeroFacture(),
          devisId:      devis.id,
          chantierId:   devis.chantier?.id || null,
          dateEmission: new Date(),
          statut:       "PAYEE",
          tva:          devis.tva,
          notes:        "ACQUITTÉE — Paiement intégral reçu. Merci de votre confiance.",
          lignes: {
            create: devis.lignes.map(l => ({
              description: l.description, quantite: l.quantite,
              unite: l.unite, prixUnitaire: l.prixUnitaire,
            })),
          },
        },
      })

      await prisma.devisCrm.update({ where: { id }, data: { statut: "FACTUREE" } })

      // Générer le PDF acquitté avec historique
      if (clientEmail) {
        const clientInfo = {
          nom: clientNom, email: clientEmail,
          ville: devis.lead ? undefined : undefined,
        }

        const pdfBuffer = await renderToBuffer(
          createElement(FacturePDF, {
            numero:               facture.numero,
            dateEmission:         facture.dateEmission,
            dateEcheance:         null,
            client:               { nom: clientNom, email: clientEmail },
            chantierTitre:        devis.chantier?.titre   ?? null,
            chantierAdresse:      devis.chantier?.adresse ?? null,
            lignes:               devis.lignes,
            tva:                  devis.tva,
            notes:                "ACQUITTÉE — Paiement intégral reçu. Merci de votre confiance.",
            historiquesPaiements,
          }) as any
        )

        await t.sendMail({
          from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
          to:      clientEmail,
          subject: `✅ Facture acquittée ${facture.numero} — Travaux Centre`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#16a34a;padding:24px 32px;border-radius:8px 8px 0 0">
                <h2 style="color:white;margin:0;font-size:20px">✅ Paiement intégral reçu</h2>
              </div>
              <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
                <h3 style="color:#0F2C5E">Bonjour ${clientNom},</h3>
                <p>Nous avons bien reçu l'intégralité de votre règlement pour le devis <strong>${devisNumero}</strong>.</p>

                <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:24px 0">
                  <p style="margin:0 0 12px;font-weight:bold;color:#166534;font-size:15px">Récapitulatif des paiements</p>
                  ${historiquesPaiements.map((p, i) => `
                    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #bbf7d0">
                      <div>
                        <span style="font-weight:bold;color:#15803d">Acompte ${i + 1} — ${p.pourcentage}%</span>
                        ${p.description ? `<br/><span style="font-size:13px;color:#4ade80">${p.description}</span>` : ""}
                        <br/><span style="font-size:12px;color:#6b7280">Reçu le : ${p.datePaiement ? fmtDate(p.datePaiement) : "—"}</span>
                      </div>
                      <span style="font-weight:bold;color:#15803d">${fmt(p.montantTTC)}</span>
                    </div>
                  `).join("")}
                  <div style="display:flex;justify-content:space-between;padding:10px 0 0;font-weight:bold;color:#166534;font-size:15px">
                    <span>TOTAL RÉGLÉ</span>
                    <span>${fmt(ttc)}</span>
                  </div>
                </div>

                <p>Votre facture acquittée est jointe en pièce jointe à cet email.</p>
                <p style="color:#888;font-size:13px">Merci de votre confiance.<br/><strong>L'équipe Travaux Centre</strong></p>
              </div>
            </div>`,
          attachments: [{
            filename:    `${facture.numero}.pdf`,
            content:     pdfBuffer as any,
            contentType: "application/pdf",
          }],
        })
      }

      return NextResponse.json({ success: true, factureGeneree: true, factureId: facture.id, message: "Facture acquittée générée et envoyée" })

    } else if (clientEmail) {
      // ─── 4b. Paiement partiel → envoyer un reçu d'acompte ───
      await t.sendMail({
        from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
        to:      clientEmail,
        subject: `Reçu de paiement — Acompte ${devisNumero} — Travaux Centre`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0F2C5E;padding:24px 32px;border-radius:8px 8px 0 0">
              <h2 style="color:white;margin:0;font-size:20px">Travaux<span style="color:#F97316">Centre</span></h2>
            </div>
            <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
              <h3 style="color:#0F2C5E">Bonjour ${clientNom},</h3>
              <p>Nous avons bien reçu votre paiement pour le devis <strong>${devisNumero}</strong>.</p>

              <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0">
                <p style="margin:0 0 4px;font-weight:bold;color:#166534">${etapeCourante.pourcentage}% — ${etapeCourante.description ?? "Acompte"}</p>
                <p style="margin:0 0 4px;font-size:22px;font-weight:bold;color:#15803d">${fmt(montantEtape)} TTC</p>
                <p style="margin:0;font-size:13px;color:#6b7280">Reçu le ${fmtDate(datePayee)}</p>
              </div>

              <p style="color:#555;font-size:13px">
                Solde restant : <strong>${fmt(ttc - etapesPayees.reduce((s, e) => s + Math.round((e.pourcentage / 100) * ttc * 100) / 100, 0))} TTC</strong>
              </p>
              <p style="color:#888;font-size:13px">Merci de votre confiance.<br/><strong>L'équipe Travaux Centre</strong></p>
            </div>
          </div>`,
      })
    }

    return NextResponse.json({ success: true, factureGeneree: false, message: "Acompte enregistré et reçu envoyé" })

  } catch (error) {
    console.error("Erreur paiement:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
