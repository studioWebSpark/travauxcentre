import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { STATUTS_CHANTIER, STATUTS_ETAPE, STATUTS_DEVIS, STATUTS_FACTURE, formatEuro, calcTotaux } from "@/lib/chantier"
import ChantierActions from "@/components/crm/ChantierActions"
import PhotoUpload from "@/components/crm/PhotoUpload"
import NoteChantierForm from "@/components/crm/NoteChantierForm"
import EtapesList from "@/components/crm/EtapesList"
import { ArrowLeft, MapPin, Calendar, Euro, Phone, Mail, FileText, Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = { title: "Chantier" }
export const dynamic = "force-dynamic"

export default async function ChantierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const c = await prisma.chantierCrm.findUnique({
    where: { id },
    include: {
      lead:     { select: { id: true, nom: true, email: true, telephone: true, typeTravaux: true } },
      etapes:   { orderBy: { ordre: "asc" } },
      photos:   { orderBy: { createdAt: "asc" } },
      notes:    { orderBy: { createdAt: "desc" } },
      devis:    { include: { lignes: true }, orderBy: { createdAt: "desc" } },
      factures: { include: { lignes: true }, orderBy: { createdAt: "desc" } },
    },
  })
  if (!c) notFound()

  const st       = STATUTS_CHANTIER[c.statut]
  const photosAvant   = c.photos.filter((p) => p.categorie === "AVANT")
  const photosPendant = c.photos.filter((p) => p.categorie === "PENDANT")
  const photosApres   = c.photos.filter((p) => p.categorie === "APRES")

  const fmtDate = (d: Date | null) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—"

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/crm/chantiers" className="inline-flex items-center gap-1 text-gray-400 hover:text-[#0F2C5E] text-sm mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour aux chantiers
          </Link>
          <h1 className="text-2xl font-bold text-[#0F2C5E]">{c.titre}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
            <div className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3" />{c.adresse}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/crm/devis/new?chantierId=${c.id}`}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#0F2C5E] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4" /> Nouveau devis
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">

          {/* Progression */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[#0F2C5E]">Avancement global</h2>
              <span className="text-2xl font-bold text-[#0F2C5E]">{c.progression}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full transition-all bg-gradient-to-r from-[#0F2C5E] to-[#F97316]"
                style={{ width: `${c.progression}%` }} />
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: "Budget estimé", value: formatEuro(c.budget) },
                { label: "Coût réel",     value: formatEuro(c.budgetReel) },
                { label: "Début",         value: fmtDate(c.dateDebut) },
                { label: "Fin prévue",    value: fmtDate(c.dateFin) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#F8F7F4] rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-bold text-[#0F2C5E]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Étapes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Étapes du chantier</h2>
            <EtapesList chantierId={c.id} etapes={c.etapes.map((e) => ({
              id: e.id, titre: e.titre, description: e.description, statut: e.statut,
              dateEcheance: e.dateEcheance?.toISOString() ?? null, ordre: e.ordre,
            }))} />
          </div>

          {/* Photos avant/pendant/après */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-5">Photos</h2>
            {[
              { label: "Avant", icon: "📸", photos: photosAvant,   categorie: "AVANT" },
              { label: "Pendant", icon: "🔨", photos: photosPendant, categorie: "PENDANT" },
              { label: "Après", icon: "✨", photos: photosApres,   categorie: "APRES" },
            ].map(({ label, icon, photos, categorie }) => (
              <div key={categorie} className="mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-3">{icon} {label} ({photos.length})</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {photos.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div key={p.id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <img src={p.url} alt={p.description ?? ""} className="w-full h-full object-cover" />
                      {p.description && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs p-1 text-center truncate">
                          {p.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <PhotoUpload chantierId={c.id} categorie={categorie} />
              </div>
            ))}
          </div>

          {/* Devis & Factures */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0F2C5E]">Devis & Factures</h2>
              <Link href={`/crm/devis/new?chantierId=${c.id}`}
                className="text-xs text-[#0F2C5E] hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Nouveau devis
              </Link>
            </div>

            {c.devis.length === 0 && c.factures.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucun document pour ce chantier</p>
            ) : (
              <div className="space-y-2">
                {c.devis.map((d) => {
                  const st  = STATUTS_DEVIS[d.statut]
                  const tot = calcTotaux(d.lignes, d.tva)
                  return (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-[#F8F7F4] rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-[#0F2C5E]">{d.numero}</p>
                        <p className="text-xs text-gray-400">{d.lignes.length} ligne{d.lignes.length > 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#0F2C5E]">{formatEuro(tot.ttc)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
                        <a href={`/api/crm/devis/${d.id}/pdf`} target="_blank"
                          className="text-xs bg-[#0F2C5E] text-white px-2.5 py-1 rounded-lg hover:bg-[#1a3f7a] transition-colors">
                          PDF
                        </a>
                      </div>
                    </div>
                  )
                })}
                {c.factures.map((f) => {
                  const st  = STATUTS_FACTURE[f.statut]
                  const tot = calcTotaux(f.lignes, f.tva)
                  return (
                    <div key={f.id} className="flex items-center justify-between p-3 bg-green-50/50 rounded-xl border border-green-100">
                      <div>
                        <p className="text-sm font-semibold text-[#0F2C5E]">{f.numero}</p>
                        <p className="text-xs text-gray-400">{f.type} · {f.lignes.length} ligne{f.lignes.length > 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-green-600">{formatEuro(tot.ttc)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
                        <a href={`/api/crm/factures/${f.id}/pdf`} target="_blank"
                          className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition-colors">
                          PDF
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Notes du chantier</h2>
            <NoteChantierForm chantierId={c.id} />
            {c.notes.length > 0 && (
              <div className="mt-4 space-y-3">
                {c.notes.map((n) => (
                  <div key={n.id} className="flex gap-3">
                    <div className="w-7 h-7 bg-[#0F2C5E] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {n.auteur[0]}
                    </div>
                    <div className="flex-1 bg-[#F8F7F4] rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#0F2C5E]">{n.auteur}</span>
                        <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <p className="text-sm text-gray-700">{n.contenu}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Gestion</h2>
            <ChantierActions chantier={{
              id: c.id, statut: c.statut, progression: c.progression,
              budget: c.budget, budgetReel: c.budgetReel,
              dateDebut: c.dateDebut?.toISOString() ?? null,
              dateFin:   c.dateFin?.toISOString()   ?? null,
            }} />
          </div>

          {/* Client */}
          {c.lead && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h2 className="font-bold text-[#0F2C5E] mb-1">Client</h2>
              <p className="font-semibold text-[#0F2C5E]">{c.lead.nom}</p>
              <p className="text-xs text-gray-500">{c.lead.typeTravaux}</p>
              <a href={`tel:${c.lead.telephone}`}
                className="flex items-center gap-2 text-sm text-[#0F2C5E] hover:underline">
                <Phone className="w-4 h-4" />{c.lead.telephone}
              </a>
              <a href={`mailto:${c.lead.email}`}
                className="flex items-center gap-2 text-sm text-[#0F2C5E] hover:underline">
                <Mail className="w-4 h-4" />{c.lead.email}
              </a>
              <Link href={`/crm/leads/${c.lead.id}`}
                className="block text-center text-xs bg-[#F8F7F4] text-[#0F2C5E] font-semibold py-2 rounded-xl hover:bg-gray-100 transition-colors mt-2">
                Voir la fiche lead →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
