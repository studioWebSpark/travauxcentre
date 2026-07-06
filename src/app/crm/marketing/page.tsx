import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import MarketingCampaignBuilder from "@/components/crm/MarketingCampaignBuilder"

export const metadata: Metadata = { title: "Marketing" }
export const dynamic = "force-dynamic"

export default async function MarketingPage() {
  const [leads, templates, campagnes] = await Promise.all([
    prisma.lead.findMany({
      select: { id: true, nom: true, email: true, ville: true, statut: true, typeTravaux: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.emailTemplate.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.campagneMarketing.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { envois: true } } },
    }),
  ])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] font-montserrat">Marketing</h1>
        <p className="text-[#404040] text-sm mt-0.5">Envoie des emails personnalisés à tes leads et clients</p>
      </div>

      <MarketingCampaignBuilder leads={leads} templates={templates} campagnes={campagnes} />
    </div>
  )
}
