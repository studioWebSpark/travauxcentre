import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"

export async function PATCH(request: Request) {
  const { userId, response } = await requireAuth()
  if (response) return response

  const { telephone, adresse, ville, codePostal } = await request.json()

  const client = await prisma.clientProfile.findUnique({ where: { userId: userId! } })
  if (!client) return err("Profil client introuvable", 404)

  await prisma.clientProfile.update({
    where: { id: client.id },
    data: { telephone, adresse, ville, codePostal },
  })

  return ok({ success: true })
}
