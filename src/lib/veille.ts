import Anthropic from "@anthropic-ai/sdk"

const MOTS_CLES = [
  "rénovation","renovation","peinture","carrelage","parquet","cloison",
  "isolation","salle de bain","cuisine","placo","enduit","ravalement",
  "facade","maçonnerie","maconnerie","extension","agrandissement",
  "toiture","charpente","électricité","electricite","plomberie",
  "chauffage","terrasse","dallage","béton","beton","artisan",
  "travaux","chantier","devis","entrepreneur","menuiserie","fenêtre",
]

export type RawAnnonce = {
  source:      "leboncoin" | "vivastreet" | "facebook" | "allovoisin" | "manuel"
  titre:       string
  description: string
  url:         string | null   // URL directe vers l'annonce
  ville:       string | null
  prix:        string | null
}

export type AnalyseIA = {
  score:        number
  resume:       string
  typeTravaux:  string
  budgetEstime: string | null
}

// ─── LeBonCoin via Playwright ─────────────────────────────────────────────────

export async function fetchLeBonCoin(): Promise<RawAnnonce[]> {
  const results: RawAnnonce[] = []

  try {
    // Playwright est déjà installé dans le projet
    const { chromium } = await import("playwright")
    const browser = await chromium.launch({ headless: true })
    const page    = await browser.newPage()

    // Bloquer images/CSS pour aller plus vite
    await page.route("**/*.{png,jpg,jpeg,gif,css,woff,woff2}", r => r.abort())

    const queries = [
      "rénovation intérieure",
      "maçonnerie extension",
      "peinture travaux maison",
      "isolation chantier",
    ]

    for (const q of queries) {
      try {
        await page.goto(
          `https://www.leboncoin.fr/recherche?category=30&text=${encodeURIComponent(q)}&locations=Nord-Pas-de-Calais`,
          { waitUntil: "domcontentloaded", timeout: 15000 }
        )
        await page.waitForTimeout(2000)

        // Extraire les annonces via JSON embarqué ou via le DOM
        const ads = await page.evaluate(() => {
          // Essayer __NEXT_DATA__
          const scripts = document.querySelectorAll("script[id='__NEXT_DATA__']")
          for (const s of scripts) {
            try {
              const data = JSON.parse(s.textContent || "")
              const ads  = data?.props?.pageProps?.searchData?.ads
                        || data?.props?.pageProps?.initialProps?.searchData?.ads
                        || []
              if (ads.length) return ads.map((a: any) => ({
                titre:       a.subject  || a.title || "",
                description: a.body     || a.description || a.subject || "",
                url:         a.url      || `https://www.leboncoin.fr${a.relative_url || ""}`,
                ville:       a.location?.city || a.city || null,
                prix:        a.price?.[0] ? `${a.price[0]} €` : null,
              }))
            } catch { /* continue */ }
          }

          // Fallback : extraire via DOM
          const items: { titre: string; description: string; url: string | null; ville: string | null; prix: string | null }[] = []
          document.querySelectorAll("a[data-qa-id='aditem_container']").forEach(el => {
            const titre = el.querySelector("[data-qa-id='aditem_title']")?.textContent?.trim() || ""
            const desc  = el.querySelector("[data-qa-id='aditem_description']")?.textContent?.trim() || titre
            const ville = el.querySelector("[data-qa-id='aditem_location']")?.textContent?.trim() || null
            const prix  = el.querySelector("[data-qa-id='aditem_price']")?.textContent?.trim() || null
            const href  = (el as HTMLAnchorElement).href || null
            if (titre.length > 10) items.push({ titre, description: desc, url: href, ville, prix })
          })
          return items
        })

        for (const ad of (ads || []).slice(0, 8)) {
          if (ad.titre && isRelevant(ad.titre + " " + (ad.description || ""))) {
            results.push({ source: "leboncoin", ...ad })
          }
        }
      } catch { /* continue next query */ }
    }

    await browser.close()
  } catch (e) {
    console.error("LeBonCoin fetch error:", e)
  }

  return dedup(results)
}

