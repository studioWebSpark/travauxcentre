import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createRdvTask } from "@/lib/hubspot"

export async function POST(request: Request) {
  try {
    const { nom, email, telephone, typeRdv, message, creneau } = await request.json()

    if (!nom || !email || !telephone || !typeRdv) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    const rdv = await prisma.rendezVous.create({
      data: { nom, email, telephone, typeRdv, message: message ?? null, creneau: creneau ?? null },
    })

    if (process.env.HUBSPOT_API_KEY) {
      try {
        const task = await createRdvTask({ nom, email, typeRdv, message })
        await prisma.rendezVous.update({ where: { id: rdv.id }, data: { hubspotTaskId: task.id } })
      } catch (e) {
        console.error("[HubSpot RDV]", e)
      }
    }

    return NextResponse.json({ success: true, id: rdv.id })
  } catch (e) {
    console.error("[RendezVous]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 })
  }
}
