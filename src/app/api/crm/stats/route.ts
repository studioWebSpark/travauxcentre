import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const now   = new Date()
  const debut = new Date(now.getFullYear(), now.getMonth(), 1)
  const an    = new Date(now.getFullYear(), 0, 1)

  const [
    totalLeads, leadsMonth, leadsGagne, leadsPerdu,
    chantiers, chantiersEnCours, chantiersTermines,
    factures, facturesPayees,
    devis, devisAcceptes,
    leadsSources, leadsVilles,
    facturesMois,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: debut } } }),
    prisma.lead.count({ where: { statut: "GAGNE" } }),
    prisma.lead.count({ where: { statut: "PERDU" } }),
    prisma.chantierCrm.count(),
    prisma.chantierCrm.count({ where: { statut: "EN_COURS" } }),
    prisma.chantierCrm.count({ where: { statut: "TERMINE" } }),
    prisma.factureCrm.findMany({ include: { lignes: true } }),
    prisma.factureCrm.findMany({ where: { statut: "PAYEE" }, include: { lignes: true } }),
    prisma.devisCrm.findMany({ include: { lignes: true } }),
    prisma.devisCrm.findMany({ where: { statut: "ACCEPTE" }, include: { lignes: true } }),
    // Sources de leads
    prisma.lead.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } }, take: 8 }),
    // Top villes
    prisma.lead.groupBy({ by: ["ville"], _count: true, orderBy: { _count: { ville: "desc" } }, take: 6, where: { ville: { not: "" } } }),
    // CA par mois (12 derniers mois)
    prisma.factureCrm.findMany({
      where: { statut: "PAYEE", createdAt: { gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) } },
      include: { lignes: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  const calcTtc = (lignes: { quantite: number; prixUnitaire: number }[], tva: number) =>
    lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0) * (1 + tva)

  const caTotal    = facturesPayees.reduce((s, f) => s + calcTtc(f.lignes, f.tva), 0)
  const caEnAttente = factures.filter(f => f.statut !== "PAYEE" && f.statut !== "BROUILLON")
    .reduce((s, f) => s + calcTtc(f.lignes, f.tva), 0)
  const caAnnuel   = facturesPayees.filter(f => f.createdAt >= an).reduce((s, f) => s + calcTtc(f.lignes, f.tva), 0)
  const caMois     = facturesPayees.filter(f => f.createdAt >= debut).reduce((s, f) => s + calcTtc(f.lignes, f.tva), 0)
  const caDevisSigne = devisAcceptes.reduce((s, d) => s + calcTtc(d.lignes, d.tva), 0)

  const tauxConversion = totalLeads > 0 ? Math.round((leadsGagne / totalLeads) * 100) : 0

  // CA par mois (12 mois glissants)
  const caMoisGlissant: { mois: string; ca: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d     = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const fin   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
    const ca    = facturesMois
      .filter(f => f.createdAt >= d && f.createdAt <= fin)
      .reduce((s, f) => s + calcTtc(f.lignes, f.tva), 0)
    caMoisGlissant.push({ mois: label, ca: Math.round(ca) })
  }

  // Funnel
  const funnel = await Promise.all([
    prisma.lead.count({ where: { statut: "NOUVEAU" } }),
    prisma.lead.count({ where: { statut: "CONTACTE" } }),
    prisma.lead.count({ where: { statut: "DEVIS_ENVOYE" } }),
    prisma.lead.count({ where: { statut: "GAGNE" } }),
  ])

  return NextResponse.json({
    kpis: { caTotal, caEnAttente, caAnnuel, caMois, caDevisSigne, tauxConversion, totalLeads, leadsMonth, leadsGagne, leadsPerdu, chantiers, chantiersEnCours, chantiersTermines },
    caMoisGlissant,
    sources: leadsSources.map(s => ({ source: s.source || "Inconnu", count: s._count })),
    villes:  leadsVilles.map(v => ({ ville: v.ville, count: v._count })),
    funnel:  [
      { label: "Nouveaux",     count: funnel[0], color: "bg-blue-400" },
      { label: "Contactés",    count: funnel[1], color: "bg-amber-400" },
      { label: "Devis envoyé", count: funnel[2], color: "bg-purple-400" },
      { label: "Gagnés",       count: funnel[3], color: "bg-green-500" },
    ],
  })
}
