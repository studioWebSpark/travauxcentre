import { NextResponse } from "next/server"
import { auth } from "@/auth"

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) return { session: null, userId: null, response: err("Non authentifié", 401) }
  return { session, userId: session.user.id as string, response: null }
}
