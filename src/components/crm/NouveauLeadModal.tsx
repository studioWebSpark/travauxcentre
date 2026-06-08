"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Loader2, UserPlus } from "lucide-react"

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

const SOURCES = ["Appel téléphonique", "Visite directe", "Site web", "Bouche à oreille", "Réseaux sociaux", "Email", "Autre"]

const BUDGETS = ["Moins de 1 000 €", "1 000 – 5 000 €", "5 000 – 15 000 €", "15 000 – 50 000 €", "Plus de 50 000 €"]

export default function NouveauLeadModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    nom: "", email: "", telephone: "", ville: "", codePostal: "",
    typeTravaux: "Rénovation intérieure", description: "",
    budget: "", surface: "", dateSouhaitee: "",
    source: "Appel téléphonique", priorite: "NORMALE",
  })

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nom || !form.telephone) return
    setLoading(true)
    const res = await fetch("/api/crm/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        surface: form.surface ? Number(form.surface) : null,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setOpen(false)
      setForm({ nom: "", email: "", telephone: "", ville: "", codePostal: "",
        typeTravaux: "Rénovation intérieure", description: "",
        budget: "", surface: "", dateSouhaitee: "", source: "Appel téléphonique", priorite: "NORMALE" })
      router.push(`/crm/leads/${data.id}`)
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a3f7a] transition-colors text-sm">
        <UserPlus className="w-4 h-4" /> Nouveau lead
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-lg font-bold text-[#0F2C5E]">Nouveau lead</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-5">
              {/* Infos client */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Informations client</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nom complet *</label>
                    <input value={form.nom} onChange={set("nom")} required autoFocus
                      placeholder="Jean Dupont"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone *</label>
                    <input value={form.telephone} onChange={set("telephone")} required
                      placeholder="06 XX XX XX XX"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={set("email")}
                      placeholder="jean@exemple.fr"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ville</label>
                    <input value={form.ville} onChange={set("ville")}
                      placeholder="Saint-Omer"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Code postal</label>
                    <input value={form.codePostal} onChange={set("codePostal")}
                      placeholder="62500"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
                    <select value={form.source} onChange={set("source")}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                      {SOURCES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Projet */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Projet</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Type de travaux *</label>
                    <select value={form.typeTravaux} onChange={set("typeTravaux")}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                      {TYPES_TRAVAUX.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Budget estimé</label>
                    <select value={form.budget} onChange={set("budget")}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                      <option value="">— Non précisé —</option>
                      {BUDGETS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Surface (m²)</label>
                    <input type="number" value={form.surface} onChange={set("surface")}
                      placeholder="50"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date souhaitée</label>
                    <input type="date" value={form.dateSouhaitee} onChange={set("dateSouhaitee")}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Priorité</label>
                    <select value={form.priorite} onChange={set("priorite")}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                      <option value="HAUTE">🔴 Haute</option>
                      <option value="NORMALE">🟡 Normale</option>
                      <option value="BASSE">🟢 Basse</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea value={form.description} onChange={set("description")} rows={3}
                      placeholder="Détails du projet, remarques…"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="flex-1 bg-[#0F2C5E] text-white font-bold py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {loading ? "Création…" : "Créer le lead"}
                </button>
                <button type="button" onClick={() => setOpen(false)}
                  className="px-5 py-3 border border-gray-200 text-gray-500 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
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
