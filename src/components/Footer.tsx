import Link from "next/link"
import { MapPin, Phone, Mail, Clock, HardHat } from "lucide-react"
import { Separator } from "@/components/ui/separator"

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

export default function Footer() {
  return (
    <footer className="bg-[#0a1f42] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[#F97316] flex items-center justify-center">
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Travaux<span className="text-[#F97316]">Centre</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Votre entreprise de confiance à Longuenesse pour tous vos projets de travaux
              dans un rayon de 80km.
            </p>
            <div className="flex gap-2">
              {socials.map(({ svg, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-[#F97316] transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{svg}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-slate-500 mb-5">
              Nos services
            </h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-slate-400 text-sm hover:text-[#F97316] transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-slate-500 mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 text-sm hover:text-[#F97316] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-slate-500 mb-5">
              Contact
            </h4>
            <ul className="space-y-3">
              {[
                { icon: MapPin, content: <>Longuenesse, 62219<br />Nord-Pas-de-Calais</> },
                {
                  icon: Phone,
                  content: (
                    <a href="tel:+33300000000" className="hover:text-[#F97316] transition-colors">
                      03 XX XX XX XX
                    </a>
                  ),
                },
                {
                  icon: Mail,
                  content: (
                    <a href="mailto:contact@travauxcentre.fr" className="hover:text-[#F97316] transition-colors">
                      contact@travauxcentre.fr
                    </a>
                  ),
                },
                { icon: Clock, content: "Lun – Ven : 8h – 18h" },
              ].map(({ icon: Icon, content }, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                  <Icon className="w-4 h-4 mt-0.5 text-[#F97316] shrink-0" />
                  <span>{content}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mt-12 bg-white/8" />

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Travaux Centre. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-slate-300 transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-slate-300 transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
