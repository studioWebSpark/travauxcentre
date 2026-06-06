"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { googleCalendarUrl } from "@/lib/ical"
import { CheckCircle, Calendar, Clock, MapPin, Loader2, XCircle } from "lucide-react"

type PlanningData = {
  id: string; date: string; duree: number; typeRdv: string
  adresse: string | null; notes: string | null; statut: string
  lead: { nom: string; typeTravaux: string }
}

export default function ConfirmationPage() {
  const { token } = useParams<{ token: string }>()
  const [data,   setData]   = useState<PlanningData | null>(null)
  const [state,  setState]  = useState<"loading" | "ready" | "confirming" | "done" | "already" | "error">("loading")
  const [gcUrl,  setGcUrl]  = useState("")

  useEffect(() => {
    fetch(`/api/planning/${token}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        if (d.statut === "CONFIRME") { setState("already"); return }
        if (d.statut === "ANNULE")   { setState("error");   return }
        setState("ready")
      })
      .catch(() => setState("error"))
  }, [token])

  async function confirmer() {
    if (!data) return
    setState("confirming")
    const res = await fetch(`/api/planning/${token}`, { method: "POST" })
    const json = await res.json()
    if (json.success || json.alreadyConfirmed) {
      const debut = new Date(data.date)
      const fin   = new Date(debut.getTime() + data.duree * 60_000)
      setGcUrl(googleCalendarUrl({
        titre:       `RDV ${data.typeRdv} — Travaux Centre`,
        description: `Projet : ${data.lead.typeTravaux}`,
        lieu:        data.adresse ?? "Longuenesse",
        debut, fin,
      }))
      setState("done")
    } else {
      setState("error")
    }
  }

  const debut   = data ? new Date(data.date) : null
  const dateStr = debut?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  const heurStr = debut?.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-[#0F2C5E]" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Loading */}
          {state === "loading" && (
            <div className="p-10 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#0F2C5E] mx-auto mb-3" />
              <p className="text-gray-500">Chargement…</p>
            </div>
          )}

          {/* Déjà confirmé */}
          {state === "already" && (
            <div className="p-8 text-center">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-[#0F2C5E] mb-2">Déjà confirmé !</h1>
              <p className="text-gray-500 text-sm">Votre rendez-vous a déjà été confirmé. À bientôt !</p>
            </div>
          )}

          {/* Erreur */}
          {state === "error" && (
            <div className="p-8 text-center">
              <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-[#0F2C5E] mb-2">Lien invalide</h1>
              <p className="text-gray-500 text-sm">Ce lien est expiré ou invalide. Contactez-nous au 03 XX XX XX XX.</p>
            </div>
          )}

          {/* Prêt à confirmer */}
          {(state === "ready" || state === "confirming") && data && (
            <>
              <div className="bg-[#0F2C5E] px-8 py-6">
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Rendez-vous à confirmer</p>
                <h1 className="text-2xl font-bold text-white">{data.typeRdv}</h1>
              </div>
              <div className="p-8 space-y-4">
                <p className="text-gray-600 text-sm">Bonjour <strong>{data.lead.nom}</strong>, merci de confirmer votre rendez-vous :</p>

                <div className="space-y-3 bg-[#F8F7F4] rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#0F2C5E] shrink-0" />
                    <span className="text-gray-800 font-semibold">{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#0F2C5E] shrink-0" />
                    <span className="text-gray-700">{heurStr} — durée : {data.duree} minutes</span>
                  </div>
                  {data.adresse && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#0F2C5E] shrink-0" />
                      <span className="text-gray-700">{data.adresse}</span>
                    </div>
                  )}
                  {data.notes && (
                    <p className="text-gray-500 text-sm pl-8 italic">{data.notes}</p>
                  )}
                </div>

                <button
                  onClick={confirmer}
                  disabled={state === "confirming"}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-lg"
                >
                  {state === "confirming" ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  {state === "confirming" ? "Confirmation…" : "✅ Confirmer mon rendez-vous"}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Ce créneau ne vous convient pas ?<br />
                  Appelez-nous : <a href="tel:+33300000000" className="text-[#0F2C5E] font-semibold">03 XX XX XX XX</a>
                </p>
              </div>
            </>
          )}

          {/* Confirmé avec succès */}
          {state === "done" && data && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-[#0F2C5E] mb-2">Rendez-vous confirmé !</h1>
              <p className="text-gray-500 text-sm mb-8">
                Merci {data.lead.nom}. Nous avons bien enregistré votre confirmation pour le <strong>{dateStr} à {heurStr}</strong>.
              </p>

              <div className="space-y-3">
                <a href={gcUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#0F2C5E] text-white font-semibold py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors text-sm">
                  <Calendar className="w-4 h-4" />
                  Ajouter à Google Calendar
                </a>
                <p className="text-xs text-gray-400">Ou ajoutez le fichier .ics reçu par email à votre agenda.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
