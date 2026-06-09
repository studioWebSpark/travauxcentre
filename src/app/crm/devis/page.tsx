import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { STATUTS_DEVIS, calcTotaux, formatEuro } from "@/lib/chantier"
import DevisRowActions from "@/components/crm/DevisRowActions"
import RelanceButton from "@/components/crm/RelanceButton"
import { Plus, FileText } from "lucide-react"

export const metadata: Metadata = { title: "Devis" }
export const dynamic = "force-dynamic"

export default async function DevisListPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; q?: string }>
}) {
  const sp     = await searchParams
  const statut = sp.statut && sp.statut !== "Tous" ? sp.statut : undefined
  const q      = sp.q ?? ""

  const devis = await prisma.devisCrm.findMany({
    where: {
      ...(statut ? { statut: statut as never } : {}),
      ...(q ? {
        OR: [
          { numero:   { contains: q, mode: "insensitive" } },
          { lead:     { nom: { contains: q, mode: "insensitive" } } },
        ],
      } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      lignes:           true,
      etapesPaiement:   { orderBy: { ordre: "asc" } },
      lead:             { select: { nom: true, email: true, ville: true } },
      chantier:         { select: { titre: true } },
      factures:         { select: { id: true } },
    },
  })

  const totalAccepte = devis
    .filter((d) => d.statut === "ACCEPTE")
    .reduce((s, d) => s + calcTotaux(d.lignes, d.tva).ttc, 0)

  const totalFacture = devis
    .filter((d) => d.statut === "FACTUREE")
    .reduce((s, d) => s + calcTotaux(d.lignes, d.tva).ttc, 0)

  const stats = [
    { label: "Total devis",   value: devis.length,                                            color: "text-[#0F2C5E]", bg: "bg-blue-50" },
    { label: "Envoyés",       value: devis.filter((d) => d.statut === "ENVOYE").length,       color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Acceptés",      value: devis.filter((d) => d.statut === "ACCEPTE").length,      color: "text-green-600", bg: "bg-green-50" },
    { label: "Facturés",      value: devis.filter((d) => d.statut === "FACTUREE").length,     color: "text-purple-600", bg: "bg-purple-50" },
    { label: "CA facturé",    value: formatEuro(totalFacture),                                color: "text-[#F97316]", bg: "bg-orange-50" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] font-montserrat">Devis</h1>
          <p className="text-[#404040] text-sm mt-0.5">{devis.length} résultat{devis.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/crm/devis/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F97316] to-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm">
          <Plus className="w-4 h-4" /> Nouveau devis
        </Link>
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
            {Object.entries(STATUTS_DEVIS).map(([k, v]) => <option key={k} value={k} className="bg-[#0D1B2A]">{v.label}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-gradient-to-r from-[#F97316] to-orange-600 text-white font-semibold px-4 py-2 rounded-xl text-sm ">
          Filtrer
        </button>
        <Link href="/crm/devis" className="text-sm text-[#404040] py-2">Réinitialiser</Link>
      </form>

      {/* Table */}
      {devis.length === 0 ? (
        <div className="glass rounded-[0.875rem] border border-white/8 text-center py-16">
          <FileText className="w-10 h-10 text-[#555555] mx-auto mb-3" />
          <p className="text-[#404040] mb-4">Aucun devis pour l&apos;instant</p>
          <Link href="/crm/devis/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F97316] to-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm ">
            <Plus className="w-4 h-4" /> Créer le premier devis
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
                {devis.map((d) => {
                  const st  = STATUTS_DEVIS[d.statut] ?? STATUTS_DEVIS.BROUILLON
                  const tot = calcTotaux(d.lignes, d.tva)
                  return (
                    <tr key={d.id} className="hover:bg-white/5 ">
                      <td className="px-5 py-4">
                        <Link href={`/crm/devis/${d.id}`}>
                          <p className="font-bold text-[#F97316] hover:underline">{d.numero}</p>
                        </Link>
                        <p className="text-xs text-[#404040] mt-0.5">
                          {new Date(d.dateEmission).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#1a1a1a]">{d.lead?.nom ?? "—"}</p>
                        <p className="text-xs text-[#404040]">{d.lead?.email ?? ""}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-[#1a1a1a] text-xs font-medium">{d.chantier?.titre ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="font-bold text-[#F97316]">{formatEuro(tot.ttc)}</p>
                        <p className="text-xs text-[#404040]">{formatEuro(tot.ht)} HT</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                          {st.label}
                        </span>
                        {d.emailEnvoye && (
                          <p className="text-xs text-[#404040] mt-1">📧 envoyé</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <DevisRowActions
                            devisId={d.id}
                            token={d.token}
                            statut={d.statut}
                            emailEnvoye={d.emailEnvoye}
                            hasEmail={!!d.lead?.email}
                            factureId={d.factures?.[0]?.id}
                          />
                          <RelanceButton type="devis" id={d.id} statut={d.statut} hasEmail={!!d.lead?.email} />
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
