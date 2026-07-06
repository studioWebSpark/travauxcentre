"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Send, Save, Mail, MailX } from "lucide-react"
import { STATUTS, formatDate } from "@/lib/crm"
import type { StatutLead } from "@/generated/prisma"

type Lead = { id: string; nom: string; email: string; ville: string; statut: StatutLead; typeTravaux: string }
type Template = { id: string; nom: string; sujet: string; corpsHtml: string }
type Campagne = { id: string; nom: string; sujet: string; createdAt: string | Date; _count: { envois: number } }

const VARIABLES = [
  { key: "nom", label: "Nom" },
  { key: "ville", label: "Ville" },
  { key: "typeTravaux", label: "Type de travaux" },
]

export default function MarketingCampaignBuilder({
  leads, templates, campagnes,
}: { leads: Lead[]; templates: Template[]; campagnes: Campagne[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statutFiltre, setStatutFiltre] = useState<string>("Tous")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const [nomCampagne, setNomCampagne] = useState("")
  const [sujet, setSujet] = useState("")
  const [corps, setCorps] = useState("")
  const [nomTemplate, setNomTemplate] = useState("")

  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ envoyes: number; echecs: number } | null>(null)

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (statutFiltre !== "Tous" && l.statut !== statutFiltre) return false
      if (search && !`${l.nom} ${l.ville}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [leads, search, statutFiltre])

  const selectedWithEmail = leads.filter(l => selected.has(l.id) && l.email)

  function toggle(id: string) {
    setSelected(s => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(s => {
      const allSelected = filteredLeads.every(l => s.has(l.id))
      const next = new Set(s)
      filteredLeads.forEach(l => allSelected ? next.delete(l.id) : next.add(l.id))
      return next
    })
  }

  function insertVar(key: string) {
    setCorps(c => c + `{{${key}}}`)
  }

  function loadTemplate(id: string) {
    const t = templates.find(t => t.id === id)
    if (!t) return
    setSujet(t.sujet)
    setCorps(t.corpsHtml)
    setNomTemplate(t.nom)
  }

  async function saveTemplate() {
    if (!nomTemplate || !sujet || !corps) return
    setSaving(true)
    await fetch("/api/crm/marketing/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: nomTemplate, sujet, corpsHtml: corps }),
    })
    setSaving(false)
    router.refresh()
  }

  async function envoyer() {
    if (!sujet || !corps || selectedWithEmail.length === 0) return
    setSending(true)
    setResult(null)
    const res = await fetch("/api/crm/marketing/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: nomCampagne || sujet,
        sujet,
        corpsHtml: corps,
        leadIds: Array.from(selected),
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setResult({ envoyes: data.envoyes, echecs: data.echecs })
      setSelected(new Set())
      router.refresh()
    }
    setSending(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Sélection des destinataires */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-[#0F2C5E]">Destinataires ({selected.size})</h2>

        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
          <select value={statutFiltre} onChange={e => setStatutFiltre(e.target.value)}
            className="border border-gray-200 rounded-xl px-2 py-2 text-sm bg-white">
            <option value="Tous">Tous statuts</option>
            {Object.entries(STATUTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
          </select>
        </div>

        <button onClick={toggleAll} className="text-xs font-semibold text-[#0F2C5E] underline">
          Tout sélectionner / désélectionner
        </button>

        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-xl">
          {filteredLeads.length === 0 && (
            <p className="text-sm text-gray-400 p-4">Aucun lead ne correspond.</p>
          )}
          {filteredLeads.map(l => (
            <label key={l.id} className="flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer">
              <input type="checkbox" checked={selected.has(l.id)} onChange={() => toggle(l.id)}
                className="w-4 h-4 accent-[#0F2C5E]" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-700 truncate">{l.nom}</p>
                <p className="text-xs text-gray-400 truncate">{l.ville || "—"} · {STATUTS[l.statut].label}</p>
              </div>
              {l.email
                ? <Mail className="w-3.5 h-3.5 text-green-500 shrink-0" />
                : <MailX className="w-3.5 h-3.5 text-red-400 shrink-0" />}
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-400">{selectedWithEmail.length} destinataire{selectedWithEmail.length > 1 ? "s" : ""} avec email valide sur {selected.size} sélectionné{selected.size > 1 ? "s" : ""}</p>
      </div>

      {/* Composition */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-[#0F2C5E]">Composer l'email</h2>

        {templates.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Charger un template</label>
            <select defaultValue="" onChange={e => e.target.value && loadTemplate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
              <option value="">— Choisir un template —</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Nom de la campagne</label>
          <input value={nomCampagne} onChange={e => setNomCampagne(e.target.value)}
            placeholder="Ex : Relance printemps 2026"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sujet</label>
          <input value={sujet} onChange={e => setSujet(e.target.value)}
            placeholder="Ex : {{nom}}, une offre pour votre projet à {{ville}}"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-500">Message</label>
            <div className="flex gap-1">
              {VARIABLES.map(v => (
                <button key={v.key} type="button" onClick={() => insertVar(v.key)}
                  className="text-xs bg-[#F8F7F4] text-[#0F2C5E] font-semibold px-2 py-1 rounded-lg">
                  + {v.label}
                </button>
              ))}
            </div>
          </div>
          <textarea value={corps} onChange={e => setCorps(e.target.value)} rows={10}
            placeholder="Bonjour {{nom}}, ..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none font-mono" />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input value={nomTemplate} onChange={e => setNomTemplate(e.target.value)}
            placeholder="Nom du template à enregistrer"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
          <button onClick={saveTemplate} disabled={saving || !nomTemplate || !sujet || !corps}
            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-semibold px-3 py-2 rounded-xl disabled:opacity-50">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Enregistrer
          </button>
        </div>

        <button onClick={envoyer} disabled={sending || !sujet || !corps || selectedWithEmail.length === 0}
          className="w-full bg-[#0F2C5E] text-white font-bold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? "Envoi…" : `Envoyer à ${selectedWithEmail.length} destinataire${selectedWithEmail.length > 1 ? "s" : ""}`}
        </button>

        {result && (
          <p className="text-sm text-center">
            <span className="text-green-600 font-semibold">{result.envoyes} envoyé{result.envoyes > 1 ? "s" : ""}</span>
            {result.echecs > 0 && <span className="text-red-500 font-semibold"> · {result.echecs} échec{result.echecs > 1 ? "s" : ""}</span>}
          </p>
        )}
      </div>

      {/* Historique */}
      {campagnes.length > 0 && (
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-[#0F2C5E] mb-3">Historique des campagnes</h2>
          <div className="divide-y divide-gray-100">
            {campagnes.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">{c.nom}</p>
                  <p className="text-xs text-gray-400">{c.sujet}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{formatDate(c.createdAt)}</p>
                  <p className="text-xs font-semibold text-[#0F2C5E]">{c._count.envois} envoi{c._count.envois > 1 ? "s" : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
