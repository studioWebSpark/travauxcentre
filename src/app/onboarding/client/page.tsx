'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ telephone: "", adresse: "", ville: "", codePostal: "" })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.ville) { setError("La ville est obligatoire"); return }
    setLoading(true)

    const res = await fetch("/api/clients/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!res.ok) { setError("Erreur lors de la sauvegarde"); setLoading(false); return }
    router.push("/dashboard/client")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-blue-600">Travaux</span>
          <span className="text-3xl font-bold text-gray-800">Centre</span>
          <p className="text-gray-500 mt-2">Finalisez votre profil</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Vos coordonnées</h2>
          <p className="text-sm text-gray-500 mb-6">Pour que les artisans puissent vous contacter et estimer les déplacements</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input type="tel" value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="06 12 34 56 78" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse des travaux</label>
              <input type="text" value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12 rue de la Paix" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville <span className="text-red-500">*</span></label>
                <input type="text" required value={form.ville}
                  onChange={(e) => setForm({ ...form, ville: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lyon" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                <input type="text" value={form.codePostal}
                  onChange={(e) => setForm({ ...form, codePostal: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="69000" />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors mt-2">
              {loading ? "Enregistrement..." : "Accéder à mon espace"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
