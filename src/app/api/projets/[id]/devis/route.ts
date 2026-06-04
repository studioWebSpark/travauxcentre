import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params

  const devis = await prisma.devis.findMany({
    where: { projetId: id },
    include: {
      artisan: {
        include: {
          user: { select: { name: true, image: true } },
          specialites: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  return ok(devis)
}

export async function POST(request: Request, { params }: Ctx) {
  const { id: projetId } = await params
  const { session, response } = await requireAuth()
  if (response) return response

  const body = await request.json()
  const { montant, description, dureeJours } = body

  if (!montant || !description || !dureeJours) {
    return err("Champs obligatoires manquants")
  }

  const artisanProfile = await prisma.artisanProfile.findUnique({
    where: { userId: session!.user.id },
  })
  if (!artisanProfile) return err("Profil artisan introuvable", 404)

  const projet = await prisma.projet.findUnique({ where: { id: projetId } })
  if (!projet || projet.statut !== "OUVERT") return err("Projet non disponible", 400)

  const devis = await prisma.devis.create({
    data: {
      projetId,
      artisanId: artisanProfile.id,
      montant: Number(montant),
      description,
      dureeJours: Number(dureeJours),
    },
  })

  return ok(devis, 201)
}
