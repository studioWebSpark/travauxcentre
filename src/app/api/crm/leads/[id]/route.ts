import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      statut:             body.statut            ?? undefined,
      priorite:           body.priorite          ?? undefined,
      montantDevis:       body.montantDevis       !== undefined ? Number(body.montantDevis) || null : undefined,
      dateContact:        body.dateContact        !== undefined ? (body.dateContact ? new Date(body.dateContact) : null) : undefined,
      dateRdv:            body.dateRdv            !== undefined ? (body.dateRdv ? new Date(body.dateRdv) : null) : undefined,
      commentaireInterne: body.commentaireInterne !== undefined ? body.commentaireInterne : undefined,
    },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  })

  return NextResponse.json(lead)
}
