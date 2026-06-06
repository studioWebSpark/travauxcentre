import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { genNumeroFacture } from "@/lib/chantier"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params
  const { type, tva, notes, dateEcheance, lignes } = await request.json()

  const chantier = await prisma.chantierCrm.findUnique({
    where:   { id },
    include: {
      devis: { include: { lignes: true }, where: { statut: "ACCEPTE" }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  })
  if (!chantier) return NextResponse.json({ error: "Chantier introuvable" }, { status: 404 })

  // Reprendre les lignes du devis accepté si aucune fournie
  let lignesData = lignes ?? []
  if (!lignesData.length && chantier.devis[0]) {
    lignesData = chantier.devis[0].lignes.map((l) => ({
      description: l.description, quantite: l.quantite, unite: l.unite, prixUnitaire: l.prixUnitaire,
    }))
  }

  const facture = await prisma.factureCrm.create({
    data: {
      numero:       genNumeroFacture(),
      chantierId:   id,
      devisId:      chantier.devis[0]?.id ?? null,
      type:         type         ?? "FACTURE",
      tva:          tva          ?? 0.20,
      notes:        notes        || null,
      dateEcheance: dateEcheance ? new Date(dateEcheance) : null,
      lignes: {
        create: lignesData.map((l: { description: string; quantite: number; unite: string; prixUnitaire: number }) => ({
          description: l.description, quantite: Number(l.quantite),
          unite: l.unite || "forfait", prixUnitaire: Number(l.prixUnitaire),
        })),
      },
    },
    include: { lignes: true },
  })

  return NextResponse.json(facture)
}
