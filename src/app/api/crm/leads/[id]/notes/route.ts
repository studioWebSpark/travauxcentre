import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { awardXp } from "@/lib/xp"

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

  await Promise.all([
    prisma.lead.update({ where: { id }, data: { dateContact: new Date() } }),
    awardXp("NOTE_AJOUTEE", { leadId: id, label: "Note ajoutée" }),
  ])

  return NextResponse.json(note)
}
