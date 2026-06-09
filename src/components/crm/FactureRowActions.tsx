"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2, CheckCircle, FileText, Eye } from "lucide-react"

type Props = {
  factureId:   string
  statut:      string
  emailEnvoye: boolean
  hasEmail:    boolean
}

export default function FactureRowActions({ factureId, statut, emailEnvoye, hasEmail }: Props) {
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(emailEnvoye)
  const [marking,  setMarking]  = useState(false)
  const [marked,   setMarked]   = useState(false)
  const router = useRouter()

  async function sendEmail() {
    setSending(true)
    const res = await fetch(`/api/crm/factures/${factureId}/send`, { method: "POST" })
    if (res.ok) { setSent(true); router.refresh() }
    setSending(false)
  }

  async function markAsPaid() {
    setMarking(true)
    const res = await fetch(`/api/crm/factures/${factureId}/payer`, { method: "POST" })
    if (res.ok) { setMarked(true); router.refresh() }
    setMarking(false)
  }

  if (statut === "PAYEE") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
          <CheckCircle className="w-3.5 h-3.5" /> Payée
        </span>
        {hasEmail && (
          <button onClick={sendEmail} disabled={sending}
            className={`inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-lg text-xs ${
              sent
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-green-600 text-white"
            } disabled:opacity-60`}>
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
             : sent   ? <CheckCircle className="w-3.5 h-3.5" />
             :           <Send className="w-3.5 h-3.5" />}
            {sending ? "Envoi…" : sent ? "Acquitté envoyé ✓" : "Envoyer acquittée"}
          </button>
        )}
        <a href={`/api/crm/factures/${factureId}/pdf`} target="_blank"
          className="inline-flex items-center gap-1 text-xs border border-gray-200 text-[#0F2C5E] px-2.5 py-1.5 rounded-lg">
          <FileText className="w-3.5 h-3.5" /> PDF
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Envoyer email */}
      {hasEmail && (
        <button onClick={sendEmail} disabled={sending}
          className={`inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-lg text-xs ${
            sent
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-amber-500 text-[#1a1a1a] "
          } disabled:opacity-60`}>
          {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
           : sent   ? <CheckCircle className="w-3.5 h-3.5" />
           :           <Send className="w-3.5 h-3.5" />}
          {sending ? "Envoi…" : sent ? "Envoyé !" : "Email"}
        </button>
      )}

      {/* Marquer comme payée */}
      <button onClick={markAsPaid} disabled={marking}
        className={`inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-lg text-xs ${
          marked
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-green-600 text-[#1a1a1a] "
        } disabled:opacity-60`}>
        {marking ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
         : marked ? <CheckCircle className="w-3.5 h-3.5" />
         :          <CheckCircle className="w-3.5 h-3.5" />}
        {marking ? "Marquage…" : marked ? "Payée ✓" : "Marquer payée"}
      </button>

      {/* PDF */}
      <a href={`/api/crm/factures/${factureId}/pdf`} target="_blank"
        className="inline-flex items-center gap-1 text-xs border border-gray-200 text-[#0F2C5E] px-2.5 py-1.5 rounded-lg ">
        <FileText className="w-3.5 h-3.5" /> PDF
      </a>
    </div>
  )
}
