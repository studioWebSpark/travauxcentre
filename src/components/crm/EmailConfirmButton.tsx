"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Loader2, CheckCircle } from "lucide-react"
import type { StatutLead } from "@/generated/prisma"

const STATUT_LABEL: Partial<Record<StatutLead, string>> = {
  CONTACTE:     "Suite à notre échange",
  DEVIS_ENVOYE: "Votre devis est prêt",
  GAGNE:        "Projet confirmé 🎉",
  EN_ATTENTE:   "Demande en attente",
}

export default function EmailConfirmButton({ leadId, statut }: { leadId: string; statut: StatutLead }) {
  const [state,   setState]  = useState<"idle" | "loading" | "sent" | "error">("idle")
  const router               = useRouter()

  const label = STATUT_LABEL[statut]
  if (!label) return null // Pas de template pour NOUVEAU / PERDU

  async function send() {
    setState("loading")
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/email`, { method: "POST" })
      if (res.ok) {
        setState("sent")
        router.refresh()
        setTimeout(() => setState("idle"), 4000)
      } else {
        setState("error")
        setTimeout(() => setState("idle"), 3000)
      }
    } catch {
      setState("error")
      setTimeout(() => setState("idle"), 3000)
    }
  }

  return (
    <button
      onClick={send}
      disabled={state === "loading" || state === "sent"}
      className={`flex items-center gap-2 w-full justify-center font-semibold px-4 py-2.5 rounded-xl text-sm transition-all ${
        state === "sent"
          ? "bg-green-50 border border-green-200 text-green-700 cursor-default"
          : state === "error"
          ? "bg-red-50 border border-red-200 text-red-600"
          : "bg-white border border-gray-200 text-[#0F2C5E] hover:bg-[#F8F7F4]"
      }`}
    >
      {state === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
      {state === "sent"    && <CheckCircle className="w-4 h-4" />}
      {state === "idle" || state === "error" ? <Mail className="w-4 h-4" /> : null}
      <span>
        {state === "loading" ? "Envoi…"
        : state === "sent"    ? "Email envoyé !"
        : state === "error"   ? "Erreur, réessayer"
        : `Email : ${label}`}
      </span>
    </button>
  )
}
