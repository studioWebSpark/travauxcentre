import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/status-badge"
import Link from "next/link"

const statutConfig: Record<string, { label: string; variant: "warning" | "info" | "default" | "success" }> = {
  PLANIFIE: { label: "Planifié",  variant: "warning" },
  EN_COURS: { label: "En cours",  variant: "info" },
  PAUSE:    { label: "En pause",  variant: "default" },
  TERMINE:  { label: "Terminé",   variant: "success" },
}

export default async function MesChantiers() {
  const session = await auth()
  const artisan = await prisma.artisanProfile.findUnique({
    where: { userId: session!.user.id },
  })

  const chantiers = await prisma.chantier.findMany({
    where: { artisanId: artisan?.id ?? "" },
    include: {
      projet: { include: { client: { include: { user: { select: { name: true } } } } } },
      taches: true,
      devis: { select: { montant: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const actifs   = chantiers.filter((c) => c.statut === "EN_COURS" || c.statut === "PLANIFIE")
  const archives = chantiers.filter((c) => c.statut === "TERMINE" || c.statut === "PAUSE")

  function ChantiersSection({ items }: { items: typeof chantiers }) {
    if (items.length === 0) return null
    return (
      <div className="grid gap-4">
        {items.map((c) => {
          const done  = c.taches.filter((t) => t.statut === "TERMINEE").length
          const total = c.taches.length
          const pct   = total > 0 ? Math.round((done / total) * 100) : 0
          const s     = statutConfig[c.statut]

          return (
            <Link
              key={c.id}
              href={`/dashboard/artisan/chantiers/${c.id}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all block"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={s.label} variant={s.variant} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base">{c.projet.titre}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Client : {c.projet.client.user.name} · {c.projet.ville}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">{c.devis.montant.toLocaleString("fr-FR")} €</p>
                  {c.dateDebut && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Début {new Date(c.dateDebut).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
              </div>

              {total > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{done}/{total} tâches terminées</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes chantiers</h1>
        <p className="text-gray-500 mt-1">{chantiers.length} chantier{chantiers.length > 1 ? "s" : ""} au total</p>
      </div>

      {chantiers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">🏗️</p>
          <p className="text-gray-500 mb-4">Aucun chantier pour le moment</p>
          <Link href="/dashboard/artisan/projets" className="text-blue-600 hover:underline text-sm font-medium">
            Trouver des projets →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {actifs.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Actifs ({actifs.length})
              </h2>
              <ChantiersSection items={actifs} />
            </section>
          )}
          {archives.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Archivés ({archives.length})
              </h2>
              <ChantiersSection items={archives} />
            </section>
          )}
        </div>
      )}
    </div>
  )
}
