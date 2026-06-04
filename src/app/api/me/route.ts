import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ok, err } from "@/lib/api"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return err("Non authentifié", 401)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, image: true },
  })

  if (!user) return err("Utilisateur introuvable", 404)
  return ok(user)
}
