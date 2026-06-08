import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import VeilleClient from "@/components/crm/VeilleClient"

export const metadata: Metadata = { title: "Veille marché" }
export const dynamic = "force-dynamic"

export default async function VeillePage() {
  const annonces = await prisma.veilleAnnonce.findMany({
    where:   { statut: { in: ["NOUVEAU", "VU"] } },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    take:    50,
  })

  const stats = {
    total:    await prisma.veilleAnnonce.count(),
    nouveau:  await prisma.veilleAnnonce.count({ where: { statut: "NOUVEAU" } }),
    importe:  await prisma.veilleAnnonce.count({ where: { statut: "IMPORTE" } }),
    ignore:   await prisma.veilleAnnonce.count({ where: { statut: "IGNORE" } }),
  }

  return <VeilleClient annonces={annonces} stats={stats} />
}
