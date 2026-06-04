'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export function DevisForm({ projetId }: { projetId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ montant: "", description: "", dureeJours: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch(`/api/projets/${projetId}/devis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        montant: Number(form.montant),
        description: form.description,
        dureeJours: Number(form.dureeJours),
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Une erreur est survenue")
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant (€) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={form.montant}
            onChange={(e) => setForm({ ...form, montant: e.target.value })}
            placeholder="ex: 2500"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durée (jours) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            required
            value={form.dureeJours}
            onChange={(e) => setForm({ ...form, dureeJours: e.target.value })}
            placeholder="ex: 5"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description de votre prestation <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Décrivez votre approche, les matériaux utilisés, vos garanties..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
      >
        {loading ? "Envoi en cours..." : "Envoyer le devis"}
      </button>
    </form>
  )
}
