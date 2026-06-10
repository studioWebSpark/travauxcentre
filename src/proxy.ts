import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes API CRM accessibles sans être connecté
const PUBLIC_API = [
  "/api/crm/auth/needs-setup",
  "/api/crm/auth/send-setup",
  "/api/crm/auth/set-password",
  "/api/crm/auth",
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protection dashboard (NextAuth JWT — edge compatible, pas de Prisma)
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  // Protection pages CRM (cookie maison)
  const crmPagePublic = pathname.startsWith("/crm/login") || pathname.startsWith("/crm/setup-password")
  if (pathname.startsWith("/crm") && !crmPagePublic) {
    const crm = request.cookies.get("crm_session")?.value
    if (crm !== "authenticated") {
      return NextResponse.redirect(new URL("/crm/login", request.url))
    }
  }

  // Protection routes API CRM (sauf routes publiques listées)
  const isPublicApi = PUBLIC_API.some(p => pathname === p || pathname.startsWith(p + "/"))
  if (pathname.startsWith("/api/crm") && !isPublicApi) {
    const crm = request.cookies.get("crm_session")?.value
    if (crm !== "authenticated") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/crm/:path*", "/api/crm/:path*"],
}
