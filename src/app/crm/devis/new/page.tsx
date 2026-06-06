import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import DevisForm from "@/components/crm/DevisForm"

export const metadata: Metadata = { title: "Nouveau devis" }

export default async function NouveauDevisPage({
  searchParams,
}: { searchParams: Promise<{ chantierId?: string; leadId?: string }> }) {
  const sp = await searchParams

  const [chantiers, leads] = await Promise.all([
    prisma.chantierCrm.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, titre: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, nom: true, ville: true } }),
  ])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F2C5E]">Nouveau devis</h1>
        <p className="text-gray-500 text-sm mt-0.5">Créer un devis professionnel et générer le PDF</p>
      </div>
      <DevisForm
        chantiers={chantiers}
        leads={leads}
        defaultChantierId={sp.chantierId ?? ""}
        defaultLeadId={sp.leadId ?? ""}
      />
    </div>
  )
}
