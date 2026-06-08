"use client"

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"

const services: Record<string, {
  title: string; subtitle: string; metaDesc: string;
  intro: string; items: string[]; avantages: { titre: string; desc: string }[]
}> = {
  "renovation-interieure": {
    title:    "Rénovation Intérieure",
    subtitle: "Peinture · Carrelage · Parquet · Plâtrerie",
    metaDesc: "Entreprise de rénovation intérieure à Longuenesse. Peinture, carrelage, parquet, plâtrerie. Devis gratuit sous 48h dans un rayon de 80km.",
    intro:    "Notre équipe de rénovation intérieure accompagne particuliers et professionnels dans tous leurs projets d'embellissement et d'optimisation d'espace. De la simple peinture à la rénovation complète d'un appartement, nous garantissons des finitions soignées et des délais respectés.",
    items:    ["Peinture intérieure et décoration", "Carrelage sol et mural", "Parquet massif, contrecollé et stratifié", "Plâtrerie, enduits et rebouchage", "Faux-plafonds suspendus et dalles", "Pose de cloisons et doublages thermiques", "Rénovation de salles de bain", "Aménagement de combles"],
    avantages: [
      { titre: "Artisans qualifiés", desc: "Nos poseurs sont formés aux dernières techniques et produits du marché." },
      { titre: "Fournitures comprises", desc: "Nous pouvons gérer l'approvisionnement des matériaux pour simplifier votre vie." },
      { titre: "Nettoyage inclus", desc: "Chaque chantier se termine par un nettoyage complet du chantier." },
      { titre: "Délais tenus", desc: "Nous respectons le planning établi lors du devis. Pas de mauvaises surprises." },
    ],
  },
  "gros-oeuvre": {
    title:    "Gros Œuvre & Maçonnerie",
    subtitle: "Murs · Fondations · Extensions · Façade",
    metaDesc: "Maçon et gros œuvre à Longuenesse. Extensions, murs porteurs, fondations. Artisans certifiés RGE. Devis gratuit dans un rayon de 80km.",
    intro:    "Le gros œuvre est le squelette de votre bâtiment. Nos maçons expérimentés et certifiés RGE assurent la solidité et la durabilité de vos ouvrages, qu'il s'agisse d'une reprise en sous-œuvre, d'une extension ou d'un ravalement complet.",
    items:    ["Murs porteurs et cloisons maçonnées", "Fondations superficielles et profondes", "Extensions de maison et surélévations", "Reprises en sous-œuvre", "Ravalement et enduits de façade", "Démolition et déconstruction sélective", "Dallages et planchers béton", "Réparation de fissures structurelles"],
    avantages: [
      { titre: "Garantie décennale", desc: "Tous nos travaux de gros œuvre sont couverts par notre assurance décennale." },
      { titre: "Certification RGE", desc: "Nos artisans sont certifiés RGE pour les travaux d'amélioration énergétique." },
      { titre: "Suivi de chantier", desc: "Un chef de chantier dédié assure la coordination et le suivi quotidien." },
      { titre: "Permis de construire", desc: "Nous vous accompagnons dans vos démarches administratives si nécessaire." },
    ],
  },
  "amenagement-exterieur": {
    title:    "Aménagement Extérieur",
    subtitle: "Terrasses · Allées · Clôtures · Dalles",
    metaDesc: "Aménagement extérieur à Longuenesse. Terrasses, allées, clôtures, dalles béton. Devis gratuit sous 48h dans un rayon de 80km.",
    intro:    "Votre extérieur est le premier espace que vous et vos visiteurs découvrez. Nos équipes spécialisées créent des espaces extérieurs fonctionnels, esthétiques et durables, adaptés à votre style de vie et à votre environnement.",
    items:    ["Terrasses en bois, composite ou carrelage", "Allées en béton, pavés ou graviers", "Clôtures en bois, aluminium ou PVC", "Murets et bordures en pierre ou béton", "Portails et portillons motorisables", "Éclairage extérieur basse consommation", "Drainage et gestion des eaux pluviales", "Escaliers extérieurs"],
    avantages: [
      { titre: "Visite gratuite", desc: "Nous nous déplaçons pour étudier votre terrain et vous conseiller au mieux." },
      { titre: "Matériaux durables", desc: "Nous sélectionnons des matériaux résistants aux intempéries du Nord." },
      { titre: "Respect du voisinage", desc: "Nos chantiers respectent les règles de copropriété et le voisinage." },
      { titre: "Satisfaction garantie", desc: "Réception contradictoire et retouches incluses si nécessaire." },
    ],
  },
  "second-oeuvre": {
    title:    "Second Œuvre",
    subtitle: "Électricité · Plomberie · Isolation · VMC",
    metaDesc: "Électricité, plomberie, isolation à Longuenesse. Artisans certifiés. Travaux aux normes NF C15-100. Devis gratuit dans un rayon de 80km.",
    intro:    "Le second œuvre regroupe tous les corps de métier techniques qui donnent vie à votre habitat : électricité, plomberie, isolation, ventilation. Nos techniciens certifiés assurent des installations conformes aux normes en vigueur et durables dans le temps.",
    items:    ["Électricité aux normes NF C15-100", "Mise aux normes du tableau électrique", "Plomberie et installation sanitaire", "Chauffage central et radiateurs", "Climatisation réversible", "Isolation thermique par l'intérieur (ITI)", "Isolation thermique par l'extérieur (ITE)", "Ventilation mécanique contrôlée (VMC)"],
    avantages: [
      { titre: "Artisans certifiés", desc: "Nos techniciens détiennent les certifications Qualibat et RGE obligatoires." },
      { titre: "Aides financières", desc: "Nous vous guidons pour obtenir MaPrimeRénov' et les CEE disponibles." },
      { titre: "Conformité garantie", desc: "Tous nos travaux respectent les normes DTU et RT en vigueur." },
      { titre: "SAV réactif", desc: "En cas de problème, notre service après-vente intervient rapidement." },
    ],
  },
}

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = services[slug]
  if (!service) return {}
  return {
    title: `${service.title} à Longuenesse | Travaux Centre`,
    description: service.metaDesc,
  }
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }))
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services[slug]
  if (!service) notFound()

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="mb-6"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-[#F97316] hover:text-orange-600 text-sm font-medium transition-colors"
            >
              ← Tous les services
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em]">Service spécialisé</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F2C5E]">
              {service.title}
            </h1>
            <p className="text-gray-600 text-lg">{service.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            {service.intro}
          </motion.div>
        </div>
      </section>

      {/* Prestations */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E] mb-4">Nos prestations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Découvrez l'ensemble de nos services pour ce domaine</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {service.items.map((item) => (
              <motion.div
                key={item}
                variants={item}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#F97316] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 bg-[#F97316] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 mt-1">✓</span>
                  <p className="text-gray-700 font-medium">{item}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E] mb-4">Nos engagements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Ce qui nous distingue et ce que vous pouvez attendre de nous</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {service.avantages.map((a) => (
              <motion.div
                key={a.titre}
                variants={item}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#F97316] transition-colors"
              >
                <h3 className="font-bold text-[#0F2C5E] mb-3 text-lg">{a.titre}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </motion.div>
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
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-gray-700 text-lg">
            Contactez-nous pour un devis gratuit. Nous répondons en moins de 48h.
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
