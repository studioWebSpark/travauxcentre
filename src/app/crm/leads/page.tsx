import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { STATUTS, PRIORITES, formatDate, formatEuro } from "@/lib/crm"
import LeadStatusSelect from "@/components/crm/LeadStatusSelect"
import { Phone, Mail } from "lucide-react"

export const metadata: Metadata = { title: "Leads" }
export const dynamic = "force-dynamic"

const TYPES = ["Tous", "Rénovation intérieure", "Gros œuvre & Maçonnerie", "Aménagement extérieur", "Second œuvre", "Autre"]

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; type?: string; q?: string }>
}) {
  const sp     = await searchParams
  const statut = sp.statut && sp.statut !== "Tous" ? sp.statut : undefined
  const type   = sp.type   && sp.type   !== "Tous" ? sp.type   : undefined
  const q      = sp.q ?? ""

  const leads = await prisma.lead.findMany({
    where: {
      ...(statut ? { statut: statut as never } : {}),
      ...(type   ? { typeTravaux: { contains: type, mode: "insensitive" } } : {}),
      ...(q ? {
        OR: [
          { nom:   { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { ville: { contains: q, mode: "insensitive" } },
        ],
      } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { notes: { orderBy: { createdAt: "desc" }, take: 1 } },
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C5E]">Leads</h1>
          <p className="text-gray-500 text-sm mt-0.5">{leads.length} résultat{leads.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Filtres */}
      <form method="GET" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-medium text-gray-500 mb-1">Recherche</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Nom, email, ville…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
          <select name="statut" defaultValue={statut ?? "Tous"} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
            <option>Tous</option>
            {Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Type de travaux</label>
          <select name="type" defaultValue={type ?? "Tous"} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-[#0F2C5E] text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-[#1a3f7a] transition-colors">
          Filtrer
        </button>
        <Link href="/crm/leads" className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">Réinitialiser</Link>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Travaux</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Budget</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Aucun lead trouvé</td></tr>
              )}
              {leads.map((lead) => {
                const pr = PRIORITES[lead.priorite]
                return (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${pr.dot} shrink-0`} />
                        <div>
                          <p className="font-semibold text-[#0F2C5E]">{lead.nom}</p>
                          <p className="text-gray-400 text-xs">{lead.ville} ({lead.codePostal})</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-1 ml-4.5">
                        <a href={`tel:${lead.telephone}`} className="text-gray-300 hover:text-[#0F2C5E] transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a href={`mailto:${lead.email}`} className="text-gray-300 hover:text-[#0F2C5E] transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700 text-sm">{lead.typeTravaux}</p>
                      {lead.surface && <p className="text-gray-400 text-xs">{lead.surface} m²</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-700">{lead.budget || "—"}</p>
                      {lead.montantDevis && <p className="text-green-600 text-xs font-semibold">{formatEuro(lead.montantDevis)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <LeadStatusSelect leadId={lead.id} statut={lead.statut} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/crm/leads/${lead.id}`}
                        className="text-xs font-semibold text-[#0F2C5E] hover:underline opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Ouvrir →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
