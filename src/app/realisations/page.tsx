'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"

const categories = ["Tous", "Rénovation intérieure", "Gros œuvre", "Extérieur", "Second œuvre"]

const realisations = [
  { titre: "Rénovation complète — Saint-Omer", cat: "Rénovation intérieure", avant: "Murs abîmés, sol usé", apres: "Peinture neuve, parquet posé, luminaires modernes", img: "/images/real-01.jpg" },
  { titre: "Extension maison — Béthune", cat: "Gros œuvre", avant: "Terrain nu en friche", apres: "Extension 30m² avec baies vitrées", img: "/images/real-03.jpg" },
  { titre: "Terrasse composite — Longuenesse", cat: "Extérieur", avant: "Pelouse irrégulière", apres: "Terrasse 40m² composite gris anthracite", img: "/images/amenagement-exterieur.jpg" },
  { titre: "Réfection électrique — Arras", cat: "Second œuvre", avant: "Tableau vétuste années 70", apres: "Tableau Legrand neuf, installation NF C15-100", img: "/images/real-06.jpg" },
  { titre: "Ravalement façade — Calais", cat: "Gros œuvre", avant: "Façade fissurée et noircie", apres: "Enduit projeté blanc, isolation ITE 12cm", img: "/images/real-05.jpg" },
  { titre: "Salle de bain — Hazebrouck", cat: "Rénovation intérieure", avant: "Carrelage années 80, baignoire", apres: "Douche à l'italienne, grands carreaux 60x60", img: "/images/real-02.jpg" },
  { titre: "Allée béton — Aire-sur-la-Lys", cat: "Extérieur", avant: "Gravier envahi de mauvaises herbes", apres: "Allée béton désactivé 60m²", img: "/images/real-04.jpg" },
  { titre: "Isolation combles — Boulogne-s-Mer", cat: "Second œuvre", avant: "Combles non isolés, R=0", apres: "Soufflage laine de verre R=7, éligible MaPrimeRénov'", img: "/images/second-oeuvre.jpg" },
  { titre: "Cuisine ouverte — Saint-Omer", cat: "Rénovation intérieure", avant: "Cloison porteuse enlevée", apres: "Séjour/cuisine ouvert, poutre apparente", img: "/images/renovation-interieure.jpg" },
]

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

export default function RealisationsPage() {
  const [selectedCat, setSelectedCat] = useState("Tous")

  const filtered = useMemo(() => {
    if (selectedCat === "Tous") return realisations
    return realisations.filter((r) => r.cat === selectedCat)
  }, [selectedCat])

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em]">Nos chantiers</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F2C5E]">
              Nos <span className="text-[#F97316]">Réalisations</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              +150 chantiers réalisés dans la région. Découvrez nos projets avant / après et l&apos;impact de nos interventions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  c === selectedCat
                    ? "bg-[#F97316] text-white"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:border-[#F97316] hover:text-[#F97316]"
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grille de réalisations */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filtered.map((r) => (
              <motion.div key={r.titre} variants={item}>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-lg hover:border-[#F97316] transition-all h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <Image
                      src={r.img}
                      alt={r.titre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-[#0F2C5E]/20" />
                    <span className="absolute top-4 right-4 bg-[#F97316] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {r.cat}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-[#0F2C5E] text-lg mb-4">{r.titre}</h3>

                    <div className="space-y-3 flex-1">
                      {/* Avant */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-red-100 text-red-700 font-bold text-xs px-2.5 py-1 rounded">Avant</span>
                        </div>
                        <p className="text-gray-600 text-sm">{r.avant}</p>
                      </div>

                      {/* Après */}
                      <div className="space-y-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-700 font-bold text-xs px-2.5 py-1 rounded">Après</span>
                        </div>
                        <p className="text-[#0F2C5E] text-sm font-medium">{r.apres}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[#F97316] font-semibold text-sm group-hover:gap-3 transition-all">
                      Voir détails <span>→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Résultat du filtrage */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune réalisation pour cette catégorie</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-[#F97316]/10 to-orange-500/10 rounded-2xl p-12 border border-[#F97316]/30"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]">
            Votre projet sera notre prochaine réalisation
          </h2>
          <p className="text-gray-700 text-lg">
            Contactez-nous pour un devis gratuit sous 48h. Nos artisans se feront un plaisir de concrétiser votre vision.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/devis"
              className="bg-[#F97316] text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Demander un devis
            </Link>
            <Link
              href="/contact"
              className="border-2 border-[#F97316] text-[#F97316] font-semibold px-8 py-3 rounded-xl hover:bg-[#F97316]/5 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
