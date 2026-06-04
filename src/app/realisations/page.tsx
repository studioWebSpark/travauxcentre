import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Nos Réalisations — Galerie de chantiers",
  description: "Découvrez nos réalisations : rénovations intérieures, maçonnerie, aménagements extérieurs dans le Nord-Pas-de-Calais. Avant / après en photos.",
}

const categories = ["Tous", "Rénovation intérieure", "Gros œuvre", "Extérieur", "Second œuvre"]

const realisations = [
  { titre: "Rénovation complète — Saint-Omer",     cat: "Rénovation intérieure", avant: "Murs abîmés, sol usé",          apres: "Peinture neuve, parquet posé, luminaires modernes" },
  { titre: "Extension maison — Béthune",           cat: "Gros œuvre",            avant: "Terrain nu en friche",          apres: "Extension 30m² avec baies vitrées" },
  { titre: "Terrasse composite — Longuenesse",     cat: "Extérieur",             avant: "Pelouse irrégulière",           apres: "Terrasse 40m² composite gris anthracite" },
  { titre: "Réfection électrique — Arras",         cat: "Second œuvre",          avant: "Tableau vétuste années 70",     apres: "Tableau Legrand neuf, installation NF C15-100" },
  { titre: "Ravalement façade — Calais",           cat: "Gros œuvre",            avant: "Façade fissurée et noircie",    apres: "Enduit projeté blanc, isolation ITE 12cm" },
  { titre: "Salle de bain — Hazebrouck",           cat: "Rénovation intérieure", avant: "Carrelage années 80, baignoire",apres: "Douche à l'italienne, grands carreaux 60x60" },
  { titre: "Allée béton — Aire-sur-la-Lys",       cat: "Extérieur",             avant: "Gravier envahi de mauvaises herbes", apres: "Allée béton désactivé 60m²" },
  { titre: "Isolation combles — Boulogne-s-Mer",  cat: "Second œuvre",          avant: "Combles non isolés, R=0",       apres: "Soufflage laine de verre R=7, éligible MaPrimeRénov'" },
  { titre: "Cuisine ouverte — Saint-Omer",        cat: "Rénovation intérieure", avant: "Cloison porteuse enlevée",      apres: "Séjour/cuisine ouvert, poutre apparente" },
]

export default function RealisationsPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="bg-[#0F2C5E] py-16 mb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Nos chantiers</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Nos Réalisations
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            +150 chantiers réalisés dans la région. Découvrez nos projets avant / après.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filtres (visuels — le filtrage JS est laissé côté client) */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((c) => (
            <button key={c} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${c === "Tous" ? "bg-[#0F2C5E] text-white border-[#0F2C5E]" : "bg-white text-gray-600 border-gray-200 hover:border-[#0F2C5E] hover:text-[#0F2C5E]"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {realisations.map((r) => (
            <div key={r.titre} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
              {/* Placeholder image */}
              <div className="h-48 bg-gradient-to-br from-[#0F2C5E]/80 to-[#1a3f7a] flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                  </svg>
                </div>
                <span className="absolute top-3 right-3 bg-[#F97316] text-white text-xs font-semibold px-2.5 py-1 rounded-full">{r.cat}</span>
                <span className="absolute bottom-3 left-3 bg-black/30 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">Photo à venir</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#0F2C5E] mb-3">{r.titre}</h3>
                <div className="space-y-2">
                  <div className="flex gap-2 text-xs">
                    <span className="bg-red-50 text-red-600 font-medium px-2 py-1 rounded shrink-0">Avant</span>
                    <span className="text-gray-500">{r.avant}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-green-50 text-green-600 font-medium px-2 py-1 rounded shrink-0">Après</span>
                    <span className="text-gray-600">{r.apres}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-[#F8F7F4] rounded-3xl py-12 px-6">
          <h2 className="text-2xl font-bold text-[#0F2C5E] mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Votre projet sera notre prochaine réalisation
          </h2>
          <p className="text-gray-600 mb-8">Contactez-nous pour un devis gratuit sous 48h.</p>
          <Link href="/devis" className="inline-flex bg-[#F97316] text-white font-semibold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors">
            Demander un devis gratuit
          </Link>
        </div>
      </div>
    </div>
  )
}
