import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import NouveauChantierForm from "@/components/crm/NouveauChantierForm"

export const metadata: Metadata = { title: "Nouveau chantier" }

export default async function NouveauChantierPage() {
  const leads = await prisma.lead.findMany({
    where:   { statut: "GAGNE" },
    orderBy: { createdAt: "desc" },
    select:  { id: true, nom: true, ville: true, typeTravaux: true },
  })

  const devis = await prisma.devisCrm.findMany({
    where:   { chantierId: null },
    orderBy: { createdAt: "desc" },
    include: { lead: { select: { nom: true } }, lignes: true },
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F2C5E]">Nouveau chantier</h1>
        <p className="text-gray-500 text-sm mt-0.5">Créer un chantier et le lier à un lead gagné</p>
      </div>
      <NouveauChantierForm leads={leads} devis={devis} />
    </div>
  )
}
