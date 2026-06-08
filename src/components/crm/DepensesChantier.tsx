"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2, PlusCircle, Euro } from "lucide-react"

const formatEuro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)

type DepenseType = "MATERIAUX" | "MAIN_OEUVRE" | "SOUS_TRAITANT" | "EQUIPEMENT" | "AUTRE"

interface Depense {
  id: string
  type: DepenseType
  description: string
  montant: number
  fournisseur: string | null
  date: string
}

const TYPE_BADGES: Record<DepenseType, { label: string; className: string }> = {
  MATERIAUX:     { label: "Matériaux",      className: "bg-blue-100 text-blue-700" },
  MAIN_OEUVRE:   { label: "Main d'œuvre",   className: "bg-amber-100 text-amber-700" },
  SOUS_TRAITANT: { label: "Sous-traitant",  className: "bg-purple-100 text-purple-700" },
  EQUIPEMENT:    { label: "Équipement",     className: "bg-gray-100 text-gray-600" },
  AUTRE:         { label: "Autre",          className: "bg-gray-100 text-gray-600" },
}

interface Props {
  chantierId: string
  budget: number | null
}

export default function DepensesChantier({ chantierId, budget }: Props) {
  const router = useRouter()
  const [depenses, setDepenses] = useState<Depense[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form state
  const [type, setType] = useState<DepenseType>("MATERIAUX")
  const [description, setDescription] = useState("")
  const [montant, setMontant] = useState("")
  const [fournisseur, setFournisseur] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const fetchDepenses = async () => {
    const res = await fetch(`/api/crm/chantiers/${chantierId}/depenses`)
    const data = await res.json()
    setDepenses(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchDepenses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chantierId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !montant) return
    setSaving(true)
    await fetch(`/api/crm/chantiers/${chantierId}/depenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, description, montant: parseFloat(montant), fournisseur: fournisseur || null, date }),
    })
    setDescription("")
    setMontant("")
    setFournisseur("")
    setDate(new Date().toISOString().slice(0, 10))
    setSaving(false)
    await fetchDepenses()
    router.refresh()
  }

  const handleDelete = async (depenseId: string) => {
    setDeletingId(depenseId)
    await fetch(`/api/crm/chantiers/${chantierId}/depenses`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ depenseId }),
    })
    setDeletingId(null)
    await fetchDepenses()
    router.refresh()
  }

  const total = depenses.reduce((s, d) => s + d.montant, 0)
  const marge = budget !== null ? budget - total : null

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[120px] bg-gray-50 rounded-lg border border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-500 font-medium">Total dépenses</p>
          <p className="text-lg font-bold text-[#0F2C5E] mt-0.5">{formatEuro(total)}</p>
        </div>
        {budget !== null && (
          <div className="flex-1 min-w-[120px] bg-gray-50 rounded-lg border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">Budget</p>
            <p className="text-lg font-bold text-[#0F2C5E] mt-0.5">{formatEuro(budget)}</p>
          </div>
        )}
        {marge !== null && (
          <div className={`flex-1 min-w-[120px] rounded-lg border px-4 py-3 ${marge >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <p className="text-xs text-gray-500 font-medium">Marge</p>
            <p className={`text-lg font-bold mt-0.5 ${marge >= 0 ? "text-green-700" : "text-red-700"}`}>
              {formatEuro(marge)}
            </p>
          </div>
        )}
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
          <PlusCircle className="w-3.5 h-3.5" />
          Ajouter une dépense
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500 mb-1 block">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DepenseType)}
              className="w-full text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]/30"
            >
              <option value="MATERIAUX">Matériaux</option>
              <option value="MAIN_OEUVRE">Main d&apos;œuvre</option>
              <option value="SOUS_TRAITANT">Sous-traitant</option>
              <option value="EQUIPEMENT">Équipement</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500 mb-1 block">Montant (€)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder="0.00"
              required
              className="w-full text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]/30"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Achat parquet 45m²"
              required
              className="w-full text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]/30"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500 mb-1 block">Fournisseur</label>
            <input
              type="text"
              value={fournisseur}
              onChange={(e) => setFournisseur(e.target.value)}
              placeholder="Leroy Merlin…"
              className="w-full text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]/30"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500 mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]/30"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0F2C5E] text-[#1a1a1a] text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Euro className="w-3.5 h-3.5" />}
          {saving ? "Enregistrement…" : "Ajouter"}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : depenses.length === 0 ? (
        <p className="text-sm text-gray-400 italic text-center py-4">Aucune dépense enregistrée</p>
      ) : (
        <div className="space-y-2">
          {depenses.map((d) => {
            const badge = TYPE_BADGES[d.type] ?? TYPE_BADGES.AUTRE
            return (
              <div
                key={d.id}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
              >
                <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
                  {badge.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{d.description}</p>
                  {d.fournisseur && (
                    <p className="text-xs text-gray-400 truncate">{d.fournisseur}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(d.date).toLocaleDateString("fr-FR")}
                </span>
                <span className="text-sm font-bold text-[#0F2C5E] shrink-0 min-w-[80px] text-right">
                  {formatEuro(d.montant)}
                </span>
                <button
                  onClick={() => handleDelete(d.id)}
                  disabled={deletingId === d.id}
                  className="shrink-0 p-1.5 text-gray-400 rounded-lg disabled:opacity-50"
                  title="Supprimer"
                >
                  {deletingId === d.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
