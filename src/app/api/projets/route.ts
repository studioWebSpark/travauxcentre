import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categorie = searchParams.get("categorie") as string | null
  const ville = searchParams.get("ville")
  const statut = searchParams.get("statut") ?? "OUVERT"

  const projets = await prisma.projet.findMany({
    where: {
      statut: statut as "OUVERT" | "EN_COURS" | "TERMINE" | "ANNULE",
      ...(categorie ? { categorie: categorie as never } : {}),
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
  const { session, response } = await requireAuth()
  if (response) return response

  const body = await request.json()
  const { titre, description, categorie, adresse, ville, codePostal, budgetMin, budgetMax, dateDebut, dateFin } = body

  if (!titre || !description || !categorie || !adresse || !ville) {
    return err("Champs obligatoires manquants")
  }

  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: session!.user.id },
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
      budgetMin: budgetMin ? Number(budgetMin) : null,
      budgetMax: budgetMax ? Number(budgetMax) : null,
      dateDebut: dateDebut ? new Date(dateDebut) : null,
      dateFin: dateFin ? new Date(dateFin) : null,
    },
  })

  return ok(projet, 201)
}
