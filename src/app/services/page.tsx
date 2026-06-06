import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Nos Services — Rénovation, Maçonnerie, Aménagement",
  description: "Découvrez tous nos services de travaux à Longuenesse : rénovation intérieure, gros œuvre, aménagement extérieur, second œuvre. Devis gratuit sous 48h.",
}

const services = [
  {
    slug:   "renovation-interieure",
    title:  "Rénovation Intérieure",
    desc:   "Transformez vos espaces de vie avec nos artisans spécialisés en peinture, carrelage, parquet, plâtrerie et faux-plafonds.",
    items:  ["Peinture intérieure et décoration", "Carrelage et revêtements de sol", "Parquet massif et stratifié", "Plâtrerie et enduits", "Faux-plafonds et isolation phonique", "Pose de cloisons et doublages"],
    img:    "/images/renovation-interieure.jpg",
    seoDesc: "Entreprise de rénovation intérieure à Longuenesse",
  },
  {
    slug:   "gros-oeuvre",
    title:  "Gros Œuvre & Maçonnerie",
    desc:   "Nos maçons certifiés prennent en charge tous vos travaux de structure : murs porteurs, fondations, extensions et reprises.",
    items:  ["Murs porteurs et cloisons", "Fondations et dallages", "Extensions et surélévations", "Reprises en sous-œuvre", "Ravalement de façade", "Démolition et déconstruction"],
    img:    "/images/gros-oeuvre.jpg",
    seoDesc: "Maçon et gros œuvre à Longuenesse",
  },
  {
    slug:   "amenagement-exterieur",
    title:  "Aménagement Extérieur",
    desc:   "Sublimez vos extérieurs avec nos solutions clés en main : terrasses, allées, clôtures et espaces paysagers.",
    items:  ["Terrasses en bois et composite", "Allées et dalles béton", "Clôtures et portails", "Murets et bordures", "Dalles et pavés", "Éclairage extérieur"],
    img:    "/images/amenagement-exterieur.jpg",
    seoDesc: "Aménagement extérieur à Longuenesse",
  },
  {
    slug:   "second-oeuvre",
    title:  "Second Œuvre",
    desc:   "Électricité, plomberie, isolation — nos techniciens certifiés assurent des installations durables et aux normes.",
    items:  ["Électricité et tableau électrique", "Plomberie et sanitaires", "Isolation thermique (ITE/ITI)", "Isolation acoustique", "Ventilation (VMC)", "Chauffage et climatisation"],
    img:    "/images/second-oeuvre.jpg",
    seoDesc: "Second œuvre : électricité, plomberie, isolation à Longuenesse",
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="bg-[#0F2C5E] py-16 mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Ce que nous proposons</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Tous nos services de travaux
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            De la rénovation intérieure au gros œuvre, nous couvrons l&apos;ensemble des corps de métier
            du bâtiment avec des artisans qualifiés et certifiés.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {services.map((s, i) => (
          <div key={s.slug} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
            {/* Visual */}
            <div className={`${i % 2 === 1 ? "lg:order-2" : ""} relative h-64 lg:h-80 rounded-3xl overflow-hidden`}>
              <Image src={s.img} alt={s.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-[#0F2C5E]/30" />
              <div className="absolute inset-0 flex items-end p-6">
                <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-3 py-1 rounded-full">{s.seoDesc}</span>
              </div>
            </div>

            {/* Content */}
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2C5E] mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>{s.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{s.desc}</p>
              <ul className="space-y-2 mb-8">
                {s.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-[#F97316] rounded-full flex items-center justify-center text-white text-xs shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Link href={`/services/${s.slug}`} className="bg-[#0F2C5E] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a3f7a] transition-colors text-sm">
                  En savoir plus
                </Link>
                <Link href="/devis" className="bg-[#F97316] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors text-sm">
                  Devis gratuit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-20 bg-[#F8F7F4] py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2C5E] mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Votre projet ne rentre pas dans une case ?
          </h2>
          <p className="text-gray-600 mb-8">Contactez-nous pour discuter de votre besoin spécifique. Nous avons l&apos;expertise pour tout type de chantier.</p>
          <Link href="/devis" className="inline-flex bg-[#F97316] text-white font-semibold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors">
            Demander un devis personnalisé
          </Link>
        </div>
      </div>
    </div>
  )
}
