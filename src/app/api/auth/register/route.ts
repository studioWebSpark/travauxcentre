import { prisma } from "@/lib/prisma"
import { ok, err } from "@/lib/api"
import bcrypt from "bcryptjs"
import type { Role } from "@/generated/prisma"

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json()

  if (!name || !email || !password || !role) return err("Tous les champs sont obligatoires")
  if (!["CLIENT", "ARTISAN"].includes(role))  return err("Rôle invalide")
  if (password.length < 8)                    return err("Le mot de passe doit contenir au moins 8 caractères")

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return err("Un compte existe déjà avec cet email", 409)

  const hashed = await bcrypt.hash(password, 12)

  const user = await prisma.$transaction(async (tx) => {
    const u = await tx.user.create({
      data: { name, email, password: hashed, role: role as Role },
    })

    if (role === "CLIENT") {
      await tx.clientProfile.create({ data: { userId: u.id } })
    } else {
      await tx.artisanProfile.create({ data: { userId: u.id } })
    }

    return u
  })

  return ok({ id: user.id, email: user.email, role: user.role }, 201)
}
