import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, ArrowRight, Check, Phone, Calendar, Shield, Star } from "lucide-react"
import { zones, getZone } from "@/lib/zones"

export async function generateStaticParams() {
  return zones.map((z) => ({ ville: z.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ville: string }>
}): Promise<Metadata> {
  const { ville } = await params
  const zone = getZone(ville)
  if (!zone) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://travauxcentre.fr"

  return {
    title: `Entreprise de travaux à ${zone.nom} — Devis gratuit`,
    description: `Travaux Centre intervient à ${zone.nom} (${zone.codePostal}) pour vos projets de rénovation intérieure, maçonnerie et aménagement extérieur. Devis gratuit sous 48h. Artisans certifiés RGE.`,
    keywords: [
      `travaux ${zone.nom.toLowerCase()}`,
      `rénovation ${zone.nom.toLowerCase()}`,
      `artisan ${zone.nom.toLowerCase()}`,
      `entreprise travaux ${zone.codePostal}`,
      `maçon ${zone.nom.toLowerCase()}`,
      `devis travaux ${zone.nom.toLowerCase()}`,
    ],
    alternates: {
      canonical: `${siteUrl}/zones-intervention/${zone.slug}`,
    },
    openGraph: {
      title: `Travaux & Rénovation à ${zone.nom} — Travaux Centre`,
      description: `Artisans certifiés RGE. Devis gratuit sous 48h à ${zone.nom}. Rénovation, maçonnerie, aménagement extérieur.`,
    },
  }
}

const services = [
  { label: "Rénovation intérieure",    href: "/services/renovation-interieure" },
  { label: "Gros œuvre & Maçonnerie", href: "/services/gros-oeuvre" },
  { label: "Aménagement extérieur",    href: "/services/amenagement-exterieur" },
  { label: "Second œuvre",             href: "/services/second-oeuvre" },
]

export default async function VillePage({
  params,
}: {
  params: Promise<{ ville: string }>
}) {
  const { ville } = await params
  const zone = getZone(ville)
  if (!zone) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Travaux & Rénovation à ${zone.nom}`,
    provider: {
      "@type": "LocalBusiness",
      name: "Travaux Centre",
      url: "https://travauxcentre.fr",
      telephone: "+33300000000",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Longuenesse",
        postalCode: "62219",
        addressCountry: "FR",
      },
    },
    areaServed: {
      "@type": "City",
      name: zone.nom,
      postalCode: zone.codePostal,
      addressCountry: "FR",
    },
    description: `Rénovation intérieure, maçonnerie, aménagement extérieur à ${zone.nom}. Devis gratuit sous 48h.`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Devis gratuit sous 48h, sans engagement",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-24 pb-20">
        {/* Hero */}
        <div className="bg-[#0F2C5E] py-16 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='0' y='0' width='1' height='40' fill='%23fff'/%3E%3Crect x='0' y='0' width='40' height='1' fill='%23fff'/%3E%3C/svg%3E")` }}
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-white">
            <Link
              href="/zones-intervention"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
            >
              ← Toutes les zones
            </Link>
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              {zone.codePostal} — {zone.departement}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Travaux &amp; Rénovation<br className="hidden sm:block" />
              {" "}à {zone.nom}
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
              {zone.intro}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-14">

              {/* Contexte local */}
              <div>
                <h2 className="text-xl font-bold text-[#0F2C5E] mb-3">
                  Le marché de la rénovation à {zone.nom}
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">{zone.contexte}</p>
                {zone.particularites && (
                  <div className="mt-5 border-l-2 border-[#0F2C5E]/20 pl-4 py-1">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      <strong className="text-gray-700">Notre expertise locale :</strong>{" "}
                      {zone.particularites}
                    </p>
                  </div>
                )}
              </div>

              {/* Projets fréquents */}
              <div>
                <h2 className="text-xl font-bold text-[#0F2C5E] mb-4">
                  Projets fréquents à {zone.nom}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {zone.projetsFrequents.map((projet) => (
                    <li
                      key={projet}
                      className="flex items-start gap-3 bg-[#F8F7F4] rounded-xl px-4 py-3"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#0F2C5E]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#0F2C5E]" />
                      </span>
                      <span className="text-sm text-gray-700">{projet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nos services */}
              <div>
                <h2 className="text-xl font-bold text-[#0F2C5E] mb-4">
                  Nos services à {zone.nom}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <Link key={s.href} href={s.href} className="group">
                      <div className="border border-gray-200 rounded-xl p-4 hover:border-[#0F2C5E]/30 hover:shadow-sm transition-all flex items-center justify-between">
                        <span className="font-medium text-[#0F2C5E] text-sm">{s.label}</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0F2C5E] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Engagements */}
              <div>
                <h2 className="text-xl font-bold text-[#0F2C5E] mb-4">
                  Nos engagements à {zone.nom}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Calendar, titre: "Devis sous 48h",        desc: "Visite sur site et chiffrage détaillé offerts. Réponse garantie sous 48h." },
                    { icon: Shield,   titre: "Garantie décennale",     desc: "Tous nos travaux sont couverts par notre assurance décennale sans exception." },
                    { icon: Star,     titre: "Artisans certifiés RGE", desc: "Nos équipes sont qualifiées RGE — éligibilité aux aides de l'État assurée." },
                    { icon: MapPin,   titre: "Déplacement offert",     desc: `Nous venons chez vous à ${zone.nom} sans frais pour établir votre devis.` },
                  ].map((e) => {
                    const Icon = e.icon
                    return (
                      <div key={e.titre} className="bg-[#F8F7F4] rounded-xl p-5">
                        <div className="w-8 h-8 bg-[#0F2C5E]/8 rounded-lg flex items-center justify-center text-[#0F2C5E] mb-3">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-semibold text-[#0F2C5E] mb-1 text-sm">{e.titre}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{e.desc}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-3">

                {/* CTA principal — seul élément orange */}
                <div className="bg-[#0F2C5E] text-white rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-2">
                    Devis gratuit à {zone.nom}
                  </h3>
                  <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                    Chiffrage détaillé sous 48h. Visite offerte, sans engagement.
                  </p>
                  <Link
                    href="/devis"
                    className="block w-full bg-white text-[#0F2C5E] font-semibold py-3 rounded-xl hover:bg-slate-100 transition-colors text-center text-sm"
                  >
                    Demander un devis
                  </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-[#0F2C5E] mb-1 text-sm">Prendre rendez-vous</h3>
                  <p className="text-gray-400 text-xs mb-4">Réservez un créneau pour votre visite.</p>
                  <Link
                    href="/rendez-vous"
                    className="flex items-center justify-center gap-2 w-full border border-gray-200 text-[#0F2C5E] font-medium py-2.5 rounded-xl hover:bg-[#F8F7F4] transition-colors text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    Réserver un créneau
                  </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-[#0F2C5E] mb-1 text-sm">Nous appeler</h3>
                  <p className="text-gray-400 text-xs mb-4">Lun – Ven, 8h – 18h</p>
                  <a
                    href="tel:+33300000000"
                    className="flex items-center justify-center gap-2 w-full border border-gray-200 text-[#0F2C5E] font-medium py-2.5 rounded-xl hover:bg-[#F8F7F4] transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    03 XX XX XX XX
                  </a>
                </div>

                {/* Autres villes */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Autres zones</p>
                  <div className="flex flex-wrap gap-2">
                    {zones
                      .filter((z) => z.slug !== zone.slug)
                      .slice(0, 6)
                      .map((z) => (
                        <Link
                          key={z.slug}
                          href={`/zones-intervention/${z.slug}`}
                          className="text-xs bg-[#F8F7F4] text-gray-600 px-3 py-1.5 rounded-full hover:bg-[#0F2C5E] hover:text-white transition-colors"
                        >
                          {z.nom}
                        </Link>
                      ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
