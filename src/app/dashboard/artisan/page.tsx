import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { StatCard } from "@/components/ui/StatCard"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

const categorieLabel: Record<string, string> = {
  MACONNERIE: "Maçonnerie", PLOMBERIE: "Plomberie", ELECTRICITE: "Électricité",
  PEINTURE: "Peinture", MENUISERIE: "Menuiserie", TOITURE: "Toiture",
  CARRELAGE: "Carrelage", ISOLATION: "Isolation", CHAUFFAGE: "Chauffage",
  CLIMATISATION: "Climatisation", JARDINAGE: "Jardinage",
  RENOVATION_GENERALE: "Rénovation générale", AUTRE: "Autre",
}

export default async function ArtisanDashboard() {
  const session = await auth()
  const artisan = await prisma.artisanProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      devis: { where: { statut: "EN_ATTENTE" } },
      chantiers: {
        where: { statut: { in: ["EN_COURS", "PLANIFIE"] } },
        include: {
          projet: true,
          taches: true,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      avis: { orderBy: { createdAt: "desc" }, take: 3 },
    },
  })

  if (!artisan) return null

  const totalChantiers = await prisma.chantier.count({ where: { artisanId: artisan.id } })
  const chiffreAffaires = await prisma.devis.aggregate({
    where: { artisanId: artisan.id, statut: "ACCEPTE" },
    _sum: { montant: true },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour 👋</h1>
        <p className="text-gray-500 mt-1">Voici un aperçu de votre activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Devis en attente"
          value={artisan.devis.length}
          sub="En attente de réponse"
          color="yellow"
          icon={<span className="text-xl">📋</span>}
        />
        <StatCard
          label="Chantiers actifs"
          value={artisan.chantiers.length}
          sub="En cours ou planifiés"
          color="blue"
          icon={<span className="text-xl">🏗️</span>}
        />
        <StatCard
          label="Chantiers terminés"
          value={totalChantiers}
          sub="Total depuis le début"
          color="green"
          icon={<span className="text-xl">✅</span>}
        />
        <StatCard
          label="Note moyenne"
          value={artisan.note > 0 ? `${artisan.note.toFixed(1)} / 5` : "—"}
          sub={`${artisan.nbAvis} avis`}
          color="purple"
          icon={<span className="text-xl">⭐</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chantiers actifs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Chantiers en cours</h2>
            <Link href="/dashboard/artisan/chantiers" className="text-sm text-blue-600 hover:underline">
              Voir tout
            </Link>
          </div>

          {artisan.chantiers.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Aucun chantier actif</p>
          ) : (
            <div className="space-y-3">
              {artisan.chantiers.map((c) => {
                const done = c.taches.filter((t) => t.statut === "TERMINEE").length
                const total = c.taches.length
                const pct = total > 0 ? Math.round((done / total) * 100) : 0

                return (
                  <Link
                    key={c.id}
                    href={`/dashboard/artisan/chantiers/${c.id}`}
                    className="block p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{c.projet.titre}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{c.projet.ville}</p>
                      </div>
                      <Badge
                        label={c.statut === "EN_COURS" ? "En cours" : "Planifié"}
                        variant={c.statut === "EN_COURS" ? "info" : "warning"}
                      />
                    </div>
                    {total > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{done}/{total} tâches</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Derniers avis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Derniers avis reçus</h2>
            <span className="text-sm text-gray-400">{artisan.nbAvis} au total</span>
          </div>

          {artisan.avis.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Aucun avis pour le moment</p>
          ) : (
            <div className="space-y-4">
              {artisan.avis.map((a) => (
                <div key={a.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < a.note ? "text-yellow-400" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                  {a.commentaire && (
                    <p className="text-sm text-gray-600 italic">"{a.commentaire}"</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
