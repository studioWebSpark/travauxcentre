'use client'

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const services = [
  {
    slug: "renovation-interieure",
    title: "Rénovation Intérieure",
    desc: "Transformez vos espaces de vie avec nos artisans spécialisés en peinture, carrelage, parquet, plâtrerie et faux-plafonds.",
    items: ["Peinture intérieure et décoration", "Carrelage et revêtements de sol", "Parquet massif et stratifié", "Plâtrerie et enduits", "Faux-plafonds et isolation phonique", "Pose de cloisons et doublages"],
    img: "/images/renovation-interieure.jpg",
    icon: "🏠",
  },
  {
    slug: "gros-oeuvre",
    title: "Gros Œuvre & Maçonnerie",
    desc: "Nos maçons certifiés prennent en charge tous vos travaux de structure : murs porteurs, fondations, extensions et reprises.",
    items: ["Murs porteurs et cloisons", "Fondations et dallages", "Extensions et surélévations", "Reprises en sous-œuvre", "Ravalement de façade", "Démolition et déconstruction"],
    img: "/images/gros-oeuvre.jpg",
    icon: "🧱",
  },
  {
    slug: "amenagement-exterieur",
    title: "Aménagement Extérieur",
    desc: "Sublimez vos extérieurs avec nos solutions clés en main : terrasses, allées, clôtures et espaces paysagers.",
    items: ["Terrasses en bois et composite", "Allées et dalles béton", "Clôtures et portails", "Murets et bordures", "Dalles et pavés", "Éclairage extérieur"],
    img: "/images/amenagement-exterieur.jpg",
    icon: "🌳",
  },
  {
    slug: "second-oeuvre",
    title: "Second Œuvre",
    desc: "Électricité, plomberie, isolation — nos techniciens certifiés assurent des installations durables et aux normes.",
    items: ["Électricité et tableau électrique", "Plomberie et sanitaires", "Isolation thermique (ITE/ITI)", "Isolation acoustique", "Ventilation (VMC)", "Chauffage et climatisation"],
    img: "/images/second-oeuvre.jpg",
    icon: "🔧",
  },
]

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

export default function ServicesPage() {
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
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em]">Ce que nous proposons</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F2C5E]">
              Tous nos <span className="text-[#F97316]">services</span> de travaux
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              De la rénovation intérieure au gros œuvre, nous couvrons l&apos;ensemble des corps de métier du bâtiment avec des artisans qualifiés et certifiés.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {services.map((s) => (
              <motion.div key={s.slug} variants={item}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 p-6 h-full flex flex-col hover:shadow-lg hover:border-[#F97316] transition-all"
                >
                  <div className="text-5xl mb-4">{s.icon}</div>
                  <h3 className="text-xl font-bold text-[#0F2C5E] mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">{s.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-[#F97316] font-semibold text-sm group-hover:gap-3 transition-all">
                    En savoir plus <span>→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-20">
          {services.map((s, i) => (
            <motion.div
              key={s.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Image */}
              <div className={`${i % 2 === 1 ? "lg:order-2" : ""} relative h-64 lg:h-80 rounded-2xl overflow-hidden`}>
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[#0F2C5E]/20" />
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E] mb-4">{s.title}</h2>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">{s.desc}</p>
                <ul className="space-y-3 mb-8">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-[#F97316] rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Link
                    href={`/services/${s.slug}`}
                    className="bg-[#F97316] text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    En savoir plus
                  </Link>
                  <Link
                    href="/devis"
                    className="border-2 border-[#F97316] text-[#F97316] font-semibold px-6 py-3 rounded-xl hover:bg-[#F97316]/5 transition-colors"
                  >
                    Devis gratuit
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
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
