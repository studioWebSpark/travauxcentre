import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { genNumeroDevis } from "@/lib/chantier"

export async function POST(request: Request) {
  const { leadId, chantierId, lignes, tva, notes, dateValidite } = await request.json()

  const devis = await prisma.devisCrm.create({
    data: {
      numero:       genNumeroDevis(),
      leadId:       leadId     || null,
      chantierId:   chantierId || null,
      tva:          tva     ?? 0.20,
      notes:        notes   || null,
      dateValidite: dateValidite ? new Date(dateValidite) : null,
      lignes: {
        create: (lignes ?? []).map((l: { description: string; quantite: number; unite: string; prixUnitaire: number }) => ({
          description:  l.description,
          quantite:     Number(l.quantite),
          unite:        l.unite || "forfait",
          prixUnitaire: Number(l.prixUnitaire),
        })),
      },
    },
    include: { lignes: true },
  })
  return NextResponse.json(devis)
}
