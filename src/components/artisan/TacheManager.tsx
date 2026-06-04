'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { Tache } from "@/types"

const statutLabel: Record<string, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
}

export function TacheManager({ chantierId, taches }: { chantierId: string; taches: Tache[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [newTitre, setNewTitre] = useState("")
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function addTache(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitre.trim()) return
    setAdding(true)
    await fetch(`/api/chantiers/${chantierId}/taches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre: newTitre, ordre: taches.length }),
    })
    setNewTitre("")
    setShowForm(false)
    setAdding(false)
    startTransition(() => router.refresh())
  }

  async function updateStatut(tacheId: string, statut: string) {
    await fetch(`/api/chantiers/${chantierId}/taches`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tacheId, statut }),
    })
    startTransition(() => router.refresh())
  }

  const statuts = ["A_FAIRE", "EN_COURS", "TERMINEE"]

  return (
    <div>
      {taches.length === 0 && !showForm && (
        <p className="text-sm text-gray-400 text-center py-4">Aucune tâche ajoutée</p>
      )}

      <ul className="space-y-2 mb-3">
        {taches.map((t) => (
          <li key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
            <button
              onClick={() => {
                const next = statuts[(statuts.indexOf(t.statut) + 1) % statuts.length]
                updateStatut(t.id, next)
              }}
              disabled={isPending}
              className={`w-5 h-5 rounded-full border-2 shrink-0 transition-colors ${
                t.statut === "TERMINEE"
                  ? "bg-green-500 border-green-500"
                  : t.statut === "EN_COURS"
                  ? "bg-blue-400 border-blue-400"
                  : "border-gray-300"
              }`}
            />
            <span className={`flex-1 text-sm ${t.statut === "TERMINEE" ? "line-through text-gray-400" : "text-gray-700"}`}>
              {t.titre}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              t.statut === "TERMINEE" ? "bg-green-100 text-green-600"
              : t.statut === "EN_COURS" ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-500"
            }`}>
              {statutLabel[t.statut]}
            </span>
          </li>
        ))}
      </ul>

      {showForm ? (
        <form onSubmit={addTache} className="flex gap-2">
          <input
            autoFocus
            value={newTitre}
            onChange={(e) => setNewTitre(e.target.value)}
            placeholder="Nom de la tâche..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {adding ? "..." : "Ajouter"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="border border-gray-200 text-gray-500 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            ✕
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
        >
          + Ajouter une tâche
        </button>
      )}
    </div>
  )
}
