"use client"

import { useState } from "react"
import Link from "next/link"

const typesTravaux = [
  "Rénovation intérieure",
  "Gros œuvre & Maçonnerie",
  "Aménagement extérieur",
  "Second œuvre (électricité, plomberie, isolation)",
  "Autre",
]

const sources = [
  "Google",
  "Bouche à oreille / recommandation",
  "Réseaux sociaux",
  "Panneau de chantier",
  "Autre",
]

type Step = 1 | 2 | 3

export default function DevisPage() {
  const [step,    setStep]    = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState("")

  const [form, setForm] = useState({
    nom: "", email: "", telephone: "",
    ville: "", codePostal: "",
    typeTravaux: "", description: "",
    surface: "", budget: "", dateSouhaitee: "", source: "",
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erreur serveur")
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4 pt-24">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0F2C5E] mb-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Demande envoyée !
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Merci <strong>{form.nom}</strong>. Nous avons bien reçu votre demande de devis
            et nous vous recontacterons sous 48h pour convenir d&apos;une visite gratuite.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#6B7280] font-semibold text-sm uppercase tracking-widest mb-2">Gratuit & Sans engagement</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Demander un Devis
          </h1>
          <p className="mt-3 text-gray-600">Réponse garantie sous 48h — Visite sur site offerte</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s < step ? "bg-green-500 text-white" : s === step ? "bg-[#0F2C5E] text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {s < step ? "✓" : s}
              </div>
              {s < 3 && <div className={`w-12 h-px ${s < step ? "bg-green-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-8 px-2">
          <span>Vos travaux</span>
          <span>Vos coordonnées</span>
          <span>Confirmation</span>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          {/* ÉTAPE 1 : Travaux */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-bold text-[#0F2C5E] text-xl mb-6">Votre projet</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de travaux *</label>
                <select value={form.typeTravaux} onChange={set("typeTravaux")} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                  <option value="">Sélectionner...</option>
                  {typesTravaux.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description du projet *</label>
                <textarea value={form.description} onChange={set("description")} required rows={4} placeholder="Décrivez votre projet en quelques mots : pièces concernées, état actuel, travaux souhaités..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Surface estimée (m²)</label>
                  <input type="number" value={form.surface} onChange={set("surface")} placeholder="Ex : 45" min="1" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget estimé (optionnel)</label>
                  <input type="text" value={form.budget} onChange={set("budget")} placeholder="Ex : 5 000 – 10 000 €" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date souhaitée de démarrage</label>
                <input type="date" value={form.dateSouhaitee} onChange={set("dateSouhaitee")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              </div>

              <button
                type="button"
                onClick={() => { if (!form.typeTravaux || !form.description) { setError("Veuillez remplir les champs obligatoires"); return } setError(""); setStep(2) }}
                className="w-full bg-[#0F2C5E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1a3f7a] transition-colors mt-2"
              >
                Continuer →
              </button>
            </div>
          )}

          {/* ÉTAPE 2 : Coordonnées */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-bold text-[#0F2C5E] text-xl mb-6">Vos coordonnées</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet *</label>
                <input type="text" value={form.nom} onChange={set("nom")} required placeholder="Jean Dupont" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={set("email")} required placeholder="jean@exemple.fr" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
                <input type="tel" value={form.telephone} onChange={set("telephone")} required placeholder="06 12 34 56 78" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville *</label>
                  <input type="text" value={form.ville} onChange={set("ville")} required placeholder="Saint-Omer" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Code postal *</label>
                  <input type="text" value={form.codePostal} onChange={set("codePostal")} required placeholder="62500" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment nous avez-vous trouvé ?</label>
                <select value={form.source} onChange={set("source")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                  <option value="">Sélectionner...</option>
                  {sources.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                  ← Retour
                </button>
                <button type="button" onClick={() => { if (!form.nom || !form.email || !form.telephone || !form.ville || !form.codePostal) { setError("Veuillez remplir les champs obligatoires"); return } setError(""); setStep(3) }} className="flex-[2] bg-[#0F2C5E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1a3f7a] transition-colors">
                  Vérifier ma demande →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Récapitulatif */}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-[#0F2C5E] text-xl mb-6">Récapitulatif</h2>
              <div className="space-y-3 mb-8">
                {[
                  ["Type de travaux", form.typeTravaux],
                  ["Description",     form.description],
                  ["Surface",         form.surface ? `${form.surface} m²` : "—"],
                  ["Budget",          form.budget || "—"],
                  ["Date souhaitée",  form.dateSouhaitee || "—"],
                  ["Nom",             form.nom],
                  ["Email",           form.email],
                  ["Téléphone",       form.telephone],
                  ["Ville",           `${form.ville} ${form.codePostal}`],
                  ["Source",          form.source || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="font-medium text-gray-500 w-36 shrink-0">{label}</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
                  ← Modifier
                </button>
                <button type="submit" disabled={loading} className="flex-[2] bg-[#6B7280] text-white font-semibold py-3.5 rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-60">
                  {loading ? "Envoi en cours…" : "Envoyer ma demande"}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          En soumettant ce formulaire, vous acceptez que vos données soient traitées pour le traitement de votre demande.
        </p>
      </div>
    </div>
  )
}