// ─── Vivastreet (annonces HTML publiques) ─────────────────────────────────────

export async function fetchVivastreet(): Promise<RawAnnonce[]> {
  const results: RawAnnonce[] = []
  const queries = ["renovation-maison", "travaux-artisan", "maconnerie"]

  for (const q of queries) {
    try {
      const url = `https://www.vivastreet.com/petites+annonces/${q}/hauts-de-france`
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9",
        },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) continue

      const html = await res.text()

      // Extraire les annonces avec URL directe
      const linkRegex = /href="(https:\/\/www\.vivastreet\.com\/annonce[^"]+)"[^>]*>\s*<[^>]+>\s*([^<]{15,120})/g
      let m
      while ((m = linkRegex.exec(html)) !== null) {
        const annonceUrl = m[1]
        const titre      = stripHtml(m[2]).trim()
        if (titre.length > 15 && isRelevant(titre)) {
          results.push({
            source:      "vivastreet",
            titre,
            description: titre,
            url:         annonceUrl,
            ville:       extractVille(html.slice(m.index - 500, m.index + 500)),
            prix:        extractPrix(html.slice(m.index, m.index + 300)),
          })
        }
      }

      // Fallback : chercher les titres avec data-attributes
      const attrRegex = /data-(?:title|name)="([^"]{15,120})"/g
      while ((m = attrRegex.exec(html)) !== null) {
        const titre = stripHtml(m[1]).trim()
        if (titre.length > 15 && isRelevant(titre) && !results.some(r => r.titre === titre)) {
          results.push({ source: "vivastreet", titre, description: titre, url: url, ville: null, prix: null })
        }
      }
    } catch { /* continue */ }
  }

  return dedup(results).slice(0, 15)
}

// ─── AlloVoisin ───────────────────────────────────────────────────────────────

export async function fetchAlloVoisin(): Promise<RawAnnonce[]> {
  const results: RawAnnonce[] = []
  const queries = ["rénovation", "travaux maison", "peinture"]

  for (const q of queries) {
    try {
      const url = `https://www.allovoisin.com/recherche?q=${encodeURIComponent(q)}&location=hauts-de-france`
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9",
        },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) continue

      const html = await res.text()

      // Chercher les liens d'annonces directes
      const linkRegex = /href="(https:\/\/www\.allovoisin\.com\/(?:annonce|service|demande)[^"]+)"[^>]*>([^<]{15,120})</g
      let m
      while ((m = linkRegex.exec(html)) !== null) {
        const titre = stripHtml(m[2]).trim()
        if (titre.length > 10 && isRelevant(titre)) {
          results.push({ source: "allovoisin", titre, description: titre, url: m[1], ville: extractVille(html.slice(m.index - 300, m.index + 300)), prix: null })
        }
      }

      // Fallback titres h2/h3
      const titleRegex = /<h[23][^>]*>([^<]{20,150})<\/h[23]>/gi
      while ((m = titleRegex.exec(html)) !== null) {
        const titre = stripHtml(m[1]).trim()
        if (isRelevant(titre) && !results.some(r => r.titre === titre)) {
          results.push({ source: "allovoisin", titre, description: titre, url: null, ville: extractVille(html.slice(m.index - 200, m.index + 200)), prix: null })
        }
      }
    } catch { /* continue */ }
  }

  return dedup(results).slice(0, 10)
}

// ─── Scan complet ─────────────────────────────────────────────────────────────

