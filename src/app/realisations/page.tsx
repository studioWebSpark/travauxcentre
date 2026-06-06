import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Nos Réalisations — Galerie de chantiers",
  description: "Découvrez nos réalisations : rénovations intérieures, maçonnerie, aménagements extérieurs dans le Nord-Pas-de-Calais. Avant / après en photos.",
}

const categories = ["Tous", "Rénovation intérieure", "Gros œuvre", "Extérieur", "Second œuvre"]

const realisations = [
  { titre: "Rénovation complète — Saint-Omer",    cat: "Rénovation intérieure", avant: "Murs abîmés, sol usé",               apres: "Peinture neuve, parquet posé, luminaires modernes",  img: "/images/real-01.jpg" },
  { titre: "Extension maison — Béthune",          cat: "Gros œuvre",            avant: "Terrain nu en friche",               apres: "Extension 30m² avec baies vitrées",                  img: "/images/real-03.jpg" },
  { titre: "Terrasse composite — Longuenesse",    cat: "Extérieur",             avant: "Pelouse irrégulière",                apres: "Terrasse 40m² composite gris anthracite",            img: "/images/amenagement-exterieur.jpg" },
  { titre: "Réfection électrique — Arras",        cat: "Second œuvre",          avant: "Tableau vétuste années 70",          apres: "Tableau Legrand neuf, installation NF C15-100",      img: "/images/real-06.jpg" },
  { titre: "Ravalement façade — Calais",          cat: "Gros œuvre",            avant: "Façade fissurée et noircie",         apres: "Enduit projeté blanc, isolation ITE 12cm",           img: "/images/real-05.jpg" },
  { titre: "Salle de bain — Hazebrouck",          cat: "Rénovation intérieure", avant: "Carrelage années 80, baignoire",     apres: "Douche à l'italienne, grands carreaux 60x60",        img: "/images/real-02.jpg" },
  { titre: "Allée béton — Aire-sur-la-Lys",      cat: "Extérieur",             avant: "Gravier envahi de mauvaises herbes", apres: "Allée béton désactivé 60m²",                        img: "/images/real-04.jpg" },
  { titre: "Isolation combles — Boulogne-s-Mer", cat: "Second œuvre",          avant: "Combles non isolés, R=0",            apres: "Soufflage laine de verre R=7, éligible MaPrimeRénov'", img: "/images/second-oeuvre.jpg" },
  { titre: "Cuisine ouverte — Saint-Omer",       cat: "Rénovation intérieure", avant: "Cloison porteuse enlevée",           apres: "Séjour/cuisine ouvert, poutre apparente",            img: "/images/renovation-interieure.jpg" },
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
              <div className="h-52 relative overflow-hidden">
                <Image src={r.img} alt={r.titre} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <span className="absolute top-3 right-3 bg-[#F97316] text-white text-xs font-semibold px-2.5 py-1 rounded-full">{r.cat}</span>
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
