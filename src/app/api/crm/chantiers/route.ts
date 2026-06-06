import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const chantiers = await prisma.chantierCrm.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lead:   { select: { nom: true, telephone: true } },
      etapes: { orderBy: { ordre: "asc" } },
      photos: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { photos: true, etapes: true, factures: true } },
    },
  })
  return NextResponse.json(chantiers)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { leadId, titre, description, adresse, budget, dateDebut, dateFin } = body

  if (!titre || !adresse) return NextResponse.json({ error: "Titre et adresse requis" }, { status: 400 })

  const chantier = await prisma.chantierCrm.create({
    data: {
      leadId:      leadId || null,
      titre,
      description: description || null,
      adresse,
      budget:      budget ? Number(budget) : null,
      dateDebut:   dateDebut ? new Date(dateDebut) : null,
      dateFin:     dateFin   ? new Date(dateFin)   : null,
    },
  })

  // Si lead lié → passer statut à GAGNE si pas déjà fait
  if (leadId) {
    await prisma.lead.update({ where: { id: leadId }, data: { statut: "GAGNE" } }).catch(() => null)
  }

  return NextResponse.json(chantier)
}
