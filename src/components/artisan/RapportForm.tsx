'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export function RapportForm({ chantierId }: { chantierId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
    setLoading(true)
    await fetch(`/api/chantiers/${chantierId}/rapports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    })
    setDescription("")
    setShowForm(false)
    setLoading(false)
    startTransition(() => router.refresh())
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors mb-4"
      >
        + Nouveau rapport d'avancement
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        autoFocus
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Décrivez l'avancement du chantier aujourd'hui..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={loading || isPending}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Publier le rapport"}
        </button>
        <button
          type="button"
          onClick={() => { setShowForm(false); setDescription("") }}
          className="border border-gray-200 text-gray-500 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
