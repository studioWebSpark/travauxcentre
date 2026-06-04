import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, ArrowRight, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="bg-[#0F2C5E] py-20 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F97316]/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-white text-center">
          <Badge variant="ghost" className="mb-6 border-white/20">
            <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
            Nord-Pas-de-Calais &amp; Hauts-de-France
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">
            Nos zones d&apos;intervention
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
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
              className="flex items-start gap-3 bg-[#F8F7F4] rounded-2xl px-5 py-4 border border-gray-100"
            >
              <span className="w-5 h-5 bg-[#F97316] rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </span>
              <span className="text-sm text-[#0F2C5E] font-medium leading-snug">{e}</span>
            </div>
          ))}
        </div>

        {/* Villes grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-[#F97316] border-[#F97316]/30">
              Villes desservies
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]">
              Retrouvez-nous près de chez vous
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
              Cliquez sur votre ville pour découvrir nos services et les types de projets
              que nous réalisons régulièrement dans votre secteur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {zones.map((zone) => (
              <Link key={zone.slug} href={`/zones-intervention/${zone.slug}`} className="group">
                <Card className="h-full hover:shadow-md hover:border-[#F97316]/30 hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-[#0F2C5E]/5 group-hover:bg-[#F97316] rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                      <MapPin className="w-5 h-5 text-[#0F2C5E] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-[#0F2C5E] text-lg mb-1">{zone.nom}</h3>
                    <p className="text-xs text-gray-400 mb-3">
                      {zone.codePostal} — {zone.departement}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                      {zone.intro.split(".")[0]}.
                    </p>
                    <span className="text-[#F97316] text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Voir nos interventions <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Votre ville non listée */}
        <div className="bg-[#F8F7F4] rounded-3xl p-10 text-center border border-gray-100">
          <h2 className="text-2xl font-bold text-[#0F2C5E] mb-3">
            Votre ville n&apos;est pas listée ?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-7">
            Nous étudions chaque demande individuellement. Si vous êtes dans un rayon de
            80 km autour de Longuenesse, il y a de bonnes chances que nous puissions
            intervenir chez vous. Contactez-nous pour en parler.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="primary" size="lg">
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
