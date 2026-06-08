import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import ChantiersClient from "./ChantiersClient"

export const metadata: Metadata = { title: "Chantiers" }
export const dynamic = "force-dynamic"

export default async function ChantiersPage() {
  const chantiers = await prisma.chantierCrm.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lead:   { select: { nom: true } },
      etapes: true,
      photos: { take: 1, orderBy: { createdAt: "desc" } },
      _count: { select: { photos: true, etapes: true, factures: true } },
    },
  })

  const enCours  = chantiers.filter((c) => c.statut === "EN_COURS").length
  const termine  = chantiers.filter((c) => c.statut === "TERMINE").length
  const caTotal  = chantiers.reduce((s, c) => s + (c.budgetReel ?? c.budget ?? 0), 0)

  return (
    <ChantiersClient
      initialChantiers={chantiers}
      enCours={enCours}
      termine={termine}
      caTotal={caTotal}
    />
  )
}
