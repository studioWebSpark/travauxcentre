import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/status-badge"
import { TacheManager } from "@/components/artisan/TacheManager"
import { RapportForm } from "@/components/artisan/RapportForm"
import { ChantierStatutForm } from "@/components/artisan/ChantierStatutForm"

const statutConfig: Record<string, { label: string; variant: "warning" | "info" | "default" | "success" }> = {
  PLANIFIE: { label: "Planifié", variant: "warning" },
  EN_COURS: { label: "En cours", variant: "info" },
  PAUSE:    { label: "En pause", variant: "default" },
  TERMINE:  { label: "Terminé",  variant: "success" },
}

export default async function ChantierDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const chantier = await prisma.chantier.findUnique({
    where: { id },
    include: {
      projet: {
        include: { client: { include: { user: { select: { name: true, image: true, email: true } } } } },
      },
      artisan: true,
      devis: true,
      taches: { orderBy: { ordre: "asc" } },
      rapports: { orderBy: { createdAt: "desc" } },
      documents: true,
    },
  })

  if (!chantier || chantier.artisan.userId !== session!.user.id) notFound()

  const done  = chantier.taches.filter((t) => t.statut === "TERMINEE").length
  const total = chantier.taches.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0
  const s     = statutConfig[chantier.statut]

  return (
    <div className="p-8">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge label={s.label} variant={s.variant} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{chantier.projet.titre}</h1>
          <p className="text-gray-500 mt-1">
            📍 {chantier.projet.adresse}, {chantier.projet.ville}
          </p>
        </div>
        <ChantierStatutForm chantierId={id} statutActuel={chantier.statut} />
      </div>

      {/* Infos */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{chantier.devis.montant.toLocaleString("fr-FR")} €</p>
          <p className="text-xs text-gray-400 mt-1">Montant du devis</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{chantier.devis.dureeJours}j</p>
          <p className="text-xs text-gray-400 mt-1">Durée prévue</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {chantier.projet.client.user.name?.split(" ")[0]}
          </p>
          <p className="text-xs text-gray-400 mt-1">Client</p>
        </div>
      </div>

      {/* Avancement */}
      {total > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Avancement global</span>
            <span className="font-bold text-blue-600">{pct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">{done} sur {total} tâches terminées</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tâches */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tâches du chantier</h2>
          <TacheManager chantierId={id} taches={chantier.taches} />
        </div>

        {/* Rapports */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Rapports d'avancement</h2>
          <RapportForm chantierId={id} />
          {chantier.rapports.length > 0 && (
            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
              {chantier.rapports.map((r) => (
                <div key={r.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                  <p className="text-sm text-gray-700">{r.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
