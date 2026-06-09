import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { genNumeroFacture } from "@/lib/chantier"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const devis = await prisma.devisCrm.findUnique({
    where:   { id },
    include: { lignes: true, factures: true },
  })

  if (!devis)                      return NextResponse.json({ error: "Devis introuvable" }, { status: 404 })
  if (devis.statut !== "ACCEPTE")  return NextResponse.json({ error: "Le devis doit être accepté" }, { status: 400 })
  if (devis.factures.length > 0)   return NextResponse.json({ error: "Facture déjà existante" }, { status: 400 })

  const facture = await prisma.factureCrm.create({
    data: {
      numero:      genNumeroFacture(),
      devisId:     devis.id,
      chantierId:  devis.chantierId ?? null,
      dateEmission: new Date(),
      statut:      "EMISE",
      tva:         devis.tva,
      notes:       devis.notes,
      lignes: {
        create: devis.lignes.map(l => ({
          description:  l.description,
          quantite:     l.quantite,
          unite:        l.unite,
          prixUnitaire: l.prixUnitaire,
        })),
      },
    },
  })

  await prisma.devisCrm.update({
    where: { id },
    data:  { statut: "FACTUREE" },
  })

  return NextResponse.json({ success: true, factureId: facture.id })
}
