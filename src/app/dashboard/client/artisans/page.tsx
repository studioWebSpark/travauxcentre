import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/status-badge"
import Link from "next/link"

const categorieLabel: Record<string, string> = {
  MACONNERIE: "Maçonnerie", PLOMBERIE: "Plomberie", ELECTRICITE: "Électricité",
  PEINTURE: "Peinture", MENUISERIE: "Menuiserie", TOITURE: "Toiture",
  CARRELAGE: "Carrelage", ISOLATION: "Isolation", CHAUFFAGE: "Chauffage",
  CLIMATISATION: "Climatisation", JARDINAGE: "Jardinage",
  RENOVATION_GENERALE: "Rénovation générale", AUTRE: "Autre",
}

export default async function TrouverArtisan({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; ville?: string }>
}) {
  const { categorie, ville } = await searchParams

  const artisans = await prisma.artisanProfile.findMany({
    where: {
      disponible: true,
      ...(categorie ? { specialites: { some: { categorie: categorie as never } } } : {}),
      ...(ville     ? { ville: { contains: ville, mode: "insensitive" } }           : {}),
    },
    include: {
      user:       { select: { name: true, image: true } },
      specialites: true,
      _count:     { select: { chantiers: true, avis: true } },
    },
    orderBy: { note: "desc" },
  })

  const categories = Object.entries(categorieLabel)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trouver un artisan</h1>
        <p className="text-gray-500 mt-1">{artisans.length} artisan{artisans.length > 1 ? "s" : ""} disponible{artisans.length > 1 ? "s" : ""}</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <form className="flex gap-3">
          <select name="categorie" defaultValue={categorie ?? ""}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Toutes spécialités</option>
            {categories.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input type="text" name="ville" defaultValue={ville ?? ""}
            placeholder="Ville..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
            Rechercher
          </button>
        </form>
      </div>

      {artisans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">Aucun artisan trouvé pour ces critères</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {artisans.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4 mb-4">
                {a.user.image ? (
                  <img src={a.user.image} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600 shrink-0">
                    {a.user.name?.[0] ?? "A"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{a.user.name}</p>
                  <p className="text-sm text-gray-400">{a.ville ?? "France"}</p>
                  {a.note > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-sm font-medium text-gray-700">{a.note.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({a.nbAvis} avis)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {a.specialites.slice(0, 3).map((s) => (
                  <Badge key={s.id} label={categorieLabel[s.categorie] ?? s.categorie} variant="info" />
                ))}
                {a.specialites.length > 3 && (
                  <span className="text-xs text-gray-400 self-center">+{a.specialites.length - 3}</span>
                )}
              </div>

              {a.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{a.description}</p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{a._count.chantiers} chantier{a._count.chantiers > 1 ? "s" : ""} réalisé{a._count.chantiers > 1 ? "s" : ""}</span>
                <span>Rayon : {a.rayon} km</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
