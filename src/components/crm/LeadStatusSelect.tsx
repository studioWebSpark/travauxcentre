"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { STATUTS } from "@/lib/crm"
import type { StatutLead } from "@/generated/prisma"

export default function LeadStatusSelect({ leadId, statut }: { leadId: string; statut: StatutLead }) {
  const [val, setVal]   = useState(statut)
  const [busy, setBusy] = useState(false)
  const router          = useRouter()

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as StatutLead
    setBusy(true)
    setVal(next)
    await fetch(`/api/crm/leads/${leadId}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ statut: next }),
    })
    router.refresh()
    setBusy(false)
  }

  const cfg = STATUTS[val]
  return (
    <select
      value={val}
      onChange={onChange}
      disabled={busy}
      className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] disabled:opacity-60 ${cfg.bg} ${cfg.color}`}
    >
      {Object.entries(STATUTS).map(([k, v]) => (
        <option key={k} value={k}>{v.label}</option>
      ))}
    </select>
  )
}
