"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, CheckCircle, Clock, Loader2 } from "lucide-react"

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
}

export default function DevisEtapesManagement({ devisId, devisNumero, devisTotal, devistva, etapes, leadEmail }: Props) {
  const router = useRouter()
  const [etapesLocales, setEtapesLocales] = useState(etapes)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const totalEtapes = etapesLocales.reduce((sum, e) => sum + e.pourcentage, 0)

  async function markAsPaid(etapeId: string) {
    setLoading(true)
    const res = await fetch(`/api/crm/devis/${devisId}/etape/${etapeId}/payer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devisNumero, devisTotal, devistva, leadEmail }),
    })
    if (res.ok) {
      setEtapesLocales((e) =>
        e.map((et) =>
          et.id === etapeId
            ? { ...et, statut: "PAYEE", datePaiement: new Date() }
            : et
        )
      )
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#0F2C5E]">Étapes de paiement</h3>
        <span className={`text-sm font-semibold ${totalEtapes === 100 ? "text-green-600" : "text-amber-600"}`}>
          {totalEtapes}% configuré
        </span>
      </div>

      {etapesLocales.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Aucune étape de paiement configurée</p>
      ) : (
        <div className="space-y-2">
          {etapesLocales.map((etape) => {
            const montant = Math.round((etape.pourcentage / 100) * devisTotal * 100) / 100
            const montantTTC = montant * (1 + devistva)

            return (
              <div
                key={etape.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  etape.statut === "PAYEE"
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {etape.statut === "PAYEE" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0F2C5E]">{etape.pourcentage}%</span>
                    {etape.description && <span className="text-sm text-gray-600">— {etape.description}</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {montant.toFixed(2)}€ HT • {montantTTC.toFixed(2)}€ TTC
                    {etape.dateEcheance && (
                      <> • Échéance: {new Date(etape.dateEcheance).toLocaleDateString("fr-FR")}</>
                    )}
                  </div>
                </div>

                {etape.statut === "PAYEE" ? (
                  <span className="text-xs font-semibold text-green-600">
                    Payé le {etape.datePaiement ? new Date(etape.datePaiement).toLocaleDateString("fr-FR") : ""}
                  </span>
                ) : (
                  <button
                    onClick={() => markAsPaid(etape.id)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-[#0F2C5E] text-white rounded-lg text-xs font-semibold hover:bg-[#0d1f4a] disabled:opacity-60 flex items-center gap-1 shrink-0"
                  >
                    {loading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    Marquer payé
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {totalEtapes === 100
            ? "✓ Les étapes couvrent 100% du montant"
            : totalEtapes > 100
            ? "⚠ Les étapes dépassent 100%"
            : `${100 - totalEtapes}% restant à configurer`}
        </p>
      </div>
    </div>
  )
}
