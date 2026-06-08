"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, FileText, Send } from "lucide-react"

interface Rapport {
  id: string
  date: string
  heures: number
  description: string
  meteo: string | null
  envoye: boolean
}

interface Props {
  chantierId: string
  clientEmail: string | null
}

export default function RapportJournalierForm({ chantierId, clientEmail }: Props) {
  const router = useRouter()
  const [rapports, setRapports] = useState<Rapport[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [heures, setHeures] = useState("")
  const [description, setDescription] = useState("")
  const [meteo, setMeteo] = useState("Ensoleillé")
  const [envoyer, setEnvoyer] = useState(false)

  const fetchRapports = async () => {
    const res = await fetch(`/api/crm/chantiers/${chantierId}/rapports`)
    const data = await res.json()
    setRapports(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchRapports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chantierId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description) return
    setSaving(true)
    setSuccess(false)
    await fetch(`/api/crm/chantiers/${chantierId}/rapports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        heures: heures ? parseFloat(heures) : 0,
        description,
        meteo,
        envoyer: envoyer && !!clientEmail,
      }),
    })
    setDescription("")
    setHeures("")
    setDate(new Date().toISOString().slice(0, 10))
    setEnvoyer(false)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    await fetchRapports()
    router.refresh()
  }

  const METEO_OPTIONS = ["Ensoleillé", "Nuageux", "Pluvieux", "Neige", "Vent"]

  const METEO_ICONS: Record<string, string> = {
    "Ensoleillé": "☀️",
    "Nuageux":    "☁️",
    "Pluvieux":   "🌧️",
    "Neige":      "❄️",
    "Vent":       "💨",
  }

  return (
    <div className="space-y-5">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Nouveau rapport journalier
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]/30"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Heures travaillées</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={heures}
              onChange={(e) => setHeures(e.target.value)}
              placeholder="8"
              className="w-full text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]/30"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Météo</label>
          <select
            value={meteo}
            onChange={(e) => setMeteo(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]/30"
          >
            {METEO_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {METEO_ICONS[m]} {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Description des travaux</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez les travaux effectués aujourd'hui…"
            rows={3}
            required
            className="w-full text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]/30 resize-none"
          />
        </div>

        {clientEmail && (
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={envoyer}
              onChange={(e) => setEnvoyer(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#0F2C5E] focus:ring-[#0F2C5E]"
            />
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Send className="w-3 h-3" />
              Envoyer automatiquement au client par email
              <span className="text-gray-400">({clientEmail})</span>
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={saving || !description}
          className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : success ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
          {saving ? "Enregistrement…" : success ? "Enregistré !" : "Enregistrer le rapport"}
        </button>
      </form>

      {/* Previous rapports */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Rapports précédents
        </h3>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : rapports.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-4">
            Aucun rapport enregistré
          </p>
        ) : (
          <div className="space-y-2">
            {rapports.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0F2C5E]">
                      {new Date(r.date).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    {r.heures > 0 && (
                      <span className="text-xs text-gray-400">{r.heures}h</span>
                    )}
                    {r.meteo && (
                      <span className="text-xs text-gray-400">
                        {METEO_ICONS[r.meteo] ?? ""} {r.meteo}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {r.envoye && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-2.5 h-2.5" />
                        Envoyé
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
