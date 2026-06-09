import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// POST /api/crm/auth → login
export async function POST(request: Request) {
  const { email, password } = await request.json()

  const user = await prisma.crmUser.findUnique({ where: { email } })
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set("crm_session", "authenticated", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 7,
    path:     "/",
  })
  return res
}

// DELETE /api/crm/auth → logout
export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete("crm_session")
  return res
}
