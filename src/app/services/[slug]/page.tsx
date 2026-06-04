import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

const services: Record<string, {
  title: string; subtitle: string; metaDesc: string;
  intro: string; items: string[]; avantages: { titre: string; desc: string }[]
}> = {
  "renovation-interieure": {
    title:    "Rénovation Intérieure",
    subtitle: "Peinture · Carrelage · Parquet · Plâtrerie",
    metaDesc: "Entreprise de rénovation intérieure à Longuenesse. Peinture, carrelage, parquet, plâtrerie. Devis gratuit sous 48h dans un rayon de 80km.",
    intro:    "Notre équipe de rénovation intérieure accompagne particuliers et professionnels dans tous leurs projets d'embellissement et d'optimisation d'espace. De la simple peinture à la rénovation complète d'un appartement, nous garantissons des finitions soignées et des délais respectés.",
    items:    ["Peinture intérieure et décoration", "Carrelage sol et mural", "Parquet massif, contrecollé et stratifié", "Plâtrerie, enduits et rebouchage", "Faux-plafonds suspendus et dalles", "Pose de cloisons et doublages thermiques", "Rénovation de salles de bain", "Aménagement de combles"],
    avantages: [
      { titre: "Artisans qualifiés", desc: "Nos poseurs sont formés aux dernières techniques et produits du marché." },
      { titre: "Fournitures comprises", desc: "Nous pouvons gérer l'approvisionnement des matériaux pour simplifier votre vie." },
      { titre: "Nettoyage inclus", desc: "Chaque chantier se termine par un nettoyage complet du chantier." },
      { titre: "Délais tenus", desc: "Nous respectons le planning établi lors du devis. Pas de mauvaises surprises." },
    ],
  },
  "gros-oeuvre": {
    title:    "Gros Œuvre & Maçonnerie",
    subtitle: "Murs · Fondations · Extensions · Façade",
    metaDesc: "Maçon et gros œuvre à Longuenesse. Extensions, murs porteurs, fondations. Artisans certifiés RGE. Devis gratuit dans un rayon de 80km.",
    intro:    "Le gros œuvre est le squelette de votre bâtiment. Nos maçons expérimentés et certifiés RGE assurent la solidité et la durabilité de vos ouvrages, qu'il s'agisse d'une reprise en sous-œuvre, d'une extension ou d'un ravalement complet.",
    items:    ["Murs porteurs et cloisons maçonnées", "Fondations superficielles et profondes", "Extensions de maison et surélévations", "Reprises en sous-œuvre", "Ravalement et enduits de façade", "Démolition et déconstruction sélective", "Dallages et planchers béton", "Réparation de fissures structurelles"],
    avantages: [
      { titre: "Garantie décennale", desc: "Tous nos travaux de gros œuvre sont couverts par notre assurance décennale." },
      { titre: "Certification RGE", desc: "Nos artisans sont certifiés RGE pour les travaux d'amélioration énergétique." },
      { titre: "Suivi de chantier", desc: "Un chef de chantier dédié assure la coordination et le suivi quotidien." },
      { titre: "Permis de construire", desc: "Nous vous accompagnons dans vos démarches administratives si nécessaire." },
    ],
  },
  "amenagement-exterieur": {
    title:    "Aménagement Extérieur",
    subtitle: "Terrasses · Allées · Clôtures · Dalles",
    metaDesc: "Aménagement extérieur à Longuenesse. Terrasses, allées, clôtures, dalles béton. Devis gratuit sous 48h dans un rayon de 80km.",
    intro:    "Votre extérieur est le premier espace que vous et vos visiteurs découvrez. Nos équipes spécialisées créent des espaces extérieurs fonctionnels, esthétiques et durables, adaptés à votre style de vie et à votre environnement.",
    items:    ["Terrasses en bois, composite ou carrelage", "Allées en béton, pavés ou graviers", "Clôtures en bois, aluminium ou PVC", "Murets et bordures en pierre ou béton", "Portails et portillons motorisables", "Éclairage extérieur basse consommation", "Drainage et gestion des eaux pluviales", "Escaliers extérieurs"],
    avantages: [
      { titre: "Visite gratuite", desc: "Nous nous déplaçons pour étudier votre terrain et vous conseiller au mieux." },
      { titre: "Matériaux durables", desc: "Nous sélectionnons des matériaux résistants aux intempéries du Nord." },
      { titre: "Respect du voisinage", desc: "Nos chantiers respectent les règles de copropriété et le voisinage." },
      { titre: "Satisfaction garantie", desc: "Réception contradictoire et retouches incluses si nécessaire." },
    ],
  },
  "second-oeuvre": {
    title:    "Second Œuvre",
    subtitle: "Électricité · Plomberie · Isolation · VMC",
    metaDesc: "Électricité, plomberie, isolation à Longuenesse. Artisans certifiés. Travaux aux normes NF C15-100. Devis gratuit dans un rayon de 80km.",
    intro:    "Le second œuvre regroupe tous les corps de métier techniques qui donnent vie à votre habitat : électricité, plomberie, isolation, ventilation. Nos techniciens certifiés assurent des installations conformes aux normes en vigueur et durables dans le temps.",
    items:    ["Électricité aux normes NF C15-100", "Mise aux normes du tableau électrique", "Plomberie et installation sanitaire", "Chauffage central et radiateurs", "Climatisation réversible", "Isolation thermique par l'intérieur (ITI)", "Isolation thermique par l'extérieur (ITE)", "Ventilation mécanique contrôlée (VMC)"],
    avantages: [
      { titre: "Artisans certifiés", desc: "Nos techniciens détiennent les certifications Qualibat et RGE obligatoires." },
      { titre: "Aides financières", desc: "Nous vous guidons pour obtenir MaPrimeRénov' et les CEE disponibles." },
      { titre: "Conformité garantie", desc: "Tous nos travaux respectent les normes DTU et RT en vigueur." },
      { titre: "SAV réactif", desc: "En cas de problème, notre service après-vente intervient rapidement." },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = services[slug]
  if (!service) return {}
  return {
    title: `${service.title} à Longuenesse`,
    description: service.metaDesc,
  }
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }))
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services[slug]
  if (!service) notFound()

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100 py-16 mb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services" className="inline-flex items-center gap-1 text-gray-400 hover:text-[#0F2C5E] text-sm mb-6 transition-colors">
            ← Tous les services
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2C5E] mb-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
            {service.title}
          </h1>
          <p className="text-gray-400 font-medium">{service.subtitle}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0F2C5E] mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>Notre expertise</h2>
              <p className="text-gray-600 leading-relaxed">{service.intro}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0F2C5E] mb-5" style={{ fontFamily: "var(--font-playfair), serif" }}>Nos prestations</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700 bg-[#F8F7F4] rounded-xl px-4 py-3">
                    <span className="w-5 h-5 bg-[#0F2C5E] rounded-full flex items-center justify-center text-white text-xs shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0F2C5E] mb-5" style={{ fontFamily: "var(--font-playfair), serif" }}>Nos engagements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.avantages.map((a) => (
                  <div key={a.titre} className="border border-gray-100 rounded-2xl p-5">
                    <h3 className="font-bold text-[#0F2C5E] mb-1">{a.titre}</h3>
                    <p className="text-gray-500 text-sm">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              <div className="bg-[#0F2C5E] text-white rounded-3xl p-7">
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: "var(--font-playfair), serif" }}>Devis gratuit</h3>
                <p className="text-slate-300 text-sm mb-6">Obtenez un chiffrage détaillé sous 48h, sans engagement.</p>
                <Link href="/devis" className="block w-full bg-[#0F2C5E] text-white font-semibold py-3 rounded-xl hover:bg-[#0F2C5E]/90 transition-colors text-center">
                  Demander un devis
                </Link>
              </div>
              <div className="bg-[#F8F7F4] rounded-3xl p-7 border border-gray-100">
                <h3 className="font-bold text-[#0F2C5E] mb-3">Nous appeler</h3>
                <p className="text-gray-500 text-sm mb-4">Lundi – Vendredi, 8h – 18h</p>
                <a href="tel:+33300000000" className="block w-full bg-white border border-gray-200 text-[#0F2C5E] font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-center">
                  03 XX XX XX XX
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
