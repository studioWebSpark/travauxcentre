import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { STATUTS_FACTURE, calcTotaux, formatEuro } from "@/lib/chantier"
import FactureRowActions from "@/components/crm/FactureRowActions"
import RelanceButton from "@/components/crm/RelanceButton"
import { FileText } from "lucide-react"

export const metadata: Metadata = { title: "Factures" }
export const dynamic = "force-dynamic"

export default async function FacturesListPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; q?: string }>
}) {
  const sp     = await searchParams
  const statut = sp.statut && sp.statut !== "Tous" ? sp.statut : undefined
  const q      = sp.q ?? ""

  const factures = await prisma.factureCrm.findMany({
    where: {
      ...(statut ? { statut: statut as never } : {}),
      ...(q ? {
        OR: [
          { numero:   { contains: q, mode: "insensitive" } },
          { chantier: { lead: { nom: { contains: q, mode: "insensitive" } } } },
        ],
      } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      lignes:   true,
      chantier: {
        include: { lead: { select: { nom: true, email: true } } },
      },
      devis: {
        include: { etapesPaiement: { where: { statut: "PAYEE" }, orderBy: { ordre: "asc" } }, lignes: true },
      },
    },
  })

  const totalPayee = factures
    .filter((f) => f.statut === "PAYEE")
    .reduce((s, f) => s + calcTotaux(f.lignes, f.tva).ttc, 0)

  const totalEnAttente = factures
    .filter((f) => f.statut !== "PAYEE")
    .reduce((s, f) => s + calcTotaux(f.lignes, f.tva).ttc, 0)

  const stats = [
    { label: "Total factures",  value: factures.length,                                             color: "text-[#0F2C5E]", bg: "bg-blue-50" },
    { label: "Envoyées",        value: factures.filter((f) => f.statut === "ENVOYEE").length,       color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Payées",          value: factures.filter((f) => f.statut === "PAYEE").length,         color: "text-green-600", bg: "bg-green-50" },
    { label: "En attente",      value: formatEuro(totalEnAttente),                                   color: "text-red-600",   bg: "bg-red-50" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] font-montserrat">Factures</h1>
          <p className="text-[#404040] text-sm mt-0.5">{factures.length} résultat{factures.length > 1 ? "s" : ""}</p>
        </div>
        <div className="text-sm font-semibold text-green-400 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-xl">
          CA encaissé : {formatEuro(totalPayee)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`glass rounded-[0.875rem] border border-white/8 p-4 ${bg.replace('bg-', 'bg-opacity-20 ').replace('border-', 'border-opacity-20 ')}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-[#1a1a1a] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <form method="GET" className="glass rounded-[0.875rem] border border-white/8 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-medium text-[#1a1a1a] mb-1">Recherche</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Numéro ou client…"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-[#1a1a1a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#1a1a1a] mb-1">Statut</label>
          <select name="statut" defaultValue={statut ?? "Tous"} className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent">
            <option className="bg-[#0D1B2A]">Tous</option>
            {Object.entries(STATUTS_FACTURE).map(([k, v]) => <option key={k} value={k} className="bg-[#0D1B2A]">{v.label}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-gradient-to-r from-[#F97316] to-orange-600 text-white font-semibold px-4 py-2 rounded-xl text-sm ">
          Filtrer
        </button>
        <Link href="/crm/factures" className="text-sm text-[#404040] py-2">Réinitialiser</Link>
      </form>

      {factures.length === 0 ? (
        <div className="glass rounded-[0.875rem] border border-white/8 text-center py-16">
          <FileText className="w-10 h-10 text-[#555555] mx-auto mb-3" />
          <p className="text-[#404040]">Les factures apparaissent ici quand vous les générez depuis un chantier.</p>
          <Link href="/crm/chantiers" className="text-[#F97316] text-sm font-semibold mt-2 inline-block">
            Aller aux chantiers →
          </Link>
        </div>
      ) : (
        <div className="glass rounded-[0.875rem] border border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/5">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider font-montserrat">Numéro</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider font-montserrat">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider hidden md:table-cell font-montserrat">Chantier</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider font-montserrat">Montant TTC</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider font-montserrat">Statut</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider font-montserrat">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {factures.map((f) => {
                  const st     = STATUTS_FACTURE[f.statut] ?? STATUTS_FACTURE.BROUILLON
                  const tot    = calcTotaux(f.lignes, f.tva)
                  const client = f.chantier?.lead
                  const ttcDevis = f.devis
                    ? calcTotaux(f.devis.lignes, f.tva).ttc
                    : tot.ttc
                  const etapesPayees = f.devis?.etapesPaiement ?? []
                  return (
                    <tr key={f.id} className="hover:bg-white/5 ">
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#F97316]">{f.numero}</p>
                        <p className="text-xs text-[#404040] mt-0.5">
                          {f.type} · {new Date(f.dateEmission).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </p>
                        {f.dateEcheance && (
                          <p className={`text-xs mt-0.5 ${f.statut !== "PAYEE" && new Date(f.dateEcheance) < new Date() ? "text-red-400 font-semibold" : "text-[#404040]"}`}>
                            Échéance : {new Date(f.dateEcheance).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </p>
                        )}
                        {/* Historique paiements */}
                        {etapesPayees.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {etapesPayees.map(e => (
                              <div key={e.id} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                <span className="text-xs text-green-700 font-medium">
                                  {e.pourcentage}% — {formatEuro(Math.round((e.pourcentage / 100) * ttcDevis * 100) / 100)}
                                </span>
                                <span className="text-xs text-[#404040]">
                                  le {e.datePaiement ? new Date(e.datePaiement).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#1a1a1a]">{client?.nom ?? "—"}</p>
                        <p className="text-xs text-[#404040]">{client?.email ?? ""}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-[#1a1a1a] text-xs font-medium">{f.chantier?.titre ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="font-bold text-[#F97316]">{formatEuro(tot.ttc)}</p>
                        <p className="text-xs text-[#404040]">{formatEuro(tot.ht)} HT</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                          {st.label}
                        </span>
                        {f.emailEnvoye && (
                          <p className="text-xs text-[#404040] mt-1">📧 envoyée</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <FactureRowActions
                            factureId={f.id}
                            statut={f.statut}
                            emailEnvoye={f.emailEnvoye}
                            hasEmail={!!client?.email}
                          />
                          <RelanceButton type="facture" id={f.id} statut={f.statut} hasEmail={!!client?.email} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
