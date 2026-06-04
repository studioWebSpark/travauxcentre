import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, ArrowRight, Check, Phone, Calendar, Shield, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  { label: "Rénovation intérieure", href: "/services/renovation-interieure" },
  { label: "Gros œuvre & Maçonnerie", href: "/services/gros-oeuvre" },
  { label: "Aménagement extérieur", href: "/services/amenagement-exterieur" },
  { label: "Second œuvre", href: "/services/second-oeuvre" },
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

      <div className="pt-24 pb-16">
        {/* Hero */}
        <div className="bg-[#0F2C5E] py-16 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/3 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-white">
            <Link
              href="/zones-intervention"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
            >
              ← Toutes les zones
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="ghost" className="border-white/20 gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                {zone.codePostal} — {zone.departement}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Travaux &amp; Rénovation à{" "}
              <span className="text-[#F97316]">{zone.nom}</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
              {zone.intro}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">

              {/* Contexte local */}
              <div>
                <h2 className="text-2xl font-bold text-[#0F2C5E] mb-4">
                  Le marché de la rénovation à {zone.nom}
                </h2>
                <p className="text-gray-600 leading-relaxed">{zone.contexte}</p>
                {zone.particularites && (
                  <div className="mt-5 bg-[#F8F7F4] border border-[#F97316]/20 rounded-2xl px-5 py-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong className="text-[#0F2C5E]">Notre expertise locale :</strong>{" "}
                      {zone.particularites}
                    </p>
                  </div>
                )}
              </div>

              {/* Projets fréquents */}
              <div>
                <h2 className="text-2xl font-bold text-[#0F2C5E] mb-5">
                  Projets fréquents à {zone.nom}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {zone.projetsFrequents.map((projet) => (
                    <li
                      key={projet}
                      className="flex items-start gap-3 bg-[#F8F7F4] rounded-xl px-4 py-3 border border-gray-100"
                    >
                      <span className="w-5 h-5 bg-[#F97316] rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                      <span className="text-sm text-gray-700">{projet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nos services */}
              <div>
                <h2 className="text-2xl font-bold text-[#0F2C5E] mb-5">
                  Nos services à {zone.nom}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((s) => (
                    <Link key={s.href} href={s.href} className="group">
                      <div className="border border-gray-100 rounded-2xl p-5 hover:border-[#F97316]/30 hover:shadow-sm transition-all">
                        <h3 className="font-bold text-[#0F2C5E] mb-1 group-hover:text-[#F97316] transition-colors">
                          {s.label}
                        </h3>
                        <span className="text-[#F97316] text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Engagements */}
              <div>
                <h2 className="text-2xl font-bold text-[#0F2C5E] mb-5">
                  Nos engagements pour vos travaux à {zone.nom}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Calendar, titre: "Devis sous 48h", desc: "Visite sur site et chiffrage détaillé offerts. Réponse garantie sous 48h." },
                    { icon: Shield,   titre: "Garantie décennale", desc: "Tous nos travaux sont couverts par notre assurance décennale sans exception." },
                    { icon: Star,     titre: "Artisans certifiés RGE", desc: "Nos équipes sont qualifiées RGE — éligibilité aux aides de l'État assurée." },
                    { icon: MapPin,   titre: "Déplacement offert", desc: `Nous venons chez vous à ${zone.nom} sans frais pour établir votre devis.` },
                  ].map((e) => {
                    const Icon = e.icon
                    return (
                      <Card key={e.titre} className="bg-[#F8F7F4] border-0">
                        <CardContent className="pt-5 pb-5">
                          <div className="w-10 h-10 bg-[#0F2C5E] rounded-xl flex items-center justify-center text-white mb-3">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-[#0F2C5E] mb-1 text-sm">{e.titre}</h3>
                          <p className="text-gray-500 text-sm">{e.desc}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">
                <div className="bg-[#0F2C5E] text-white rounded-3xl p-7">
                  <h3 className="font-bold text-xl mb-2">
                    Devis gratuit à {zone.nom}
                  </h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Obtenez un chiffrage détaillé sous 48h. Visite sur site offerte,
                    sans engagement.
                  </p>
                  <Link
                    href="/devis"
                    className="block w-full bg-[#F97316] text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors text-center"
                  >
                    Demander un devis
                  </Link>
                </div>

                <div className="bg-[#F8F7F4] rounded-3xl p-7 border border-gray-100">
                  <h3 className="font-bold text-[#0F2C5E] mb-1">Prendre rendez-vous</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Réservez directement un créneau pour votre visite.
                  </p>
                  <Link
                    href="/rendez-vous"
                    className="block w-full bg-white border border-gray-200 text-[#0F2C5E] font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-center text-sm"
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Réserver un créneau
                  </Link>
                </div>

                <div className="bg-[#F8F7F4] rounded-3xl p-7 border border-gray-100">
                  <h3 className="font-bold text-[#0F2C5E] mb-1">Nous appeler</h3>
                  <p className="text-gray-500 text-sm mb-4">Lundi – Vendredi, 8h – 18h</p>
                  <a
                    href="tel:+33300000000"
                    className="block w-full bg-white border border-gray-200 text-[#0F2C5E] font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-center text-sm"
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    03 XX XX XX XX
                  </a>
                </div>

                {/* Autres villes */}
                <div className="rounded-3xl p-7 border border-gray-100">
                  <h3 className="font-bold text-[#0F2C5E] mb-4 text-sm">Autres zones</h3>
                  <div className="flex flex-wrap gap-2">
                    {zones
                      .filter((z) => z.slug !== zone.slug)
                      .slice(0, 6)
                      .map((z) => (
                        <Link
                          key={z.slug}
                          href={`/zones-intervention/${z.slug}`}
                          className="text-xs bg-[#F8F7F4] text-[#0F2C5E] px-3 py-1.5 rounded-full hover:bg-[#0F2C5E] hover:text-white transition-colors"
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
