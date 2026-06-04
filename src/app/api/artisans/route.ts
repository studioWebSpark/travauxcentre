import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categorie = searchParams.get("categorie")
  const ville = searchParams.get("ville")

  const artisans = await prisma.artisanProfile.findMany({
    where: {
      disponible: true,
      verifie: true,
      ...(categorie ? { specialites: { some: { categorie: categorie as never } } } : {}),
      ...(ville ? { ville: { contains: ville, mode: "insensitive" } } : {}),
    },
    include: {
      user: { select: { name: true, image: true } },
      specialites: true,
      _count: { select: { devis: true, chantiers: true, avis: true } },
    },
    orderBy: { note: "desc" },
  })

  return ok(artisans)
}
