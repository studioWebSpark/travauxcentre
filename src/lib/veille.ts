import Anthropic from "@anthropic-ai/sdk"

const MOTS_CLES = [
  "rénovation", "renovation", "peinture", "carrelage", "parquet", "cloison",
  "isolation", "salle de bain", "cuisine", "placo", "enduit", "ravalement",
  "facade", "maçonnerie", "maconnerie", "extension", "agrandissement",
  "toiture", "charpente", "électricité", "electricite", "plomberie",
  "chauffage", "terrasse", "dallage", "béton", "beton", "artisan",
  "travaux", "chantier", "devis", "entrepreneur"
]

// ─── Types ────────────────────────────────────────────────────────────────────

export type RawAnnonce = {
  source:      "leboncoin" | "habitissimo" | "quotatis" | "travaux" | "hellocasa" | "allovoisin" | "facebook" | "manuel"
  titre:       string
  description: string
  url:         string | null
  ville:       string | null
  prix:        string | null
}

export type AnalyseIA = {
  score:        number
  resume:       string
  typeTravaux:  string
  budgetEstime: string | null
}

// ─── LeBonCoin RSS ────────────────────────────────────────────────────────────
// Catégorie 30 = Services > Réparation/Travaux (particuliers cherchent artisans)
// Région 10 = Nord-Pas-de-Calais

const LBC_QUERIES = [
  "rénovation intérieure",
  "maçonnerie extension",
  "peinture travaux",
  "carrelage pose",
  "isolation combles",
  "salle de bain rénovation",
  "toiture couverture",
  "chantier artisan devis",
]

export async function fetchLeBonCoin(): Promise<RawAnnonce[]> {
  const results: RawAnnonce[] = []

  for (const q of LBC_QUERIES) {
    try {
      const url = `https://www.leboncoin.fr/recherche.rss?category=30&text=${encodeURIComponent(q)}&region=10`
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        signal:  AbortSignal.timeout(8000),
      })
      if (!res.ok) continue

      const xml   = await res.text()
      const items = parseRSS(xml, "leboncoin")
      results.push(...items.slice(0, 6))
    } catch { /* continue */ }
  }

  return dedup(results)
}

// ─── Habitissimo ─────────────────────────────────────────────────────────────
// Particuliers postent leurs projets de rénovation

export async function fetchHabitissimo(): Promise<RawAnnonce[]> {
  const results: RawAnnonce[] = []
  const regions = ["nord-pas-de-calais", "hauts-de-france"]

  const categories = [
    "renovation-interieure",
    "maconnerie",
    "peinture",
    "plomberie",
    "chauffage",
  ]

  for (const cat of categories) {
    for (const region of regions.slice(0, 1)) {
      try {
        const url = `https://www.habitissimo.fr/devis/${cat}/${region}`
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept":     "text/html,application/xhtml+xml",
          },
          signal: AbortSignal.timeout(8000),
        })
        if (!res.ok) continue

        const html  = await res.text()
        const items = parseHabitissimo(html)
        results.push(...items)
      } catch { /* continue */ }
    }
  }

  return dedup(results)
}

function parseHabitissimo(html: string): RawAnnonce[] {
  const items: RawAnnonce[] = []

  // Extraction des titres de demandes de devis
  const patterns = [
    /<h[23][^>]*class="[^"]*(?:title|name|project)[^"]*"[^>]*>([^<]{15,150})<\/h[23]>/gi,
    /<span[^>]*class="[^"]*(?:title|description)[^"]*"[^>]*>([^<]{15,200})<\/span>/gi,
    /data-title="([^"]{15,150})"/gi,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(html)) !== null) {
      const titre = stripHtml(match[1]).trim()
      if (titre.length > 15 && isRelevant(titre)) {
        items.push({
          source:      "habitissimo",
          titre,
          description: titre,
          url:         "https://www.habitissimo.fr",
          ville:       extractVille(titre + " " + html.slice(match.index - 200, match.index + 200)),
          prix:        null,
        })
      }
    }
  }

  return items.slice(0, 8)
}

// ─── Quotatis ─────────────────────────────────────────────────────────────────

export async function fetchQuotatis(): Promise<RawAnnonce[]> {
  const results: RawAnnonce[] = []
  const travaux = ["renovation", "maconnerie", "peinture", "isolation", "plomberie"]

  for (const t of travaux) {
    try {
      const url = `https://www.quotatis.fr/travaux/${t}/nord`
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        signal:  AbortSignal.timeout(8000),
      })
      if (!res.ok) continue

      const html  = await res.text()
      const items = parseGenericListings(html, "quotatis", `https://www.quotatis.fr/travaux/${t}/nord`)
      results.push(...items)
    } catch { /* continue */ }
  }

  return dedup(results)
}

