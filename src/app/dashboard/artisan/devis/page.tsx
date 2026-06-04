import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

const statutBadge: Record<string, { label: string; variant: "warning" | "success" | "danger" }> = {
  EN_ATTENTE: { label: "En attente", variant: "warning" },
  ACCEPTE:    { label: "Accepté",    variant: "success" },
  REFUSE:     { label: "Refusé",     variant: "danger" },
}

export default async function MesDevis() {
  const session = await auth()
  const artisan = await prisma.artisanProfile.findUnique({
    where: { userId: session!.user.id },
  })

  const devis = await prisma.devis.findMany({
    where: { artisanId: artisan?.id ?? "" },
    include: {
      projet: {
        include: { client: { include: { user: { select: { name: true } } } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const enAttente = devis.filter((d) => d.statut === "EN_ATTENTE").length
  const acceptes  = devis.filter((d) => d.statut === "ACCEPTE").length

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes devis</h1>
        <p className="text-gray-500 mt-1">
          {enAttente} en attente · {acceptes} accepté{acceptes > 1 ? "s" : ""}
        </p>
      </div>

      {devis.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 mb-4">Vous n'avez pas encore envoyé de devis</p>
          <Link href="/dashboard/artisan/projets" className="text-blue-600 hover:underline text-sm font-medium">
            Parcourir les projets →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Projet</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durée</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {devis.map((d) => {
                const s = statutBadge[d.statut]
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/artisan/projets/${d.projetId}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {d.projet.titre}
                      </Link>
                      <p className="text-gray-400 text-xs mt-0.5">{d.projet.ville}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{d.projet.client.user.name}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {d.montant.toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-6 py-4 text-gray-600">{d.dureeJours} j</td>
                    <td className="px-6 py-4">
                      <Badge label={s.label} variant={s.variant} />
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
