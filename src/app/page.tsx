"use client"

import { useState, useRef, MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import ZoneMapCompactLoader from "@/components/ZoneMapCompactLoader"

// ─── Icon components ──────────────────────────────────────────────────────────

function IconHome()    { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V12h6v9"/></svg> }
function IconBrick()   { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="4" rx="1" strokeWidth={1.5}/><rect x="2" y="13" width="20" height="4" rx="1" strokeWidth={1.5}/><line x1="7" y1="7" x2="7" y2="11" strokeWidth={1.5}/><line x1="12" y1="13" x2="12" y2="17" strokeWidth={1.5}/></svg> }
function IconTree()    { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22V12m0 0l-4-4m4 4l4-4M6 12l-2-3h16l-2 3"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9L6 6h12l-2 3"/></svg> }
function IconWrench()  { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> }
function IconCheck()   { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> }
function IconPhone()   { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> }
function IconShield()  { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> }
function IconCalendar(){ return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2}/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth={2}/></svg> }
function IconTrophy()  { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-2m6 2v-2M12 17v-4m-5.5-7H5a2 2 0 00-2 2v1a5.5 5.5 0 0011 0V8a2 2 0 00-2-2h-1.5m-3 0V4a1 1 0 011-1h2a1 1 0 011 1v2m-4 0h4"/></svg> }
function IconArrow()   { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg> }

// ─── Data ─────────────────────────────────────────────────────────────────────

const services = [
  { icon: <IconHome />,   title: "Rénovation Intérieure",     desc: "Peinture, carrelage, parquet, plâtrerie, faux-plafonds — on transforme vos espaces avec soin et précision.",                 href: "/services/renovation-interieure", img: "/images/renovation-interieure.jpg" },
  { icon: <IconBrick />,  title: "Gros Œuvre & Maçonnerie",   desc: "Murs porteurs, fondations, extensions, reprises en sous-œuvre — nos maçons certifiés assurent la solidité de votre bâti.",  href: "/services/gros-oeuvre",           img: "/images/gros-oeuvre.jpg" },
  { icon: <IconTree />,   title: "Aménagement Extérieur",     desc: "Terrasses, allées, clôtures, dallages — on sublime vos extérieurs pour créer des espaces de vie agréables.",                  href: "/services/amenagement-exterieur", img: "/images/amenagement-exterieur.jpg" },
  { icon: <IconWrench />, title: "Second Œuvre",              desc: "Électricité, plomberie, isolation thermique et acoustique — des installations conformes aux normes en vigueur.",               href: "/services/second-oeuvre",         img: "/images/second-oeuvre.jpg" },
]

const avantages = [
  { icon: <IconCheck />,    title: "Société certifiée RGE", desc: "Travaux Centre est certifiée RGE (Reconnu Garant de l'Environnement). Vos travaux d'isolation et rénovation énergétique sont garantis conformes. Accès à MaPrimeRénov'." },
  { icon: <IconCalendar />, title: "Devis gratuit sous 48h",        desc: "Nous nous engageons à vous répondre rapidement. Visite sur site et chiffrage entièrement offerts." },
  { icon: <IconShield />,   title: "Garantie décennale",            desc: "Maçonnerie, menuiserie extérieure et isolation ITE couverts par notre assurance décennale pour votre tranquillité d'esprit." },
  { icon: <IconTrophy />,   title: "+150 chantiers réalisés",       desc: "Des dizaines de clients satisfaits dans la région. Notre réputation se construit chantier après chantier." },
]

const etapes = [
  { num: "01", title: "Prise de contact",        desc: "Contactez-nous par téléphone, email ou formulaire. On échange sur votre projet en moins de 24h." },
  { num: "02", title: "Visite & devis gratuit",  desc: "On se déplace chez vous pour évaluer vos besoins et vous remettre un devis détaillé sans engagement." },
  { num: "03", title: "Réalisation des travaux", desc: "Nos artisans interviennent dans les délais convenus avec un suivi rigoureux de l'avancement du chantier." },
  { num: "04", title: "Réception & garantie",    desc: "On finalise ensemble la réception du chantier. Vos travaux sont garantis décennale et SAV réactif." },
]

const villes = [
  "Saint-Omer", "Arras", "Boulogne-sur-Mer",
  "Béthune", "Calais", "Hazebrouck",
  "Aire-sur-la-Lys", "Fruges", "Lumbres",
]

// ─── Animation variants ────────────────────────────────────────────────────────

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

// ─── 3D tilt card component ────────────────────────────────────────────────────

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    setRotateX((e.clientY - centerY) / 12)
    setRotateY(-(e.clientX - centerX) / 12)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
    >
      {children}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const titleWords = ["Vos", "Travaux,"]

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-white to-gray-50">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating circles */}
          <motion.div
            className="absolute w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0) 70%)" }}
            animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(15,44,94,0.1) 0%, rgba(15,44,94,0) 70%)" }}
            animate={{ x: [50, 0, 50], y: [30, -20, 30] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-full h-full" />
          </motion.div>

          {/* Floating card shapes */}
          <motion.div
            className="absolute top-20 right-10 w-40 h-48 rounded-3xl border-2 border-[#F97316]/20"
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))" }}
          />
          <motion.div
            className="absolute bottom-32 left-10 w-32 h-40 rounded-2xl border-2 border-[#0F2C5E]/20"
            animate={{ y: [0, 25, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "linear-gradient(135deg, rgba(15,44,94,0.08), rgba(15,44,94,0.02))" }}
          />
          <motion.div
            className="absolute top-1/3 left-1/4 w-24 h-32 rounded-xl border-2 border-[#F97316]/15"
            animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.06), transparent)" }}
          />
        </div>

        <div className="relative z-10 text-center text-[#0F2C5E] px-4 sm:px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-4 py-2 text-sm font-[500] mb-8 border border-gray-200"
          >
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            Société certifiée RGE — Garantie décennale
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[1.05] mb-4 font-bold">
            <span className="flex flex-wrap justify-center gap-x-4 mb-2">
              {titleWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: easeOut }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <motion.span
              className="text-[#F97316]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: easeOut }}
            >
              Notre Expertise
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed font-[400]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            Entreprise de travaux ancrée à Longuenesse, nous intervenons dans un rayon de 80km pour
            tous vos projets de rénovation, maçonnerie et aménagement.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link
                href="/devis"
                className="btn-shine inline-flex items-center justify-center gap-2 text-white font-[600] px-8 py-4 rounded-full text-lg shadow-lg shadow-orange-500/30 transition-shadow hover:shadow-xl hover:shadow-orange-500/40"
                style={{ background: "linear-gradient(135deg, #F97316 0%, #EA6B0E 100%)" }}
              >
                Demander un Devis Gratuit
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link
                href="/services"
                className="glass inline-flex items-center justify-center gap-2 text-[#0F2C5E] font-[600] px-8 py-4 rounded-full text-lg hover:bg-white/20 transition-colors border border-white/50"
              >
                Nos Services
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 sm:gap-10"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: <IconCalendar />, label: "Devis sous 48h" },
              { icon: <IconShield />,  label: "Garantie décennale*" },
              { icon: <IconPhone />,   label: "Disponible 7j/7" },
            ].map(({ icon, label }) => (
              <motion.div
                key={label}
                variants={item}
                className="flex items-center gap-2 text-[#0F2C5E] text-sm font-[500] bg-white/80 px-4 py-2 rounded-full"
              >
                <span className="text-[#F97316]">{icon}</span>
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#0F2C5E]/40"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Ce que nous faisons</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E] mb-4">Nos domaines d&apos;expertise</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
              De la rénovation intérieure au gros œuvre, nous couvrons l&apos;ensemble des corps de métier du bâtiment.
            </p>
          </motion.div>

          {/* Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {services.map((s) => (
              <motion.div key={s.title} variants={item}>
                <TiltCard className="h-full">
                  <Link
                    href={s.href}
                    className="group bg-white h-full flex flex-col rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#F97316] transition-all border border-gray-100"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden flex-shrink-0">
                      <Image
                        src={s.img}
                        alt={s.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-[#0F2C5E]/10 group-hover:bg-[#0F2C5E]/5 transition-colors" />
                      <div className="absolute top-3 left-3 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#F97316] shadow-sm">
                        {s.icon}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-[700] text-[#0F2C5E] text-base mb-2">{s.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed flex-1">{s.desc}</p>
                      <div className="mt-4 flex items-center gap-1 text-[#F97316] text-sm font-[600] group-hover:gap-2 transition-all">
                        Découvrir <IconArrow />
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── AVANTAGES ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Pourquoi nous choisir</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E] mb-4">Nos avantages</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {avantages.map((a) => (
              <motion.div key={a.title} variants={item}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center group hover:shadow-lg hover:border-[#F97316] transition-all">
                  <div className="flex justify-center mb-4 text-[#F97316]">
                    {a.icon}
                  </div>
                  <h3 className="font-bold text-[#0F2C5E] mb-2">{a.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ÉTAPES ───────────────────────────────────────────────────────– */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Comment ça marche</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]">Notre process</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {etapes.map((e, i) => (
              <motion.div key={e.num} variants={item}>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#F97316] text-white font-bold flex items-center justify-center flex-shrink-0">
                      {e.num}
                    </div>
                    {i < etapes.length - 1 && (
                      <div className="hidden lg:block absolute left-14 top-0 w-[calc(100%+2rem)] h-0.5 bg-gradient-to-r from-[#F97316] to-transparent" style={{ width: "calc(100% + 2rem)" }} />
                    )}
                  </div>
                  <h3 className="font-bold text-[#0F2C5E] mb-2">{e.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ZONES ────────────────────────────────────────────────────────– */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Zone d'intervention</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E] mb-4">Nous intervenons dans la région</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Basés à Longuenesse, nous couvrons un rayon de 80km autour de nos locaux.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              className="lg:col-span-2 bg-gray-100 rounded-2xl overflow-hidden h-96 border border-gray-200"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <ZoneMapCompactLoader />
            </motion.div>

            <motion.div
              className="flex flex-col gap-4"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-sm text-gray-600 mb-2 font-semibold text-[#0F2C5E]">Principales villes couvertes :</p>
              {villes.map((ville) => (
                <motion.div key={ville} variants={item} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#F97316] rounded-full" />
                  <span className="text-gray-700">{ville}</span>
                </motion.div>
              ))}
              <Link href="/zones-intervention" className="mt-4 inline-flex text-[#F97316] font-semibold text-sm gap-1 hover:gap-2 transition-all">
                Voir toutes les villes <IconArrow />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-[#F97316]/10 to-orange-500/10 rounded-2xl p-12 border border-[#F97316]/30 px-4"
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
