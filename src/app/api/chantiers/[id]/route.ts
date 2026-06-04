import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params
  const { session, response } = await requireAuth()
  if (response) return response

  const chantier = await prisma.chantier.findUnique({
    where: { id },
    include: {
      projet: { include: { client: { include: { user: { select: { name: true, image: true } } } } } },
      artisan: { include: { user: { select: { name: true, image: true } }, specialites: true } },
      devis: true,
      taches: { orderBy: { ordre: "asc" } },
      rapports: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
      avis: true,
    },
  })

  if (!chantier) return err("Chantier introuvable", 404)

  const userId = session!.user.id
  const isClient = chantier.projet.client.userId === userId
  const isArtisan = chantier.artisan.userId === userId

  if (!isClient && !isArtisan) return err("Non autorisé", 403)

  return ok(chantier)
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params
  const { session, response } = await requireAuth()
  if (response) return response

  const { statut, dateDebut, dateFin } = await request.json()

  const chantier = await prisma.chantier.findUnique({
    where: { id },
    include: { artisan: true },
  })

  if (!chantier) return err("Chantier introuvable", 404)
  if (chantier.artisan.userId !== session!.user.id) return err("Non autorisé", 403)

  const updated = await prisma.chantier.update({
    where: { id },
    data: {
      ...(statut ? { statut } : {}),
      ...(dateDebut ? { dateDebut: new Date(dateDebut) } : {}),
      ...(dateFin ? { dateFin: new Date(dateFin) } : {}),
    },
  })

  return ok(updated)
}
