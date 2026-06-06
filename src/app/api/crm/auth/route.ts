import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password !== process.env.CRM_PASSWORD) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set("crm_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: "/",
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete("crm_session")
  return res
}
