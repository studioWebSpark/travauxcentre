"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2, FileText } from "lucide-react"
import { calcTotaux, formatEuro } from "@/lib/chantier"

type Ligne = { description: string; quantite: number; unite: string; prixUnitaire: number }
type Props = {
  chantiers: { id: string; titre: string }[]
  leads:     { id: string; nom: string; ville: string }[]
  defaultChantierId?: string
  defaultLeadId?:    string
}

const LIGNES_PRESET = [
  { description: "Main d'œuvre — pose et finition", quantite: 1, unite: "forfait", prixUnitaire: 1200 },
  { description: "Fournitures et matériaux",          quantite: 1, unite: "forfait", prixUnitaire: 800 },
]

export default function DevisForm({ chantiers, leads, defaultChantierId, defaultLeadId }: Props) {
  const router = useRouter()
  const [chantierId, setChantierId] = useState(defaultChantierId ?? "")
  const [leadId,     setLeadId]     = useState(defaultLeadId ?? "")
  const [tva,        setTva]        = useState(0.20)
  const [notes,      setNotes]      = useState("Devis valable 30 jours. Acompte de 30% à la commande.")
  const [dateValidite, setDateVal]  = useState("")
  const [lignes, setLignes]         = useState<Ligne[]>(LIGNES_PRESET)
  const [loading, setLoading]       = useState(false)
  const [createdId, setCreatedId]   = useState<string | null>(null)

  const totaux = calcTotaux(lignes, tva)

  function addLigne() {
    setLignes((l) => [...l, { description: "", quantite: 1, unite: "forfait", prixUnitaire: 0 }])
  }

  function removeLigne(i: number) { setLignes((l) => l.filter((_, j) => j !== i)) }

  function setLigne(i: number, k: keyof Ligne, v: string | number) {
    setLignes((l) => l.map((line, j) => j === i ? { ...line, [k]: k === "description" || k === "unite" ? v : Number(v) } : line))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (lignes.length === 0) return
    setLoading(true)
    const res = await fetch("/api/crm/devis", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chantierId: chantierId || null, leadId: leadId || null, lignes, tva, notes, dateValidite: dateValidite || null }),
    })
    if (res.ok) {
      const data = await res.json()
      setCreatedId(data.id)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  if (createdId) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-[#0F2C5E] mb-2">Devis créé !</h2>
        <p className="text-gray-500 text-sm mb-8">Téléchargez le PDF ou retournez au chantier.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`/api/crm/devis/${createdId}/pdf`} target="_blank"
            className="inline-flex items-center gap-2 bg-[#0F2C5E] text-[#1a1a1a] font-semibold px-6 py-3 rounded-xl ">
            <FileText className="w-4 h-4" /> Télécharger le PDF
          </a>
          {chantierId && (
            <button onClick={() => router.push(`/crm/chantiers/${chantierId}`)}
              className="inline-flex items-center justify-center border border-gray-200 text-[#0F2C5E] font-semibold px-6 py-3 rounded-xl ">
              Retour au chantier →
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Liaisons */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-[#0F2C5E]">Informations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Chantier associé</label>
            <select value={chantierId} onChange={(e) => setChantierId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
              <option value="">— Aucun —</option>
              {chantiers.map((c) => <option key={c.id} value={c.id}>{c.titre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Lead associé</label>
            <select value={leadId} onChange={(e) => setLeadId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
              <option value="">— Aucun —</option>
              {leads.map((l) => <option key={l.id} value={l.id}>{l.nom} — {l.ville}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Valable jusqu&apos;au</label>
            <input type="date" value={dateValidite} onChange={(e) => setDateVal(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">TVA</label>
            <select value={tva} onChange={(e) => setTva(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
              <option value={0}>0% — Sans TVA</option>
              <option value={0.10}>10% — Taux réduit travaux</option>
              <option value={0.20}>20% — Taux normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lignes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#0F2C5E] mb-4">Lignes du devis</h2>
        <div className="space-y-3">
          {/* Headers */}
          <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400 px-1">
            <span className="col-span-5">Description</span>
            <span className="col-span-2 text-center">Qté</span>
            <span className="col-span-2">Unité</span>
            <span className="col-span-2 text-right">P.U. HT (€)</span>
            <span className="col-span-1" />
          </div>

          {lignes.map((l, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={l.description} onChange={(e) => setLigne(i, "description", e.target.value)}
                placeholder="Description de la prestation" required
                className="col-span-12 sm:col-span-5 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              <input type="number" min={0.01} step={0.01} value={l.quantite} onChange={(e) => setLigne(i, "quantite", e.target.value)}
                className="col-span-4 sm:col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              <select value={l.unite} onChange={(e) => setLigne(i, "unite", e.target.value)}
                className="col-span-4 sm:col-span-2 border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                <option>forfait</option><option>m²</option><option>ml</option>
                <option>heure</option><option>jour</option><option>unité</option>
              </select>
              <input type="number" min={0} step={0.01} value={l.prixUnitaire} onChange={(e) => setLigne(i, "prixUnitaire", e.target.value)}
                className="col-span-3 sm:col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              <button type="button" onClick={() => removeLigne(i)}
                className="col-span-1 text-gray-300 flex justify-center">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addLigne}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-gray-200 text-gray-400 py-2.5 rounded-xl text-sm ">
          <Plus className="w-4 h-4" /> Ajouter une ligne
        </button>

        {/* Totaux */}
        <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Total HT</span>
            <span className="font-semibold">{formatEuro(totaux.ht)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>TVA ({(tva * 100).toFixed(0)}%)</span>
            <span>{formatEuro(totaux.tvaAmount)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#0F2C5E] bg-[#F8F7F4] px-3 py-2 rounded-xl">
            <span>Total TTC</span>
            <span className="text-[#F97316]">{formatEuro(totaux.ttc)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Conditions & notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
      </div>

      <button type="submit" disabled={loading || lignes.length === 0}
        className="w-full bg-[#0F2C5E] text-[#1a1a1a] font-bold py-4 rounded-2xl disabled:opacity-60 flex items-center justify-center gap-2 text-base">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
        {loading ? "Création…" : "Créer le devis et générer le PDF"}
      </button>
    </form>
  )
}
