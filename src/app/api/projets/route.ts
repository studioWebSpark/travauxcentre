import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"
import type { Categorie, StatutProjet } from "@/generated/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categorie = searchParams.get("categorie") as Categorie | null
  const ville     = searchParams.get("ville")
  const statut    = (searchParams.get("statut") ?? "OUVERT") as StatutProjet

  const projets = await prisma.projet.findMany({
    where: {
      statut,
      ...(categorie ? { categorie } : {}),
      ...(ville ? { ville: { contains: ville, mode: "insensitive" } } : {}),
    },
    include: {
      client: { include: { user: { select: { name: true, image: true } } } },
      _count: { select: { devis: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return ok(projets)
}

export async function POST(request: Request) {
  const { userId, response } = await requireAuth()
  if (response) return response

  const body = await request.json()
  const { titre, description, categorie, adresse, ville, codePostal, budgetMin, budgetMax, dateDebut, dateFin } = body

  if (!titre || !description || !categorie || !adresse || !ville) {
    return err("Champs obligatoires manquants")
  }

  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: userId! },
  })
  if (!clientProfile) return err("Profil client introuvable", 404)

  const projet = await prisma.projet.create({
    data: {
      clientId: clientProfile.id,
      titre,
      description,
      categorie,
      adresse,
      ville,
      codePostal: codePostal ?? "",
      budgetMin:  budgetMin  ? Number(budgetMin)  : null,
      budgetMax:  budgetMax  ? Number(budgetMax)  : null,
      dateDebut:  dateDebut  ? new Date(dateDebut) : null,
      dateFin:    dateFin    ? new Date(dateFin)   : null,
    },
  })

  return ok(projet, 201)
}
