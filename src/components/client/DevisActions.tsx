'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export function DevisActions({ devisId }: { devisId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState<"ACCEPTE" | "REFUSE" | null>(null)

  async function handleAction(statut: "ACCEPTE" | "REFUSE") {
    await fetch(`/api/devis/${devisId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    })
    setConfirming(null)
    startTransition(() => router.refresh())
  }

  if (confirming) {
    return (
      <div className={`p-3 rounded-lg ${confirming === "ACCEPTE" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
        <p className="text-sm font-medium mb-3 text-gray-800">
          {confirming === "ACCEPTE"
            ? "Confirmer l'acceptation ? Les autres devis seront automatiquement refusés et le chantier sera créé."
            : "Confirmer le refus de ce devis ?"}
        </p>
        <div className="flex gap-2">
          <button onClick={() => handleAction(confirming)} disabled={isPending}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
              confirming === "ACCEPTE" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}>
            {isPending ? "..." : "Confirmer"}
          </button>
          <button onClick={() => setConfirming(null)}
            className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <button onClick={() => setConfirming("ACCEPTE")}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
        ✓ Accepter ce devis
      </button>
      <button onClick={() => setConfirming("REFUSE")}
        className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition-colors">
        ✕ Refuser
      </button>
    </div>
  )
}
