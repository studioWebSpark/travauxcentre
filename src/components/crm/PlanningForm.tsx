"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, FileText, Send, Loader2, CheckCircle } from "lucide-react"

type Props = { leadId: string; leadNom: string; leadEmail: string }

export default function PlanningForm({ leadId, leadNom, leadEmail }: Props) {
  const [form, setForm] = useState({
    date:    "",
    heure:   "",
    duree:   60,
    typeRdv: "visite",
    adresse: "",
    notes:   "",
  })
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle")
  const router = useRouter()

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: k === "duree" ? Number(e.target.value) : e.target.value }))

  async function submit() {
    if (!form.date || !form.heure || !form.typeRdv) {
      alert("Date, heure et type de RDV requis")
      return
    }
    setState("loading")
    const res = await fetch(`/api/crm/leads/${leadId}/planning`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    })
    if (res.ok) {
      setState("done")
      setTimeout(() => {
        setState("idle")
        setForm({ date: "", heure: "", duree: 60, typeRdv: "visite", adresse: "", notes: "" })
        router.refresh()
      }, 3000)
    } else {
      setState("error")
      setTimeout(() => setState("idle"), 2000)
    }
  }

  const dateObj = form.date ? new Date(form.date) : null
  const dateStr = dateObj?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-[#0F2C5E] mb-5">Planifier un rendez-vous</h2>

      {state === "done" ? (
        <div className="text-center py-6">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="text-green-600 font-semibold">Rendez-vous créé !</p>
          <p className="text-xs text-gray-400 mt-1">Email de confirmation envoyé à {leadEmail}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Heure *</label>
              <input
                type="time"
                value={form.heure}
                onChange={set("heure")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type de RDV *</label>
              <select
                value={form.typeRdv}
                onChange={set("typeRdv")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white"
              >
                <option value="visite">Visite site</option>
                <option value="consultation">Consultation</option>
                <option value="reunion">Réunion</option>
                <option value="diagnostic">Diagnostic</option>
                <option value="chantier">Visite chantier</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Durée (min)</label>
              <select
                value={form.duree}
                onChange={set("duree")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white"
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1h</option>
                <option value={90}>1h30</option>
                <option value={120}>2h</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Adresse du RDV</label>
            <input
              type="text"
              value={form.adresse}
              onChange={set("adresse")}
              placeholder="Ex: 12 Rue de la Paix, Saint-Omer"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes additionnelles</label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Ex: Accès par le garage, prévoir clés"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none"
            />
          </div>

          {state === "error" && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">Erreur lors de la création</p>}

          <div className="bg-[#F8F7F4] rounded-xl p-4 text-sm">
            <p className="text-gray-700 mb-2">
              <strong>Récapitulatif :</strong><br />
              {dateStr && `${dateStr} à ${form.heure || "--:--"}`} — {form.duree} min
            </p>
            <p className="text-xs text-gray-500">
              Un email de confirmation sera envoyé à <strong>{leadNom}</strong> ({leadEmail})
            </p>
          </div>

          <button
            onClick={submit}
            disabled={state === "loading"}
            className="w-full bg-[#0F2C5E] text-[#1a1a1a] font-semibold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {state === "loading" ? "Création..." : "Créer et envoyer l'email"}
          </button>
        </div>
      )}
    </div>
  )
}
