"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2, CheckCircle, ExternalLink, Copy } from "lucide-react"

type Props = { devisId: string; statut: string; token: string; emailEnvoye: boolean }

export default function DevisActions({ devisId, statut, token, emailEnvoye }: Props) {
  const [sending, setSending]   = useState(false)
  const [sent,    setSent]      = useState(emailEnvoye)
  const [copied,  setCopied]    = useState(false)
  const router                  = useRouter()

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
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
        <span className="text-green-700 text-sm font-semibold">Devis accepté par le client ✓</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Envoyer par email */}
      <button onClick={sendEmail} disabled={sending}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-xl text-sm transition-colors ${
          sent
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-[#0F2C5E] text-white hover:bg-[#1a3f7a]"
        } disabled:opacity-60`}>
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : sent ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        {sending ? "Envoi…" : sent ? "Email envoyé — Renvoyer ?" : "Envoyer par email + PDF"}
      </button>

      {/* Lien partager pour présentation sur place */}
      <div className="flex gap-2">
        <button onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-[#0F2C5E] font-semibold py-2.5 rounded-xl text-xs hover:bg-gray-50 transition-colors">
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Lien copié !" : "Copier le lien"}
        </button>
        <a href={devisUrl} target="_blank"
          className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-[#0F2C5E] font-semibold py-2.5 rounded-xl text-xs hover:bg-gray-50 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          Voir (sur place)
        </a>
      </div>
      <p className="text-xs text-gray-400 text-center">
        Montrez ce lien au client sur votre écran pour validation immédiate
      </p>
    </div>
  )
}
