"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Loader2, X, Zap, UserPlus, ArrowRight } from "lucide-react"

function CaptureForm() {
  const sp     = useSearchParams()
  const router = useRouter()

  const [titre,       setTitre]       = useState(sp.get("titre")       ?? "")
  const [description, setDescription] = useState(sp.get("description") ?? "")
  const [url,         setUrl]         = useState(sp.get("url")         ?? "")
  const [ville,       setVille]       = useState(sp.get("ville")       ?? "")
  const [prix,        setPrix]        = useState(sp.get("prix")        ?? "")
  const [source,      setSource]      = useState(sp.get("source")      ?? "manuel")

  // Mode import lead direct
  const [mode,      setMode]    = useState<"capture"|"lead">("capture")
  const [nom,       setNom]     = useState("")
  const [telephone, setTelephone] = useState("")
  const [email,     setEmail]   = useState("")

  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ score?: number; leadId?: string; duplicate?: boolean } | null>(null)

  async function saveAnnonce() {
    setSaving(true)
    const res = await fetch("/api/crm/veille/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre, description, url, ville, prix, source }),
    })
    const data = await res.json()
    setResult(data)
    setSaving(false)
  }

  async function saveLead() {
    setSaving(true)
    // D'abord sauvegarder l'annonce dans la veille
    const res1 = await fetch("/api/crm/veille/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre, description, url, ville, prix, source }),
    })
    const annonce = await res1.json()

    // Ensuite créer le lead directement
    const res2 = await fetch("/api/crm/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom:         nom || `Prospect (${source})`,
        email:       email || "",
        telephone:   telephone || "",
        ville:       ville || "",
        codePostal:  "",
        typeTravaux: titre.slice(0, 80),
        description: description,
        budget:      prix || null,
        source,
        priorite:    "NORMALE",
      }),
    })
    const lead = await res2.json()
    if (lead.id) {
      // Lier l'annonce au lead si créée
      if (annonce.id) {
        await fetch(`/api/crm/veille/${annonce.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut: "IMPORTE", leadId: lead.id }),
        }).catch(() => null)
      }
      setResult({ leadId: lead.id })
    }
    setSaving(false)
  }

  // Écran de succès
  if (result) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          {result.leadId ? (
            <>
              <h2 className="text-xl font-bold text-[#0F2C5E] mb-2">Lead créé !</h2>
              <p className="text-gray-500 text-sm mb-8">La fiche lead est prête dans votre CRM.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { router.push(`/crm/leads/${result.leadId}`); window.close() }}
                  className="bg-[#0F2C5E] text-[#1a1a1a] font-semibold px-6 py-3 rounded-xl text-sm">
                  Ouvrir la fiche lead →
                </button>
                <button onClick={() => window.close()}
                  className="border border-gray-200 text-gray-500 font-semibold px-6 py-3 rounded-xl text-sm">
                  Fermer
                </button>
              </div>
            </>
          ) : result.duplicate ? (
            <>
              <h2 className="text-xl font-bold text-[#0F2C5E] mb-2">Déjà dans la Veille !</h2>
              <p className="text-gray-500 text-sm mb-8">Cette annonce est déjà enregistrée.</p>
              <button onClick={() => window.close()}
                className="bg-[#0F2C5E] text-[#1a1a1a] font-semibold px-6 py-3 rounded-xl text-sm">Fermer</button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#0F2C5E] mb-2">Annonce capturée !</h2>
              {result.score !== undefined && (
                <p className="text-gray-500 text-sm mb-2">Score IA : <strong className="text-[#F97316]">{result.score}/100</strong></p>
              )}
              <p className="text-gray-400 text-xs mb-8">Visible dans Veille → CRM</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { router.push("/crm/veille"); window.close() }}
                  className="bg-[#0F2C5E] text-[#1a1a1a] font-semibold px-6 py-3 rounded-xl text-sm">
                  Voir dans la Veille →
                </button>
                <button onClick={() => window.close()}
                  className="border border-gray-200 text-gray-500 font-semibold px-6 py-3 rounded-xl text-sm ">
                  Fermer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] py-6 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-5">
          <span className="text-2xl font-bold text-[#0F2C5E]">
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
          <p className="text-gray-400 text-xs mt-1">Capture d&apos;annonce</p>
        </div>

        {/* Onglets mode */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode("capture")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border ${
              mode === "capture" ? "bg-[#0F2C5E] text-[#1a1a1a] border-[#0F2C5E]" : "border-gray-200 text-gray-600 bg-white "
            }`}>
            Enregistrer dans Veille
          </button>
          <button onClick={() => setMode("lead")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border ${
              mode === "lead" ? "bg-[#F97316] text-[#1a1a1a] border-[#F97316]" : "border-gray-200 text-gray-600 bg-white "
            }`}>
            Créer un Lead directement
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">

          {/* Champs annonce */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
            <select value={source} onChange={e => setSource(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
              <option value="leboncoin">🟠 LeBonCoin</option>
              <option value="facebook">🔵 Facebook</option>
              <option value="vivastreet">🟣 Vivastreet</option>
              <option value="allovoisin">👥 AlloVoisin</option>
              <option value="manuel">✏️ Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Titre de l&apos;annonce *</label>
            <input value={titre} onChange={e => setTitre(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Ville</label>
              <input value={ville} onChange={e => setVille(e.target.value)}
                placeholder="Ex: Saint-Omer"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Budget / Prix</label>
              <input value={prix} onChange={e => setPrix(e.target.value)}
                placeholder="Ex: 5000 €"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">URL de l&apos;annonce</label>
            <input value={url} onChange={e => setUrl(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] font-mono text-xs" />
          </div>

          {/* Champs lead (mode=lead seulement) */}
          {mode === "lead" && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-xs font-semibold text-[#F97316] flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Informations du client (lead)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nom / Pseudo</label>
                  <input value={nom} onChange={e => setNom(e.target.value)}
                    placeholder="Ex: Dupont Jean ou laisser vide"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
                  <input value={telephone} onChange={e => setTelephone(e.target.value)}
                    placeholder="06 XX XX XX XX"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="email@exemple.fr"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]" />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                💡 Ces infos sont souvent dans l&apos;annonce ou après avoir contacté le particulier
              </p>
            </div>
          )}

          {/* Bouton action */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={mode === "lead" ? saveLead : saveAnnonce}
              disabled={saving || !titre}
              className={`flex-1 font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 ${
                mode === "lead"
                  ? "bg-[#F97316] text-[#1a1a1a] "
                  : "bg-[#0F2C5E] text-[#1a1a1a] "
              }`}>
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Traitement…</>
                : mode === "lead"
                  ? <><UserPlus className="w-4 h-4" /> Créer le lead</>
                  : <><Zap className="w-4 h-4" /> Enregistrer dans Veille</>
              }
            </button>
            <button onClick={() => window.close()}
              className="px-4 border border-gray-200 text-gray-500 rounded-xl ">
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
