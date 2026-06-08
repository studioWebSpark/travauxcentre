"use client"

import { useState } from "react"
import Link from "next/link"

const typesRdv = [
  "Visite chantier",
  "Consultation téléphonique",
  "Réunion en agence",
]

const creneaux = [
  "Matin (8h – 12h)",
  "Après-midi (13h – 17h)",
  "Fin de journée (17h – 18h)",
]

export default function RendezVousPage() {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", typeRdv: "", creneau: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState("")

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/rendez-vous", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
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
            Rendez-vous demandé !
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Merci <strong>{form.nom}</strong>. Nous vous confirmerons votre créneau par email sous 24h.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 bg-[#F8F7F4] min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-[#6B7280] font-semibold text-sm uppercase tracking-widest mb-2">Gratuit & Sans engagement</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Prendre Rendez-vous
          </h1>
          <p className="mt-3 text-gray-600">Disponible du lundi au vendredi, 7h – 20h</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={submit} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de rendez-vous *</label>
              <select value={form.typeRdv} onChange={set("typeRdv")} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                <option value="">Sélectionner...</option>
                {typesRdv.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Créneau préféré</label>
              <select value={form.creneau} onChange={set("creneau")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                <option value="">Pas de préférence</option>
                {creneaux.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message (optionnel)</label>
              <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Précisez votre demande..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#6B7280] text-white font-semibold py-3.5 rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-60 mt-2">
              {loading ? "Envoi en cours…" : "Confirmer ma demande"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Créneaux disponibles : Lundi – Vendredi, 7h – 20h. Confirmation par email sous 24h.
        </p>
      </div>
    </div>
  )
}
