import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { STATUTS_CHANTIER, formatEuro, calcTotaux } from "@/lib/chantier"

export const dynamic = "force-dynamic"

export default async function PortailClientPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const chantier  = await prisma.chantierCrm.findUnique({
    where:   { tokenClient: token },
    include: {
      lead:     { select: { nom: true, email: true } },
      etapes:   { orderBy: { ordre: "asc" } },
      photos:   { orderBy: { createdAt: "asc" } },
      devis:    { include: { lignes: true }, orderBy: { createdAt: "desc" } },
      factures: { include: { lignes: true }, orderBy: { createdAt: "desc" } },
      rapports: { orderBy: { date: "desc" }, take: 5 },
    },
  })
  if (!chantier) notFound()

  const st            = STATUTS_CHANTIER[chantier.statut]
  const photosAvant   = chantier.photos.filter(p => p.categorie === "AVANT")
  const photosApres   = chantier.photos.filter(p => p.categorie === "APRES")
  const photosPendant = chantier.photos.filter(p => p.categorie === "PENDANT")
  const etapesDone    = chantier.etapes.filter(e => e.statut === "TERMINEE").length
  const fmtDate       = (d: Date | null) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* Header */}
      <div className="bg-[#0F2C5E] text-white py-5 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold">Travaux<span className="text-[#F97316]">Centre</span></span>
          <span className="text-sm opacity-70">Espace client</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Titre + statut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Votre chantier</p>
              <h1 className="text-2xl font-bold text-[#0F2C5E]">{chantier.titre}</h1>
              {chantier.lead && <p className="text-gray-500 text-sm mt-1">Bonjour, <strong>{chantier.lead.nom}</strong></p>}
              <p className="text-gray-400 text-sm mt-0.5">📍 {chantier.adresse}</p>
            </div>
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
          </div>

          {/* Progression */}
          <div className="mt-5">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-500">Avancement global</span>
              <span className="font-bold text-[#0F2C5E]">{chantier.progression}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#0F2C5E] to-[#F97316] transition-all"
                style={{ width: `${chantier.progression}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>Début : {fmtDate(chantier.dateDebut)}</span>
              <span>Fin prévue : {fmtDate(chantier.dateFin)}</span>
            </div>
          </div>
        </div>

        {/* Étapes */}
        {chantier.etapes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Étapes du chantier</h2>
            <p className="text-xs text-gray-400 mb-4">{etapesDone} / {chantier.etapes.length} étapes terminées</p>
            <div className="space-y-2">
              {chantier.etapes.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-3 bg-[#F8F7F4] rounded-xl">
                  <span className="text-lg">
                    {e.statut === "TERMINEE" ? "✅" : e.statut === "EN_COURS" ? "🔄" : "⬜"}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${e.statut === "TERMINEE" ? "line-through text-gray-400" : "text-[#0F2C5E]"}`}>
                      {e.titre}
                    </p>
                    {e.description && <p className="text-xs text-gray-400">{e.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rapports récents */}
        {chantier.rapports.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Derniers rapports de chantier</h2>
            <div className="space-y-3">
              {chantier.rapports.map(r => (
                <div key={r.id} className="p-4 bg-[#F8F7F4] rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-[#0F2C5E]">
                      {new Date(r.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    {r.heures > 0 && <span className="text-xs text-gray-400">⏱️ {r.heures}h</span>}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.description}</p>
                  {r.meteo && <p className="text-xs text-gray-400 mt-1">🌤️ {r.meteo}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {chantier.photos.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Photos du chantier</h2>
            {photosAvant.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">📸 Avant</p>
                <div className="grid grid-cols-3 gap-2">
                  {photosAvant.map(p => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.id} src={p.url} alt="avant" className="w-full aspect-square object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}
            {photosPendant.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">🔨 En cours</p>
                <div className="grid grid-cols-3 gap-2">
                  {photosPendant.map(p => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.id} src={p.url} alt="pendant" className="w-full aspect-square object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}
            {photosApres.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">✨ Après</p>
                <div className="grid grid-cols-3 gap-2">
                  {photosApres.map(p => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.id} src={p.url} alt="après" className="w-full aspect-square object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Devis */}
        {chantier.devis.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Vos devis</h2>
            <div className="space-y-2">
              {chantier.devis.map(d => {
                const tot = calcTotaux(d.lignes, d.tva)
                return (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-[#F8F7F4] rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-[#0F2C5E]">{d.numero}</p>
                      <p className="text-xs text-gray-400">{d.statut === "ACCEPTE" ? "✅ Accepté" : d.statut === "ENVOYE" ? "📤 En attente" : d.statut}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#0F2C5E]">{formatEuro(tot.ttc)}</span>
                      <a href={`/api/crm/devis/${d.id}/pdf`} target="_blank"
                        className="text-xs bg-[#0F2C5E] text-white px-3 py-1.5 rounded-lg hover:bg-[#1a3f7a]">PDF</a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Factures */}
        {chantier.factures.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Vos factures</h2>
            <div className="space-y-2">
              {chantier.factures.map(f => {
                const tot = calcTotaux(f.lignes, f.tva)
                return (
                  <div key={f.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <div>
                      <p className="text-sm font-bold text-[#0F2C5E]">{f.numero}</p>
                      <p className="text-xs text-gray-400">{f.statut === "PAYEE" ? "✅ Payée" : f.statut === "ENVOYEE" ? "📤 En attente" : f.statut}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-600">{formatEuro(tot.ttc)}</span>
                      <a href={`/api/crm/factures/${f.id}/pdf`} target="_blank"
                        className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">PDF</a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          Travaux Centre — Longuenesse (62219) — contact@travauxcentre.fr
        </p>
      </div>
    </div>
  )
}
