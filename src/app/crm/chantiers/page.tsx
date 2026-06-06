import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { STATUTS_CHANTIER, formatEuro } from "@/lib/chantier"
import { Plus, MapPin, Calendar, TrendingUp } from "lucide-react"

export const metadata: Metadata = { title: "Chantiers" }
export const dynamic = "force-dynamic"

export default async function ChantiersPage() {
  const chantiers = await prisma.chantierCrm.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lead:   { select: { nom: true } },
      etapes: true,
      photos: { take: 1, orderBy: { createdAt: "desc" } },
      _count: { select: { photos: true, etapes: true, factures: true } },
    },
  })

  const enCours  = chantiers.filter((c) => c.statut === "EN_COURS").length
  const termine  = chantiers.filter((c) => c.statut === "TERMINE").length
  const caTotal  = chantiers.reduce((s, c) => s + (c.budgetReel ?? c.budget ?? 0), 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C5E]">Chantiers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{chantiers.length} chantier{chantiers.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/crm/chantiers/new"
          className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a3f7a] transition-colors text-sm">
          <Plus className="w-4 h-4" /> Nouveau chantier
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total",    value: chantiers.length, color: "text-[#0F2C5E]", bg: "bg-blue-50" },
          { label: "En cours", value: enCours,          color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "Terminés", value: termine,          color: "text-green-600",  bg: "bg-green-50" },
          { label: "CA total", value: formatEuro(caTotal), color: "text-[#F97316]", bg: "bg-orange-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Grid chantiers */}
      {chantiers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 mb-4">Aucun chantier pour l&apos;instant</p>
          <Link href="/crm/chantiers/new"
            className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-4 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> Créer le premier chantier
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {chantiers.map((c) => {
            const st         = STATUTS_CHANTIER[c.statut]
            const etapesDone = c.etapes.filter((e) => e.statut === "TERMINEE").length
            return (
              <Link key={c.id} href={`/crm/chantiers/${c.id}`} className="group">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0F2C5E]/20 transition-all h-full overflow-hidden">
                  {/* Photo ou placeholder */}
                  <div className="h-36 bg-gradient-to-br from-[#0F2C5E]/10 to-[#0F2C5E]/5 relative overflow-hidden">
                    {c.photos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.photos[0].url} alt={c.titre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-[#0F2C5E]/20" />
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                      {st.label}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-[#0F2C5E] mb-1 group-hover:underline">{c.titre}</h3>
                    {c.lead && <p className="text-xs text-gray-400 mb-2">Client : {c.lead.nom}</p>}

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      <span className="truncate">{c.adresse}</span>
                    </div>

                    {/* Progression */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Progression</span>
                        <span className="text-xs font-bold text-[#0F2C5E]">{c.progression}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0F2C5E] rounded-full transition-all"
                          style={{ width: `${c.progression}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{c._count.etapes} étapes · {etapesDone} terminées</span>
                      <span>{c._count.photos} photos</span>
                    </div>

                    {(c.budget || c.budgetReel) && (
                      <div className="mt-3 pt-3 border-t border-gray-50 text-xs">
                        {c.budgetReel && <span className="font-bold text-green-600">{formatEuro(c.budgetReel)}</span>}
                        {c.budget && !c.budgetReel && <span className="text-gray-500">Budget : {formatEuro(c.budget)}</span>}
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
