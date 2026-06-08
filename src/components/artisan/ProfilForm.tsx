'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { User, ArtisanProfile, Specialite } from "@/types"

const categories = [
  { value: "MACONNERIE",          label: "Maçonnerie" },
  { value: "PLOMBERIE",           label: "Plomberie" },
  { value: "ELECTRICITE",         label: "Électricité" },
  { value: "PEINTURE",            label: "Peinture" },
  { value: "MENUISERIE",          label: "Menuiserie" },
  { value: "TOITURE",             label: "Toiture" },
  { value: "CARRELAGE",           label: "Carrelage" },
  { value: "ISOLATION",           label: "Isolation" },
  { value: "CHAUFFAGE",           label: "Chauffage" },
  { value: "CLIMATISATION",       label: "Climatisation" },
  { value: "JARDINAGE",           label: "Jardinage" },
  { value: "RENOVATION_GENERALE", label: "Rénovation générale" },
  { value: "AUTRE",               label: "Autre" },
]

type Props = {
  user: User & { artisanProfile: ArtisanProfile & { specialites: Specialite[] } | null }
  artisan: ArtisanProfile & { specialites: Specialite[] }
}

export function ProfilForm({ user, artisan }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    telephone: artisan.telephone ?? "",
    adresse:   artisan.adresse   ?? "",
    ville:     artisan.ville     ?? "",
    codePostal: artisan.codePostal ?? "",
    siret:     artisan.siret     ?? "",
    description: artisan.description ?? "",
    rayon:     String(artisan.rayon),
    disponible: artisan.disponible,
  })

  const [specialites, setSpecialites] = useState<string[]>(
    artisan.specialites.map((s) => s.categorie)
  )

  function toggleSpecialite(cat: string) {
    setSpecialites((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaved(false)

    const res = await fetch("/api/artisans/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, specialites }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erreur lors de la sauvegarde")
      return
    }

    setSaved(true)
    startTransition(() => router.refresh())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Infos de base */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Informations personnelles</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="06 12 34 56 78"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
            <input
              type="text"
              value={form.siret}
              onChange={(e) => setForm({ ...form, siret: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="92995887400018"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            value={form.adresse}
            onChange={(e) => setForm({ ...form, adresse: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input
              type="text"
              value={form.ville}
              onChange={(e) => setForm({ ...form, ville: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
            <input
              type="text"
              value={form.codePostal}
              onChange={(e) => setForm({ ...form, codePostal: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Présentez-vous, votre expérience, vos points forts..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Disponibilité */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Disponibilité</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Disponible pour de nouveaux projets</p>
            <p className="text-xs text-gray-400">Votre profil apparaîtra dans les résultats de recherche</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, disponible: !form.disponible })}
            className={`relative w-12 h-6 rounded-full transition-colors ${form.disponible ? "bg-blue-600" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.disponible ? "translate-x-6" : ""}`} />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rayon d'intervention : {form.rayon} km
          </label>
          <input
            type="range"
            min="5"
            max="200"
            step="5"
            value={form.rayon}
            onChange={(e) => setForm({ ...form, rayon: e.target.value })}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Spécialités */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Mes spécialités</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((cat) => {
            const selected = specialites.includes(cat.value)
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleSpecialite(cat.value)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${
                  selected
                    ? "bg-blue-50 border-blue-400 text-blue-700 font-medium"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {selected && <span className="mr-1">✓</span>}
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
      {saved && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">Profil mis à jour avec succès ✓</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        {isPending ? "Sauvegarde..." : "Sauvegarder le profil"}
      </button>
    </form>
  )
}
