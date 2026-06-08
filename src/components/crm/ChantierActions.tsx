"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { STATUTS_CHANTIER } from "@/lib/chantier"
import type { StatutChantierCrm } from "@/generated/prisma"

type Props = {
  chantier: { id: string; statut: StatutChantierCrm; progression: number
              budget: number | null; budgetReel: number | null
              dateDebut: string | null; dateFin: string | null }
}

export default function ChantierActions({ chantier }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    statut:     chantier.statut,
    progression: chantier.progression,
    budget:     chantier.budget?.toString()    ?? "",
    budgetReel: chantier.budgetReel?.toString() ?? "",
    dateDebut:  chantier.dateDebut ? chantier.dateDebut.slice(0, 10) : "",
    dateFin:    chantier.dateFin   ? chantier.dateFin.slice(0, 10)   : "",
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save() {
    setSaving(true)
    await fetch(`/api/crm/chantiers/${chantier.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        statut:     form.statut,
        progression: Number(form.progression),
        budget:     form.budget     ? Number(form.budget)     : null,
        budgetReel: form.budgetReel ? Number(form.budgetReel) : null,
        dateDebut:  form.dateDebut  || null,
        dateFin:    form.dateFin    || null,
      }),
    })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
    setSaving(false); router.refresh()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
        <select value={form.statut} onChange={set("statut")}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
          {Object.entries(STATUTS_CHANTIER).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Progression ({form.progression}%)</label>
        <input type="range" min={0} max={100} value={form.progression}
          onChange={set("progression")}
          className="w-full accent-[#0F2C5E]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Budget estimé (€)</label>
          <input type="number" value={form.budget} onChange={set("budget")} placeholder="5000"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Coût réel (€)</label>
          <input type="number" value={form.budgetReel} onChange={set("budgetReel")} placeholder="4800"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Début</label>
          <input type="date" value={form.dateDebut} onChange={set("dateDebut")}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Fin prévue</label>
          <input type="date" value={form.dateFin} onChange={set("dateFin")}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="w-full bg-[#0F2C5E] text-[#1a1a1a] font-semibold py-2.5 rounded-xl disabled:opacity-60 text-sm">
        {saved ? "✓ Sauvegardé" : saving ? "Sauvegarde…" : "Sauvegarder"}
      </button>
    </div>
  )
}
