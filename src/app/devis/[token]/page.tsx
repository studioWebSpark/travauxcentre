"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2, FileText, MapPin, Phone, Mail, Calendar } from "lucide-react"

type Ligne = { description: string; quantite: number; unite: string; prixUnitaire: number }
type DevisData = {
  id: string; numero: string; statut: string; token: string
  dateEmission: string; dateValidite: string | null; tva: number; notes: string | null
  lignes: Ligne[]
  lead: { nom: string; email: string; telephone: string; ville: string; codePostal: string } | null
  chantier: { titre: string; adresse: string } | null
}

const fmt     = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)
const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : null

export default function DevisPublicPage() {
  const { token }     = useParams<{ token: string }>()
  const [data, setData] = useState<DevisData | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "accepting" | "accepted" | "already" | "error">("loading")

  useEffect(() => {
    fetch(`/api/public/devis/${token}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setState(d.statut === "ACCEPTE" ? "already" : d.error ? "error" : "ready")
      })
      .catch(() => setState("error"))
  }, [token])

  async function accepter() {
    if (!data) return
    setState("accepting")
    const res = await fetch(`/api/public/devis/${token}`, { method: "POST" })
    const json = await res.json()
    setState(json.success || json.alreadyAccepted ? "accepted" : "error")
  }

  const ht  = data?.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0) ?? 0
  const tvaAmt = ht * (data?.tva ?? 0.2)
  const ttc = ht + tvaAmt

  if (state === "loading") return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#0F2C5E]" />
    </div>
  )

  if (state === "error") return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center px-4">
      <div className="text-center">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-gray-600">Ce devis est introuvable ou le lien est expiré.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F4F5F7] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-[#0F2C5E]">
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
          <p className="text-gray-500 text-sm mt-1">Longuenesse (62219) — 03 XX XX XX XX</p>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* En-tête devis */}
          <div className="bg-[#0F2C5E] px-8 py-6 flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Devis</p>
              <h1 className="text-2xl font-bold text-white">{data?.numero}</h1>
              <p className="text-slate-400 text-sm mt-1">Émis le {fmtDate(data?.dateEmission ?? null)}</p>
              {data?.dateValidite && (
                <p className="text-amber-300 text-xs mt-0.5">Valable jusqu'au {fmtDate(data.dateValidite)}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs mb-1">Total TTC</p>
              <p className="text-3xl font-bold text-[#F97316]">{fmt(ttc)}</p>
            </div>
          </div>

          <div className="p-8">
            {/* Statut */}
            {(state === "accepted" || state === "already") && (
              <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                <div>
                  <p className="font-semibold text-green-700">Devis accepté !</p>
                  <p className="text-green-600 text-sm">Nous vous contacterons prochainement pour démarrer les travaux.</p>
                </div>
              </div>
            )}

            {/* Infos client & chantier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {data?.lead && (
                <div className="bg-[#F8F7F4] rounded-2xl p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Client</p>
                  <p className="font-bold text-[#0F2C5E] text-lg mb-2">{data.lead.nom}</p>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" />{data.lead.email}</div>
                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" />{data.lead.telephone}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" />{data.lead.ville} ({data.lead.codePostal})</div>
                  </div>
                </div>
              )}
              {data?.chantier && (
                <div className="bg-[#F8F7F4] rounded-2xl p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Chantier</p>
                  <p className="font-bold text-[#0F2C5E] text-base mb-2">{data.chantier.titre}</p>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <span>{data.chantier.adresse}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Table des lignes */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Détail des prestations</p>
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 gap-2 bg-[#0F2C5E] px-5 py-3 text-xs font-semibold text-white">
                  <span className="col-span-6">Description</span>
                  <span className="col-span-2 text-center">Qté</span>
                  <span className="col-span-2 text-center">Unité</span>
                  <span className="col-span-2 text-right">Total HT</span>
                </div>
                {data?.lignes.map((l, i) => (
                  <div key={i} className={`grid grid-cols-12 gap-2 px-5 py-3.5 text-sm border-t border-gray-50 ${i % 2 === 1 ? "bg-[#FAFAFA]" : ""}`}>
                    <span className="col-span-6 text-gray-700">{l.description}</span>
                    <span className="col-span-2 text-center text-gray-500">{l.quantite}</span>
                    <span className="col-span-2 text-center text-gray-500">{l.unite}</span>
                    <span className="col-span-2 text-right font-semibold text-[#0F2C5E]">{fmt(l.quantite * l.prixUnitaire)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totaux */}
            <div className="flex flex-col items-end gap-2 mb-8">
              <div className="flex justify-between w-56 text-sm text-gray-500">
                <span>Total HT</span><span className="font-medium">{fmt(ht)}</span>
              </div>
              <div className="flex justify-between w-56 text-sm text-gray-500">
                <span>TVA ({((data?.tva ?? 0.2) * 100).toFixed(0)}%)</span><span>{fmt(tvaAmt)}</span>
              </div>
              <div className="flex justify-between w-56 bg-[#0F2C5E] text-white rounded-xl px-4 py-2.5">
                <span className="font-semibold">Total TTC</span>
                <span className="font-bold text-[#F97316]">{fmt(ttc)}</span>
              </div>
            </div>

            {/* Notes */}
            {data?.notes && (
              <div className="bg-[#F8F7F4] rounded-2xl p-5 mb-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Conditions</p>
                <p className="text-sm text-gray-600 leading-relaxed">{data.notes}</p>
              </div>
            )}

            {/* CTA */}
            {state === "ready" && (
              <div className="space-y-3">
                <button onClick={accepter}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-colors text-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  ✅ J'accepte ce devis
                </button>
                <a href={`/api/crm/devis/${data?.id}/pdf`} target="_blank"
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-[#0F2C5E] font-semibold py-3 rounded-2xl hover:bg-[#F8F7F4] transition-colors text-sm">
                  <FileText className="w-4 h-4" /> Télécharger le PDF
                </a>
                <p className="text-center text-xs text-gray-400">
                  Des questions ? Appelez-nous : <a href="tel:+33300000000" className="text-[#0F2C5E] font-semibold">03 XX XX XX XX</a>
                </p>
              </div>
            )}

            {state === "accepting" && (
              <div className="text-center py-6">
                <Loader2 className="w-8 h-8 animate-spin text-[#0F2C5E] mx-auto" />
                <p className="text-gray-500 text-sm mt-2">Validation en cours…</p>
              </div>
            )}

            {(state === "accepted" || state === "already") && (
              <a href={`/api/crm/devis/${data?.id}/pdf`} target="_blank"
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-[#0F2C5E] font-semibold py-3 rounded-2xl hover:bg-[#F8F7F4] transition-colors text-sm">
                <FileText className="w-4 h-4" /> Télécharger mon devis (PDF)
              </a>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Travaux Centre — Longuenesse 62219 — Garantie décennale — Artisans certifiés RGE
        </p>
      </div>
    </div>
  )
}
