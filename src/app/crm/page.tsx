import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { AlertTriangle, Plus, TrendingUp } from "lucide-react"

export const metadata: Metadata = { title: "Dashboard" }
export const dynamic = "force-dynamic"

const formatEuro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)

interface StatsData {
  kpis: {
    caTotal: number
    caEnAttente: number
    caAnnuel: number
    caMois: number
    caDevisSigne: number
    tauxConversion: number
    totalLeads: number
    leadsMonth: number
    leadsGagne: number
    leadsPerdu: number
    chantiers: number
    chantiersEnCours: number
    chantiersTermines: number
  }
  caMoisGlissant: { mois: string; ca: number }[]
  sources: { source: string; count: number }[]
  villes: { ville: string; count: number }[]
  funnel: { label: string; count: number; color: string }[]
}

export default async function CrmDashboard() {
  // Fetch stats from API
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const statsRes = await fetch(`${baseUrl}/api/crm/stats`, { cache: "no-store" })
  const stats: StatsData = await statsRes.json()

  const { kpis, caMoisGlissant, sources, villes, funnel } = stats

  // Alertes: fetch direct via Prisma
  const now = new Date()
  const cutoff48h = new Date(now.getTime() - 48 * 60 * 60 * 1000)
  const cutoff7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [leadsNouveau, devisEnRetard, facturesRetard] = await Promise.all([
    prisma.lead.findMany({
      where: { statut: "NOUVEAU", createdAt: { lt: cutoff48h } },
      select: { id: true, nom: true, typeTravaux: true, createdAt: true },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
    prisma.devisCrm.findMany({
      where: { statut: "ENVOYE", updatedAt: { lt: cutoff7d } },
      select: { id: true, numero: true, updatedAt: true },
      orderBy: { updatedAt: "asc" },
      take: 5,
    }),
    prisma.factureCrm.findMany({
      where: { statut: "ENVOYEE", dateEcheance: { lt: now } },
      select: { id: true, numero: true, dateEcheance: true },
      orderBy: { dateEcheance: "asc" },
      take: 5,
    }),
  ])

  const alertCount = leadsNouveau.length + devisEnRetard.length + facturesRetard.length

  // Bar chart helpers
  const maxCa = Math.max(...caMoisGlissant.map((m) => m.ca), 1)

  // Funnel max
  const funnelMax = Math.max(...funnel.map((f) => f.count), 1)

  // Sources max
  const sourcesMax = Math.max(...sources.map((s) => s.count), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-montserrat">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-0.5">Vue d&apos;ensemble de votre activité</p>
        </div>
        <Link
          href="/crm/leads"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F97316] to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Nouveau lead
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-[0.875rem] p-5 border border-white/8">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">CA encaissé ce mois</p>
          <p className="text-2xl font-bold text-[#F97316] mt-1 font-montserrat">{formatEuro(kpis.caMois)}</p>
          <p className="text-xs text-slate-400 mt-1">Factures payées</p>
        </div>
        <div className="glass rounded-[0.875rem] p-5 border border-white/8">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">CA annuel</p>
          <p className="text-2xl font-bold text-white mt-1 font-montserrat">{formatEuro(kpis.caAnnuel)}</p>
          <p className="text-xs text-slate-400 mt-1">Depuis le 1er janv.</p>
        </div>
        <div className="glass rounded-[0.875rem] p-5 border border-white/8">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Leads ce mois</p>
          <p className="text-2xl font-bold text-white mt-1 font-montserrat">{kpis.leadsMonth}</p>
          <p className="text-xs text-slate-400 mt-1">{kpis.totalLeads} au total</p>
        </div>
        <div className="glass rounded-[0.875rem] p-5 border border-white/8">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Taux de conversion</p>
          <p className="text-2xl font-bold text-[#F97316] mt-1 font-montserrat">{kpis.tauxConversion}%</p>
          <p className="text-xs text-slate-400 mt-1">{kpis.leadsGagne} gagnés</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CA Bar Chart — spans 2 cols */}
        <div className="lg:col-span-2 glass rounded-[0.875rem] p-5 border border-white/8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#F97316]" />
            <h2 className="text-sm font-semibold text-white font-montserrat">CA mensuel (12 mois glissants)</h2>
          </div>
          <div className="flex items-end gap-1.5 h-44">
            {caMoisGlissant.map((m) => {
              const pct = maxCa > 0 ? Math.max((m.ca / maxCa) * 100, m.ca > 0 ? 2 : 0) : 0
              return (
                <div key={m.mois} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex items-end justify-center" style={{ height: "128px" }}>
                    <div
                      className="w-full bg-gradient-to-t from-[#F97316] to-orange-400 rounded-t hover:from-orange-500 hover:to-orange-300 transition-colors cursor-default"
                      style={{ height: `${pct}%` }}
                      title={`${m.mois}: ${formatEuro(m.ca)}`}
                    />
                    {m.ca > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {formatEuro(m.ca)}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 text-center leading-tight">{m.mois}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Funnel */}
        <div className="glass rounded-[0.875rem] p-5 border border-white/8">
          <h2 className="text-sm font-semibold text-white font-montserrat mb-4">Entonnoir leads</h2>
          <div className="space-y-3">
            {funnel.map((step, i) => {
              const pct = funnelMax > 0 ? Math.round((step.count / funnelMax) * 100) : 0
              return (
                <div key={step.label}>
                  {i > 0 && (
                    <div className="flex justify-center my-1">
                      <svg className="w-3 h-3 text-white/20" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 9L1 4h10L6 9z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 w-24 shrink-0 truncate">{step.label}</span>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${step.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#F97316] w-7 text-right">{step.count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sources + Villes row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top sources */}
        <div className="glass rounded-[0.875rem] p-5 border border-white/8">
          <h2 className="text-sm font-semibold text-white font-montserrat mb-4">Sources de leads</h2>
          <div className="space-y-2.5">
            {sources.slice(0, 7).map((s) => {
              const pct = sourcesMax > 0 ? Math.max((s.count / sourcesMax) * 100, 4) : 0
              return (
                <div key={s.source} className="flex items-center gap-3">
                  <span className="text-xs text-slate-300 w-28 shrink-0 truncate">{s.source || "Inconnu"}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#F97316] to-orange-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#F97316] w-6 text-right">{s.count}</span>
                </div>
              )
            })}
            {sources.length === 0 && (
              <p className="text-sm text-slate-400 italic">Aucune donnée</p>
            )}
          </div>
        </div>

        {/* Top villes */}
        <div className="glass rounded-[0.875rem] p-5 border border-white/8">
          <h2 className="text-sm font-semibold text-white font-montserrat mb-4">Top villes</h2>
          <div className="flex flex-wrap gap-2">
            {villes.slice(0, 5).map((v) => (
              <span
                key={v.ville}
                className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"
              >
                {v.ville}
                <span className="bg-[#F97316] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {v.count}
                </span>
              </span>
            ))}
            {villes.length === 0 && (
              <span className="text-sm text-slate-400 italic">Aucune donnée</span>
            )}
          </div>
        </div>
      </div>

      {/* Alertes */}
      {alertCount > 0 ? (
        <div className="glass rounded-[0.875rem] p-5 border border-orange-500/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-[#F97316]" />
            <h2 className="text-sm font-semibold text-white font-montserrat">
              Alertes{" "}
              <span className="ml-1 bg-[#F97316] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {alertCount}
              </span>
            </h2>
          </div>
          <div className="space-y-2">
            {leadsNouveau.map((l) => (
              <Link
                key={l.id}
                href="/crm/leads"
                className="flex items-start gap-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <span className="shrink-0 w-2 h-2 rounded-full bg-red-400 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-red-300">Lead sans contact &gt; 48h</p>
                  <p className="text-xs text-slate-400 truncate">
                    {l.nom} — {l.typeTravaux}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {l.createdAt.toLocaleDateString("fr-FR")}
                </span>
              </Link>
            ))}
            {devisEnRetard.map((d) => (
              <Link
                key={d.id}
                href="/crm/devis"
                className="flex items-start gap-3 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors"
              >
                <span className="shrink-0 w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-300">Devis sans réponse &gt; 7 jours</p>
                  <p className="text-xs text-slate-400 truncate">{d.numero}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {d.updatedAt.toLocaleDateString("fr-FR")}
                </span>
              </Link>
            ))}
            {facturesRetard.map((f) => (
              <Link
                key={f.id}
                href="/crm/factures"
                className="flex items-start gap-3 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition-colors"
              >
                <span className="shrink-0 w-2 h-2 rounded-full bg-orange-400 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-orange-300">Facture en retard de paiement</p>
                  <p className="text-xs text-slate-400 truncate">{f.numero}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  Éch. {f.dateEcheance?.toLocaleDateString("fr-FR") ?? "—"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-[0.875rem] p-5 border border-white/8">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-300 font-montserrat">Alertes</h2>
          </div>
          <p className="text-sm text-slate-400 mt-2 italic">Aucune alerte en cours. Tout est à jour !</p>
        </div>
      )}
    </div>
  )
}
