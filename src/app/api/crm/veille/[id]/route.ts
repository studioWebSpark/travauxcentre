import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PATCH — changer statut (VU, IGNORE)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }   = await params
  const { statut } = await request.json()
  const annonce = await prisma.veilleAnnonce.update({ where: { id }, data: { statut } })
  return NextResponse.json(annonce)
}

// POST — importer comme lead
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const annonce = await prisma.veilleAnnonce.findUnique({ where: { id } })
  if (!annonce) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  const lead = await prisma.lead.create({
    data: {
      nom:         "Prospect — " + (annonce.ville ?? annonce.source),
      email:       "",
      telephone:   "",
      ville:       annonce.ville ?? "",
      codePostal:  "",
      typeTravaux: annonce.typeTravaux ?? "Autre",
      description: annonce.resume ?? annonce.titre,
      budget:      annonce.budgetEstime ?? null,
      source:      annonce.source,
      statut:      "NOUVEAU",
      priorite:    annonce.score >= 80 ? "HAUTE" : annonce.score >= 60 ? "NORMALE" : "BASSE",
    },
  })

  await prisma.veilleAnnonce.update({ where: { id }, data: { statut: "IMPORTE", leadId: lead.id } })
  return NextResponse.json({ leadId: lead.id })
}
