"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Loader2, CheckCircle } from "lucide-react"

type Props = { chantierId: string; statut: string }

export default function FactureButton({ chantierId, statut }: Props) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("FACTURE")
  const [tva, setTva] = useState("0.20")
  const [echeance, setEcheance] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const router = useRouter()

  if (!["EN_COURS", "TERMINE"].includes(statut)) return null

  async function generate() {
    setLoading(true)
    const res = await fetch(`/api/crm/chantiers/${chantierId}/facture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        tva: Number(tva),
        dateEcheance: echeance || null,
        notes: notes || null,
      }),
    })
    if (res.ok) {
      setGenerated(true)
      setTimeout(() => {
        router.push("/crm/factures")
      }, 1500)
    }
    setLoading(false)
  }

  if (generated) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-semibold flex items-center gap-2">
        <CheckCircle className="w-4 h-4" /> Facture générée ! Redirection…
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-green-700 transition-colors"
      >
        <FileText className="w-4 h-4" /> Générer une facture
      </button>
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-500">Générer une facture</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white"
          >
            <option value="FACTURE">Facture finale</option>
            <option value="ACOMPTE">Acompte</option>
            <option value="AVOIR">Avoir</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">TVA</label>
          <select
            value={tva}
            onChange={(e) => setTva(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white"
          >
            <option value="0">0%</option>
            <option value="0.10">10%</option>
            <option value="0.20">20%</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Échéance</label>
        <input
          type="date"
          value={echeance}
          onChange={(e) => setEcheance(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Notes</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="IBAN, conditions…"
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={generate}
          disabled={loading}
          className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg text-xs disabled:opacity-60 flex items-center justify-center gap-1.5 hover:bg-green-700 transition-colors"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          {loading ? "Création…" : "Générer"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
