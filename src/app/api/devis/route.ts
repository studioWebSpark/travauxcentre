import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createContact, createDeal, createTask } from "@/lib/hubspot"
import { sendDevisConfirmation, sendDevisNotification } from "@/lib/mailer"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { nom, email, telephone, ville, codePostal, typeTravaux, description, surface, budget, dateSouhaitee, source } = body

    if (!nom || !email || !telephone || !ville || !codePostal || !typeTravaux || !description) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    let hubspotContactId: string | undefined
    let hubspotDealId:    string | undefined

    // 1. Sauvegarder en base
    const lead = await prisma.lead.create({
      data: {
        nom, email, telephone, ville, codePostal,
        typeTravaux, description,
        surface:       surface    ? Number(surface)    : null,
        budget:        budget     ?? null,
        dateSouhaitee: dateSouhaitee ?? null,
        source:        source     ?? null,
      },
    })

    // 2. HubSpot (si clé configurée)
    if (process.env.HUBSPOT_API_KEY) {
      try {
        const contact = await createContact({ email, nom, telephone, ville, source })
        hubspotContactId = contact.id

        const deal = await createDeal({
          contactId: contact.id,
          typeTravaux, ville, description,
          surface:       surface ? Number(surface) : null,
          budget:        budget ?? null,
          dateSouhaitee: dateSouhaitee ?? null,
        })
        hubspotDealId = deal.id

        await createTask({ contactId: contact.id, nom })

        await prisma.lead.update({
          where: { id: lead.id },
          data:  { hubspotContactId, hubspotDealId },
        })
      } catch (e) {
        console.error("[HubSpot]", e)
      }
    }

    // 3. Emails (si SMTP configuré)
    if (process.env.SMTP_USER) {
      try {
        await Promise.all([
          sendDevisConfirmation({ nom, email, typeTravaux }),
          sendDevisNotification({ nom, email, telephone, ville, codePostal, typeTravaux, description, surface: surface ? Number(surface) : null, budget, dateSouhaitee, source }),
        ])
      } catch (e) {
        console.error("[Mailer]", e)
      }
    }

    return NextResponse.json({ success: true, id: lead.id })
  } catch (e) {
    console.error("[Devis]", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur serveur" }, { status: 500 })
  }
}
