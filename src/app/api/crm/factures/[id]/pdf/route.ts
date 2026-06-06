import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { FacturePDF } from "@/lib/pdf-templates"
import React from "react"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }   = await params
  const facture  = await prisma.factureCrm.findUnique({
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

  const buffer = await renderToBuffer(
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

  return new Response(buffer, {
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${facture.numero}.pdf"`,
    },
  })
}
