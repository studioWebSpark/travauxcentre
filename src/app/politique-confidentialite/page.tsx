'use client'

import { motion } from "framer-motion"
import Link from "next/link"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function PolitiqueConfidentialitePage() {
  const sections = [
    {
      title: "1. Collecte des données",
      content: [
        "Nous collectons les données personnelles suivantes lorsque vous utilisez notre site :",
        "• Formulaires de contact : nom, email, téléphone, message",
        "• Demande de devis : adresse, description du projet, budget",
        "• Rendez-vous : date, heure, adresse du chantier, notes spécifiques",
        "• Connexion CRM : email, données relatives à vos chantiers",
        "Ces données sont nécessaires pour traiter vos demandes et assurer le suivi de vos projets.",
      ],
    },
    {
      title: "2. Utilisation des données",
      content: [
        "Vos données personnelles sont utilisées exclusivement pour :",
        "• Répondre à vos demandes de contact et de devis",
        "• Planifier et gérer vos rendez-vous sur site",
        "• Suivre l'avancement de vos chantiers via le portail client",
        "• Envoyer des mises à jour relatives à votre projet",
        "• Générer factures et documents contractuels",
        "Nous ne vendons, ne partageons, ni ne louons vos données personnelles à des tiers.",
      ],
    },
    {
      title: "3. Conservation des données",
      content: [
        "Les données sont conservées aussi longtemps que nécessaire pour :",
        "• Exécuter nos obligations contractuelles",
        "• Répondre aux exigences légales et réglementaires",
        "• Conserver des preuves de nos transactions (factures, devis)",
        "Après fin de votre projet, les données sont conservées 3 ans conformément à la loi française.",
        "Vous pouvez à tout moment demander la suppression de vos données.",
      ],
    },
    {
      title: "4. Sécurité des données",
      content: [
        "Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :",
        "• Chiffrement en transit (HTTPS)",
        "• Hébergement sécurisé chez Vercel et Supabase (bases de données PostgreSQL)",
        "• Contrôle d'accès restreint aux données sensibles",
        "• Authentification sécurisée pour l'accès au CRM",
        "Malgré ces précautions, nous ne pouvons garantir 100% de sécurité.",
      ],
    },
    {
      title: "5. Vos droits RGPD",
      content: [
        "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :",
        "• Droit d'accès : obtenir une copie de vos données",
        "• Droit de rectification : corriger ou compléter vos données",
        "• Droit à l'oubli : demander la suppression de vos données",
        "• Droit à la limitation du traitement : restreindre l'utilisation de vos données",
        "• Droit à la portabilité : recevoir vos données dans un format transférable",
        "Pour exercer ces droits, contactez-nous à contact.travauxcentre@gmail.com.",
      ],
    },
    {
      title: "6. Cookies et suivi",
      content: [
        "Ce site n'utilise que des cookies techniques strictement nécessaires au fonctionnement :",
        "• Cookies de session pour maintenir votre connexion au CRM",
        "• Cookies de préférences pour mémoriser vos choix",
        "Nous n'utilisons pas :",
        "• Cookies de traçage (Google Analytics, Facebook Pixel, etc.)",
        "• Cookies de publicité comportementale",
        "Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.",
      ],
    },
    {
      title: "7. Partage avec des tiers",
      content: [
        "Vos données peuvent être partagées uniquement avec :",
        "• Nos prestataires techniques (Vercel, Supabase) pour hébergement et stockage",
        "• Services de paiement (si applicable) pour traiter vos transactions",
        "• Autorités légales si légalement requis",
        "Ces prestataires sont tenus de respecter une confidentialité stricte et d'utiliser vos données uniquement à titre de sous-traitant.",
      ],
    },
    {
      title: "8. Modifications de cette politique",
      content: [
        "Nous nous réservons le droit de modifier cette politique de confidentialité.",
        "Les modifications seront publiées sur cette page avec une date de mise à jour.",
        "Une utilisation continue du site après modification implique votre acceptation des changements.",
        "Nous vous recommandons de consulter régulièrement cette page.",
      ],
    },
    {
      title: "9. Contact et réclamations",
      content: [
        "Pour toute question sur cette politique ou l'utilisation de vos données :",
        "Email : contact.travauxcentre@gmail.com",
        "Téléphone : 07 67 17 57 24",
        "Adresse : Longuenesse, 62219",
        "Vous avez également le droit de déposer une plainte auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).",
        "Site CNIL : www.cnil.fr",
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
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em]">Votre vie privée</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F2C5E]">
              Politique de <span className="text-[#F97316]">Confidentialité</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Comment nous collectons, utilisons et protégeons vos données personnelles. Conforme au RGPD.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 mb-4 font-semibold">Sommaire</p>
          <div className="flex flex-wrap gap-2">
            {sections.map((section, idx) => (
              <a
                key={idx}
                href={`#section-${idx}`}
                className="text-sm px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[#0F2C5E] hover:border-[#F97316] hover:text-[#F97316] transition-colors"
              >
                {section.title.split('.')[0]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              id={`section-${idx}`}
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

      {/* Footer Note */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-blue-50 border-t border-blue-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-sm text-gray-600"
          >
            <p>
              <strong>Dernière mise à jour :</strong> 26 juin 2026
            </p>
            <p className="mt-2">
              Si vous avez des questions, consultez nos <Link href="/mentions-legales" className="text-[#F97316] hover:underline font-semibold">mentions légales</Link>.
            </p>
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
            Vos données vous appartiennent
          </h2>
          <p className="text-gray-700 text-lg">
            Contactez-nous pour exercer vos droits ou pour toute question concernant vos données.
          </p>
          <a
            href="mailto:contact.travauxcentre@gmail.com"
            className="inline-block bg-[#F97316] text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            contact.travauxcentre@gmail.com
          </a>
        </motion.div>
      </section>
    </div>
  )
}
