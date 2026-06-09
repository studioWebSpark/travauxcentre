import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const { token, password } = await request.json()

  const user = await prisma.crmUser.findUnique({ where: { resetToken: token } })
  if (!user || !user.resetExpiry || user.resetExpiry < new Date()) {
    return NextResponse.json({ error: "Lien invalide ou expiré" }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Le mot de passe doit faire au moins 8 caractères" }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)
  await prisma.crmUser.update({
    where: { id: user.id },
    data:  { passwordHash: hash, resetToken: null, resetExpiry: null },
  })

  return NextResponse.json({ success: true })
}
