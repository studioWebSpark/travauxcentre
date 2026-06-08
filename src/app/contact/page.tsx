"use client"

import { useState } from "react"
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

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erreur serveur")
      setSuccess(true)
      setForm({ nom: "", email: "", telephone: "", message: "" })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi")
    } finally {
      setLoading(false)
    }
  }

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
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em]">Contactez-nous</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F2C5E]">
              Parlons de votre <span className="text-[#F97316]">projet</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Une question ? Un projet en tête ? Notre équipe vous répond sous 24h. Contactez-nous par formulaire, téléphone ou email.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0F2C5E] text-xl mb-2">Message envoyé !</h3>
                  <p className="text-gray-600">Nous vous répondrons dans les meilleurs délais.</p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <h2 className="font-bold text-[#0F2C5E] text-2xl mb-8">Votre message</h2>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#0F2C5E] mb-2">Nom complet *</label>
                    <input
                      type="text"
                      value={form.nom}
                      onChange={set("nom")}
                      required
                      placeholder="Jean Dupont"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F2C5E] mb-2">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      required
                      placeholder="jean@exemple.fr"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F2C5E] mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      value={form.telephone}
                      onChange={set("telephone")}
                      required
                      placeholder="06 12 34 56 78"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F2C5E] mb-2">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={set("message")}
                      required
                      rows={5}
                      placeholder="Décrivez votre demande..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] resize-none text-black"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#F97316] text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60"
                  >
                    {loading ? "Envoi…" : "Envoyer le message"}
                  </motion.button>
                </form>
              )}
            </div>

            {/* Info cards */}
            <motion.div
              className="space-y-4"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                {
                  icon: "📍",
                  title: "Adresse",
                  content: "Longuenesse, 62219\nNord-Pas-de-Calais",
                },
                {
                  icon: "📞",
                  title: "Téléphone",
                  content: "07 67 17 57 24",
                },
                {
                  icon: "✉️",
                  title: "Email",
                  content: "contact.travauxcentre@gmail.com",
                },
                {
                  icon: "🕐",
                  title: "Horaires",
                  content: "Lun – Ven : 8h – 18h\nSamedi sur RDV",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={item}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#F97316] transition-colors flex gap-4"
                >
                  <div className="text-3xl shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-[#0F2C5E] mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
            Prêt à démarrer ?
          </h2>
          <p className="text-gray-700 text-lg">
            Contactez-nous dès aujourd'hui pour discuter de votre projet. Réponse garantie sous 24h.
          </p>
        </motion.div>
      </section>
    </div>
  )
}
