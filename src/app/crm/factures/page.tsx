import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { STATUTS_FACTURE, calcTotaux, formatEuro } from "@/lib/chantier"
import FactureRowActions from "@/components/crm/FactureRowActions"
import { FileText } from "lucide-react"

export const metadata: Metadata = { title: "Factures" }
export const dynamic = "force-dynamic"

export default async function FacturesListPage() {
  const factures = await prisma.factureCrm.findMany({
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
          <h1 className="text-2xl font-bold text-[#0F2C5E]">Factures</h1>
          <p className="text-gray-500 text-sm mt-0.5">{factures.length} facture{factures.length > 1 ? "s" : ""}</p>
        </div>
        <div className="text-sm font-semibold text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
          CA encaissé : {formatEuro(totalPayee)}
        </div>
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

      {factures.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">
          <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">Les factures apparaissent ici quand vous les générez depuis un chantier.</p>
          <Link href="/crm/chantiers" className="text-[#0F2C5E] text-sm font-semibold hover:underline mt-2 inline-block">
            Aller aux chantiers →
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
                {factures.map((f) => {
                  const st  = STATUTS_FACTURE[f.statut] ?? STATUTS_FACTURE.BROUILLON
                  const tot = calcTotaux(f.lignes, f.tva)
                  const client = f.chantier?.lead
                  return (
                    <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#0F2C5E]">{f.numero}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {f.type} · {new Date(f.dateEmission).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </p>
                        {f.dateEcheance && (
                          <p className={`text-xs mt-0.5 ${f.statut !== "PAYEE" && new Date(f.dateEcheance) < new Date() ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                            Échéance : {new Date(f.dateEcheance).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-700">{client?.nom ?? "—"}</p>
                        <p className="text-xs text-gray-400">{client?.email ?? ""}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-gray-600 text-xs">{f.chantier?.titre ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <p className="font-bold text-[#0F2C5E]">{formatEuro(tot.ttc)}</p>
                        <p className="text-xs text-gray-400">{formatEuro(tot.ht)} HT</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                          {st.label}
                        </span>
                        {f.emailEnvoye && (
                          <p className="text-xs text-gray-400 mt-1">📧 envoyée</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <FactureRowActions
                          factureId={f.id}
                          statut={f.statut}
                          emailEnvoye={f.emailEnvoye}
                          hasEmail={!!client?.email}
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
