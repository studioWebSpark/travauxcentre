"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Loader2, X, Zap } from "lucide-react"
import { Suspense } from "react"

function CaptureForm() {
  const sp     = useSearchParams()
  const router = useRouter()

  const [titre,       setTitre]       = useState(sp.get("titre")       ?? "")
  const [description, setDescription] = useState(sp.get("description") ?? "")
  const [url,         setUrl]         = useState(sp.get("url")         ?? "")
  const [ville,       setVille]       = useState(sp.get("ville")       ?? "")
  const [source,      setSource]      = useState(sp.get("source")      ?? "manuel")
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState<{ score: number } | null>(null)

  async function save() {
    setSaving(true)
    const res = await fetch("/api/crm/veille/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre, description, url, ville, source }),
    })
    const data = await res.json()
    if (data.success || data.duplicate) {
      setSaved({ score: data.score ?? 0 })
    }
    setSaving(false)
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-[#0F2C5E] mb-2">Annonce capturée !</h2>
          <p className="text-gray-500 text-sm mb-2">Score IA : <strong className="text-[#F97316]">{saved.score}/100</strong></p>
          <p className="text-gray-400 text-xs mb-8">Vous pouvez fermer cet onglet</p>
          <button onClick={() => router.push("/crm/veille")}
            className="bg-[#0F2C5E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors text-sm">
            Voir dans la Veille →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <span className="text-2xl font-bold text-[#0F2C5E]">
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
          <p className="text-gray-400 text-sm mt-1">Capture d&apos;annonce</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#F97316]" />
            <p className="text-sm font-semibold text-[#0F2C5E]">Vérifiez et enregistrez</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
            <select value={source} onChange={e => setSource(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
              <option value="leboncoin">LeBonCoin</option>
              <option value="facebook">Facebook</option>
              <option value="vivastreet">Vivastreet</option>
              <option value="allovoisin">AlloVoisin</option>
              <option value="manuel">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Titre de l&apos;annonce *</label>
            <input value={titre} onChange={e => setTitre(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Ville</label>
              <input value={ville} onChange={e => setVille(e.target.value)}
                placeholder="Ex: Saint-Omer"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">URL annonce</label>
              <input value={url} onChange={e => setUrl(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving || !titre}
              className="flex-1 bg-[#0F2C5E] text-white font-bold py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {saving ? "Analyse IA…" : "Enregistrer"}
            </button>
            <button onClick={() => window.close()}
              className="px-4 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CapturePage() {
  return (
    <Suspense>
      <CaptureForm />
    </Suspense>
  )
}
