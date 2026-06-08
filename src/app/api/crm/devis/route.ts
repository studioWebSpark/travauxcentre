import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { genNumeroDevis } from "@/lib/chantier"

export async function POST(request: Request) {
  const { leadId, chantierId, lignes, etapes, tva, notes, dateValidite } = await request.json()

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
      etapesPaiement: {
        create: (etapes ?? []).map((e: { pourcentage: number; description?: string; dateEcheance?: string }, idx: number) => ({
          pourcentage:  Number(e.pourcentage),
          description:  e.description || null,
          dateEcheance: e.dateEcheance ? new Date(e.dateEcheance) : null,
          ordre:        idx,
        })),
      },
    },
    include: { lignes: true, etapesPaiement: true },
  })
  return NextResponse.json(devis)
}
