import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import CalendarClient from "@/components/crm/CalendarClient"

export const metadata: Metadata = { title: "Calendrier" }
export const dynamic = "force-dynamic"

interface Planning {
  id: string
  date: Date
  heure?: string
  typeRdv: string
  adresse: string | null
  notes: string | null
  duree: number
  statut: string
  lead: { id: string; nom: string; telephone: string | null }
}

export default async function CalendrierPage() {
  const planningsData = await prisma.planning.findMany({
    include: { lead: { select: { id: true, nom: true, telephone: true } } },
    orderBy: { date: "asc" },
  })

  const plannings: Planning[] = planningsData.map((p) => ({
    id: p.id,
    date: p.date,
    heure: p.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    typeRdv: p.typeRdv,
    adresse: p.adresse,
    notes: p.notes,
    duree: p.duree,
    statut: p.statut,
    lead: p.lead,
  }))

  return <CalendarClient initialPlannings={plannings} />
}
