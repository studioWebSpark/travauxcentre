import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const depenses = await prisma.depenseChantier.findMany({
    where: { chantierId: id }, orderBy: { date: "desc" },
  })
  return NextResponse.json(depenses)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { type, description, montant, fournisseur, date } = await request.json()
  if (!description || !montant) return NextResponse.json({ error: "Requis" }, { status: 400 })

  const depense = await prisma.depenseChantier.create({
    data: { chantierId: id, type: type ?? "MATERIAUX", description, montant: Number(montant), fournisseur: fournisseur || null, date: date ? new Date(date) : new Date() },
  })

  // Mettre à jour budgetReel
  const total = await prisma.depenseChantier.aggregate({ where: { chantierId: id }, _sum: { montant: true } })
  await prisma.chantierCrm.update({ where: { id }, data: { budgetReel: total._sum.montant ?? 0 } })

  return NextResponse.json(depense)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { depenseId } = await request.json()
  await prisma.depenseChantier.delete({ where: { id: depenseId } })

  const total = await prisma.depenseChantier.aggregate({ where: { chantierId: id }, _sum: { montant: true } })
  await prisma.chantierCrm.update({ where: { id }, data: { budgetReel: total._sum.montant ?? 0 } })

  return NextResponse.json({ success: true })
}