// ─── Travaux.com ──────────────────────────────────────────────────────────────

export async function fetchTravauxCom(): Promise<RawAnnonce[]> {
  const results: RawAnnonce[] = []

  try {
    const url = "https://www.travaux.com/devis/demandes?region=nord-pas-de-calais"
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal:  AbortSignal.timeout(8000),
    })
    if (res.ok) {
      const html  = await res.text()
      const items = parseGenericListings(html, "travaux", "https://www.travaux.com")
      results.push(...items)
    }
  } catch { /* continue */ }

  return results
}

// ─── AlloVoisin ───────────────────────────────────────────────────────────────

export async function fetchAlloVoisin(): Promise<RawAnnonce[]> {
  const results: RawAnnonce[] = []

  const queries = ["rénovation", "peinture travaux", "maçonnerie"]
  for (const q of queries) {
    try {
      const url = `https://www.allovoisin.com/recherche?q=${encodeURIComponent(q)}&location=hauts-de-france`
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        signal:  AbortSignal.timeout(8000),
      })
      if (!res.ok) continue
      const html  = await res.text()
      const items = parseGenericListings(html, "allovoisin", "https://www.allovoisin.com")
      results.push(...items)
    } catch { /* continue */ }
  }

  return dedup(results)
}

// ─── Hellocasa ────────────────────────────────────────────────────────────────

export async function fetchHellocasa(): Promise<RawAnnonce[]> {
  const results: RawAnnonce[] = []

  try {
    const url = "https://www.hellocasa.fr/demandes?region=nord"
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal:  AbortSignal.timeout(8000),
    })
    if (res.ok) {
      const html  = await res.text()
      const items = parseGenericListings(html, "hellocasa" as RawAnnonce["source"], "https://www.hellocasa.fr")
      results.push(...items)
    }
  } catch { /* continue */ }

  return results
}

// ─── Parsers communs ─────────────────────────────────────────────────────────

function parseRSS(xml: string, source: RawAnnonce["source"]): RawAnnonce[] {
  const items: RawAnnonce[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block       = match[1]
    const titre       = stripHtml(extractTag(block, "title"))
    const url         = extractTag(block, "link") || extractTag(block, "guid")
    const description = stripHtml(extractTag(block, "description") || "")
    const ville       = extractVille(description + " " + titre)

    if (titre && description.length > 10 && isRelevant(titre + " " + description)) {
      items.push({ source, titre, description: description.slice(0, 600), url: url || null, ville, prix: null })
    }
  }
  return items
}

function parseGenericListings(html: string, source: RawAnnonce["source"], baseUrl: string): RawAnnonce[] {
  const items: RawAnnonce[] = []

  // Patterns communs aux sites de demandes de travaux
  const titlePatterns = [
    /<h[123][^>]*>([^<]{20,200})<\/h[123]>/gi,
    /class="[^"]*(?:title|titre|name|project-name|demand)[^"]*"[^>]*>\s*([^<]{20,200})\s*</gi,
    /data-(?:title|name)="([^"]{20,150})"/gi,
    /<(?:p|div)[^>]*class="[^"]*(?:description|desc|summary)[^"]*"[^>]*>([^<]{30,300})<\/(?:p|div)>/gi,
  ]

  for (const pattern of titlePatterns) {
    let match
    while ((match = pattern.exec(html)) !== null) {
      const titre = stripHtml(match[1]).trim()
      if (titre.length >= 20 && isRelevant(titre)) {
        // Éviter les doublons dans ce batch
        if (!items.some(i => i.titre === titre)) {
          items.push({
            source,
            titre,
            description: titre,
            url:         baseUrl,
            ville:       extractVille(html.slice(Math.max(0, match.index - 300), match.index + 300)),
            prix:        extractPrix(html.slice(Math.max(0, match.index - 200), match.index + 200)),
          })
        }
      }
    }
    if (items.length >= 8) break
  }

  return items.slice(0, 8)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractTag(xml: string, tag: string): string {
  const m = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i").exec(xml)
  return m ? m[1].trim() : ""
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#39;/g, "'")
          .replace(/\s+/g, " ").trim()
}

