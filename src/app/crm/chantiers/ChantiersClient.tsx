"use client"

import Link from "next/link"
import { STATUTS_CHANTIER, formatEuro } from "@/lib/chantier"
import { Plus, MapPin, TrendingUp, Search, X } from "lucide-react"
import { useState, useMemo } from "react"

const STATUTS_FILTER = ["Tous", "PLANIFIE", "EN_COURS", "PAUSE", "TERMINE", "ANNULE"]

export default function ChantiersClient({
  initialChantiers,
  enCours,
  termine,
  caTotal,
}: {
  initialChantiers: any[]
  enCours: number
  termine: number
  caTotal: number
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("Tous")

  const filteredChantiers = useMemo(() => {
    return initialChantiers.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.adresse.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = selectedStatus === "Tous" || c.statut === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, selectedStatus, initialChantiers])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-montserrat">Chantiers</h1>
          <p className="text-slate-300 text-sm mt-0.5">{initialChantiers.length} chantier{initialChantiers.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/crm/chantiers/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F97316] to-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:from-orange-500 hover:to-orange-700 transition-all text-sm">
          <Plus className="w-4 h-4" /> Nouveau chantier
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total",    value: initialChantiers.length, color: "text-[#F97316]", bg: "bg-orange-50/20 border-orange-500/30" },
          { label: "En cours", value: enCours,                 color: "text-amber-400",  bg: "bg-amber-500/20 border-amber-500/30" },
          { label: "Terminés", value: termine,                 color: "text-green-400",  bg: "bg-green-500/20 border-green-500/30" },
          { label: "CA total", value: formatEuro(caTotal),    color: "text-white",      bg: "bg-white/5 border-white/20" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`glass rounded-[0.875rem] border ${bg} p-4`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-300 mt-0.5 font-medium uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="glass rounded-[0.875rem] border border-white/8 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wide">Recherche</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Titre ou adresse…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 pl-9 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 uppercase tracking-wide">Statut</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
          >
            {STATUTS_FILTER.map((st) => {
              const label = st === "Tous" ? "Tous" : STATUTS_CHANTIER[st as keyof typeof STATUTS_CHANTIER]?.label || st
              return (
                <option key={st} value={st} className="bg-[#0D1B2A]">
                  {label}
                </option>
              )
            })}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-300 font-medium">
        {filteredChantiers.length} résultat{filteredChantiers.length > 1 ? "s" : ""}
      </div>

      {/* Grid chantiers */}
      {filteredChantiers.length === 0 ? (
        <div className="text-center py-16 glass rounded-[0.875rem] border border-white/8">
          <p className="text-slate-400 mb-4">Aucun chantier trouvé</p>
          {(searchQuery || selectedStatus !== "Tous") && (
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedStatus("Tous")
              }}
              className="text-[#F97316] text-sm font-semibold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChantiers.map((c) => {
            const st         = STATUTS_CHANTIER[c.statut]
            const etapesDone = c.etapes.filter((e) => e.statut === "TERMINEE").length
            return (
              <Link key={c.id} href={`/crm/chantiers/${c.id}`} className="group">
                <div className="glass rounded-[0.875rem] border border-white/8 shadow-sm hover:shadow-md hover:border-[#F97316]/30 transition-all h-full overflow-hidden">
                  {/* Photo ou placeholder */}
                  <div className="h-36 bg-gradient-to-br from-[#F97316]/10 to-[#F97316]/5 relative overflow-hidden">
                    {c.photos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photos[0].url} alt={c.titre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-[#F97316]/20" />
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                      {st.label}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-white mb-1 group-hover:text-[#F97316] transition-colors">{c.titre}</h3>
                    {c.lead && <p className="text-xs text-slate-400 mb-2">Client : {c.lead.nom}</p>}

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{c.adresse}</span>
                    </div>

                    {/* Progression */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">Progression</span>
                        <span className="text-xs font-bold text-[#F97316]">{c.progression}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#F97316] to-orange-400 rounded-full transition-all"
                          style={{ width: `${c.progression}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{c._count.etapes} étapes · {etapesDone} terminées</span>
                      <span>{c._count.photos} photos</span>
                    </div>

                    {(c.budget || c.budgetReel) && (
                      <div className="mt-3 pt-3 border-t border-white/8 text-xs">
                        {c.budgetReel && <span className="font-bold text-green-400">{formatEuro(c.budgetReel)}</span>}
                        {c.budget && !c.budgetReel && <span className="text-slate-400">Budget : {formatEuro(c.budget)}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
