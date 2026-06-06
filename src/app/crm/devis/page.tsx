import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { STATUTS_DEVIS, calcTotaux, formatEuro } from "@/lib/chantier"
import DevisRowActions from "@/components/crm/DevisRowActions"
import { Plus, FileText } from "lucide-react"

export const metadata: Metadata = { title: "Devis" }
export const dynamic = "force-dynamic"

export default async function DevisListPage() {
  const devis = await prisma.devisCrm.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lignes:   true,
      lead:     { select: { nom: true, email: true, ville: true } },
      chantier: { select: { titre: true } },
    },
  })

  const totalAccepte = devis
    .filter((d) => d.statut === "ACCEPTE")
    .reduce((s, d) => s + calcTotaux(d.lignes, d.tva).ttc, 0)

  const stats = [
    { label: "Total devis",  value: devis.length,                                           color: "text-[#0F2C5E]", bg: "bg-blue-50" },
    { label: "Envoyés",      value: devis.filter((d) => d.statut === "ENVOYE").length,      color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Acceptés",     value: devis.filter((d) => d.statut === "ACCEPTE").length,     color: "text-green-600", bg: "bg-green-50" },
    { label: "CA accepté",   value: formatEuro(totalAccepte),                               color: "text-[#F97316]", bg: "bg-orange-50" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C5E]">Devis</h1>
          <p className="text-gray-500 text-sm mt-0.5">{devis.length} devis au total</p>
        </div>
        <Link href="/crm/devis/new"
          className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a3f7a] transition-colors text-sm">
          <Plus className="w-4 h-4" /> Nouveau devis
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {devis.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">
          <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">Aucun devis pour l&apos;instant</p>
          <Link href="/crm/devis/new"
            className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-4 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> Créer le premier devis
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Numéro</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Chantier</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Montant TTC</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {devis.map((d) => {
                  const st  = STATUTS_DEVIS[d.statut] ?? STATUTS_DEVIS.BROUILLON
                  const tot = calcTotaux(d.lignes, d.tva)
                  return (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#0F2C5E]">{d.numero}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(d.dateEmission).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-700">{d.lead?.nom ?? "—"}</p>
                        <p className="text-xs text-gray-400">{d.lead?.email ?? ""}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-gray-600 text-xs">{d.chantier?.titre ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="font-bold text-[#0F2C5E]">{formatEuro(tot.ttc)}</p>
                        <p className="text-xs text-gray-400">{formatEuro(tot.ht)} HT</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                          {st.label}
                        </span>
                        {d.emailEnvoye && (
                          <p className="text-xs text-gray-400 mt-1">📧 envoyé</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <DevisRowActions
                          devisId={d.id}
                          token={d.token}
                          statut={d.statut}
                          emailEnvoye={d.emailEnvoye}
                          hasEmail={!!d.lead?.email}
                        />
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
