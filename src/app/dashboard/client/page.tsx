import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { StatCard } from "@/components/ui/StatCard"
import { Badge } from "@/components/ui/status-badge"
import Link from "next/link"

export default async function ClientDashboard() {
  const session = await auth()
  const client = await prisma.clientProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      projets: {
        include: { _count: { select: { devis: true } }, devis: { where: { statut: "EN_ATTENTE" } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!client) return null

  const nbProjetsOuverts  = client.projets.filter((p) => p.statut === "OUVERT").length
  const nbDevisEnAttente  = client.projets.reduce((acc, p) => acc + p.devis.length, 0)
  const nbChantiersActifs = await prisma.chantier.count({
    where: { projet: { clientId: client.id }, statut: { in: ["EN_COURS", "PLANIFIE"] } },
  })
  const nbTermines = await prisma.chantier.count({
    where: { projet: { clientId: client.id }, statut: "TERMINE" },
  })

  const statutBadge: Record<string, { label: string; variant: "info" | "warning" | "success" | "danger" | "default" }> = {
    OUVERT:    { label: "Ouvert",     variant: "info" },
    EN_COURS:  { label: "En cours",   variant: "warning" },
    TERMINE:   { label: "Terminé",    variant: "success" },
    ANNULE:    { label: "Annulé",     variant: "danger" },
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour 👋</h1>
        <p className="text-gray-500 mt-1">Suivez vos projets et chantiers</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Projets ouverts"    value={nbProjetsOuverts}  sub="En attente de devis"   color="blue"   icon={<span className="text-xl">📁</span>} />
        <StatCard label="Nouveaux devis"     value={nbDevisEnAttente}  sub="À examiner"            color="yellow" icon={<span className="text-xl">📋</span>} />
        <StatCard label="Chantiers actifs"   value={nbChantiersActifs} sub="En cours ou planifiés" color="purple" icon={<span className="text-xl">🏗️</span>} />
        <StatCard label="Travaux terminés"   value={nbTermines}        sub="Total"                 color="green"  icon={<span className="text-xl">✅</span>} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Mes projets récents</h2>
          <Link href="/dashboard/client/projets/nouveau"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Nouveau projet
          </Link>
        </div>

        {client.projets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🏠</p>
            <p className="text-gray-500 mb-4">Vous n'avez pas encore posté de projet</p>
            <Link href="/dashboard/client/projets/nouveau"
              className="text-blue-600 hover:underline text-sm font-medium">
              Poster mon premier projet →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {client.projets.map((p) => {
              const s = statutBadge[p.statut]
              const newDevis = p.devis.length
              return (
                <Link key={p.id} href={`/dashboard/client/projets/${p.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{p.titre}</p>
                      {newDevis > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {newDevis} nouveau{newDevis > 1 ? "x" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {p.ville} · {p._count.devis} devis reçus
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Badge label={s.label} variant={s.variant} />
                    <span className="text-gray-300 text-sm">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
