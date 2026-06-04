import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"
import type { StatutTache } from "@/generated/prisma"

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Ctx) {
  const { id: chantierId } = await params
  const { userId, response } = await requireAuth()
  if (response) return response

  const { titre, description, dateEcheance, ordre } = await request.json()
  if (!titre) return err("Le titre est obligatoire")

  const chantier = await prisma.chantier.findUnique({
    where: { id: chantierId },
    include: { artisan: true },
  })
  if (!chantier) return err("Chantier introuvable", 404)
  if (chantier.artisan.userId !== userId!) return err("Non autorisé", 403)

  const tache = await prisma.tache.create({
    data: {
      chantierId,
      titre,
      description,
      dateEcheance: dateEcheance ? new Date(dateEcheance) : null,
      ordre: ordre ?? 0,
    },
  })

  return ok(tache, 201)
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { id: chantierId } = await params
  const { userId, response } = await requireAuth()
  if (response) return response

  const { tacheId, statut } = await request.json()
  if (!tacheId || !statut) return err("tacheId et statut requis")

  const chantier = await prisma.chantier.findUnique({
    where: { id: chantierId },
    include: { artisan: true },
  })
  if (!chantier) return err("Chantier introuvable", 404)
  if (chantier.artisan.userId !== userId!) return err("Non autorisé", 403)

  const tache = await prisma.tache.update({
    where: { id: tacheId, chantierId },
    data: { statut: statut as StatutTache },
  })

  return ok(tache)
}
