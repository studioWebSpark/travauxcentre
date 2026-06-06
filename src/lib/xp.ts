import { prisma } from "@/lib/prisma"

// ── Points par action ─────────────────────────────────────────────────────────
export const XP_VALUES = {
  NOTE_AJOUTEE:      5,
  EMAIL_ENVOYE:      10,
  LEAD_CONTACTE:     15,
  DEVIS_ENVOYE:      25,
  DEAL_GAGNE:        100,
  OBJECTIF_JOUR:     50,
  OBJECTIF_SEMAINE:  150,
  OBJECTIF_MOIS:     300,
} as const

export type XpType = keyof typeof XP_VALUES

// ── Niveaux ───────────────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, label: "Apprenti",  min: 0,    max: 99,   icon: "🔨", color: "#9ca3af" },
  { level: 2, label: "Artisan",   min: 100,  max: 349,  icon: "⚒️",  color: "#3b82f6" },
  { level: 3, label: "Expert",    min: 350,  max: 799,  icon: "🏗️",  color: "#8b5cf6" },
  { level: 4, label: "Maître",    min: 800,  max: 1799, icon: "🏆",  color: "#f59e0b" },
  { level: 5, label: "Légende",   min: 1800, max: Infinity, icon: "👑", color: "#F97316" },
] as const

export function getLevelInfo(totalXp: number) {
  const current = LEVELS.findLast((l) => totalXp >= l.min) ?? LEVELS[0]
  const next    = LEVELS.find((l) => l.level === current.level + 1)
  const progress = next
    ? Math.round(((totalXp - current.min) / (next.min - current.min)) * 100)
    : 100
  return { current, next, progress, totalXp }
}

// ── Objectifs ─────────────────────────────────────────────────────────────────
export type Objectif = {
  id:      string
  label:   string
  periode: "jour" | "semaine" | "mois"
  cible:   number
  actuel:  number
  xpBonus: number
  done:    boolean
}

export async function getObjectifs(): Promise<Objectif[]> {
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lundi = new Date(today)
  lundi.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)

  const [leads, notes] = await Promise.all([
    prisma.lead.findMany({ select: { statut: true, montantDevis: true, dateContact: true, updatedAt: true } }),
    prisma.noteLead.findMany({ select: { createdAt: true } }),
  ])

  // Journaliers
  const contactesAuj    = leads.filter((l) => l.dateContact && l.dateContact >= today).length
  const notesAuj        = notes.filter((n) => n.createdAt >= today).length
  const devisAuj        = leads.filter((l) => l.statut === "DEVIS_ENVOYE" && l.updatedAt >= today).length

  // Hebdo
  const contactesSemaine = leads.filter((l) => l.dateContact && l.dateContact >= lundi).length
  const devisSemaine     = leads.filter((l) => l.statut === "DEVIS_ENVOYE" && l.updatedAt >= lundi).length
  const gagnesSemaine    = leads.filter((l) => l.statut === "GAGNE" && l.updatedAt >= lundi).length

  // Mensuel
  const gagnesMois = leads.filter((l) => l.statut === "GAGNE" && l.updatedAt >= debutMois).length
  const caMois     = leads.filter((l) => l.montantDevis && l.updatedAt >= debutMois)
                          .reduce((s, l) => s + (l.montantDevis ?? 0), 0)

  return [
    // Journaliers
    { id: "j1", label: "Contacter 1 lead aujourd'hui",    periode: "jour",    cible: 1, actuel: contactesAuj,    xpBonus: XP_VALUES.OBJECTIF_JOUR,    done: contactesAuj    >= 1 },
    { id: "j2", label: "Ajouter 2 notes dans la journée", periode: "jour",    cible: 2, actuel: notesAuj,        xpBonus: XP_VALUES.OBJECTIF_JOUR,    done: notesAuj        >= 2 },
    { id: "j3", label: "Envoyer 1 devis aujourd'hui",     periode: "jour",    cible: 1, actuel: devisAuj,        xpBonus: XP_VALUES.OBJECTIF_JOUR,    done: devisAuj        >= 1 },
    // Hebdo
    { id: "h1", label: "Contacter 5 leads cette semaine", periode: "semaine", cible: 5, actuel: contactesSemaine, xpBonus: XP_VALUES.OBJECTIF_SEMAINE, done: contactesSemaine >= 5 },
    { id: "h2", label: "Envoyer 3 devis cette semaine",   periode: "semaine", cible: 3, actuel: devisSemaine,    xpBonus: XP_VALUES.OBJECTIF_SEMAINE, done: devisSemaine    >= 3 },
    { id: "h3", label: "Gagner 1 deal cette semaine",     periode: "semaine", cible: 1, actuel: gagnesSemaine,   xpBonus: XP_VALUES.OBJECTIF_SEMAINE, done: gagnesSemaine   >= 1 },
    // Mensuel
    { id: "m1", label: "Gagner 3 deals ce mois",          periode: "mois",    cible: 3, actuel: gagnesMois,      xpBonus: XP_VALUES.OBJECTIF_MOIS,    done: gagnesMois      >= 3 },
    { id: "m2", label: "Générer 10 000 € de CA",          periode: "mois",    cible: 10000, actuel: caMois,      xpBonus: XP_VALUES.OBJECTIF_MOIS,    done: caMois          >= 10000 },
  ]
}

// ── Award XP ──────────────────────────────────────────────────────────────────
export async function awardXp(type: XpType, opts?: { leadId?: string; label?: string }) {
  return prisma.xpEvent.create({
    data: {
      type,
      points: XP_VALUES[type],
      leadId: opts?.leadId ?? null,
      label:  opts?.label  ?? null,
    },
  })
}

export async function getTotalXp(): Promise<number> {
  const result = await prisma.xpEvent.aggregate({ _sum: { points: true } })
  return result._sum.points ?? 0
}
