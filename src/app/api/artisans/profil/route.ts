import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"
import type { Categorie } from "@/generated/prisma"

export async function PATCH(request: Request) {
  const { userId, response } = await requireAuth()
  if (response) return response

  const body = await request.json()
  const { telephone, adresse, ville, codePostal, siret, description, rayon, disponible, specialites } = body

  const artisan = await prisma.artisanProfile.findUnique({
    where: { userId: userId! },
  })
  if (!artisan) return err("Profil artisan introuvable", 404)

  await prisma.$transaction(async (tx) => {
    await tx.artisanProfile.update({
      where: { id: artisan.id },
      data: {
        telephone, adresse, ville, codePostal, siret, description,
        rayon:      Number(rayon),
        disponible: Boolean(disponible),
      },
    })

    await tx.specialite.deleteMany({ where: { artisanId: artisan.id } })

    if (Array.isArray(specialites) && specialites.length > 0) {
      await tx.specialite.createMany({
        data: (specialites as string[]).map((cat) => ({
          artisanId: artisan.id,
          categorie: cat as Categorie,
        })),
      })
    }
  })

  return ok({ success: true })
}
