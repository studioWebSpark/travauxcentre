"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2, CheckCircle, Eye, FileText, Copy } from "lucide-react"

type Props = {
  devisId:    string
  token:      string
  statut:     string
  emailEnvoye: boolean
  hasEmail:   boolean
  factureId?: string
}

export default function DevisRowActions({ devisId, token, statut, emailEnvoye, hasEmail, factureId }: Props) {
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [copied,  setCopied]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [devisUrl, setDevisUrl] = useState(`/devis/${token}`)
  const router = useRouter()

  useEffect(() => {
    setDevisUrl(`${window.location.origin}/devis/${token}`)
  }, [token])

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

  async function creerFacture() {
    setLoading(true)
    const res = await fetch(`/api/crm/devis/${devisId}/facturer`, { method: "POST" })
    const data = await res.json()
    if (res.ok) router.refresh()
    setLoading(false)
  }

  if (statut === "FACTUREE") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-semibold">
          <CheckCircle className="w-3.5 h-3.5" /> Facturé
        </span>
        {factureId && (
          <a href={`/api/crm/factures/${factureId}/pdf`} target="_blank"
            className="inline-flex items-center gap-1 text-xs border border-gray-200 text-[#0F2C5E] px-2.5 py-1.5 rounded-lg ">
            <FileText className="w-3.5 h-3.5" /> Facture
          </a>
        )}
        <a href={`/api/crm/devis/${devisId}/pdf`} target="_blank"
          className="inline-flex items-center gap-1 text-xs border border-gray-200 text-[#0F2C5E] px-2.5 py-1.5 rounded-lg ">
          <FileText className="w-3.5 h-3.5" /> Devis
        </a>
      </div>
    )
  }

  if (statut === "ACCEPTE") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
          <CheckCircle className="w-3.5 h-3.5" /> Accepté
        </span>
        <button onClick={creerFacture} disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs bg-[#F97316] text-white font-semibold px-3 py-1.5 rounded-lg disabled:opacity-60">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          {loading ? "Création…" : "Créer la facture"}
        </button>
        <a href={`/api/crm/devis/${devisId}/pdf`} target="_blank"
          className="inline-flex items-center gap-1 text-xs border border-gray-200 text-[#0F2C5E] px-2.5 py-1.5 rounded-lg">
          <FileText className="w-3.5 h-3.5" /> Devis PDF
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
              : "bg-[#0F2C5E] text-white "
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
