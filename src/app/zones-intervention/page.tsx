import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { zones } from "@/lib/zones"

export const metadata: Metadata = {
  title: "Zones d'intervention — Travaux Centre",
  description:
    "Travaux Centre intervient dans un rayon de 80 km autour de Longuenesse : Lens, Hénin-Beaumont, Béthune, Arras, Lille, Boulogne-sur-Mer, Berck, Hazebrouck et toutes les communes du Nord-Pas-de-Calais.",
  keywords: [
    "travaux lens",
    "rénovation hénin-beaumont",
    "entreprise travaux béthune",
    "artisan arras",
    "travaux lille métropole",
    "rénovation boulogne-sur-mer",
    "travaux berck",
    "artisan hazebrouck",
    "entreprise travaux pas-de-calais",
    "rénovation nord pas de calais",
  ],
}

const engagements = [
  "Devis gratuit sous 48h, sans engagement",
  "Artisans certifiés RGE — Garantie décennale",
  "Déplacement offert dans toute la zone",
  "Accompagnement aides MaPrimeRénov' et CEE",
]

export default function ZonesPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="bg-[#0F2C5E] py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='0' y='0' width='1' height='40' fill='%23fff'/%3E%3Crect x='0' y='0' width='40' height='1' fill='%23fff'/%3E%3C/svg%3E")` }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-white text-center">
          <p className="text-slate-400 text-sm font-medium tracking-widest uppercase mb-5">
            Nord-Pas-de-Calais &amp; Hauts-de-France
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Nos zones d&apos;intervention
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Basés à <strong className="text-white">Longuenesse (62219)</strong>, nous
            intervenons dans un rayon de 80 km pour tous vos projets de rénovation,
            maçonnerie et aménagement extérieur.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Engagements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {engagements.map((e) => (
            <div
              key={e}
              className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4 border border-gray-200"
            >
              <span className="w-4 h-4 rounded-full bg-[#0F2C5E]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-[#0F2C5E]" />
              </span>
              <span className="text-sm text-gray-700 leading-snug">{e}</span>
            </div>
          ))}
        </div>

        {/* Villes grid */}
        <div className="mb-16">
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
              Villes desservies
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]">
              Retrouvez-nous près de chez vous
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl text-[15px] leading-relaxed">
              Cliquez sur votre ville pour découvrir nos services et les projets
              que nous réalisons régulièrement dans votre secteur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones.map((zone) => (
              <Link key={zone.slug} href={`/zones-intervention/${zone.slug}`} className="group">
                <div className="h-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#0F2C5E]/30 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-400">{zone.codePostal}</span>
                  </div>
                  <h3 className="font-bold text-[#0F2C5E] text-lg mb-2">{zone.nom}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-5">
                    {zone.intro.split(".")[0]}.
                  </p>
                  <span className="text-[#0F2C5E] text-sm font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Voir nos interventions <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Votre ville non listée */}
        <div className="border border-gray-200 rounded-3xl p-10 text-center">
          <h2 className="text-xl font-bold text-[#0F2C5E] mb-3">
            Votre ville n&apos;est pas listée ?
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-7 text-sm leading-relaxed">
            Nous étudions chaque demande individuellement. Si vous êtes dans un rayon de
            80 km autour de Longuenesse, contactez-nous pour en parler.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" size="lg">
              <Link href="/devis">
                Demander un devis gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
