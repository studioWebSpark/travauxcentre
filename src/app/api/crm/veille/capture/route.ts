import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { analyserAvecIA, type RawAnnonce } from "@/lib/veille"

export async function POST(request: Request) {
  const body = await request.json()
  const { titre, description, url, ville, source } = body

  if (!titre) return NextResponse.json({ error: "Titre requis" }, { status: 400 })

  // Éviter les doublons
  const existing = await prisma.veilleAnnonce.findFirst({ where: { url: url || undefined } })
  if (existing) return NextResponse.json({ duplicate: true, id: existing.id })

  const raw: RawAnnonce = {
    source:      (source as RawAnnonce["source"]) || "manuel",
    titre:       titre.trim(),
    description: (description || titre).trim(),
    url:         url || null,
    ville:       ville || null,
    prix:        null,
  }

  const analyse = await analyserAvecIA(raw)

  const annonce = await prisma.veilleAnnonce.create({
    data: {
      source:       raw.source,
      titre:        raw.titre,
      description:  raw.description.slice(0, 1000),
      url:          raw.url,
      ville:        raw.ville,
      score:        analyse.score,
      resume:       analyse.resume,
      typeTravaux:  analyse.typeTravaux,
      budgetEstime: analyse.budgetEstime,
    },
  })

  return NextResponse.json({ success: true, id: annonce.id, score: annonce.score })
}

// GET pour vérification CORS depuis le bookmarklet
export async function GET() {
  return NextResponse.json({ ok: true })
}
