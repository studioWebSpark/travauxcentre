'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

const categories = [
  { value: "MACONNERIE",          label: "Maçonnerie",         icon: "🧱" },
  { value: "PLOMBERIE",           label: "Plomberie",          icon: "🔧" },
  { value: "ELECTRICITE",         label: "Électricité",        icon: "⚡" },
  { value: "PEINTURE",            label: "Peinture",           icon: "🎨" },
  { value: "MENUISERIE",          label: "Menuiserie",         icon: "🪚" },
  { value: "TOITURE",             label: "Toiture",            icon: "🏠" },
  { value: "CARRELAGE",           label: "Carrelage",          icon: "⬜" },
  { value: "ISOLATION",           label: "Isolation",          icon: "🌡️" },
  { value: "CHAUFFAGE",           label: "Chauffage",          icon: "🔥" },
  { value: "CLIMATISATION",       label: "Climatisation",      icon: "❄️" },
  { value: "JARDINAGE",           label: "Jardinage",          icon: "🌿" },
  { value: "RENOVATION_GENERALE", label: "Rénovation générale",icon: "🏗️" },
  { value: "AUTRE",               label: "Autre",              icon: "🔨" },
]

export default function NouveauProjet() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState("")
  const [form, setForm]     = useState({
    titre: "", description: "", categorie: "", adresse: "", ville: "", codePostal: "",
    budgetMin: "", budgetMax: "", dateDebut: "", dateFin: "",
  })

  function set(key: string, val: string) { setForm((f) => ({ ...f, [key]: val })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.categorie) { setError("Choisissez une catégorie"); return }
    setLoading(true); setError("")

    const res = await fetch("/api/projets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      }),
    })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? "Erreur lors de la création")
      setLoading(false)
      return
    }

    const projet = await res.json()
    router.push(`/dashboard/client/projets/${projet.id}`)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Poster un projet</h1>
        <p className="text-gray-500 mt-1">Les artisans disponibles pourront vous envoyer un devis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Catégorie */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Type de travaux <span className="text-red-500">*</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button key={cat.value} type="button" onClick={() => set("categorie", cat.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.categorie === cat.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}>
                <span>{cat.icon}</span>{cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Description du projet</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre <span className="text-red-500">*</span></label>
            <input type="text" required value={form.titre} onChange={(e) => set("titre", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ex: Rénovation salle de bain complète" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée <span className="text-red-500">*</span></label>
            <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Décrivez vos travaux : surface, matériaux, contraintes, etc." />
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Lieu des travaux</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse <span className="text-red-500">*</span></label>
            <input type="text" required value={form.adresse} onChange={(e) => set("adresse", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12 rue de la Paix" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville <span className="text-red-500">*</span></label>
              <input type="text" required value={form.ville} onChange={(e) => set("ville", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lyon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
              <input type="text" value={form.codePostal} onChange={(e) => set("codePostal", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="69000" />
            </div>
          </div>
        </div>

        {/* Budget & dates */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Budget & dates (optionnels)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget min (€)</label>
              <input type="number" min="0" value={form.budgetMin} onChange={(e) => set("budgetMin", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget max (€)</label>
              <input type="number" min="0" value={form.budgetMax} onChange={(e) => set("budgetMax", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début souhaitée</label>
              <input type="date" value={form.dateDebut} onChange={(e) => set("dateDebut", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin souhaitée</label>
              <input type="date" value={form.dateFin} onChange={(e) => set("dateFin", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3.5 rounded-xl transition-colors text-base">
          {loading ? "Publication en cours..." : "Publier mon projet"}
        </button>
      </form>
    </div>
  )
}
