"use client"

import { useState } from "react"
import type { Metadata } from "next"

// Note: metadata doit être dans un server component pour Next.js App Router
// On l'exporte depuis un layout ou page server — ici on la déclare pour information

export default function ContactPage() {
  const [form,    setForm]    = useState({ nom: "", email: "", telephone: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState("")

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
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

  return (
    <div className="pt-24 pb-16 bg-[#F8F7F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Parlons de votre projet</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Contactez-nous
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Une question ? Un projet ? Notre équipe vous répond sous 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {success ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#0F2C5E] text-xl mb-2">Message envoyé !</h3>
                <p className="text-gray-600">Nous vous répondrons dans les meilleurs délais.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <h2 className="font-bold text-[#0F2C5E] text-xl mb-6">Votre message</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={set("message")} required rows={5} placeholder="Décrivez votre demande..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#F97316] text-white font-semibold py-3.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60">
                  {loading ? "Envoi…" : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>

          {/* Infos */}
          <div className="space-y-6">
            {[
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
                title: "Adresse",
                content: "Longuenesse, 62219\nNord-Pas-de-Calais",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
                title: "Téléphone",
                content: "03 XX XX XX XX",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
                title: "Email",
                content: "contact@travauxcentre.fr",
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2}/><line x1="3" y1="10" x2="21" y2="10" strokeWidth={2}/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} strokeLinecap="round"/></svg>,
                title: "Horaires",
                content: "Lundi – Vendredi : 8h – 18h\nSamedi sur rendez-vous",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="w-12 h-12 bg-[#0F2C5E] rounded-xl flex items-center justify-center text-white shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#0F2C5E] mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{item.content}</p>
                </div>
              </div>
            ))}

            {/* Google Maps placeholder */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden h-48 flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p className="text-sm">Carte Google Maps</p>
                <p className="text-xs mt-1">Longuenesse, 62219</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
