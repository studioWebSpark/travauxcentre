"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { STATUTS, PRIORITES } from "@/lib/crm"
import type { StatutLead, PrioriteLead } from "@/generated/prisma"

type Props = {
  lead: {
    id: string
    statut: StatutLead
    priorite: PrioriteLead
    montantDevis: number | null
    dateContact: string | null
    dateRdv: string | null
    commentaireInterne: string | null
  }
}

export default function LeadActions({ lead }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    statut:             lead.statut,
    priorite:           lead.priorite,
    montantDevis:       lead.montantDevis?.toString() ?? "",
    dateContact:        lead.dateContact ? lead.dateContact.slice(0, 10) : "",
    dateRdv:            lead.dateRdv     ? lead.dateRdv.slice(0, 10)     : "",
    commentaireInterne: lead.commentaireInterne ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save() {
    setSaving(true)
    await fetch(`/api/crm/leads/${lead.id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        statut:             form.statut,
        priorite:           form.priorite,
        montantDevis:       form.montantDevis ? Number(form.montantDevis) : null,
        dateContact:        form.dateContact || null,
        dateRdv:            form.dateRdv     || null,
        commentaireInterne: form.commentaireInterne || null,
      }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Statut pipeline</label>
        <select value={form.statut} onChange={set("statut")}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
          {Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Priorité</label>
        <select value={form.priorite} onChange={set("priorite")}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
          {Object.entries(PRIORITES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Montant devis (€)</label>
        <input type="number" value={form.montantDevis} onChange={set("montantDevis")} placeholder="Ex : 4500"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Date de contact</label>
        <input type="date" value={form.dateContact} onChange={set("dateContact")}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Date RDV</label>
        <input type="date" value={form.dateRdv} onChange={set("dateRdv")}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Commentaire interne</label>
        <textarea value={form.commentaireInterne} onChange={set("commentaireInterne")} rows={3}
          placeholder="Notes privées sur ce lead…"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
      </div>

      <button onClick={save} disabled={saving}
        className="w-full bg-[#0F2C5E] text-white font-semibold py-2.5 rounded-xl disabled:opacity-60 text-sm">
        {saved ? "✓ Sauvegardé" : saving ? "Sauvegarde…" : "Sauvegarder"}
      </button>
    </div>
  )
}
