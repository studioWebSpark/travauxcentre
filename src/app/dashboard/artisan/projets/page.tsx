import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

const categorieLabel: Record<string, string> = {
  MACONNERIE: "Maçonnerie", PLOMBERIE: "Plomberie", ELECTRICITE: "Électricité",
  PEINTURE: "Peinture", MENUISERIE: "Menuiserie", TOITURE: "Toiture",
  CARRELAGE: "Carrelage", ISOLATION: "Isolation", CHAUFFAGE: "Chauffage",
  CLIMATISATION: "Climatisation", JARDINAGE: "Jardinage",
  RENOVATION_GENERALE: "Rénovation générale", AUTRE: "Autre",
}

export default async function ProjetsDisponibles({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; ville?: string }>
}) {
  const { categorie, ville } = await searchParams
  const session = await auth()

  const artisan = await prisma.artisanProfile.findUnique({
    where: { userId: session!.user.id },
    include: { specialites: true },
  })

  const projets = await prisma.projet.findMany({
    where: {
      statut: "OUVERT",
      ...(categorie ? { categorie: categorie as never } : {}),
      ...(ville ? { ville: { contains: ville, mode: "insensitive" } } : {}),
    },
    include: {
      client: { include: { user: { select: { name: true, image: true } } } },
      _count: { select: { devis: true } },
      devis: { where: { artisanId: artisan?.id ?? "" }, select: { statut: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const categories = Object.keys(categorieLabel)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projets disponibles</h1>
        <p className="text-gray-500 mt-1">{projets.length} projet{projets.length > 1 ? "s" : ""} ouvert{projets.length > 1 ? "s" : ""}</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href="/dashboard/artisan/projets"
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !categorie ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
          }`}
        >
          Tous
        </a>
        {artisan?.specialites.map((s) => (
          <a
            key={s.categorie}
            href={`/dashboard/artisan/projets?categorie=${s.categorie}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              categorie === s.categorie
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          >
            {categorieLabel[s.categorie]}
          </a>
        ))}
      </div>

      {/* Liste */}
      {projets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">Aucun projet disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projets.map((p) => {
            const dejaDepose = p.devis.length > 0
            return (
              <Link
                key={p.id}
                href={`/dashboard/artisan/projets/${p.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge label={categorieLabel[p.categorie] ?? p.categorie} variant="info" />
                      {dejaDepose && <Badge label="Devis envoyé" variant="success" />}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{p.titre}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      <span>📍 {p.ville} ({p.codePostal})</span>
                      <span>💬 {p._count.devis} devis</span>
                      {p.budgetMin && (
                        <span>
                          💶 {p.budgetMin.toLocaleString("fr-FR")}
                          {p.budgetMax ? ` – ${p.budgetMax.toLocaleString("fr-FR")}` : "+"} €
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <div className="flex items-center gap-2 mt-2 justify-end">
                      {p.client.user.image ? (
                        <img src={p.client.user.image} alt="" className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {p.client.user.name?.[0] ?? "?"}
                        </div>
                      )}
                      <span className="text-xs text-gray-500">{p.client.user.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