export async function scanToutes(): Promise<RawAnnonce[]> {
  // LeBonCoin séparé (Playwright, plus lent) + les autres en parallèle
  const [lbc, viva, allo] = await Promise.allSettled([
    fetchLeBonCoin(),
    fetchVivastreet(),
    fetchAlloVoisin(),
  ])

  return dedup([
    ...(lbc.status  === "fulfilled" ? lbc.value  : []),
    ...(viva.status === "fulfilled" ? viva.value : []),
    ...(allo.status === "fulfilled" ? allo.value : []),
  ])
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractTag(xml: string, tag: string): string {
  const m = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i").exec(xml)
  return m ? m[1].trim() : ""
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ")
          .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
          .replace(/&nbsp;/g, " ").replace(/&#39;/g, "'").replace(/&quot;/g, '"')
          .replace(/\s+/g, " ").trim()
}

function extractVille(text: string): string | null {
  const villes = [
    "Longuenesse","Saint-Omer","Boulogne-sur-Mer","Calais","Arras","Lens",
    "Béthune","Valenciennes","Douai","Lille","Dunkerque","Hazebrouck",
    "Aire-sur-la-Lys","Bruay-la-Buissière","Liévin","Hénin-Beaumont",
    "Maubeuge","Cambrai","Roubaix","Tourcoing","Villeneuve-d'Ascq",
    "Amiens","Abbeville","Boulogne","Calais","Armentières",
  ]
  const t = text.toLowerCase()
  for (const v of villes) {
    if (t.includes(v.toLowerCase())) return v
  }
  const cp = text.match(/\b(59|62)\d{3}\b/)
  return cp ? cp[0] : null
}

function extractPrix(text: string): string | null {
  const m = text.match(/(\d[\d\s]{1,6})(?:\s*€|\s*euros?)/i)
  return m ? m[0].trim() : null
}

function isRelevant(text: string): boolean {
  const t = text.toLowerCase()
  return MOTS_CLES.some(m => t.includes(m))
}

function dedup(items: RawAnnonce[]): RawAnnonce[] {
  const seen = new Set<string>()
  return items.filter(i => {
    const key = i.url && !["https://www.allovoisin.com","https://www.vivastreet.com"].includes(i.url)
      ? i.url
      : i.titre.slice(0, 60).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ─── Analyse IA ──────────────────────────────────────────────────────────────

export async function analyserAvecIA(annonce: RawAnnonce): Promise<AnalyseIA> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return analyserHeuristique(annonce)

  try {
    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 250,
      messages: [{
        role:    "user",
        content: `Tu es un assistant pour Travaux Centre (artisans BTP, Longuenesse 62219, Nord-Pas-de-Calais). Cette annonce est postée par un PARTICULIER qui cherche un artisan.

Titre: ${annonce.titre}
Description: ${annonce.description.slice(0, 400)}
Ville: ${annonce.ville ?? "?"}
Source: ${annonce.source}

Réponds UNIQUEMENT en JSON :
{"score":<0-100 pertinence pour une entreprise de travaux>,"resume":"<1 phrase claire sur le projet>","typeTravaux":"<type précis>","budgetEstime":"<fourchette ou null>"}`,
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
  score += hits * 7
  if (annonce.ville)                                      score += 15
  if (annonce.url && !annonce.url.includes("allovoisin.com/\n")) score += 5  // URL directe = meilleure qualité
  if (text.includes("urgent") || text.includes("vite"))  score += 12
  if (text.includes("devis") || text.includes("budget")) score += 8
  if (annonce.source === "leboncoin")                     score += 8

  const typeTravaux =
    text.includes("maçon") || text.includes("extension") ? "Gros œuvre"
    : text.includes("peinture") || text.includes("enduit") ? "Peinture"
    : text.includes("carrelage") || text.includes("parquet") ? "Sols & Carrelage"
    : text.includes("salle de bain") || text.includes("plomberie") ? "Salle de bain"
    : text.includes("toiture") || text.includes("charpente") ? "Toiture"
    : text.includes("isolation") ? "Isolation"
    : "Rénovation intérieure"

  return {
    score:        Math.min(100, score),
    resume:       annonce.titre,
    typeTravaux,
    budgetEstime: annonce.prix,
  }
}
