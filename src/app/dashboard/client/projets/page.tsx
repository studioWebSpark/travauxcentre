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

const statutBadge: Record<string, { label: string; variant: "info" | "warning" | "success" | "danger" }> = {
  OUVERT:   { label: "Ouvert",   variant: "info" },
  EN_COURS: { label: "En cours", variant: "warning" },
  TERMINE:  { label: "Terminé",  variant: "success" },
  ANNULE:   { label: "Annulé",   variant: "danger" },
}

export default async function MesProjets() {
  const session = await auth()
  const client  = await prisma.clientProfile.findUnique({ where: { userId: session!.user.id } })

  const projets = await prisma.projet.findMany({
    where: { clientId: client?.id ?? "" },
    include: {
      _count: { select: { devis: true } },
      devis:  { where: { statut: "EN_ATTENTE" }, select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes projets</h1>
          <p className="text-gray-500 mt-1">{projets.length} projet{projets.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/client/projets/nouveau"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors">
          + Nouveau projet
        </Link>
      </div>

      {projets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-gray-500 mb-4">Aucun projet pour le moment</p>
          <Link href="/dashboard/client/projets/nouveau" className="text-blue-600 hover:underline text-sm font-medium">
            Poster mon premier projet →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projets.map((p) => {
            const s       = statutBadge[p.statut]
            const newDevis = p.devis.length
            return (
              <Link key={p.id} href={`/dashboard/client/projets/${p.id}`}
                className="flex items-center justify-between bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={categorieLabel[p.categorie] ?? p.categorie} variant="info" />
                    <Badge label={s.label} variant={s.variant} />
                    {newDevis > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {newDevis} nouveau{newDevis > 1 ? "x" : ""}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900">{p.titre}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {p.ville} · {p._count.devis} devis reçu{p._count.devis > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                  <span className="text-gray-300 text-sm ml-2">→</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
