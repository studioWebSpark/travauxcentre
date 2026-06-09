import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { FacturePDF } from "@/lib/pdf-templates"
import { createElement } from "react"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params
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
  // Utilise le TTC de la facture (source de vérité) pour les montants
  const ht  = facture.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const ttc = ht * (1 + facture.tva)

  const historiquesPaiements = facture.devis?.etapesPaiement.map(e => ({
    pourcentage:  e.pourcentage,
    description:  e.description,
    datePaiement: e.datePaiement,
    montantTTC:   Math.round((e.pourcentage / 100) * ttc * 100) / 100,
  })) ?? []

  const buffer = await renderToBuffer(
    createElement(FacturePDF, {
      numero:               facture.numero,
      dateEmission:         facture.dateEmission,
      dateEcheance:         facture.dateEcheance,
      client,
      chantierTitre:        facture.chantier?.titre   ?? null,
      chantierAdresse:      facture.chantier?.adresse ?? null,
      lignes:               facture.lignes,
      tva:                  facture.tva,
      notes:                facture.notes,
      type:                 facture.type,
      historiquesPaiements: historiquesPaiements.length > 0 ? historiquesPaiements : undefined,
    }) as any
  )

  return new Response(buffer as any, {
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${facture.numero}.pdf"`,
    },
  })
}
