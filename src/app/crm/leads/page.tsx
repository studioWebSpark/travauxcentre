import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { STATUTS, PRIORITES, formatDate, formatEuro } from "@/lib/crm"
import LeadStatusSelect from "@/components/crm/LeadStatusSelect"
import NouveauLeadModal from "@/components/crm/NouveauLeadModal"
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
          <h1 className="text-2xl font-bold text-white font-montserrat">Leads</h1>
          <p className="text-slate-400 text-sm mt-0.5">{leads.length} résultat{leads.length > 1 ? "s" : ""}</p>
        </div>
        <NouveauLeadModal />
      </div>

      {/* Filtres */}
      <form method="GET" className="glass rounded-[0.875rem] border border-white/8 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-medium text-slate-300 mb-1">Recherche</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Nom, email, ville…"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Statut</label>
          <select name="statut" defaultValue={statut ?? "Tous"} className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent">
            <option className="bg-[#0D1B2A]">Tous</option>
            {Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k} className="bg-[#0D1B2A]">{v.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Type de travaux</label>
          <select name="type" defaultValue={type ?? "Tous"} className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent">
            {TYPES.map((t) => <option key={t} className="bg-[#0D1B2A]">{t}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-gradient-to-r from-[#F97316] to-orange-600 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:from-orange-500 hover:to-orange-700 transition-all">
          Filtrer
        </button>
        <Link href="/crm/leads" className="text-sm text-slate-400 hover:text-slate-300 transition-colors py-2">Réinitialiser</Link>
      </form>

      {/* Table */}
      <div className="glass rounded-[0.875rem] border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/5">
                <th className="text-left px-4 py-3 text-xs font-semibold text-white uppercase tracking-wider font-montserrat">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white uppercase tracking-wider font-montserrat">Travaux</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white uppercase tracking-wider hidden md:table-cell font-montserrat">Budget</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white uppercase tracking-wider font-montserrat">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-white uppercase tracking-wider hidden lg:table-cell font-montserrat">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {leads.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">Aucun lead trouvé</td></tr>
              )}
              {leads.map((lead) => {
                const pr = PRIORITES[lead.priorite]
                return (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors group border-white/8">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${pr.dot} shrink-0`} />
                        <div>
                          <p className="font-semibold text-white">{lead.nom}</p>
                          <p className="text-slate-400 text-xs">{lead.ville} ({lead.codePostal})</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-1 ml-4.5">
                        <a href={`tel:${lead.telephone}`} className="text-slate-400 hover:text-[#F97316] transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a href={`mailto:${lead.email}`} className="text-slate-400 hover:text-[#F97316] transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{lead.typeTravaux}</p>
                      {lead.surface && <p className="text-slate-400 text-xs">{lead.surface} m²</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-white font-medium">{lead.budget || "—"}</p>
                      {lead.montantDevis && <p className="text-green-400 text-xs font-semibold">{formatEuro(lead.montantDevis)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <LeadStatusSelect leadId={lead.id} statut={lead.statut} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/crm/leads/${lead.id}`}
                        className="text-xs font-semibold text-[#F97316] hover:underline opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
