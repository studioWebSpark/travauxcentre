import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { STATUTS, PRIORITES, daysSince, formatDate, formatEuro } from "@/lib/crm"
import { AlertTriangle, TrendingUp, Euro, Users, ChevronRight } from "lucide-react"

export const metadata: Metadata = { title: "Dashboard" }
export const dynamic = "force-dynamic"

export default async function CrmDashboard() {
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const week  = new Date(today); week.setDate(today.getDate() - 7)
  const month = new Date(today); month.setDate(1)

  const [allLeads, recentLeads] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { notes: { orderBy: { createdAt: "desc" }, take: 1 } },
    }),
  ])

  const total      = allLeads.length
  const ceJour     = allLeads.filter((l) => l.createdAt >= today).length
  const cetteSemaine = allLeads.filter((l) => l.createdAt >= week).length
  const ceMois     = allLeads.filter((l) => l.createdAt >= month).length
  const gagnes     = allLeads.filter((l) => l.statut === "GAGNE").length
  const tauxConv   = total > 0 ? Math.round((gagnes / total) * 100) : 0
  const caTotal    = allLeads.reduce((s, l) => s + (l.montantDevis ?? 0), 0)

  // Leads urgents : NOUVEAU non contacté depuis +48h
  const urgents = allLeads.filter((l) => {
    if (l.statut !== "NOUVEAU") return false
    const days = daysSince(l.dateContact ?? l.createdAt)
    return (days ?? 0) >= 2
  })

  // Stats pipeline
  const parStatut = STATUTS
  const pipeline  = Object.entries(parStatut).map(([statut, cfg]) => ({
    statut, cfg,
    count: allLeads.filter((l) => l.statut === statut).length,
  }))

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F2C5E]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">{formatDate(now)} — Vue d&apos;ensemble de votre activité commerciale</p>
      </div>

      {/* Alerte urgents */}
      {urgents.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">
              {urgents.length} lead{urgents.length > 1 ? "s" : ""} non contacté{urgents.length > 1 ? "s" : ""} depuis +48h
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {urgents.map((l) => (
                <Link key={l.id} href={`/crm/leads/${l.id}`}
                  className="text-xs bg-amber-100 border border-amber-300 text-amber-800 px-2.5 py-1 rounded-full hover:bg-amber-200 transition-colors">
                  {l.nom} — {l.ville}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Leads total",     value: total,         sub: `${ceJour} aujourd'hui`,   icon: Users,       color: "text-[#0F2C5E]",  bg: "bg-blue-50" },
          { label: "Cette semaine",   value: cetteSemaine,  sub: `${ceMois} ce mois`,        icon: TrendingUp,  color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Taux conversion", value: `${tauxConv}%`, sub: `${gagnes} gagné${gagnes > 1 ? "s" : ""}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "CA potentiel",    value: formatEuro(caTotal), sub: "devis enregistrés", icon: Euro,        color: "text-[#F97316]",  bg: "bg-orange-50" },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-700 text-sm font-medium mt-0.5">{label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline mini */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0F2C5E]">Pipeline</h2>
            <Link href="/crm/pipeline" className="text-xs text-gray-400 hover:text-[#0F2C5E] transition-colors">Voir tout →</Link>
          </div>
          <div className="space-y-3">
            {pipeline.map(({ statut, cfg, count }) => (
              <div key={statut} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0F2C5E] transition-all"
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Derniers leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0F2C5E]">Derniers leads</h2>
            <Link href="/crm/leads" className="text-xs text-gray-400 hover:text-[#0F2C5E] transition-colors">Voir tous →</Link>
          </div>
          <div className="space-y-2">
            {recentLeads.map((lead) => {
              const st = STATUTS[lead.statut]
              const pr = PRIORITES[lead.priorite]
              const days = daysSince(lead.createdAt)
              return (
                <Link key={lead.id} href={`/crm/leads/${lead.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                  <span className={`w-2 h-2 rounded-full ${pr.dot} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#0F2C5E] text-sm truncate">{lead.nom}</p>
                    <p className="text-gray-400 text-xs truncate">{lead.typeTravaux} — {lead.ville}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${st.bg} ${st.color} shrink-0`}>{st.label}</span>
                  <span className="text-xs text-gray-300 shrink-0 hidden sm:block">
                    {days === 0 ? "auj." : `${days}j`}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-gray-400 transition-colors shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
