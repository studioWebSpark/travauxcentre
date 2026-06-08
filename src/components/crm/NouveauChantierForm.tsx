"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

type Lead = { id: string; nom: string; ville: string; typeTravaux: string }

export default function NouveauChantierForm({ leads }: { leads: Lead[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    leadId: "", titre: "", description: "", adresse: "",
    budget: "", dateDebut: "", dateFin: "",
  })
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  // Auto-remplir depuis le lead sélectionné
  function onLeadChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id   = e.target.value
    const lead = leads.find((l) => l.id === id)
    setForm((f) => ({
      ...f,
      leadId: id,
      titre:  lead ? `${lead.typeTravaux} — ${lead.nom}` : f.titre,
      adresse: lead ? lead.ville : f.adresse,
    }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titre || !form.adresse) return
    setLoading(true)
    const res = await fetch("/api/crm/chantiers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, budget: form.budget ? Number(form.budget) : null }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/crm/chantiers/${data.id}`)
    } else {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Lead associé (facultatif)</label>
        <select value={form.leadId} onChange={onLeadChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
          <option value="">— Aucun lead —</option>
          {leads.map((l) => (
            <option key={l.id} value={l.id}>{l.nom} — {l.typeTravaux} ({l.ville})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Titre du chantier *</label>
        <input value={form.titre} onChange={set("titre")} required
          placeholder="Ex: Rénovation salon — Dupont"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Adresse du chantier *</label>
        <input value={form.adresse} onChange={set("adresse")} required
          placeholder="Ex: 12 rue de la Paix, Saint-Omer"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
        <textarea value={form.description} onChange={set("description")} rows={3}
          placeholder="Détails du chantier…"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Budget estimé (€)</label>
          <input type="number" value={form.budget} onChange={set("budget")} placeholder="5000"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Date de début</label>
          <input type="date" value={form.dateDebut} onChange={set("dateDebut")}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Date de fin prévue</label>
          <input type="date" value={form.dateFin} onChange={set("dateFin")}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#0F2C5E] text-white font-semibold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</> : "Créer le chantier"}
      </button>
    </form>
  )
}
