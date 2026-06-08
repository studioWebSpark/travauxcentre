import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; etapeId: string }> }
) {
  const { id, etapeId } = await params
  const { devisNumero, devisTotal, devistva, leadEmail } = await request.json()

  try {
    // Marquer l'étape comme payée
    const etape = await prisma.etapePaiementDevis.update({
      where: { id: etapeId },
      data: {
        statut: "PAYEE",
        datePaiement: new Date(),
      },
    })

    // Récupérer toutes les étapes du devis pour calculer les montants cumulés
    const devis = await prisma.devisCrm.findUnique({
      where: { id },
      include: {
        etapesPaiement: { orderBy: { ordre: "asc" } },
        lead: { select: { email: true, nom: true } },
        lignes: true,
      },
    })

    if (!devis) return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 })

    // Calculer le montant total payé
    const montantPayeHT = devis.etapesPaiement
      .filter((e) => e.statut === "PAYEE")
      .reduce((sum, e) => sum + (e.pourcentage / 100) * devisTotal, 0)

    const montantPayeTTC = montantPayeHT * (1 + devistva)

    // Créer ou mettre à jour la facture
    // Pour l'instant, on retourne juste le succès
    // TODO: Générer la facture partielle avec détail des paiements

    return NextResponse.json({
      success: true,
      etape,
      montantPayeHT,
      montantPayeTTC,
      message: "Étape marquée comme payée",
    })
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
