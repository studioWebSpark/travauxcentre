import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Ctx) {
  const { id: chantierId } = await params
  const { userId, response } = await requireAuth()
  if (response) return response

  const { description, photos } = await request.json()
  if (!description) return err("La description est obligatoire")

  const chantier = await prisma.chantier.findUnique({
    where: { id: chantierId },
    include: { artisan: true },
  })
  if (!chantier) return err("Chantier introuvable", 404)
  if (chantier.artisan.userId !== userId!) return err("Non autorisé", 403)

  const rapport = await prisma.rapport.create({
    data: {
      chantierId,
      auteurId:    userId!,
      description,
      photos:      photos ?? [],
    },
  })

  return ok(rapport, 201)
}
