'use client'

import Link from "next/link"
import { motion } from "framer-motion"

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

export default function InformationsPage() {
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
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em]">Informations légales</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F2C5E]">
              Garantie <span className="text-[#F97316]">Décennale</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Comprendre la couverture décennale de Travaux Centre par métier et type de travaux
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Explication générale */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-blue-50 rounded-2xl p-8 border border-blue-100"
          >
            <h2 className="text-2xl font-bold text-[#0F2C5E] mb-4">Qu'est-ce que la garantie décennale ?</h2>
            <p className="text-gray-700 leading-relaxed">
              La garantie décennale est une obligation légale qui couvre les vices et malfaçons de construction pendant 10 ans après la réception des travaux. Elle s'applique uniquement à certains métiers du bâtiment selon leur domaine de compétence défini par les numéros de couverture assurantielle.
            </p>
          </motion.div>

          {/* Métiers couverts */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-[#0F2C5E]">Métiers couverts par notre garantie décennale</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* N° 11 */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F2C5E]">N° 11 — Maçonnerie et béton</h3>
                    <p className="text-sm text-gray-600 mt-1">Armé, sauf précontraint in situ</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><strong>Services couverts :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Murs porteurs et cloisons maçonnées</li>
                    <li>Fondations et dallages</li>
                    <li>Extensions et surélévations</li>
                    <li>Reprises en sous-œuvre</li>
                    <li>Ravalement de façade</li>
                  </ul>
                </div>
              </div>

              {/* N° 31.2 */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F2C5E]">N° 31.2 — Isolation thermique par l'extérieur (ITE)</h3>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><strong>Services couverts :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pose de panneaux isolants en façade</li>
                    <li>Revêtement de finition</li>
                    <li>Traitement des ponts thermiques</li>
                  </ul>
                </div>
              </div>

              {/* N° 19 */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F2C5E]">N° 19 — Menuiserie extérieure</h3>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><strong>Services couverts :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Portes et fenêtres</li>
                    <li>Volets roulants</li>
                    <li>Portes d'entrée</li>
                  </ul>
                </div>
              </div>

              {/* N° 15 */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F2C5E]">N° 15 — Couverture</h3>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><strong>Services couverts :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tuiles et ardoises</li>
                    <li>Membranes et revêtements</li>
                    <li>Gouttières et zinguerie</li>
                  </ul>
                </div>
              </div>

              {/* N° 13 */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F2C5E]">N° 13 — Charpente et structure bois</h3>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><strong>Services couverts :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Charpentes et ossatures</li>
                    <li>Planchers bois</li>
                    <li>Escaliers bois</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Métiers NON couverts */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-orange-50 rounded-2xl p-8 border-2 border-orange-200"
          >
            <h2 className="text-2xl font-bold text-[#0F2C5E] mb-6">Services NON couverts par la décennale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Peinture intérieure et extérieure",
                "Carrelage et revêtements de sol",
                "Parquet",
                "Plâtrerie et enduits légers",
                "Faux-plafonds",
                "Électricité et installation électrique",
                "Plomberie et sanitaires",
                "Isolation thermique intérieure (ITI)",
                "Terrasses (sauf structure maçonnée)",
                "Allées et dallages simples",
                "Clôtures légères",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-300 text-white flex items-center justify-center flex-shrink-0 mt-1 text-sm">−</div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Note importante */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-blue-100 rounded-2xl p-8 border border-blue-300"
          >
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong>⚠️ Important :</strong> Pour les travaux mixtes (par exemple : extension avec électricité), seuls les travaux de structure (maçonnerie N° 11) sont couverts par la décennale. Les installations électriques ne bénéficient pas de cette couverture. Nous vous conseillons de vérifier votre type de travaux avant de signer un devis.
            </p>
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
            Des questions sur la décennale ?
          </h2>
          <p className="text-gray-700 text-lg">
            Contactez-nous pour clarifier votre situation spécifique. Nous vous expliquerons précisément la couverture applicable à vos travaux.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="bg-[#F97316] text-white font-semibold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Nous contacter
            </Link>
            <Link
              href="/devis"
              className="border-2 border-[#F97316] text-[#F97316] font-semibold px-8 py-3 rounded-xl hover:bg-[#F97316]/5 transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
