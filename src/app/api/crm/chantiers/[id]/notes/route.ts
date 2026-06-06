import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { contenu, auteur } = await request.json()
  if (!contenu?.trim()) return NextResponse.json({ error: "Contenu requis" }, { status: 400 })
  const note = await prisma.noteChantierCrm.create({
    data: { chantierId: id, contenu: contenu.trim(), auteur: auteur ?? "Équipe" },
  })
  return NextResponse.json(note)
}
