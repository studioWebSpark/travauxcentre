import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"

export async function GET(request: Request) {
  const { userId, response } = await requireAuth()
  if (response) return response

  const { searchParams } = new URL(request.url)
  const avecUserId = searchParams.get("avec")

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { expediteurId: userId!,   ...(avecUserId ? { destinataireId: avecUserId } : {}) },
        { destinataireId: userId!, ...(avecUserId ? { expediteurId:   avecUserId } : {}) },
      ],
    },
    include: {
      expediteur:   { select: { name: true, image: true } },
      destinataire: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  await prisma.message.updateMany({
    where: { destinataireId: userId!, lu: false },
    data:  { lu: true },
  })

  return ok(messages)
}

export async function POST(request: Request) {
  const { userId, response } = await requireAuth()
  if (response) return response

  const { destinataireId, contenu, projetId } = await request.json()
  if (!destinataireId || !contenu) return err("Destinataire et contenu obligatoires")

  const message = await prisma.message.create({
    data: {
      expediteurId:   userId!,
      destinataireId,
      contenu,
      projetId:       projetId ?? null,
    },
  })

  return ok(message, 201)
}
