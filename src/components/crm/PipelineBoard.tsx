"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { STATUTS, PRIORITES, formatDate, formatEuro } from "@/lib/crm"
import type { StatutLead, PrioriteLead } from "@/generated/prisma"
import { Phone, MapPin, ChevronDown } from "lucide-react"

type LeadCard = {
  id: string; nom: string; ville: string; typeTravaux: string
  budget: string | null; montantDevis: number | null
  priorite: PrioriteLead; createdAt: string; dateContact: string | null
  lastNote: string | null
}

type Column = {
  statut: StatutLead
  cfg: typeof STATUTS[StatutLead]
  leads: LeadCard[]
}

export default function PipelineBoard({ columns }: { columns: Column[] }) {
  const router   = useRouter()
  const [moving, setMoving] = useState<string | null>(null)

  async function moveToStatut(leadId: string, statut: StatutLead) {
    setMoving(leadId)
    await fetch(`/api/crm/leads/${leadId}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ statut }),
    })
    setMoving(null)
    router.refresh()
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {columns.map(({ statut, cfg, leads }) => (
          <div key={statut} className="w-64 shrink-0">
            {/* En-tête colonne */}
            <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border mb-3 ${cfg.bg}`}>
              <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
              <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center bg-white/60 ${cfg.color}`}>
                {leads.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {leads.length === 0 && (
                <div className="border-2 border-dashed border-gray-100 rounded-2xl h-20 flex items-center justify-center">
                  <p className="text-xs text-gray-300">Aucun lead</p>
                </div>
              )}
              {leads.map((lead) => {
                const pr = PRIORITES[lead.priorite]
                return (
                  <div key={lead.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 ${moving === lead.id ? "opacity-50 pointer-events-none" : ""}`}>
                    {/* Priorité + nom */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`w-2 h-2 rounded-full ${pr.dot}`} />
                          <span className={`text-xs ${pr.color}`}>{pr.label}</span>
                        </div>
                        <Link href={`/crm/leads/${lead.id}`}
                          className="font-bold text-[#0F2C5E] text-sm hover:underline leading-tight block">
                          {lead.nom}
                        </Link>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-1">{lead.typeTravaux}</p>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                      <MapPin className="w-3 h-3" />
                      {lead.ville}
                    </div>

                    {(lead.budget || lead.montantDevis) && (
                      <div className="text-xs bg-gray-50 rounded-lg px-2.5 py-1.5 mb-3 text-gray-600">
                        {lead.montantDevis ? (
                          <span className="font-semibold text-green-600">{formatEuro(lead.montantDevis)}</span>
                        ) : lead.budget}
                      </div>
                    )}

                    {lead.lastNote && (
                      <p className="text-xs text-gray-400 italic line-clamp-2 mb-3 border-l-2 border-gray-100 pl-2">
                        {lead.lastNote}
                      </p>
                    )}

                    {/* Déplacer vers */}
                    <div className="border-t border-gray-50 pt-3">
                      <p className="text-xs text-gray-300 mb-1.5">Déplacer vers :</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(STATUTS)
                          .filter(([k]) => k !== statut)
                          .map(([k, v]) => (
                            <button
                              key={k}
                              onClick={() => moveToStatut(lead.id, k as StatutLead)}
                              className={`text-xs px-2 py-0.5 rounded-full border ${v.bg} ${v.color} hover:opacity-80 transition-opacity`}
                            >
                              {v.label}
                            </button>
                          ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-300">{formatDate(lead.createdAt)}</span>
                      <div className="flex gap-1">
                        <a href={`tel:${lead.id}`}
                          className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center hover:bg-[#0F2C5E] hover:text-white transition-colors">
                          <Phone className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
