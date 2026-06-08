"use client"

import Link from "next/link"
import { motion } from "framer-motion"

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

interface ServicePageClientProps {
  service: {
    title: string
    subtitle: string
    intro: string
    items: string[]
    avantages: { titre: string; desc: string }[]
  }
}

export default function ServicePageClient({ service }: ServicePageClientProps) {
  return (
    <>
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
            {service.items.map((serviceItem) => (
              <motion.div
                key={serviceItem}
                variants={item}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#F97316] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 bg-[#F97316] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 mt-1">✓</span>
                  <p className="text-gray-700 font-medium">{serviceItem}</p>
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
    </>
  )
}
