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
          <h1 className="text-2xl font-bold text-white font-montserrat">Factures</h1>
          <p className="text-slate-400 text-sm mt-0.5">{factures.length} résultat{factures.length > 1 ? "s" : ""}</p>
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
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <form method="GET" className="glass rounded-[0.875rem] border border-white/8 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-medium text-slate-300 mb-1">Recherche</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Numéro ou client…"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Statut</label>
          <select name="statut" defaultValue={statut ?? "Tous"} className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent">
            <option className="bg-[#0D1B2A]">Tous</option>
            {Object.entries(STATUTS_FACTURE).map(([k, v]) => <option key={k} value={k} className="bg-[#0D1B2A]">{v.label}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-gradient-to-r from-[#F97316] to-orange-600 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:from-orange-500 hover:to-orange-700 transition-all">
          Filtrer
        </button>
        <Link href="/crm/factures" className="text-sm text-slate-400 hover:text-slate-300 transition-colors py-2">Réinitialiser</Link>
      </form>

      {factures.length === 0 ? (
        <div className="glass rounded-[0.875rem] border border-white/8 text-center py-16">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400">Les factures apparaissent ici quand vous les générez depuis un chantier.</p>
          <Link href="/crm/chantiers" className="text-[#F97316] text-sm font-semibold hover:underline mt-2 inline-block">
            Aller aux chantiers →
          </Link>
        </div>
      ) : (
        <div className="glass rounded-[0.875rem] border border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/5">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider font-montserrat">Numéro</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider font-montserrat">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider hidden md:table-cell font-montserrat">Chantier</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider font-montserrat">Montant TTC</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider font-montserrat">Statut</th>
                  <th className="px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider font-montserrat">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {factures.map((f) => {
                  const st  = STATUTS_FACTURE[f.statut] ?? STATUTS_FACTURE.BROUILLON
                  const tot = calcTotaux(f.lignes, f.tva)
                  const client = f.chantier?.lead
                  return (
                    <tr key={f.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#F97316]">{f.numero}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {f.type} · {new Date(f.dateEmission).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </p>
                        {f.dateEcheance && (
                          <p className={`text-xs mt-0.5 ${f.statut !== "PAYEE" && new Date(f.dateEcheance) < new Date() ? "text-red-400 font-semibold" : "text-slate-400"}`}>
                            Échéance : {new Date(f.dateEcheance).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">{client?.nom ?? "—"}</p>
                        <p className="text-xs text-slate-400">{client?.email ?? ""}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-white text-xs font-medium">{f.chantier?.titre ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="font-bold text-[#F97316]">{formatEuro(tot.ttc)}</p>
                        <p className="text-xs text-slate-400">{formatEuro(tot.ht)} HT</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                          {st.label}
                        </span>
                        {f.emailEnvoye && (
                          <p className="text-xs text-slate-400 mt-1">📧 envoyée</p>
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
