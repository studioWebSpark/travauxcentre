import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/status-badge"
import { DevisForm } from "@/components/artisan/DevisForm"

const categorieLabel: Record<string, string> = {
  MACONNERIE: "Maçonnerie", PLOMBERIE: "Plomberie", ELECTRICITE: "Électricité",
  PEINTURE: "Peinture", MENUISERIE: "Menuiserie", TOITURE: "Toiture",
  CARRELAGE: "Carrelage", ISOLATION: "Isolation", CHAUFFAGE: "Chauffage",
  CLIMATISATION: "Climatisation", JARDINAGE: "Jardinage",
  RENOVATION_GENERALE: "Rénovation générale", AUTRE: "Autre",
}

export default async function ProjetDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const [projet, artisan] = await Promise.all([
    prisma.projet.findUnique({
      where: { id },
      include: {
        client: { include: { user: { select: { name: true, image: true, email: true } } } },
        _count: { select: { devis: true } },
      },
    }),
    prisma.artisanProfile.findUnique({ where: { userId: session!.user.id } }),
  ])

  if (!projet || projet.statut !== "OUVERT") notFound()

  const monDevis = artisan
    ? await prisma.devis.findUnique({ where: { projetId_artisanId: { projetId: id, artisanId: artisan.id } } })
    : null

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Badge label={categorieLabel[projet.categorie] ?? projet.categorie} variant="info" />
        <h1 className="text-2xl font-bold text-gray-900 mt-3">{projet.titre}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          <span>📍 {projet.adresse}, {projet.ville} {projet.codePostal}</span>
          <span>💬 {projet._count.devis} devis reçus</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Description du projet</h2>
        <p className="text-gray-600 leading-relaxed">{projet.description}</p>

        {(projet.budgetMin || projet.budgetMax) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Budget estimé</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {projet.budgetMin?.toLocaleString("fr-FR")} €
              {projet.budgetMax ? ` – ${projet.budgetMax.toLocaleString("fr-FR")} €` : "+"}
            </p>
          </div>
        )}

        {(projet.dateDebut || projet.dateFin) && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Dates souhaitées</p>
            <p className="text-sm text-gray-600 mt-0.5">
              {projet.dateDebut && `Début : ${new Date(projet.dateDebut).toLocaleDateString("fr-FR")}`}
              {projet.dateFin && ` · Fin : ${new Date(projet.dateFin).toLocaleDateString("fr-FR")}`}
            </p>
          </div>
        )}
      </div>

      {/* Client */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 flex items-center gap-4">
        {projet.client.user.image ? (
          <img src={projet.client.user.image} alt="" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-500">
            {projet.client.user.name?.[0] ?? "?"}
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">{projet.client.user.name}</p>
          <p className="text-sm text-gray-400">{projet.client.ville ?? "Client"}</p>
        </div>
      </div>

      {/* Formulaire devis ou devis existant */}
      {monDevis ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="font-semibold text-green-800 mb-3">✅ Votre devis a été envoyé</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Montant</p>
              <p className="font-bold text-gray-900 text-lg">{monDevis.montant.toLocaleString("fr-FR")} €</p>
            </div>
            <div>
              <p className="text-gray-500">Durée estimée</p>
              <p className="font-bold text-gray-900 text-lg">{monDevis.dureeJours} jours</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">{monDevis.description}</p>
          <div className="mt-4">
            <Badge
              label={monDevis.statut === "EN_ATTENTE" ? "En attente de réponse" : monDevis.statut === "ACCEPTE" ? "Accepté" : "Refusé"}
              variant={monDevis.statut === "EN_ATTENTE" ? "warning" : monDevis.statut === "ACCEPTE" ? "success" : "danger"}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Envoyer un devis</h2>
          <DevisForm projetId={id} />
        </div>
      )}
    </div>
  )
}
