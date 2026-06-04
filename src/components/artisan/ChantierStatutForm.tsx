'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

const statuts = [
  { value: "PLANIFIE", label: "Planifié" },
  { value: "EN_COURS", label: "En cours" },
  { value: "PAUSE",    label: "En pause" },
  { value: "TERMINE",  label: "Terminé" },
]

export function ChantierStatutForm({ chantierId, statutActuel }: { chantierId: string; statutActuel: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [statut, setStatut] = useState(statutActuel)

  async function handleChange(newStatut: string) {
    setStatut(newStatut)
    await fetch(`/api/chantiers/${chantierId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: newStatut }),
    })
    startTransition(() => router.refresh())
  }

  return (
    <select
      value={statut}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {statuts.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
