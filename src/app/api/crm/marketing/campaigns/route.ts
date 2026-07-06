import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { renderTemplate, sendMarketingEmail } from "@/lib/mailer"

export async function GET() {
  const campagnes = await prisma.campagneMarketing.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { envois: true } } },
  })
  return NextResponse.json(campagnes)
}

export async function POST(request: Request) {
  const { nom, sujet, corpsHtml, leadIds } = await request.json()

  if (!nom || !sujet || !corpsHtml || !Array.isArray(leadIds) || leadIds.length === 0) {
    return NextResponse.json({ error: "Nom, sujet, corps et destinataires requis" }, { status: 400 })
  }

  const leads = await prisma.lead.findMany({ where: { id: { in: leadIds } } })

  const campagne = await prisma.campagneMarketing.create({
    data: { nom: nom.trim(), sujet: sujet.trim(), corpsHtml },
  })

  let envoyes = 0
  let echecs = 0

  for (const lead of leads) {
    if (!lead.email) {
      echecs++
      await prisma.envoiCampagne.create({
        data: { campagneId: campagne.id, leadId: lead.id, email: "", statut: "ECHEC", erreur: "Pas d'email" },
      })
      continue
    }

    const vars = { nom: lead.nom, ville: lead.ville, typeTravaux: lead.typeTravaux }
    try {
      await sendMarketingEmail(lead.email, renderTemplate(sujet, vars), renderTemplate(corpsHtml, vars))
      envoyes++
      await prisma.envoiCampagne.create({
        data: { campagneId: campagne.id, leadId: lead.id, email: lead.email, statut: "ENVOYE" },
      })
    } catch (err) {
      echecs++
      await prisma.envoiCampagne.create({
        data: { campagneId: campagne.id, leadId: lead.id, email: lead.email, statut: "ECHEC", erreur: err instanceof Error ? err.message : String(err) },
      })
    }
  }

  return NextResponse.json({ campagneId: campagne.id, envoyes, echecs })
}
