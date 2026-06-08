import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { awardXp } from "@/lib/xp"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body   = await request.json()

  // Statut actuel avant mise à jour (pour XP)
  const before = await prisma.lead.findUnique({ where: { id }, select: { statut: true } })

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      statut:             body.statut            ?? undefined,
      priorite:           body.priorite          ?? undefined,
      description:        body.description       !== undefined ? body.description : undefined,
      montantDevis:       body.montantDevis       !== undefined ? Number(body.montantDevis) || null : undefined,
      dateContact:        body.dateContact        !== undefined ? (body.dateContact ? new Date(body.dateContact) : null) : undefined,
      dateRdv:            body.dateRdv            !== undefined ? (body.dateRdv ? new Date(body.dateRdv) : null) : undefined,
      commentaireInterne: body.commentaireInterne !== undefined ? body.commentaireInterne : undefined,
    },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  })

  // Award XP selon le changement de statut
  if (body.statut && before && body.statut !== before.statut) {
    if (body.statut === "CONTACTE")     await awardXp("LEAD_CONTACTE",  { leadId: id, label: `Lead contacté : ${lead.nom}` })
    if (body.statut === "DEVIS_ENVOYE") await awardXp("DEVIS_ENVOYE",   { leadId: id, label: `Devis envoyé : ${lead.nom}` })
    if (body.statut === "GAGNE")        await awardXp("DEAL_GAGNE",     { leadId: id, label: `Deal gagné : ${lead.nom} 🎉` })
  }

  return NextResponse.json(lead)
}
