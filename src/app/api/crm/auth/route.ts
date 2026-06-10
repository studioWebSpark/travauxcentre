import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    const user = await prisma.crmUser.findUnique({ where: { email } })

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash)
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

  } catch (error) {
    console.error("CRM Auth error:", error)
    return NextResponse.json(
      { error: "Erreur serveur", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete("crm_session")
  return res
}
