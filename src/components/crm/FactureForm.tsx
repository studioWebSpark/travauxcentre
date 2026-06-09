"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { calcTotaux, formatEuro } from "@/lib/chantier"

type Ligne = { description: string; quantite: number; unite: string; prixUnitaire: number }
type Devis = { id: string; numero: string; lignes: Ligne[]; tva: number }

type Props = {
  chantiers:         { id: string; titre: string }[]
  defaultChantierId?: string
  devisDisponibles?: Devis[]
}

export default function FactureForm({ chantiers, defaultChantierId, devisDisponibles = [] }: Props) {
  const router = useRouter()
  const [chantierId, setChantierId] = useState(defaultChantierId ?? "")
  const [devisId,    setDevisId]    = useState("")
  const [tva,        setTva]        = useState(0.20)
  const [notes,      setNotes]      = useState("")
  const [dateEcheance, setDate]     = useState("")
  const [lignes, setLignes]         = useState<Ligne[]>([
    { description: "", quantite: 1, unite: "forfait", prixUnitaire: 0 },
  ])
  const [loading, setLoading] = useState(false)

  const totaux = calcTotaux(lignes, tva)

  function onDevisChange(id: string) {
    setDevisId(id)
    if (!id) return
    const devis = devisDisponibles.find(d => d.id === id)
    if (devis) {
      setLignes(devis.lignes.map(l => ({ ...l })))
      setTva(devis.tva)
    }
  }

  function addLigne() {
    setLignes(l => [...l, { description: "", quantite: 1, unite: "forfait", prixUnitaire: 0 }])
  }

  function removeLigne(i: number) {
    setLignes(l => l.filter((_, j) => j !== i))
  }

  function setLigne(i: number, k: keyof Ligne, v: string | number) {
    setLignes(l => l.map((line, j) => j === i ? { ...line, [k]: k === "description" || k === "unite" ? v : Number(v) } : line))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/crm/factures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chantierId: chantierId || null, devisId: devisId || null, lignes, tva, notes, dateEcheance: dateEcheance || null }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/crm/factures`)
    } else {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">

      {/* Chantier */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-[#0F2C5E]">Chantier</h2>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Chantier associé</label>
          <select value={chantierId} onChange={e => setChantierId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
            <option value="">— Aucun —</option>
            {chantiers.map(c => <option key={c.id} value={c.id}>{c.titre}</option>)}
          </select>
        </div>

        {devisDisponibles.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Pré-remplir depuis un devis</label>
            <select value={devisId} onChange={e => onDevisChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
              <option value="">— Saisie manuelle —</option>
              {devisDisponibles.map(d => <option key={d.id} value={d.id}>{d.numero}</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">TVA</label>
            <select value={tva} onChange={e => setTva(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
              <option value={0.20}>20%</option>
              <option value={0.10}>10%</option>
              <option value={0.055}>5,5%</option>
              <option value={0}>0%</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Date d'échéance</label>
            <input type="date" value={dateEcheance} onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
          </div>
        </div>
      </div>

      {/* Lignes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#0F2C5E] mb-4">Prestations</h2>

        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-400 pb-1">
            <span className="col-span-12 sm:col-span-5">Description</span>
            <span className="col-span-4 sm:col-span-2 text-center">Qté</span>
            <span className="col-span-4 sm:col-span-2 text-center">Unité</span>
            <span className="col-span-3 sm:col-span-2 text-right">Prix HT</span>
            <span className="col-span-1" />
          </div>

          {lignes.map((l, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={l.description} onChange={e => setLigne(i, "description", e.target.value)}
                placeholder="Description" required
                className="col-span-12 sm:col-span-5 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              <input type="number" min={0.01} step={0.01}
                value={l.quantite === 0 ? "" : l.quantite}
                onChange={e => setLigne(i, "quantite", e.target.value === "" ? 0 : e.target.value)}
                placeholder="Qté"
                className="col-span-4 sm:col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              <select value={l.unite} onChange={e => setLigne(i, "unite", e.target.value)}
                className="col-span-4 sm:col-span-2 border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                <option>forfait</option><option>m²</option><option>ml</option>
                <option>heure</option><option>jour</option><option>unité</option>
              </select>
              <input type="number" min={0} step={0.01}
                value={l.prixUnitaire === 0 ? "" : l.prixUnitaire}
                onChange={e => setLigne(i, "prixUnitaire", e.target.value === "" ? 0 : e.target.value)}
                placeholder="Prix €"
                className="col-span-3 sm:col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              <button type="button" onClick={() => removeLigne(i)} className="col-span-1 text-gray-300 flex justify-center hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addLigne}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-gray-200 text-gray-400 py-2.5 rounded-xl text-sm">
          <Plus className="w-4 h-4" /> Ajouter une ligne
        </button>

        {/* Totaux */}
        <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Total HT</span><span className="font-semibold">{formatEuro(totaux.ht)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>TVA ({(tva * 100).toFixed(0)}%)</span><span>{formatEuro(totaux.tvaAmount)}</span>
          </div>
          <div className="flex justify-between bg-[#0F2C5E] text-white rounded-xl px-4 py-3">
            <span className="font-bold">Total TTC</span>
            <span className="font-bold text-[#F97316]">{formatEuro(totaux.ttc)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#0F2C5E] mb-3">Notes (optionnel)</h2>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          placeholder="Conditions de paiement, remarques…"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#0F2C5E] text-white font-bold py-3.5 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Création…</> : "Créer la facture"}
      </button>
    </form>
  )
}
