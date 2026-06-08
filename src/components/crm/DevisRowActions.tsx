"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2, CheckCircle, Eye, FileText, Copy } from "lucide-react"

type Props = {
  devisId:    string
  token:      string
  statut:     string
  emailEnvoye: boolean
  hasEmail:   boolean
}

export default function DevisRowActions({ devisId, token, statut, emailEnvoye, hasEmail }: Props) {
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [copied,  setCopied]  = useState(false)
  const router = useRouter()

  const siteUrl  = typeof window !== "undefined" ? window.location.origin : ""
  const devisUrl = `${siteUrl}/devis/${token}`

  async function sendEmail() {
    setSending(true)
    const res = await fetch(`/api/crm/devis/${devisId}/send`, { method: "POST" })
    if (res.ok) { setSent(true); router.refresh() }
    setSending(false)
  }

  function copyLink() {
    navigator.clipboard.writeText(devisUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  if (statut === "ACCEPTE") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
          <CheckCircle className="w-3.5 h-3.5" /> Accepté
        </span>
        <a href={`/api/crm/devis/${devisId}/pdf`} target="_blank"
          className="inline-flex items-center gap-1 text-xs border border-gray-200 text-[#0F2C5E] px-2.5 py-1.5 rounded-lg ">
          <FileText className="w-3.5 h-3.5" /> PDF
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Bouton principal : Envoyer email */}
      {hasEmail && (
        <button onClick={sendEmail} disabled={sending}
          className={`inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-lg text-xs ${
            sent
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-[#0F2C5E] text-[#1a1a1a] "
          } disabled:opacity-60`}>
          {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
           : sent   ? <CheckCircle className="w-3.5 h-3.5" />
           :           <Send className="w-3.5 h-3.5" />}
          {sending ? "Envoi…" : sent ? "Envoyé !" : emailEnvoye ? "Renvoyer" : "Envoyer"}
        </button>
      )}

      {/* Copier lien */}
      <button onClick={copyLink}
        className="inline-flex items-center gap-1 text-xs border border-gray-200 text-[#0F2C5E] px-2.5 py-1.5 rounded-lg ">
        <Copy className="w-3.5 h-3.5" />
        {copied ? "Copié !" : "Lien"}
      </button>

      {/* Voir sur place */}
      <a href={devisUrl} target="_blank"
        className="inline-flex items-center gap-1 text-xs border border-gray-200 text-[#0F2C5E] px-2.5 py-1.5 rounded-lg ">
        <Eye className="w-3.5 h-3.5" /> Voir
      </a>

      {/* PDF */}
      <a href={`/api/crm/devis/${devisId}/pdf`} target="_blank"
        className="inline-flex items-center gap-1 text-xs border border-gray-200 text-[#0F2C5E] px-2.5 py-1.5 rounded-lg ">
        <FileText className="w-3.5 h-3.5" /> PDF
      </a>
    </div>
  )
}
