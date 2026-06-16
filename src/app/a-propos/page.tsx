'use client'

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const certifications = [
  { nom: "Qualibat", desc: "Certification qualité bâtiment", icon: "✓" },
  { nom: "RGE", desc: "Reconnu Garant de l'Environnement", icon: "🌱" },
  { nom: "Décennale", desc: "Assurance décennale pour maçonnerie, menuiserie, isolation ITE", icon: "🛡️" },
  { nom: "KBIS", desc: "Entreprise immatriculée", icon: "📋" },
]

const valeurs = [
  {
    icon: "🎯",
    titre: "Excellence",
    desc: "Chaque chantier est traité avec le même niveau d'exigence, qu'il s'agisse d'une petite réparation ou d'une rénovation complète.",
  },
  {
    icon: "🤝",
    titre: "Transparence",
    desc: "Devis détaillé, communication claire : vous ne serez jamais sans savoir ce pour quoi vous avez payé.",
  },
  {
    icon: "⏱",
    titre: "Ponctualité",
    desc: "Une rigueur stricte sur le respect des délais annoncés. Nos engagements sont tenus.",
  },
  {
    icon: "🌱",
    titre: "Responsabilité",
    desc: "Nous privilégions des matériaux durables, des techniques économes en énergie et une gestion responsable des déchets.",
  },
]

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

export default function AProposPage() {
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
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em]">Notre histoire</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F2C5E]">
              À Propos de <span className="text-[#F97316]">Travaux Centre</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Une entreprise familiale fondée à Longuenesse, au service des habitants des Hauts de France.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Histoire Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Texte */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]">Notre histoire</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Travaux Centre est née de la passion d&apos;artisans locaux pour un travail bien fait. Fondée à Longuenesse,
                  notre entreprise s&apos;est construite sur un principe simple : traiter chaque client comme si on travaillait
                  pour un ami, avec toute l&apos;honnêteté et la rigueur que cela implique.
                </p>
                <p>
                  Depuis nos débuts, nous avons réalisé plus de 150 chantiers dans la région, de la simple peinture
                  d&apos;un appartement aux extensions de maison les plus complexes. Chaque projet nous a permis de grandir
                  et d&apos;affiner notre savoir-faire.
                </p>
                <p>
                  Aujourd&apos;hui, notre équipe de professionnels qualifiés intervient dans un rayon de 80km autour de Longuenesse, couvrant l&apos;ensemble des Hauts de France.
                </p>
                <p>
                  Travaux Centre est certifiée RGE (Reconnu Garant de l&apos;Environnement) pour les travaux d&apos;isolation et rénovation énergétique.
                </p>
              </div>
            </div>

            {/* Image et stats */}
            <div className="space-y-4">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image
                  src="/images/about.jpg"
                  alt="Équipe Travaux Centre sur chantier"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { chiffre: "+150", label: "Chantiers réalisés" },
                  { chiffre: "80km", label: "Zone d'intervention" },
                  { chiffre: "48h", label: "Délai de réponse" },
                  { chiffre: "10+", label: "Ans d'expérience" },
                ].map((stat) => (
                  <motion.div key={stat.label} variants={item} className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-[#F97316] transition-colors">
                    <p className="text-3xl font-bold text-[#F97316] mb-2">{stat.chiffre}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Nos valeurs</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]">Nos valeurs</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {valeurs.map((v) => (
              <motion.div key={v.titre} variants={item} className="bg-white rounded-2xl p-8 text-center space-y-4 border border-gray-100 hover:border-[#F97316] transition-colors">
                <div className="text-5xl">{v.icon}</div>
                <h3 className="text-xl font-bold text-[#0F2C5E]">{v.titre}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Nos garanties</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]">Nos certifications et labels</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {certifications.map((c) => (
              <motion.div key={c.nom} variants={item} className="bg-white rounded-2xl p-8 text-center space-y-3 border border-gray-100 hover:border-[#F97316] transition-colors">
                <div className="text-4xl">{c.icon}</div>
                <h3 className="text-lg font-bold text-[#0F2C5E]">{c.nom}</h3>
                <p className="text-gray-600 text-sm">{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-[#F97316]/10 to-orange-500/10 rounded-2xl p-12 border border-[#F97316]/30"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]">
            Faites confiance à des experts
          </h2>
          <p className="text-gray-700 text-lg">
            Contactez-nous pour discuter de votre projet. Travaux Centre est certifiée pour vous garantir une qualité professionnelle et des travaux conformes aux normes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/devis"
              className="bg-[#F97316] text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Devis gratuit
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
