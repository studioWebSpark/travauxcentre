"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Clock, Loader2, Calendar } from "lucide-react"

type Etape = {
  id: string
  pourcentage: number
  description: string | null
  dateEcheance: Date | null
  statut: string
  datePaiement: Date | null
  ordre: number
}

type Props = {
  devisId: string
  devisNumero: string
  devisTotal: number
  devistva: number
  etapes: Etape[]
  leadEmail?: string
  leadNom?: string
}

export default function DevisEtapesManagement({ devisId, devisNumero, devisTotal, devistva, etapes, leadEmail, leadNom }: Props) {
  const router = useRouter()
  const [etapesLocales, setEtapesLocales] = useState(etapes)
  const [loadingId, setLoadingId]         = useState<string | null>(null)
  // Pour chaque étape : date de paiement saisie
  const [datesPaiement, setDatesPaiement] = useState<Record<string, string>>({})
  // Étape en cours de confirmation
  const [confirmingId, setConfirmingId]   = useState<string | null>(null)

  const totalEtapes  = etapesLocales.reduce((sum, e) => sum + e.pourcentage, 0)
  const etapesPayees = etapesLocales.filter(e => e.statut === "PAYEE")
  const toutPaye     = totalEtapes === 100 && etapesPayees.length === etapesLocales.length

  async function markAsPaid(etapeId: string) {
    const datePaiement = datesPaiement[etapeId] || new Date().toISOString().slice(0, 10)
    setLoadingId(etapeId)
    const res = await fetch(`/api/crm/devis/${devisId}/etape/${etapeId}/payer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        devisNumero,
        devisTotal,
        devistva,
        leadEmail,
        leadNom,
        datePaiement,
      }),
    })
    if (res.ok) {
      setEtapesLocales(prev =>
        prev.map(et => et.id === etapeId
          ? { ...et, statut: "PAYEE", datePaiement: new Date(datePaiement) }
          : et
        )
      )
      setConfirmingId(null)
      router.refresh()
    }
    setLoadingId(null)
  }

  const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#0F2C5E]">Étapes de paiement</h3>
        <span className={`text-sm font-semibold ${totalEtapes === 100 ? "text-green-600" : "text-amber-600"}`}>
          {etapesPayees.length}/{etapesLocales.length} payées
        </span>
      </div>

      {etapesLocales.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Aucune étape configurée</p>
      ) : (
        <div className="space-y-3">
          {etapesLocales.map((etape, idx) => {
            const montantHT  = Math.round((etape.pourcentage / 100) * devisTotal * 100) / 100
            const montantTTC = Math.round(montantHT * (1 + devistva) * 100) / 100
            const isConfirming = confirmingId === etape.id
            const isLoading    = loadingId === etape.id

            return (
              <div key={etape.id} className={`rounded-xl border p-4 ${
                etape.statut === "PAYEE" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
              }`}>
                {/* Ligne principale */}
                <div className="flex items-center gap-3">
                  {etape.statut === "PAYEE"
                    ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    : <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  }

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#0F2C5E]">Acompte {idx + 1} — {etape.pourcentage}%</span>
                      {etape.description && <span className="text-sm text-gray-500">({etape.description})</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {fmt(montantHT)} HT &nbsp;·&nbsp; <strong>{fmt(montantTTC)} TTC</strong>
                      {etape.dateEcheance && (
                        <> &nbsp;·&nbsp; Échéance : {new Date(etape.dateEcheance).toLocaleDateString("fr-FR")}</>
                      )}
                    </div>
                  </div>

                  {etape.statut === "PAYEE" ? (
                    <span className="text-xs font-semibold text-green-700 shrink-0">
                      Reçu le {etape.datePaiement
                        ? new Date(etape.datePaiement).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                        : "—"}
                    </span>
                  ) : !isConfirming ? (
                    <button
                      onClick={() => setConfirmingId(etape.id)}
                      className="px-3 py-1.5 bg-[#0F2C5E] text-white rounded-lg text-xs font-semibold shrink-0"
                    >
                      Marquer payé
                    </button>
                  ) : null}
                </div>

                {/* Formulaire de confirmation */}
                {isConfirming && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Date à laquelle le client a payé :
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          value={datesPaiement[etape.id] ?? new Date().toISOString().slice(0, 10)}
                          onChange={e => setDatesPaiement(prev => ({ ...prev, [etape.id]: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
                        />
                      </div>
                      <button
                        onClick={() => markAsPaid(etape.id)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold disabled:opacity-60 flex items-center gap-1 shrink-0"
                      >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        {isLoading ? "Envoi…" : "Confirmer"}
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="px-3 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs"
                      >
                        Annuler
                      </button>
                    </div>
                    {leadEmail && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        Un reçu sera envoyé automatiquement à {leadEmail}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        {toutPaye ? (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs font-bold text-green-700">✓ 100% réglé — Facture acquittée générée et envoyée au client</p>
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            {etapesPayees.length > 0
              ? `${etapesPayees.reduce((s, e) => s + e.pourcentage, 0)}% reçu — ${100 - etapesPayees.reduce((s, e) => s + e.pourcentage, 0)}% restant`
              : "Aucun paiement reçu pour l'instant"}
          </p>
        )}
      </div>
    </div>
  )
}
