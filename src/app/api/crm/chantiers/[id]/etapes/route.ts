import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }   = await params
  const { titre, description, dateEcheance, statut } = await request.json()

  const count = await prisma.etapeChantierCrm.count({ where: { chantierId: id } })

  const etape = await prisma.etapeChantierCrm.create({
    data: {
      chantierId:   id,
      titre,
      description:  description ?? null,
      ordre:        count,
      statut:       statut      ?? "A_FAIRE",
      dateEcheance: dateEcheance ? new Date(dateEcheance) : null,
    },
  })
  return NextResponse.json(etape)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { etapeId, statut } = await request.json()

  const etape = await prisma.etapeChantierCrm.update({
    where: { id: etapeId },
    data:  { statut },
  })

  // Recalculer la progression du chantier
  const all  = await prisma.etapeChantierCrm.findMany({ where: { chantierId: id } })
  const done = all.filter((e) => e.statut === "TERMINEE").length
  const prog = all.length > 0 ? Math.round((done / all.length) * 100) : 0
  await prisma.chantierCrm.update({ where: { id }, data: { progression: prog } })

  return NextResponse.json(etape)
}
