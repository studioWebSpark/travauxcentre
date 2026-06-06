import type { StatutLead, PrioriteLead } from "@/generated/prisma"

export const STATUTS: Record<StatutLead, { label: string; color: string; bg: string; next?: StatutLead }> = {
  NOUVEAU:      { label: "Nouveau",       color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",    next: "CONTACTE" },
  CONTACTE:     { label: "Contacté",      color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",  next: "DEVIS_ENVOYE" },
  DEVIS_ENVOYE: { label: "Devis envoyé",  color: "text-purple-700", bg: "bg-purple-50 border-purple-200", next: "GAGNE" },
  GAGNE:        { label: "Gagné ✓",       color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  PERDU:        { label: "Perdu",         color: "text-red-700",    bg: "bg-red-50 border-red-200" },
  EN_ATTENTE:   { label: "En attente",    color: "text-gray-700",   bg: "bg-gray-50 border-gray-200" },
}

export const PRIORITES: Record<PrioriteLead, { label: string; color: string; dot: string }> = {
  HAUTE:   { label: "Haute",   color: "text-red-600",  dot: "bg-red-500" },
  NORMALE: { label: "Normale", color: "text-blue-600", dot: "bg-blue-400" },
  BASSE:   { label: "Basse",   color: "text-gray-400", dot: "bg-gray-300" },
}

export const PIPELINE_ORDER: StatutLead[] = [
  "NOUVEAU", "CONTACTE", "DEVIS_ENVOYE", "GAGNE", "PERDU", "EN_ATTENTE",
]

export function daysSince(date: Date | string | null): number | null {
  if (!date) return null
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

export function formatEuro(val: number | null | undefined): string {
  if (!val) return "—"
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val)
}
