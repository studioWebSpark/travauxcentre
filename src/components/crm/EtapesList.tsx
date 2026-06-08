"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { STATUTS_ETAPE } from "@/lib/chantier"
import { Plus, Loader2 } from "lucide-react"

type Etape = { id: string; titre: string; description: string | null; statut: string; dateEcheance: string | null; ordre: number }

export default function EtapesList({ chantierId, etapes }: { chantierId: string; etapes: Etape[] }) {
  const router    = useRouter()
  const [busy,    setBusy]    = useState<string | null>(null)
  const [adding,  setAdding]  = useState(false)
  const [newEtape, setNew]    = useState({ titre: "", description: "", dateEcheance: "" })
  const [saving,  setSaving]  = useState(false)

  async function toggleEtape(etapeId: string, current: string) {
    setBusy(etapeId)
    const next = current === "TERMINEE" ? "A_FAIRE" : current === "A_FAIRE" ? "EN_COURS" : "TERMINEE"
    await fetch(`/api/crm/chantiers/${chantierId}/etapes`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etapeId, statut: next }),
    })
    setBusy(null); router.refresh()
  }

  async function addEtape() {
    if (!newEtape.titre.trim()) return
    setSaving(true)
    await fetch(`/api/crm/chantiers/${chantierId}/etapes`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEtape),
    })
    setNew({ titre: "", description: "", dateEcheance: "" })
    setAdding(false); setSaving(false); router.refresh()
  }

  return (
    <div className="space-y-2">
      {etapes.length === 0 && !adding && (
        <p className="text-sm text-gray-400 text-center py-4">Aucune étape — ajoutez-en une ci-dessous</p>
      )}

      {etapes.map((e) => {
        const st = STATUTS_ETAPE[e.statut] ?? STATUTS_ETAPE.A_FAIRE
        return (
          <div key={e.id} className="flex items-center gap-3 p-3 bg-[#F8F7F4] rounded-xl ">
            <button
              onClick={() => toggleEtape(e.id, e.statut)}
              disabled={busy === e.id}
              className="text-lg shrink-0 disabled:opacity-50"
              title="Cliquer pour changer le statut"
            >
              {busy === e.id ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : st.icon}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${e.statut === "TERMINEE" ? "line-through text-gray-400" : "text-[#0F2C5E]"}`}>
                {e.titre}
              </p>
              {e.description && <p className="text-xs text-gray-400 truncate">{e.description}</p>}
            </div>
            <span className={`text-xs font-medium ${st.color} shrink-0`}>{st.label}</span>
            {e.dateEcheance && (
              <span className="text-xs text-gray-300 shrink-0 hidden sm:block">
                {new Date(e.dateEcheance).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </span>
            )}
          </div>
        )
      })}

      {adding ? (
        <div className="border border-dashed border-[#0F2C5E]/30 rounded-xl p-4 space-y-3">
          <input value={newEtape.titre} onChange={(e) => setNew((f) => ({ ...f, titre: e.target.value }))}
            placeholder="Titre de l'étape *" autoFocus
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
          <input value={newEtape.description} onChange={(e) => setNew((f) => ({ ...f, description: e.target.value }))}
            placeholder="Description (optionnel)"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
          <input type="date" value={newEtape.dateEcheance} onChange={(e) => setNew((f) => ({ ...f, dateEcheance: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
          <div className="flex gap-2">
            <button onClick={addEtape} disabled={saving}
              className="flex-1 bg-[#0F2C5E] text-[#1a1a1a] font-semibold py-2 rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? "Ajout…" : "Ajouter"}
            </button>
            <button onClick={() => setAdding(false)}
              className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl">
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-200 text-gray-400 py-2.5 rounded-xl text-sm ">
          <Plus className="w-4 h-4" /> Ajouter une étape
        </button>
      )}
    </div>
  )
}
