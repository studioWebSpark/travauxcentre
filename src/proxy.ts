import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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
  if (pathname.startsWith("/crm") && !pathname.startsWith("/crm/login") && !pathname.startsWith("/crm/setup-password")) {
    const crm = request.cookies.get("crm_session")?.value
    if (crm !== "authenticated") {
      return NextResponse.redirect(new URL("/crm/login", request.url))
    }
  }

  // Protection routes API CRM
  if (pathname.startsWith("/api/crm") && !pathname.startsWith("/api/crm/auth")) {
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
