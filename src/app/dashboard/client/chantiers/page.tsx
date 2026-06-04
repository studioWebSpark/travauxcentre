import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/status-badge"
import Link from "next/link"

const statutConfig: Record<string, { label: string; variant: "warning" | "info" | "default" | "success" }> = {
  PLANIFIE: { label: "Planifié", variant: "warning" },
  EN_COURS: { label: "En cours", variant: "info" },
  PAUSE:    { label: "En pause", variant: "default" },
  TERMINE:  { label: "Terminé",  variant: "success" },
}

export default async function MesChantiers() {
  const session = await auth()
  const client  = await prisma.clientProfile.findUnique({ where: { userId: session!.user.id } })

  const chantiers = await prisma.chantier.findMany({
    where: { projet: { clientId: client?.id ?? "" } },
    include: {
      projet: true,
      artisan: { include: { user: { select: { name: true } } } },
      devis: { select: { montant: true } },
      taches: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes chantiers</h1>
        <p className="text-gray-500 mt-1">{chantiers.length} chantier{chantiers.length > 1 ? "s" : ""}</p>
      </div>

      {chantiers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">🏗️</p>
          <p className="text-gray-500 mb-4">Aucun chantier en cours</p>
          <Link href="/dashboard/client/projets/nouveau" className="text-blue-600 hover:underline text-sm font-medium">
            Poster un projet →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {chantiers.map((c) => {
            const done  = c.taches.filter((t) => t.statut === "TERMINEE").length
            const total = c.taches.length
            const pct   = total > 0 ? Math.round((done / total) * 100) : 0
            const s     = statutConfig[c.statut]
            return (
              <Link key={c.id} href={`/dashboard/client/chantiers/${c.id}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all block">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={s.label} variant={s.variant} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{c.projet.titre}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">Artisan : {c.artisan.user.name}</p>
                  </div>
                  <p className="font-bold text-gray-900 shrink-0">{c.devis.montant.toLocaleString("fr-FR")} €</p>
                </div>
                {total > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{done}/{total} tâches</span><span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
