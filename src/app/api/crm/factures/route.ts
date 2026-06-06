import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { genNumeroFacture } from "@/lib/chantier"

export async function POST(request: Request) {
  const { chantierId, devisId, lignes, tva, notes, dateEcheance, type } = await request.json()

  // Si devis lié → copier les lignes si pas de lignes fournies
  let lignesData = lignes ?? []
  if (!lignesData.length && devisId) {
    const devis = await prisma.devisCrm.findUnique({ where: { id: devisId }, include: { lignes: true } })
    if (devis) lignesData = devis.lignes.map((l) => ({ description: l.description, quantite: l.quantite, unite: l.unite, prixUnitaire: l.prixUnitaire }))
  }

  const facture = await prisma.factureCrm.create({
    data: {
      numero:       genNumeroFacture(),
      chantierId:   chantierId   || null,
      devisId:      devisId      || null,
      tva:          tva          ?? 0.20,
      type:         type         ?? "FACTURE",
      notes:        notes        || null,
      dateEcheance: dateEcheance ? new Date(dateEcheance) : null,
      lignes: { create: lignesData.map((l: { description: string; quantite: number; unite: string; prixUnitaire: number }) => ({
        description: l.description, quantite: Number(l.quantite), unite: l.unite || "forfait", prixUnitaire: Number(l.prixUnitaire),
      })) },
    },
    include: { lignes: true },
  })
  return NextResponse.json(facture)
}
