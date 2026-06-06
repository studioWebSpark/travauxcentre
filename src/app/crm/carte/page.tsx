import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { STATUTS, PRIORITES } from "@/lib/crm"
import CrmMapLoader from "@/components/crm/CrmMapLoader"

export const metadata: Metadata = { title: "Carte clients" }
export const dynamic = "force-dynamic"

export default async function CartePage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, nom: true, ville: true, codePostal: true,
      typeTravaux: true, statut: true, priorite: true,
      telephone: true, email: true, montantDevis: true,
    },
  })

  // Sérialisation pour le composant client
  const markers = leads.map((l) => ({
    id:          l.id,
    nom:         l.nom,
    ville:       l.ville,
    codePostal:  l.codePostal,
    typeTravaux: l.typeTravaux,
    statut:      l.statut,
    priorite:    l.priorite,
    telephone:   l.telephone,
    email:       l.email,
    montantDevis: l.montantDevis,
  }))

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C5E]">Carte clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">{leads.length} lead{leads.length > 1 ? "s" : ""} géolocalisés par ville</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(STATUTS).map(([k, v]) => (
            <span key={k} className={`text-xs px-2.5 py-1 rounded-full border ${v.bg} ${v.color}`}>{v.label}</span>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: 500 }}>
        <CrmMapLoader markers={markers} />
      </div>
    </div>
  )
}
