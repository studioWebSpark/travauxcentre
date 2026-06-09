import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import FactureForm from "@/components/crm/FactureForm"

export const metadata: Metadata = { title: "Nouvelle facture" }

export default async function NouvelleFacturePage({
  searchParams,
}: {
  searchParams: Promise<{ chantierId?: string }>
}) {
  const sp         = await searchParams
  const chantierId = sp.chantierId ?? ""

  const chantiers = await prisma.chantierCrm.findMany({
    orderBy: { createdAt: "desc" },
    select:  { id: true, titre: true },
  })

  // Si chantierId fourni, récupérer les devis acceptés du chantier pour pré-remplir
  const devisChantier = chantierId
    ? await prisma.devisCrm.findMany({
        where:   { chantierId, statut: { in: ["ACCEPTE", "FACTUREE"] } },
        include: { lignes: true },
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F2C5E] font-montserrat">Nouvelle facture</h1>
        <p className="text-gray-500 text-sm mt-0.5">Créer une facture liée à un chantier</p>
      </div>
      <FactureForm
        chantiers={chantiers}
        defaultChantierId={chantierId}
        devisDisponibles={devisChantier}
      />
    </div>
  )
}
