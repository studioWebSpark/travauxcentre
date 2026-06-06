import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { contenu, auteur } = await request.json()

  if (!contenu?.trim()) {
    return NextResponse.json({ error: "Contenu requis" }, { status: 400 })
  }

  const note = await prisma.noteLead.create({
    data: { leadId: id, contenu: contenu.trim(), auteur: auteur ?? "Équipe" },
  })

  // Mettre à jour la date de contact
  await prisma.lead.update({
    where: { id },
    data: { dateContact: new Date() },
  })

  return NextResponse.json(note)
}
