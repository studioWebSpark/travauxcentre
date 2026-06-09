import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Protection dashboard artisan/client (NextAuth)
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Protection pages CRM (cookie maison)
  if (pathname.startsWith("/crm") && !pathname.startsWith("/crm/login")) {
    const crm = request.cookies.get("crm_session")?.value
    if (crm !== "authenticated") {
      return NextResponse.redirect(new URL("/crm/login", request.url))
    }
  }

  // Protection routes API CRM
  if (pathname.startsWith("/api/crm") && pathname !== "/api/crm/auth") {
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
