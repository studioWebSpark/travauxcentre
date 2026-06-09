import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { STATUTS_DEVIS, calcTotaux, formatEuro } from "@/lib/chantier"
import DevisEtapesManagement from "@/components/crm/DevisEtapesManagement"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DevisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const devis  = await prisma.devisCrm.findUnique({
    where:   { id },
    include: {
      lignes:         true,
      etapesPaiement: { orderBy: { ordre: "asc" } },
      lead:           { select: { nom: true, email: true } },
      chantier:       { select: { titre: true } },
      factures:       { select: { id: true, numero: true, statut: true } },
    },
  })
  if (!devis) notFound()

  const st  = STATUTS_DEVIS[devis.statut] ?? STATUTS_DEVIS.BROUILLON
  const tot = calcTotaux(devis.lignes, devis.tva)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/crm/devis" className="inline-flex items-center gap-1 text-gray-400 text-sm mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> Retour aux devis
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#0F2C5E] font-montserrat">{devis.numero}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
              {devis.lead   && <span className="text-sm text-gray-500">{devis.lead.nom}</span>}
              {devis.chantier && <span className="text-sm text-gray-400">· {devis.chantier.titre}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <a href={`/api/crm/devis/${devis.id}/pdf`} target="_blank"
              className="inline-flex items-center gap-1.5 border border-gray-200 text-[#0F2C5E] text-sm font-semibold px-4 py-2.5 rounded-xl">
              <FileText className="w-4 h-4" /> PDF devis
            </a>
          </div>
        </div>
      </div>

      {/* Montant */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[#F8F7F4] rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total HT</p>
            <p className="font-bold text-[#0F2C5E]">{formatEuro(tot.ht)}</p>
          </div>
          <div className="bg-[#F8F7F4] rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">TVA {(devis.tva * 100).toFixed(0)}%</p>
            <p className="font-bold text-[#0F2C5E]">{formatEuro(tot.tvaAmount)}</p>
          </div>
          <div className="bg-[#0F2C5E] rounded-xl p-4">
            <p className="text-xs text-white/60 mb-1">Total TTC</p>
            <p className="font-bold text-[#F97316] text-lg">{formatEuro(tot.ttc)}</p>
          </div>
        </div>
      </div>

      {/* Étapes de paiement */}
      {devis.etapesPaiement.length > 0 && (
        <DevisEtapesManagement
          devisId={devis.id}
          devisNumero={devis.numero}
          devisTotal={tot.ht}
          devistva={devis.tva}
          etapes={devis.etapesPaiement.map(e => ({
            id:           e.id,
            pourcentage:  e.pourcentage,
            description:  e.description,
            dateEcheance: e.dateEcheance,
            statut:       e.statut,
            datePaiement: e.datePaiement,
            ordre:        e.ordre,
          }))}
          leadEmail={devis.lead?.email ?? undefined}
          leadNom={devis.lead?.nom ?? undefined}
        />
      )}

      {/* Facture liée */}
      {devis.factures.length > 0 && (
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
          <h2 className="font-bold text-[#0F2C5E] mb-3">Facture générée</h2>
          {devis.factures.map(f => (
            <div key={f.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
              <div>
                <p className="font-semibold text-[#0F2C5E]">{f.numero}</p>
                <p className="text-xs text-gray-500">{f.statut}</p>
              </div>
              <a href={`/api/crm/factures/${f.id}/pdf`} target="_blank"
                className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg">
                PDF facture
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
