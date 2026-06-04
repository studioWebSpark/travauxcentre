import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/Badge"
import { DevisActions } from "@/components/client/DevisActions"
import Link from "next/link"

const categorieLabel: Record<string, string> = {
  MACONNERIE: "Maçonnerie", PLOMBERIE: "Plomberie", ELECTRICITE: "Électricité",
  PEINTURE: "Peinture", MENUISERIE: "Menuiserie", TOITURE: "Toiture",
  CARRELAGE: "Carrelage", ISOLATION: "Isolation", CHAUFFAGE: "Chauffage",
  CLIMATISATION: "Climatisation", JARDINAGE: "Jardinage",
  RENOVATION_GENERALE: "Rénovation générale", AUTRE: "Autre",
}

const statutBadge: Record<string, { label: string; variant: "warning" | "info" | "success" | "danger" | "default" }> = {
  EN_ATTENTE: { label: "En attente",  variant: "warning" },
  ACCEPTE:    { label: "Accepté",     variant: "success" },
  REFUSE:     { label: "Refusé",      variant: "danger" },
}

export default async function ProjetClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const client = await prisma.clientProfile.findUnique({ where: { userId: session!.user.id } })
  const projet = await prisma.projet.findUnique({
    where: { id },
    include: {
      devis: {
        include: {
          artisan: {
            include: { user: { select: { name: true, image: true } }, specialites: true },
          },
        },
        orderBy: { montant: "asc" },
      },
      chantier: true,
    },
  })

  if (!projet || projet.clientId !== client?.id) notFound()

  const devisEnAttente = projet.devis.filter((d) => d.statut === "EN_ATTENTE")
  const devisTraites   = projet.devis.filter((d) => d.statut !== "EN_ATTENTE")

  return (
    <div className="p-8 max-w-3xl">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge label={categorieLabel[projet.categorie] ?? projet.categorie} variant="info" />
          <Badge
            label={{ OUVERT: "Ouvert", EN_COURS: "En cours", TERMINE: "Terminé", ANNULE: "Annulé" }[projet.statut] ?? projet.statut}
            variant={{ OUVERT: "info", EN_COURS: "warning", TERMINE: "success", ANNULE: "danger" }[projet.statut] as never ?? "default"}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{projet.titre}</h1>
        <p className="text-gray-500 mt-1">📍 {projet.adresse}, {projet.ville} {projet.codePostal}</p>
      </div>

      {/* Lien vers le chantier */}
      {projet.chantier && (
        <Link href={`/dashboard/client/chantiers/${projet.chantier.id}`}
          className="block mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-medium hover:bg-blue-100 transition-colors">
          🏗️ Voir le chantier en cours →
        </Link>
      )}

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
        <p className="text-gray-600 leading-relaxed">{projet.description}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {(projet.budgetMin || projet.budgetMax) && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Budget</p>
              <p className="font-semibold text-gray-900 mt-0.5">
                {projet.budgetMin?.toLocaleString("fr-FR")} €
                {projet.budgetMax ? ` – ${projet.budgetMax.toLocaleString("fr-FR")} €` : "+"}
              </p>
            </div>
          )}
          {projet.dateDebut && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Dates souhaitées</p>
              <p className="font-semibold text-gray-900 mt-0.5">
                {new Date(projet.dateDebut).toLocaleDateString("fr-FR")}
                {projet.dateFin && ` → ${new Date(projet.dateFin).toLocaleDateString("fr-FR")}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Devis reçus */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">
          Devis reçus ({projet.devis.length})
        </h2>

        {projet.devis.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-3xl mb-3">⏳</p>
            <p className="text-gray-500">Les artisans n'ont pas encore répondu</p>
            <p className="text-sm text-gray-400 mt-1">Vous recevrez une notification dès qu'un devis est déposé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...devisEnAttente, ...devisTraites].map((d) => {
              const s = statutBadge[d.statut]
              return (
                <div key={d.id} className={`bg-white rounded-xl border p-6 transition-all ${
                  d.statut === "ACCEPTE" ? "border-green-300 bg-green-50/30" :
                  d.statut === "REFUSE"  ? "border-gray-200 opacity-60" :
                  "border-gray-200 hover:border-blue-200"
                }`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      {d.artisan.user.image ? (
                        <img src={d.artisan.user.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                          {d.artisan.user.name?.[0] ?? "A"}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{d.artisan.user.name}</p>
                        <p className="text-xs text-gray-400">
                          {d.artisan.specialites.slice(0, 2).map((s) => categorieLabel[s.categorie]).join(", ")}
                        </p>
                      </div>
                    </div>
                    <Badge label={s.label} variant={s.variant} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">{d.montant.toLocaleString("fr-FR")} €</p>
                      <p className="text-xs text-gray-400">Montant TTC</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-900">{d.dureeJours}j</p>
                      <p className="text-xs text-gray-400">Durée estimée</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{d.description}</p>

                  {d.statut === "EN_ATTENTE" && projet.statut === "OUVERT" && (
                    <DevisActions devisId={d.id} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
