import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "À Propos — Notre histoire, nos valeurs, notre équipe",
  description: "Découvrez l'histoire de Travaux Centre, entreprise familiale à Longuenesse. Nos valeurs, nos certifications et notre équipe d'artisans qualifiés.",
}

const certifications = [
  { nom: "Qualibat",           desc: "Certification qualité bâtiment" },
  { nom: "RGE",               desc: "Reconnu Garant de l'Environnement" },
  { nom: "Décennale",         desc: "Assurance garantie décennale" },
  { nom: "KBIS",              desc: "Entreprise immatriculée" },
]

const valeurs = [
  {
    icon: "🎯",
    titre: "Excellence",
    desc: "Chaque chantier est traité avec le même niveau d'exigence, qu'il s'agisse d'une petite réparation ou d'une rénovation complète.",
  },
  {
    icon: "🤝",
    titre: "Transparence",
    desc: "Devis détaillé, communication claire, pas de mauvaises surprises. Vous savez exactement ce que vous payez et pourquoi.",
  },
  {
    icon: "⏱",
    titre: "Ponctualité",
    desc: "Nous respectons les délais annoncés. Votre temps est précieux, et les engagements pris sont tenus.",
  },
  {
    icon: "🌱",
    titre: "Responsabilité",
    desc: "Nous privilégions des matériaux durables, des techniques économes en énergie et une gestion responsable des déchets de chantier.",
  },
]

const equipe = [
  { nom: "Marc Dupont",   role: "Gérant — Chef de chantier",        experience: "15 ans d'expérience" },
  { nom: "Pierre Martin", role: "Maçon certifié RGE",               experience: "12 ans d'expérience" },
  { nom: "Julie Bernard", role: "Coordinatrice chantiers & devis",  experience: "8 ans d'expérience" },
  { nom: "Thomas Leroy",  role: "Électricien certifié NF C15-100",  experience: "10 ans d'expérience" },
]

export default function AProposPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="bg-[#0F2C5E] py-16 mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-[#6B7280] font-semibold text-sm uppercase tracking-widest mb-3">Notre histoire</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5" style={{ fontFamily: "var(--font-playfair), serif" }}>
            À Propos de Travaux Centre
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Une entreprise familiale fondée à Longuenesse, au service des habitants du Nord-Pas-de-Calais.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Histoire */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2C5E] mb-5" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Notre histoire
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Travaux Centre est née de la passion d&apos;artisans locaux pour un travail bien fait. Fondée à Longuenesse,
                notre entreprise s&apos;est construite sur un principe simple : traiter chaque client comme si on travaillait
                pour un ami, avec toute l&apos;honnêteté et la rigueur que cela implique.
              </p>
              <p>
                Depuis nos débuts, nous avons réalisé plus de 150 chantiers dans la région, de la simple peinture
                d&apos;un appartement aux extensions de maison les plus complexes. Chaque projet nous a permis de grandir
                et d&apos;affiner notre savoir-faire.
              </p>
              <p>
                Aujourd&apos;hui, notre équipe de professionnels qualifiés et certifiés RGE intervient dans un rayon de
                80km autour de Longuenesse, couvrant l&apos;ensemble du Nord-Pas-de-Calais.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { chiffre: "+150", label: "Chantiers réalisés" },
              { chiffre: "80km", label: "Zone d'intervention" },
              { chiffre: "48h",  label: "Délai de réponse" },
              { chiffre: "10+",  label: "Ans d'expérience" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#F8F7F4] rounded-2xl p-6 text-center border border-gray-100">
                <p className="text-3xl font-bold text-[#0F2C5E] mb-1" style={{ fontFamily: "var(--font-playfair), serif" }}>{stat.chiffre}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Valeurs */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2C5E]" style={{ fontFamily: "var(--font-playfair), serif" }}>Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeurs.map((v) => (
              <div key={v.titre} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-[#0F2C5E] mb-2">{v.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-[#0F2C5E] rounded-3xl p-10 text-white">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>Nos certifications</h2>
            <p className="text-slate-300">Des garanties concrètes pour votre tranquillité d&apos;esprit</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((c) => (
              <div key={c.nom} className="bg-white/10 rounded-2xl p-5 text-center border border-white/10">
                <div className="w-12 h-12 bg-[#6B7280] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <p className="font-bold text-lg">{c.nom}</p>
                <p className="text-slate-300 text-xs mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Équipe */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2C5E]" style={{ fontFamily: "var(--font-playfair), serif" }}>Notre équipe</h2>
            <p className="mt-3 text-gray-600">Des professionnels passionnés à votre service</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipe.map((m) => (
              <div key={m.nom} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-[#0F2C5E] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {m.nom[0]}
                </div>
                <h3 className="font-bold text-[#0F2C5E]">{m.nom}</h3>
                <p className="text-[#6B7280] text-sm font-medium mt-1">{m.role}</p>
                <p className="text-gray-400 text-xs mt-2">{m.experience}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#F8F7F4] rounded-3xl py-14 px-6">
          <h2 className="text-2xl font-bold text-[#0F2C5E] mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Travaillons ensemble
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Vous avez un projet ? Rencontrons-nous. Le premier rendez-vous est gratuit et sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/devis" className="bg-[#6B7280] text-white font-semibold px-8 py-4 rounded-xl hover:bg-gray-600 transition-colors">
              Demander un devis
            </Link>
            <Link href="/contact" className="bg-[#0F2C5E] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1a3f7a] transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
