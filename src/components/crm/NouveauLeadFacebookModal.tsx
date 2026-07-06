"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Loader2, MessageCircle } from "lucide-react"

const TYPES_TRAVAUX = [
  "Rénovation intérieure",
  "Gros œuvre & Maçonnerie",
  "Aménagement extérieur",
  "Peinture & Revêtements",
  "Plomberie & Sanitaire",
  "Électricité",
  "Toiture & Charpente",
  "Isolation & Chauffage",
  "Carrelage & Sols",
  "Menuiserie & Fenêtres",
  "Second œuvre",
  "Autre",
]

export default function NouveauLeadFacebookModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    nom: "", facebookUrl: "", telephone: "", email: "", ville: "",
    typeTravaux: "Autre", description: "",
  })

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nom) return
    setLoading(true)
    const res = await fetch("/api/crm/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, source: "Facebook" }),
    })
    if (res.ok) {
      const data = await res.json()
      setOpen(false)
      setForm({ nom: "", facebookUrl: "", telephone: "", email: "", ville: "", typeTravaux: "Autre", description: "" })
      router.push(`/crm/leads/${data.id}`)
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-[#1877F2] text-white font-semibold px-4 py-2.5 rounded-xl text-sm">
        <MessageCircle className="w-4 h-4" /> Lead Facebook
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-lg font-bold text-[#0F2C5E] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#1877F2]" /> Nouveau lead Facebook
              </h2>
              <button onClick={() => setOpen(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
              <p className="text-xs text-gray-400">
                Trouvé dans un groupe ou en message privé ? Renseigne ce que tu as sous la main, le reste peut être complété plus tard.
              </p>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nom *</label>
                <input value={form.nom} onChange={set("nom")} required autoFocus
                  placeholder="Nom du profil Facebook"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Lien du profil Facebook</label>
                <input value={form.facebookUrl} onChange={set("facebookUrl")}
                  placeholder="https://facebook.com/..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
                  <input value={form.telephone} onChange={set("telephone")}
                    placeholder="06 XX XX XX XX"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={set("email")}
                    placeholder="jean@exemple.fr"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Ville</label>
                  <input value={form.ville} onChange={set("ville")}
                    placeholder="Saint-Omer"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type de travaux</label>
                  <select value={form.typeTravaux} onChange={set("typeTravaux")}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                    {TYPES_TRAVAUX.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Message copié / notes</label>
                <textarea value={form.description} onChange={set("description")} rows={3}
                  placeholder="Colle ici le message ou le post du groupe…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="flex-1 bg-[#0F2C5E] text-white font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                  {loading ? "Création…" : "Créer le lead"}
                </button>
                <button type="button" onClick={() => setOpen(false)}
                  className="px-5 py-3 border border-gray-200 text-gray-500 font-semibold rounded-xl">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
