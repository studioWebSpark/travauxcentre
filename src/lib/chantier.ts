import type { StatutChantierCrm } from "@/generated/prisma"

export const STATUTS_CHANTIER: Record<StatutChantierCrm, { label: string; color: string; bg: string; dot: string }> = {
  PLANIFIE: { label: "Planifié",   color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   dot: "bg-blue-500" },
  EN_COURS: { label: "En cours",   color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",  dot: "bg-amber-500" },
  PAUSE:    { label: "En pause",   color: "text-gray-600",   bg: "bg-gray-50 border-gray-200",    dot: "bg-gray-400" },
  TERMINE:  { label: "Terminé ✓", color: "text-green-700",  bg: "bg-green-50 border-green-200",  dot: "bg-green-500" },
  ANNULE:   { label: "Annulé",     color: "text-red-700",    bg: "bg-red-50 border-red-200",      dot: "bg-red-400" },
}

export const STATUTS_ETAPE: Record<string, { label: string; color: string; icon: string }> = {
  A_FAIRE:  { label: "À faire",    color: "text-gray-500",  icon: "⬜" },
  EN_COURS: { label: "En cours",   color: "text-amber-600", icon: "🔄" },
  TERMINEE: { label: "Terminée",   color: "text-green-600", icon: "✅" },
}

export const STATUTS_DEVIS: Record<string, { label: string; color: string; bg: string }> = {
  BROUILLON: { label: "Brouillon", color: "text-gray-600",  bg: "bg-gray-50 border-gray-200" },
  ENVOYE:    { label: "Envoyé",    color: "text-blue-600",  bg: "bg-blue-50 border-blue-200" },
  ACCEPTE:   { label: "Accepté ✓", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  REFUSE:    { label: "Refusé",    color: "text-red-600",   bg: "bg-red-50 border-red-200" },
}

export const STATUTS_FACTURE: Record<string, { label: string; color: string; bg: string }> = {
  BROUILLON: { label: "Brouillon", color: "text-gray-600",  bg: "bg-gray-50 border-gray-200" },
  ENVOYEE:   { label: "Envoyée",   color: "text-blue-600",  bg: "bg-blue-50 border-blue-200" },
  PAYEE:     { label: "Payée ✓",   color: "text-green-600", bg: "bg-green-50 border-green-200" },
  RETARD:    { label: "En retard", color: "text-red-600",   bg: "bg-red-50 border-red-200" },
}

export function calcTotaux(lignes: { quantite: number; prixUnitaire: number }[], tva: number) {
  const ht  = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const tvaAmount = ht * tva
  const ttc = ht + tvaAmount
  return { ht, tvaAmount, ttc }
}

export function formatEuro(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)
}

// Les numéros sont générés avec timestamp pour garantir l'unicité
export function genNumeroDevis() {
  const now = new Date()
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`
  return `DEV-${timestamp}`
}

export function genNumeroFacture() {
  const now = new Date()
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`
  return `FAC-${timestamp}`
}
