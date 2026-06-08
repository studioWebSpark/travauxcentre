import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { STATUTS, PIPELINE_ORDER, PRIORITES, formatDate, formatEuro } from "@/lib/crm"
import PipelineBoard from "@/components/crm/PipelineBoard"

export const metadata: Metadata = { title: "Pipeline" }
export const dynamic = "force-dynamic"

export default async function PipelinePage() {
  const leads = await prisma.lead.findMany({
    orderBy: [{ priorite: "asc" }, { createdAt: "desc" }],
    include: { notes: { orderBy: { createdAt: "desc" }, take: 1 } },
  })

  const columns = PIPELINE_ORDER.map((statut) => ({
    statut,
    cfg:   STATUTS[statut],
    leads: leads
      .filter((l) => l.statut === statut)
      .map((l) => ({
        id:          l.id,
        nom:         l.nom,
        ville:       l.ville,
        typeTravaux: l.typeTravaux,
        telephone:   l.telephone,
        budget:      l.budget,
        montantDevis: l.montantDevis,
        priorite:    l.priorite,
        createdAt:   l.createdAt.toISOString(),
        dateContact: l.dateContact?.toISOString() ?? null,
        lastNote:    l.notes[0]?.contenu ?? null,
      })),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2C5E]">Pipeline commercial</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {leads.length} lead{leads.length > 1 ? "s" : ""} — glissez ou cliquez pour changer le statut
        </p>
      </div>
      <PipelineBoard columns={columns} />
    </div>
  )
}
