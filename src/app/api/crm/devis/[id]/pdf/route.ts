import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import { DevisPDF } from "@/lib/pdf-templates"
import { createElement } from "react"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const buffer = await renderToBuffer(
    createElement(DevisPDF, {
      numero:          devis.numero,
      dateEmission:    devis.dateEmission,
      dateValidite:    devis.dateValidite,
      client:          devis.lead,
      chantierTitre:   devis.chantier?.titre ?? null,
      chantierAdresse: devis.chantier?.adresse ?? null,
      lignes:          devis.lignes,
      tva:             devis.tva,
      notes:           devis.notes,
    }) as any
  )

  return new Response(buffer as any, {
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${devis.numero}.pdf"`,
    },
  })
}
