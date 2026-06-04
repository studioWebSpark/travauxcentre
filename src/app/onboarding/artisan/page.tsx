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

export default function OnboardingArtisan() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [specialites, setSpecialites] = useState<string[]>([])
  const [form, setForm] = useState({
    telephone: "", ville: "", codePostal: "", description: "", rayon: "30",
  })

  function toggle(cat: string) {
    setSpecialites((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (step === 1) {
      if (specialites.length === 0) { setError("Sélectionnez au moins une spécialité"); return }
      setStep(2)
      return
    }

    if (!form.ville) { setError("La ville est obligatoire"); return }
    setLoading(true)

    const res = await fetch("/api/artisans/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, specialites }),
    })

    if (!res.ok) { setError("Erreur lors de la sauvegarde"); setLoading(false); return }
    router.push("/dashboard/artisan")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-blue-600">Travaux</span>
          <span className="text-3xl font-bold text-gray-800">Centre</span>
          <p className="text-gray-500 mt-2">Configurez votre profil artisan</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  s <= step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                }`}>{s}</div>
                {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? "bg-blue-600" : "bg-gray-100"}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Vos spécialités</h2>
                  <p className="text-sm text-gray-500 mt-1">Sélectionnez tout ce que vous savez faire</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => {
                    const sel = specialites.includes(cat.value)
                    return (
                      <button
                        key={cat.value} type="button" onClick={() => toggle(cat.value)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                          sel ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span>{cat.icon}</span>{cat.label}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Votre zone d'intervention</h2>
                  <p className="text-sm text-gray-500 mt-1">Ces informations vous mettent en relation avec les bons clients</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville <span className="text-red-500">*</span></label>
                    <input type="text" required value={form.ville}
                      onChange={(e) => setForm({ ...form, ville: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paris" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                    <input type="text" value={form.codePostal}
                      onChange={(e) => setForm({ ...form, codePostal: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="75000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="06 12 34 56 78" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rayon d'intervention : <span className="font-bold text-blue-600">{form.rayon} km</span>
                  </label>
                  <input type="range" min="5" max="200" step="5" value={form.rayon}
                    onChange={(e) => setForm({ ...form, rayon: e.target.value })}
                    className="w-full accent-blue-600" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5 km</span><span>200 km</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Présentez-vous</label>
                  <textarea rows={3} value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Votre expérience, vos points forts, vos certifications..." />
                </div>
              </>
            )}

            {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <button type="button" onClick={() => { setStep(1); setError("") }}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">
                  Retour
                </button>
              )}
              <button type="submit" disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors">
                {loading ? "Enregistrement..." : step === 1 ? "Continuer" : "Accéder à mon dashboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