function extractVille(text: string): string | null {
  const villes = [
    "Longuenesse","Saint-Omer","Boulogne-sur-Mer","Calais","Arras","Lens",
    "Béthune","Valenciennes","Douai","Lille","Dunkerque","Hazebrouck",
    "Aire-sur-la-Lys","Bruay-la-Buissière","Liévin","Hénin-Beaumont",
    "Maubeuge","Cambrai","Saint-Quentin","Amiens","Abbeville",
    "Liège","Roubaix","Tourcoing","Villeneuve-d'Ascq","Marcq-en-Barœul",
  ]
  for (const v of villes) {
    if (text.toLowerCase().includes(v.toLowerCase())) return v
  }
  // Chercher code postal 59xxx ou 62xxx
  const cp = text.match(/\b(59|62)\d{3}\b/)
  return cp ? cp[0] : null
}

function extractPrix(text: string): string | null {
  const m = text.match(/(\d[\d\s]{2,6})(?:\s*€|\s*euros?)/i)
  return m ? m[0].trim() : null
}

function isRelevant(text: string): boolean {
  const t = text.toLowerCase()
  return MOTS_CLES.some(m => t.includes(m))
}

function dedup(items: RawAnnonce[]): RawAnnonce[] {
  const seen = new Set<string>()
  return items.filter(i => {
    const key = i.url && i.url !== "https://www.habitissimo.fr"
      ? i.url
      : i.titre.slice(0, 60).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ─── Scan complet ─────────────────────────────────────────────────────────────

export async function scanToutes(): Promise<RawAnnonce[]> {
  const [lbc, hab, quo, trv, allo, hello] = await Promise.allSettled([
    fetchLeBonCoin(),
    fetchHabitissimo(),
    fetchQuotatis(),
    fetchTravauxCom(),
    fetchAlloVoisin(),
    fetchHellocasa(),
  ])

  return dedup([
    ...(lbc.status   === "fulfilled" ? lbc.value   : []),
    ...(hab.status   === "fulfilled" ? hab.value   : []),
    ...(quo.status   === "fulfilled" ? quo.value   : []),
    ...(trv.status   === "fulfilled" ? trv.value   : []),
    ...(allo.status  === "fulfilled" ? allo.value  : []),
    ...(hello.status === "fulfilled" ? hello.value : []),
  ])
}

// ─── Analyse IA ──────────────────────────────────────────────────────────────

export async function analyserAvecIA(annonce: RawAnnonce): Promise<AnalyseIA> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return analyserHeuristique(annonce)

  try {
    const client = new Anthropic({ apiKey })
    const msg    = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 250,
      messages: [{
        role: "user",
        content: `Tu es un assistant pour Travaux Centre (artisans, Longuenesse 62219, Nord-Pas-de-Calais).

Annonce postée par un particulier :
Titre: ${annonce.titre}
Description: ${annonce.description.slice(0, 400)}
Ville: ${annonce.ville ?? "?"}
Source: ${annonce.source}

Réponds UNIQUEMENT en JSON :
{"score":<0-100 pertinence pour une entreprise de travaux>,"resume":"<1 phrase>","typeTravaux":"<type>","budgetEstime":"<montant ou null>"}`
      }],
    })

    const text = msg.content[0].type === "text" ? msg.content[0].text : ""
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}")
    return {
      score:        Math.min(100, Math.max(0, Number(json.score) || 0)),
      resume:       json.resume      ?? annonce.titre,
      typeTravaux:  json.typeTravaux ?? "Travaux",
      budgetEstime: json.budgetEstime ?? null,
    }
  } catch {
    return analyserHeuristique(annonce)
  }
}

function analyserHeuristique(annonce: RawAnnonce): AnalyseIA {
  const text  = (annonce.titre + " " + annonce.description).toLowerCase()
  let score   = 30

  const hits = MOTS_CLES.filter(m => text.includes(m)).length
  score += hits * 8
  if (annonce.ville)                                      score += 15
  if (text.includes("urgent") || text.includes("vite"))  score += 12
  if (text.includes("devis") || text.includes("budget")) score += 8
  if (annonce.source === "leboncoin")                     score += 5

  const typeTravaux =
    text.includes("maçon") || text.includes("extension") || text.includes("fondation")
      ? "Gros œuvre"
    : text.includes("peinture") || text.includes("enduit")
      ? "Peinture"
    : text.includes("carrelage") || text.includes("parquet")
      ? "Sols & Carrelage"
    : text.includes("salle de bain") || text.includes("plomberie")
      ? "Salle de bain"
    : text.includes("toiture") || text.includes("charpente")
      ? "Toiture"
    : "Rénovation intérieure"

  return {
    score:        Math.min(100, score),
    resume:       annonce.titre,
    typeTravaux,
    budgetEstime: annonce.prix,
  }
}
