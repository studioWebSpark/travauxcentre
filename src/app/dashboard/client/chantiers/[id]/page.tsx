import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

const statutConfig: Record<string, { label: string; variant: "warning" | "info" | "default" | "success" }> = {
  PLANIFIE: { label: "Planifié", variant: "warning" },
  EN_COURS: { label: "En cours", variant: "info" },
  PAUSE:    { label: "En pause", variant: "default" },
  TERMINE:  { label: "Terminé",  variant: "success" },
}

export default async function ChantierClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const client  = await prisma.clientProfile.findUnique({ where: { userId: session!.user.id } })

  const chantier = await prisma.chantier.findUnique({
    where: { id },
    include: {
      projet: true,
      artisan: { include: { user: { select: { name: true, image: true } }, specialites: true } },
      devis: true,
      taches:   { orderBy: { ordre: "asc" } },
      rapports: { orderBy: { createdAt: "desc" } },
      avis: true,
    },
  })

  if (!chantier || chantier.projet.clientId !== client?.id) notFound()

  const done  = chantier.taches.filter((t) => t.statut === "TERMINEE").length
  const total = chantier.taches.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0
  const s     = statutConfig[chantier.statut]

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge label={s.label} variant={s.variant} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{chantier.projet.titre}</h1>
          <p className="text-gray-500 mt-1">📍 {chantier.projet.adresse}, {chantier.projet.ville}</p>
        </div>
        <Link href={`/dashboard/client/projets/${chantier.projetId}`}
          className="text-sm text-blue-600 hover:underline">← Retour au projet</Link>
      </div>

      {/* Artisan */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 flex items-center gap-4">
        {chantier.artisan.user.image ? (
          <img src={chantier.artisan.user.image} alt="" className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
            {chantier.artisan.user.name?.[0] ?? "A"}
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-lg">{chantier.artisan.user.name}</p>
          {chantier.artisan.telephone && (
            <p className="text-sm text-gray-500">📞 {chantier.artisan.telephone}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{chantier.devis.montant.toLocaleString("fr-FR")} €</p>
          <p className="text-xs text-gray-400">Devis accepté</p>
        </div>
      </div>

      {/* Avancement */}
      {total > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Avancement du chantier</span>
            <span className="font-bold text-blue-600">{pct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">{done} sur {total} tâches terminées</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tâches (lecture seule) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tâches du chantier</h2>
          {chantier.taches.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Aucune tâche définie</p>
          ) : (
            <ul className="space-y-2">
              {chantier.taches.map((t) => (
                <li key={t.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-5 h-5 rounded-full shrink-0 border-2 ${
                    t.statut === "TERMINEE" ? "bg-green-500 border-green-500" :
                    t.statut === "EN_COURS" ? "bg-blue-400 border-blue-400" : "border-gray-300"
                  }`} />
                  <span className={`flex-1 text-sm ${t.statut === "TERMINEE" ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {t.titre}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    t.statut === "TERMINEE" ? "bg-green-100 text-green-600" :
                    t.statut === "EN_COURS" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {{ A_FAIRE: "À faire", EN_COURS: "En cours", TERMINEE: "Terminée" }[t.statut]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rapports */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Rapports d'avancement</h2>
          {chantier.rapports.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Aucun rapport publié</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {chantier.rapports.map((r) => (
                <div key={r.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
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
