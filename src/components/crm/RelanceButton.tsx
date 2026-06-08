"use client"

import { useState } from "react"
import { Loader2, CheckCircle, Mail } from "lucide-react"

type RelanceType = "lead" | "devis" | "facture"

interface Props {
  type: RelanceType
  id: string
  statut: string
  hasEmail: boolean
}

const ENDPOINT: Record<RelanceType, string> = {
  lead:    "leads",
  devis:   "devis",
  facture: "factures",
}

const RELANCABLE_STATUTS: Record<RelanceType, string[]> = {
  lead:    ["CONTACTE", "EN_ATTENTE"],
  devis:   ["ENVOYE", "EN_ATTENTE"],
  facture: ["ENVOYEE", "RETARD"],
}

export default function RelanceButton({ type, id, statut, hasEmail }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canRelance = hasEmail && RELANCABLE_STATUTS[type].includes(statut)

  if (!canRelance) return null

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    try {
      const endpoint = ENDPOINT[type]
      const res = await fetch(`/api/crm/${endpoint}/${id}/relancer`, {
        method: "POST",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.error ?? "Erreur lors de la relance")
      } else {
        setDone(true)
        setTimeout(() => setDone(false), 5000)
      }
    } catch {
      setError("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
        <CheckCircle className="w-3 h-3" />
        Relancé !
      </span>
    )
  }

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-800 px-2.5 py-1 rounded-full transition-colors disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Mail className="w-3 h-3" />
        )}
        {loading ? "Envoi…" : "Relancer"}
      </button>
      {error && (
        <span className="text-[10px] text-red-500">{error}</span>
      )}
    </div>
  )
}
