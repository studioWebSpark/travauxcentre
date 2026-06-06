import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const chantier = await prisma.chantierCrm.findUnique({
    where: { id },
    include: {
      lead:     { select: { id: true, nom: true, email: true, telephone: true, typeTravaux: true } },
      etapes:   { orderBy: { ordre: "asc" } },
      photos:   { orderBy: { createdAt: "desc" } },
      notes:    { orderBy: { createdAt: "desc" } },
      devis:    { include: { lignes: true }, orderBy: { createdAt: "desc" } },
      factures: { include: { lignes: true }, orderBy: { createdAt: "desc" } },
    },
  })
  if (!chantier) return NextResponse.json({ error: "Introuvable" }, { status: 404 })
  return NextResponse.json(chantier)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params
  const body    = await request.json()

  const chantier = await prisma.chantierCrm.update({
    where: { id },
    data: {
      titre:       body.titre       ?? undefined,
      description: body.description ?? undefined,
      adresse:     body.adresse     ?? undefined,
      budget:      body.budget      !== undefined ? (body.budget ? Number(body.budget) : null) : undefined,
      budgetReel:  body.budgetReel  !== undefined ? (body.budgetReel ? Number(body.budgetReel) : null) : undefined,
      statut:      body.statut      ?? undefined,
      progression: body.progression !== undefined ? Number(body.progression) : undefined,
      dateDebut:   body.dateDebut   !== undefined ? (body.dateDebut ? new Date(body.dateDebut) : null) : undefined,
      dateFin:     body.dateFin     !== undefined ? (body.dateFin   ? new Date(body.dateFin)   : null) : undefined,
    },
  })
  return NextResponse.json(chantier)
}
