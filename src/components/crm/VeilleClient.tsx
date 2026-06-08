"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, Plus, ExternalLink, CheckCircle, X, Zap, Bookmark } from "lucide-react"

type Annonce = {
  id: string; source: string; titre: string; description: string
  url: string | null; ville: string | null; score: number
  resume: string | null; typeTravaux: string | null; budgetEstime: string | null
  statut: string; createdAt: Date
}

type Stats = { total: number; nouveau: number; importe: number; ignore: number }

const SOURCE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  leboncoin:  { label: "🟠 LeBonCoin",   color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  vivastreet: { label: "🟣 Vivastreet",  color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  allovoisin: { label: "👥 AlloVoisin",  color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  facebook:   { label: "🔵 Facebook",    color: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  manuel:     { label: "✏️ Manuel",      color: "text-gray-700",   bg: "bg-gray-50 border-gray-200" },
}

// URL directe vers une annonce (pas juste la homepage)
function isDirectUrl(url: string | null): boolean {
  if (!url) return false
  const homepages = ["https://www.allovoisin.com","https://www.vivastreet.com","https://www.leboncoin.fr"]
  return !homepages.some(h => url === h || url === h + "/")
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-gray-400"
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className={`text-xs font-bold ${score >= 75 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-gray-500"}`}>
        {score}/100
      </span>
    </div>
  )
}

export default function VeilleClient({ annonces: initial, stats }: { annonces: Annonce[]; stats: Stats }) {
  const [annonces, setAnnonces]   = useState(initial)
  const [scanning,  setScanning]  = useState(false)
  const [scanResult, setScanResult] = useState<{ saved: number; tops: number } | null>(null)
  const [importing, setImporting] = useState<string | null>(null)
  const [ignoring,  setIgnoring]  = useState<string | null>(null)
  // Facebook paste
  const [showPaste, setShowPaste] = useState(false)
  const [pasteForm, setPasteForm] = useState({ source: "facebook", titre: "", description: "", ville: "" })
  const [pasting,   setPasting]   = useState(false)
  const router = useRouter()

  async function scan() {
    setScanning(true); setScanResult(null)
    const res  = await fetch("/api/crm/veille", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
    const data = await res.json()
    setScanResult(data)
    setScanning(false)
    router.refresh()
  }

  async function importer(id: string) {
    setImporting(id)
    const res = await fetch(`/api/crm/veille/${id}`, { method: "POST" })
    const data = await res.json()
    if (data.leadId) router.push(`/crm/leads/${data.leadId}`)
    setImporting(null)
  }

  async function ignorer(id: string) {
    setIgnoring(id)
    await fetch(`/api/crm/veille/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "IGNORE" }),
    })
    setAnnonces(a => a.filter(x => x.id !== id))
    setIgnoring(null)
  }

  async function submitPaste(e: React.FormEvent) {
    e.preventDefault(); setPasting(true)
    const res = await fetch("/api/crm/veille", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manuel: true, ...pasteForm }),
    })
    const data = await res.json()
    if (data.annonces?.[0]) setAnnonces(a => [data.annonces[0], ...a])
    setPasteForm({ source: "facebook", titre: "", description: "", ville: "" })
    setShowPaste(false); setPasting(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C5E]">Veille marché</h1>
          <p className="text-gray-500 text-sm mt-0.5">Agent IA — LeBonCoin · Habitissimo · Quotatis · Travaux.com · Hellocasa · AlloVoisin</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="/crm/veille/bookmarklet"
            className="inline-flex items-center gap-2 border border-gray-200 text-[#0F2C5E] font-semibold px-4 py-2.5 rounded-xl text-sm">
            <Bookmark className="w-4 h-4" /> Bookmarklet
          </a>
          <button onClick={() => setShowPaste(true)}
            className="inline-flex items-center gap-2 border border-gray-200 text-[#0F2C5E] font-semibold px-4 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> Coller une annonce
          </button>
          <button onClick={scan} disabled={scanning}
            className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-4 py-2.5 rounded-xl text-sm disabled:opacity-60">
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {scanning ? "Scan en cours…" : "Scanner maintenant"}
          </button>
        </div>
      </div>

      {/* Résultat scan */}
      {scanResult && (
        <div className={`rounded-2xl border px-5 py-4 flex items-center gap-3 ${scanResult.saved > 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
          <Zap className={`w-5 h-5 ${scanResult.saved > 0 ? "text-green-500" : "text-gray-400"}`} />
          <div>
            <p className="font-semibold text-sm">
              {scanResult.saved > 0
                ? `✅ ${scanResult.saved} nouvelle${scanResult.saved > 1 ? "s" : ""} annonce${scanResult.saved > 1 ? "s" : ""} trouvée${scanResult.saved > 1 ? "s" : ""}`
                : "Aucune nouvelle annonce — tout est déjà à jour"}
            </p>
            {scanResult.tops > 0 && (
              <p className="text-xs text-green-600 mt-0.5">🔔 {scanResult.tops} à fort potentiel — email envoyé !</p>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total trouvées", value: stats.total,   color: "text-[#0F2C5E]", bg: "bg-blue-50" },
          { label: "À traiter",      value: stats.nouveau, color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "Importées",      value: stats.importe, color: "text-green-600",  bg: "bg-green-50" },
          { label: "Ignorées",       value: stats.ignore,  color: "text-gray-500",   bg: "bg-gray-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Liste annonces */}
      {annonces.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16">
          <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">Aucune annonce — lancez un scan pour démarrer</p>
          <button onClick={scan} disabled={scanning}
            className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-5 py-3 rounded-xl text-sm">
            <Search className="w-4 h-4" /> Lancer le premier scan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {annonces.map((a) => {
            const src = SOURCE_BADGE[a.source] ?? SOURCE_BADGE.manuel
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${src.bg} ${src.color}`}>
                        {src.label}
                      </span>
                      <ScoreBadge score={a.score} />
                      {a.ville && <span className="text-xs text-gray-400">📍 {a.ville}</span>}
                      {a.typeTravaux && <span className="text-xs text-gray-400">🔧 {a.typeTravaux}</span>}
                    </div>
                    <h3 className="font-bold text-[#0F2C5E] mb-1 leading-snug">{a.titre}</h3>
                    {a.resume && <p className="text-sm text-gray-600 mb-1">{a.resume}</p>}
                    {a.budgetEstime && <p className="text-xs text-[#F97316] font-semibold">💰 {a.budgetEstime}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => importer(a.id)} disabled={importing === a.id}
                      className="inline-flex items-center gap-1.5 bg-green-600 text-[#1a1a1a] font-semibold px-3 py-1.5 rounded-lg text-xs disabled:opacity-60">
                      {importing === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Importer lead
                    </button>
                    {isDirectUrl(a.url) && (
                      <a href={a.url!} target="_blank"
                        className="inline-flex items-center gap-1.5 border border-gray-200 text-[#0F2C5E] font-semibold px-3 py-1.5 rounded-lg text-xs ">
                        <ExternalLink className="w-3.5 h-3.5" /> Voir l&apos;annonce
                      </a>
                    )}
                    <button onClick={() => ignorer(a.id)} disabled={ignoring === a.id}
                      className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-400 font-semibold px-3 py-1.5 rounded-lg text-xs disabled:opacity-60">
                      <X className="w-3.5 h-3.5" /> Ignorer
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal paste Facebook / AlloVoisin manuel */}
      {showPaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaste(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#0F2C5E]">Coller une annonce</h2>
              <button onClick={() => setShowPaste(false)} className="text-gray-400 ">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitPaste} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
                <select value={pasteForm.source} onChange={e => setPasteForm(f => ({ ...f, source: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white">
                  <option value="facebook">Facebook</option>
                  <option value="allovoisin">AlloVoisin</option>
                  <option value="manuel">Autre source</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Titre de l&apos;annonce</label>
                <input value={pasteForm.titre} onChange={e => setPasteForm(f => ({ ...f, titre: e.target.value }))} required
                  placeholder="Ex: Recherche peintre pour rénovation salon"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Colle le texte complet de l&apos;annonce</label>
                <textarea value={pasteForm.description} onChange={e => setPasteForm(f => ({ ...f, description: e.target.value }))}
                  required rows={5} placeholder="Colle ici tout le texte de l'annonce Facebook…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Ville (si connue)</label>
                <input value={pasteForm.ville} onChange={e => setPasteForm(f => ({ ...f, ville: e.target.value }))}
                  placeholder="Ex: Saint-Omer"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={pasting}
                  className="flex-1 bg-[#0F2C5E] text-white font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
                  {pasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {pasting ? "Analyse IA en cours…" : "Analyser avec l'IA"}
                </button>
                <button type="button" onClick={() => setShowPaste(false)}
                  className="px-5 border border-gray-200 text-gray-500 font-semibold rounded-xl ">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
