"use client"

import dynamic from "next/dynamic"
import type { StatutLead, PrioriteLead } from "@/generated/prisma"

type Marker = {
  id: string; nom: string; ville: string; codePostal: string
  typeTravaux: string; statut: StatutLead; priorite: PrioriteLead
  telephone: string; email: string; montantDevis: number | null
}

const CrmMap = dynamic(() => import("@/components/crm/CrmMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center"><p className="text-gray-400 text-sm">Chargement de la carte…</p></div>,
})

export default function CrmMapLoader({ markers }: { markers: Marker[] }) {
  return <CrmMap markers={markers} />
}
