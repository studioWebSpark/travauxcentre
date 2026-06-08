"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { zones } from "@/lib/zones"

const services = [
  { label: "Rénovation intérieure",    href: "/services/renovation-interieure" },
  { label: "Gros œuvre & Maçonnerie",  href: "/services/gros-oeuvre" },
  { label: "Aménagement extérieur",    href: "/services/amenagement-exterieur" },
  { label: "Second œuvre",             href: "/services/second-oeuvre" },
]

const links = [
  { label: "Accueil",          href: "/" },
  { label: "Services",         href: "/services" },
  { label: "Réalisations",     href: "/realisations" },
  { label: "À propos",         href: "/a-propos" },
  { label: "Contact",          href: "/contact" },
  { label: "Mentions légales", href: "/mentions-legales" },
]

const socials = [
  {
    href: "#", label: "Facebook",
    svg: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
  },
  {
    href: "#", label: "Instagram",
    svg: <><rect x="2" y="2" width="20" height="20" rx="5" strokeWidth={2} fill="none" stroke="currentColor" /><circle cx="12" cy="12" r="4" strokeWidth={2} fill="none" stroke="currentColor" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
  },
  {
    href: "#", label: "LinkedIn",
    svg: <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
  },
]

const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function Footer() {
  const pathname = usePathname()

  if (
    pathname.startsWith("/crm") ||
    pathname.startsWith("/client") ||
    pathname.startsWith("/devis") ||
    pathname.startsWith("/planning")
  ) {
    return null
  }

  return (
    <footer className="bg-[#0F2C5E] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* SEO zones */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-[600] text-xs uppercase tracking-[0.18em] text-white/70">
              Zones d&apos;intervention — 80 km autour de Longuenesse
            </h4>
            <Link href="/zones-intervention" className="text-xs text-white/70 hover:text-[#F97316] transition-colors underline underline-offset-2">
              Voir la carte →
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {zones.map((z) => (
              <Link
                key={z.slug}
                href={`/zones-intervention/${z.slug}`}
                className="text-xs text-white/70 hover:text-[#F97316] transition-colors whitespace-nowrap"
              >
                {z.nom} ({z.codePostal})
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/8 mb-12" />

        {/* Main columns */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
        >
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
                </svg>
              </div>
              <span className="text-xl font-[800]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                Travaux<span className="text-[#F97316]">Centre</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Votre entreprise de confiance à Longuenesse pour tous vos projets de travaux
              dans un rayon de 80km.
            </p>
            <div className="flex gap-2">
              {socials.map(({ svg, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass hover:bg-white/10 transition-colors flex items-center justify-center text-white/70 hover:text-[#F97316]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{svg}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-[600] text-xs uppercase tracking-[0.18em] text-white/70 mb-5">
              Nos services
            </h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-white/70 text-sm hover:text-[#F97316] transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-[600] text-xs uppercase tracking-[0.18em] text-white/70 mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 text-sm hover:text-[#F97316] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[600] text-xs uppercase tracking-[0.18em] text-white/70 mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              {[
                { icon: MapPin, content: <>Longuenesse, 62219<br />Nord-Pas-de-Calais</> },
                {
                  icon: Phone,
                  content: (
                    <a href="tel:+33300000000" className="hover:text-white transition-colors">
                      03 XX XX XX XX
                    </a>
                  ),
                },
                {
                  icon: Mail,
                  content: (
                    <a href="mailto:contact@travauxcentre.fr" className="hover:text-white transition-colors">
                      contact@travauxcentre.fr
                    </a>
                  ),
                },
                { icon: Clock, content: "Lun – Ven : 8h – 18h" },
              ].map(({ icon: Icon, content }, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                  <Icon className="w-4 h-4 mt-0.5 text-[#F97316] shrink-0" />
                  <span>{content}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="h-px bg-white/10 mt-12 mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>© {new Date().getFullYear()} Travaux Centre. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-[#F97316] transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-[#F97316] transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
