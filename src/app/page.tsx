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
function IconStar()    { return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> }
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
  { icon: <IconCheck />,    title: "Artisans locaux certifiés RGE", desc: "Nos équipes sont qualifiées et certifiées RGE pour vous garantir des travaux conformes aux normes." },
  { icon: <IconCalendar />, title: "Devis gratuit sous 48h",        desc: "Nous nous engageons à vous répondre rapidement. Visite sur site et chiffrage entièrement offerts." },
  { icon: <IconShield />,   title: "Garantie décennale",            desc: "Tous nos travaux sont couverts par notre assurance décennale pour votre tranquillité d'esprit." },
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

const temoignages = [
  { nom: "Sophie M.",       ville: "Saint-Omer",  note: 5, texte: "Excellent travail pour notre rénovation complète. L'équipe est sérieuse, propre et respectueuse des délais. Je recommande vivement !" },
  { nom: "Jean-Pierre L.",  ville: "Béthune",     note: 5, texte: "Devis rapide, prix honnête et résultat impeccable. Nos nouvelles cloisons et notre carrelage sont parfaits. Merci à toute l'équipe." },
  { nom: "Marie C.",        ville: "Longuenesse", note: 5, texte: "Terrasse et allée réalisées en 4 jours chrono. La finition est soignée et le suivi client excellent. Une entreprise de confiance." },
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0F1E]">
        {/* Background image */}
        <Image
          src="/images/hero.jpg"
          alt="Chantier de rénovation Travaux Centre"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(15,44,94,0.55) 0%, rgba(10,15,30,0.88) 70%)" }}
          aria-hidden
        />

        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-[500] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            Artisans certifiés RGE — Garantie décennale
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[1.05] mb-4">
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
              className="gradient-text inline-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: easeOut }}
            >
              Notre Expertise
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-[400]"
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
                className="glass inline-flex items-center justify-center gap-2 text-white font-[600] px-8 py-4 rounded-full text-lg hover:bg-white/10 transition-colors"
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
              { icon: <IconShield />,  label: "Garantie décennale" },
              { icon: <IconPhone />,   label: "Disponible 7j/7" },
            ].map(({ icon, label }) => (
              <motion.div
                key={label}
                variants={item}
                className="flex items-center gap-2 text-slate-300 text-sm font-[500]"
              >
                <span className="text-[#F97316]">{icon}</span>
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0D1B2A]">
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
            <h2 className="text-3xl sm:text-4xl text-white mb-4">Nos domaines d&apos;expertise</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
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
                    className="group glass h-full flex flex-col rounded-2xl overflow-hidden hover:bg-white/8 transition-colors duration-300"
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
                      <div className="absolute inset-0 bg-[#0A0F1E]/40 group-hover:bg-[#0A0F1E]/20 transition-colors" />
                      <div className="absolute top-3 left-3 w-10 h-10 glass rounded-xl flex items-center justify-center text-[#F97316]">
                        {s.icon}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-[700] text-white text-base mb-2">{s.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed flex-1">{s.desc}</p>
                      <div className="mt-4 flex items-center gap-1 text-[#F97316] text-sm font-[600] group-hover:gap-2 transition-all">
                        En savoir plus
                        <IconArrow />
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────────────── */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Comment ça marche</p>
            <h2 className="text-3xl sm:text-4xl text-white">Notre processus en 4 étapes</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {etapes.map((e, i) => (
              <motion.div key={e.num} variants={item} className="relative">
                {/* Connector line */}
                {i < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] right-0 h-px bg-white/10" />
                )}
                <div className="text-center">
                  {/* Number circle */}
                  <div
                    className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center font-[800] text-white text-lg relative z-10"
                    style={{ background: "linear-gradient(135deg, #F97316 0%, #EA6B0E 100%)", boxShadow: "0 0 24px rgba(249,115,22,0.35)" }}
                  >
                    {e.num}
                  </div>
                  <h3 className="font-[700] text-white text-base mb-3">{e.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── AVANTAGES ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0A0F1E] relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text + CTA */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Pourquoi nous choisir</p>
              <h2 className="text-3xl sm:text-4xl text-white mb-6">
                L&apos;artisanat local au service<br />de votre projet
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8 text-sm">
                Depuis notre création, nous mettons la qualité d&apos;exécution, la transparence et la satisfaction client
                au cœur de chaque chantier. Nos artisans sont sélectionnés pour leur expertise et leur rigueur.
              </p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-block"
              >
                <Link
                  href="/devis"
                  className="btn-shine inline-flex items-center gap-2 text-white font-[600] px-6 py-3 rounded-full text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-shadow"
                  style={{ background: "linear-gradient(135deg, #F97316 0%, #EA6B0E 100%)" }}
                >
                  Obtenir un devis gratuit
                  <IconArrow />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: 2x2 advantage cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {avantages.map((a) => (
                <motion.div
                  key={a.title}
                  variants={item}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass rounded-2xl p-6"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4"
                    style={{ background: "linear-gradient(135deg, #F97316 0%, #EA6B0E 100%)" }}
                  >
                    {a.icon}
                  </div>
                  <h3 className="font-[700] text-white text-sm mb-2">{a.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{a.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Avis clients</p>
            <h2 className="text-3xl sm:text-4xl text-white">Ce que disent nos clients</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {temoignages.map((t) => (
              <motion.div
                key={t.nom}
                variants={item}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass rounded-2xl p-7"
              >
                {/* Stars */}
                <div className="flex text-[#F97316] mb-4 gap-0.5">
                  {Array.from({ length: t.note }).map((_, i) => <IconStar key={i} />)}
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 italic text-sm">&ldquo;{t.texte}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-[700] text-sm"
                    style={{ background: "linear-gradient(135deg, #F97316 0%, #EA6B0E 100%)" }}
                  >
                    {t.nom[0]}
                  </div>
                  <div>
                    <p className="font-[600] text-white text-sm">{t.nom}</p>
                    <p className="text-slate-500 text-xs">{t.ville}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ZONES D'INTERVENTION ─────────────────────────────────────────── */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-3">Zone géographique</p>
            <h2 className="text-3xl sm:text-4xl text-white mb-4">
              Nous intervenons dans un rayon de 80km
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Basés à <strong className="text-white">Longuenesse (62219)</strong>, nous couvrons l&apos;ensemble du Nord-Pas-de-Calais.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Map */}
            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden glass" style={{ minHeight: 340 }}>
              <ZoneMapCompactLoader />
            </div>

            {/* Info */}
            <div className="lg:col-span-2 flex flex-col justify-between gap-6">
              <div>
                <p className="text-slate-400 mb-5 leading-relaxed text-sm">
                  Nous couvrons <strong className="text-white">26 communes</strong> et toutes les localités environnantes.
                </p>
                <div className="space-y-2 mb-6">
                  {[
                    { color: "#22c55e", label: "Zone proche", sub: "< 20 km" },
                    { color: "#F97316", label: "Zone intermédiaire", sub: "20 à 45 km" },
                    { color: "#94a3b8", label: "Zone étendue", sub: "45 à 80 km" },
                  ].map(({ color, label, sub }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-slate-400">
                        <strong className="text-white">{label}</strong> — {sub}
                      </span>
                    </div>
                  ))}
                </div>

                {/* City badges */}
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={container}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {villes.map((v) => (
                    <motion.span
                      key={v}
                      variants={item}
                      className="glass text-slate-300 text-xs font-[500] px-3 py-1.5 rounded-full"
                    >
                      {v}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/zones-intervention"
                  className="glass inline-flex items-center justify-center gap-2 text-white font-[600] px-5 py-3 rounded-full text-sm hover:bg-white/8 transition-colors"
                >
                  Voir toutes nos zones
                  <IconArrow />
                </Link>
                <Link
                  href="/devis"
                  className="btn-shine inline-flex items-center justify-center gap-2 text-white font-[600] px-5 py-3 rounded-full text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-shadow"
                  style={{ background: "linear-gradient(135deg, #F97316 0%, #EA6B0E 100%)" }}
                >
                  Devis gratuit sous 48h
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-[#0A0F1E] relative overflow-hidden">
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(249,115,22,0.12) 0%, transparent 70%)" }}
          aria-hidden
        />

        <motion.div
          className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-[#F97316] font-[600] text-xs uppercase tracking-[0.2em] mb-4">Prêt à commencer ?</p>
          <h2 className="text-4xl sm:text-5xl text-white mb-6 leading-tight">
            Démarrez votre projet{" "}
            <span className="gradient-text">dès aujourd&apos;hui</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Contactez-nous pour obtenir votre devis gratuit. Nos artisans se déplacent chez vous
            et vous remettent un chiffrage détaillé sous 48h, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link
                href="/rendez-vous"
                className="btn-shine inline-flex items-center justify-center gap-2 text-white font-[600] px-8 py-4 rounded-full text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 transition-shadow"
                style={{ background: "linear-gradient(135deg, #F97316 0%, #EA6B0E 100%)" }}
              >
                Prendre Rendez-vous
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <a
                href="tel:+33300000000"
                className="glass inline-flex items-center justify-center gap-2 text-white font-[600] px-8 py-4 rounded-full text-lg hover:bg-white/8 transition-colors"
              >
                <IconPhone />
                03 XX XX XX XX
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
