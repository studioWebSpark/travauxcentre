import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const { nom, email, telephone, ville, codePostal, typeTravaux, description,
          budget, surface, dateSouhaitee, source, priorite, facebookUrl } = body

  if (!nom) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 })
  }

  const lead = await prisma.lead.create({
    data: {
      nom:           nom.trim(),
      email:         email?.trim() || "",
      telephone:     telephone?.trim() || "",
      ville:         ville?.trim() || "",
      codePostal:    codePostal?.trim() || "",
      typeTravaux:   typeTravaux || "Autre",
      description:   description?.trim() || "",
      budget:        budget || null,
      surface:       surface ? Number(surface) : null,
      dateSouhaitee: dateSouhaitee || null,
      source:        source || "Manuel",
      priorite:      priorite || "NORMALE",
      statut:        "NOUVEAU",
      facebookUrl:   facebookUrl?.trim() || null,
    },
  })

  return NextResponse.json(lead)
}
