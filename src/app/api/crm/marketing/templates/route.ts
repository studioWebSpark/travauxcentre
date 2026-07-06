import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const templates = await prisma.emailTemplate.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(templates)
}

export async function POST(request: Request) {
  const { nom, sujet, corpsHtml } = await request.json()

  if (!nom || !sujet || !corpsHtml) {
    return NextResponse.json({ error: "Nom, sujet et corps requis" }, { status: 400 })
  }

  const template = await prisma.emailTemplate.create({
    data: { nom: nom.trim(), sujet: sujet.trim(), corpsHtml },
  })

  return NextResponse.json(template)
}
