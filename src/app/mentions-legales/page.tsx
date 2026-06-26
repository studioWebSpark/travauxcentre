'use client'

import { motion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function MentionsLegalesPage() {
  const sections = [
    {
      title: "Éditeur du site",
      content: [
        "Travaux Centre",
        "Siège social : Longuenesse, 62219 — Hauts de France",
        "Email : contact.travauxcentre@gmail.com",
        "Téléphone : 07 67 17 57 24",
      ],
    },
    {
      title: "Hébergement",
      content: [
        "Ce site est hébergé par Vercel Inc.",
        "340 Pine Street, Suite 701",
        "San Francisco, CA 94104, États-Unis",
      ],
    },
    {
      title: "Propriété intellectuelle",
      content: [
        "L'ensemble du contenu de ce site (textes, images, graphismes, logo) est la propriété exclusive de Travaux Centre et est protégé par les lois françaises et internationales sur la propriété intellectuelle.",
        "Toute reproduction, adaptation ou utilisation sans autorisation préalable est interdite.",
      ],
    },
    {
      title: "Données personnelles",
      content: [
        "Les données collectées via les formulaires sont utilisées uniquement pour traiter vos demandes de devis, planifier des rendez-vous et assurer le suivi de vos chantiers.",
        "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
        "Pour exercer vos droits, contactez-nous à contact.travauxcentre@gmail.com.",
      ],
    },
    {
      title: "Cookies",
      content: [
        "Ce site utilise uniquement des cookies techniques nécessaires au bon fonctionnement du service.",
        "Aucun cookie de traçage tiers, aucune donnée comportementale vendus à des tiers n'est utilisé.",
        "Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.",
      ],
    },
    {
      title: "Responsabilité",
      content: [
        "Les informations disponibles sur ce site sont fournies à titre informatif uniquement.",
        "Travaux Centre décline toute responsabilité en cas d'erreur, d'omission ou d'inexactitude.",
        "L'utilisateur accepte d'utiliser ce site sous sa propre responsabilité.",
      ],
    },
  ]

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
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em]">Transparence</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F2C5E]">
              Mentions <span className="text-[#F97316]">légales</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Informations légales, droits, responsabilités et conditions d'utilisation du site Travaux Centre.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl p-8 border border-gray-100 ${
                idx % 2 === 0 ? "bg-white hover:border-[#F97316]" : "bg-gray-50 hover:border-[#F97316]"
              } transition-colors`}
            >
              <h2 className="text-2xl font-bold text-[#0F2C5E] mb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#F97316] text-white flex items-center justify-center text-lg font-bold shrink-0">
                  {idx + 1}
                </span>
                {section.title}
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                {section.content.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
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
            Des questions ?
          </h2>
          <p className="text-gray-700 text-lg">
            Pour toute demande concernant vos données personnelles ou cette politique, contactez-nous directement.
          </p>
          <a
            href="mailto:contact.travauxcentre@gmail.com"
            className="inline-block bg-[#F97316] text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Nous contacter
          </a>
        </motion.div>
      </section>
    </div>
  )
}
