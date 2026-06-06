import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, ArrowRight, Check } from "lucide-react"
import { zones, getZonesSortedByDistance } from "@/lib/zones"
import ZoneMapLoader from "@/components/ZoneMapLoader"

export const metadata: Metadata = {
  title: "Zones d'intervention — 80 km autour de Longuenesse",
  description:
    "Travaux Centre intervient dans un rayon de 80 km autour de Longuenesse : Saint-Omer, Calais, Boulogne-sur-Mer, Béthune, Arras, Lille, Lens, Dunkerque et 20 autres communes du Nord-Pas-de-Calais.",
  keywords: [
    "travaux saint-omer", "rénovation calais", "artisan boulogne-sur-mer",
    "travaux béthune", "entreprise travaux arras", "artisan lille",
    "rénovation lens", "travaux dunkerque", "entreprise travaux pas-de-calais",
    "rénovation nord pas de calais", "artisan hazebrouck", "travaux berck",
  ],
}

const engagements = [
  "Devis gratuit sous 48h, sans engagement",
  "Artisans certifiés RGE — Garantie décennale",
  "Déplacement offert dans toute la zone",
  "Accompagnement aides MaPrimeRénov' et CEE",
]

// Grouper les zones par tranche de distance
function groupByDistance(zones: ReturnType<typeof getZonesSortedByDistance>) {
  return {
    proche:      zones.filter((z) => z.distanceKm < 20),
    intermediaire: zones.filter((z) => z.distanceKm >= 20 && z.distanceKm < 45),
    etendue:     zones.filter((z) => z.distanceKm >= 45),
  }
}

export default function ZonesPage() {
  const sorted = getZonesSortedByDistance()
  const groups = groupByDistance(sorted)

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="bg-[#0F2C5E] py-20 mb-12 relative overflow-hidden">
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
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            Basés à <strong className="text-white">Longuenesse (62219)</strong>, nous
            intervenons dans un rayon de <strong className="text-white">80 km</strong> pour
            tous vos projets de rénovation, maçonnerie et aménagement extérieur.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1">{zones.length} communes couvertes</span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1">80 km de rayon</span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1">Devis sous 48h</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Engagements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {engagements.map((e) => (
            <div key={e} className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4 border border-gray-200">
              <span className="w-5 h-5 rounded-full bg-[#0F2C5E]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#0F2C5E]" />
              </span>
              <span className="text-sm text-gray-700 leading-snug">{e}</span>
            </div>
          ))}
        </div>

        {/* CARTE INTERACTIVE */}
        <div className="mb-16">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">Carte interactive</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2C5E]">
              Visualisez notre zone de couverture
            </h2>
            <p className="mt-2 text-gray-500 text-sm max-w-xl">
              Cliquez sur un marqueur pour voir la ville et accéder à sa page dédiée. Le cercle bleu représente le rayon de 80 km.
            </p>
          </div>
          <ZoneMapLoader />
        </div>

        {/* LISTE ZONES PAR TRANCHE */}
        <div className="mb-16 space-y-14">

          {/* Proche < 20 km */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-green-600 shrink-0" />
              <h2 className="text-xl font-bold text-[#0F2C5E]">Zone proche — moins de 20 km</h2>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-1">{groups.proche.length} communes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {groups.proche.map((zone) => (
                <ZoneCard key={zone.slug} zone={zone} accentColor="green" />
              ))}
            </div>
          </div>

          {/* Intermédiaire 20–45 km */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-[#0F2C5E] shrink-0" />
              <h2 className="text-xl font-bold text-[#0F2C5E]">Zone intermédiaire — 20 à 45 km</h2>
              <span className="text-xs bg-blue-50 text-[#0F2C5E] border border-blue-200 rounded-full px-2.5 py-1">{groups.intermediaire.length} communes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {groups.intermediaire.map((zone) => (
                <ZoneCard key={zone.slug} zone={zone} accentColor="navy" />
              ))}
            </div>
          </div>

          {/* Étendue 45–80 km */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
              <h2 className="text-xl font-bold text-[#0F2C5E]">Zone étendue — 45 à 80 km</h2>
              <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-2.5 py-1">{groups.etendue.length} communes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {groups.etendue.map((zone) => (
                <ZoneCard key={zone.slug} zone={zone} accentColor="gray" />
              ))}
            </div>
          </div>
        </div>

        {/* Votre ville non listée */}
        <div className="border border-gray-200 rounded-3xl p-10 text-center">
          <MapPin className="w-8 h-8 text-[#0F2C5E] mx-auto mb-4 opacity-40" />
          <h2 className="text-xl font-bold text-[#0F2C5E] mb-3">
            Votre ville n&apos;est pas listée ?
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-7 text-sm leading-relaxed">
            Nous étudions chaque demande individuellement. Si vous êtes dans un rayon de
            80 km autour de Longuenesse, contactez-nous pour en parler.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/devis" className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors">
              Demander un devis gratuit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center border border-gray-200 text-[#0F2C5E] font-semibold px-6 py-3 rounded-xl hover:bg-[#F8F7F4] transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

function ZoneCard({ zone, accentColor }: { zone: (typeof zones)[0]; accentColor: "green" | "navy" | "gray" }) {
  const dot = accentColor === "green" ? "bg-green-600" : accentColor === "navy" ? "bg-[#0F2C5E]" : "bg-gray-400"

  return (
    <Link href={`/zones-intervention/${zone.slug}`} className="group">
      <div className="h-full bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#0F2C5E]/30 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`} />
            <span className="text-xs text-gray-400 font-medium">{zone.codePostal}</span>
          </div>
          <span className="text-xs text-gray-300">{zone.distanceKm} km</span>
        </div>
        <h3 className="font-bold text-[#0F2C5E] text-base mb-1">{zone.nom}</h3>
        <p className="text-gray-400 text-xs mb-4">{zone.departement}</p>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {zone.intro.split(".")[0]}.
        </p>
        <span className="text-[#0F2C5E] text-xs font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Voir nos interventions <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}
