import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const devis  = await prisma.devisCrm.findUnique({
    where:   { id },
    include: { lignes: true, lead: { select: { nom: true, email: true, telephone: true, ville: true, codePostal: true } }, chantier: { select: { titre: true, adresse: true } } },
  })
  if (!devis) return NextResponse.json({ error: "Introuvable" }, { status: 404 })
  return NextResponse.json(devis)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body   = await request.json()

  if (body.lignes) {
    await prisma.ligneDevisCrm.deleteMany({ where: { devisId: id } })
    await prisma.ligneDevisCrm.createMany({
      data: body.lignes.map((l: { description: string; quantite: number; unite: string; prixUnitaire: number }) => ({
        devisId: id, description: l.description, quantite: Number(l.quantite),
        unite: l.unite || "forfait", prixUnitaire: Number(l.prixUnitaire),
      })),
    })
  }

  const devis = await prisma.devisCrm.update({
    where: { id },
    data:  { statut: body.statut ?? undefined, notes: body.notes ?? undefined },
    include: { lignes: true },
  })
  return NextResponse.json(devis)
}
