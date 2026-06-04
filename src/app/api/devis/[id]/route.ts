import { prisma } from "@/lib/prisma"
import { ok, err, requireAuth } from "@/lib/api"

type Ctx = { params: Promise<{ id: string }> }

// Accepter ou refuser un devis (client uniquement)
export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params
  const { session, response } = await requireAuth()
  if (response) return response

  const { statut } = await request.json()
  if (statut !== "ACCEPTE" && statut !== "REFUSE") {
    return err("Statut invalide")
  }

  const devis = await prisma.devis.findUnique({
    where: { id },
    include: { projet: { include: { client: true } } },
  })

  if (!devis) return err("Devis introuvable", 404)
  if (devis.projet.client.userId !== session!.user.id) return err("Non autorisé", 403)
  if (devis.statut !== "EN_ATTENTE") return err("Ce devis a déjà été traité", 400)

  const updated = await prisma.$transaction(async (tx) => {
    const d = await tx.devis.update({ where: { id }, data: { statut } })

    if (statut === "ACCEPTE") {
      // Refuser les autres devis du même projet
      await tx.devis.updateMany({
        where: { projetId: devis.projetId, id: { not: id } },
        data: { statut: "REFUSE" },
      })

      // Passer le projet en EN_COURS
      await tx.projet.update({
        where: { id: devis.projetId },
        data: { statut: "EN_COURS" },
      })

      // Créer le chantier
      await tx.chantier.create({
        data: {
          projetId: devis.projetId,
          devisId: id,
          artisanId: devis.artisanId,
        },
      })
    }

    return d
  })

  return ok(updated)
}
