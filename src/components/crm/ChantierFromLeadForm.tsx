"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Wrench } from "lucide-react"

type Props = {
  lead: {
    id: string
    nom: string
    ville: string
    codePostal: string
    typeTravaux: string
    description: string
  }
}

export default function ChantierFromLeadForm({ lead }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    titre:       `${lead.typeTravaux} — ${lead.nom}`,
    adresse:     `${lead.ville} (${lead.codePostal})`,
    description: lead.description ?? "",
    dateDebut:   "",
    dateFin:     "",
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titre || !form.adresse) return
    setLoading(true)
    const res = await fetch("/api/crm/chantiers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId:      lead.id,
        titre:       form.titre,
        adresse:     form.adresse,
        description: form.description,
        budget:      null,
        dateDebut:   form.dateDebut || null,
        dateFin:     form.dateFin || null,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/crm/chantiers/${data.id}`)
    } else {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
      >
        <Wrench className="w-4 h-4" />
        Créer le chantier
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Titre du chantier *</label>
        <input value={form.titre} onChange={set("titre")} required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Adresse *</label>
        <input value={form.adresse} onChange={set("adresse")} required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
        <textarea value={form.description} onChange={set("description")} rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Début</label>
          <input type="date" value={form.dateDebut} onChange={set("dateDebut")}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Fin prévue</label>
          <input type="date" value={form.dateFin} onChange={set("dateFin")}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen(false)}
          className="flex-1 border border-gray-200 text-gray-500 font-semibold py-2.5 rounded-xl text-sm">
          Annuler
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-[#0F2C5E] text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Création…</> : "Confirmer"}
        </button>
      </div>
    </form>
  )
}
