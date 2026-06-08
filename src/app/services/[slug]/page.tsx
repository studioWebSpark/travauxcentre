import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ServicePageClient from "./ServicePageClient"

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
    metaDesc: "Maçon et gros œuvre à Longuenesse. Extensions, murs porteurs, fondations. Société certifiée RGE. Devis gratuit dans un rayon de 80km.",
    intro:    "Le gros œuvre est le squelette de votre bâtiment. Nos maçons expérimentés assurent la solidité et la durabilité de vos ouvrages. Travaux Centre est certifiée RGE pour les travaux d'amélioration énergétique.",
    items:    ["Murs porteurs et cloisons maçonnées", "Fondations superficielles et profondes", "Extensions de maison et surélévations", "Reprises en sous-œuvre", "Ravalement et enduits de façade", "Démolition et déconstruction sélective", "Dallages et planchers béton", "Réparation de fissures structurelles"],
    avantages: [
      { titre: "Garantie décennale", desc: "Tous nos travaux de maçonnerie et structure (N° 11) sont couverts par notre assurance décennale obligatoire." },
      { titre: "Société certifiée RGE", desc: "Travaux Centre est certifiée RGE pour les travaux d'isolation et rénovation énergétique. Accès à MaPrimeRénov'." },
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
    intro:    "Le second œuvre regroupe tous les corps de métier techniques qui donnent vie à votre habitat : électricité, plomberie, isolation, ventilation. Nos techniciens assurent des installations conformes aux normes. Travaux Centre est certifiée RGE pour l'isolation et la rénovation énergétique.",
    items:    ["Électricité aux normes NF C15-100", "Mise aux normes du tableau électrique", "Plomberie et installation sanitaire", "Chauffage central et radiateurs", "Climatisation réversible", "Isolation thermique par l'intérieur (ITI)", "Isolation thermique par l'extérieur (ITE)", "Ventilation mécanique contrôlée (VMC)"],
    avantages: [
      { titre: "Société certifiée RGE", desc: "Travaux Centre dispose des certifications Qualibat et RGE pour garantir la conformité de tous les travaux." },
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
    title: `${service.title} à Longuenesse | Travaux Centre`,
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
    <div className="bg-white min-h-screen">
      <ServicePageClient service={service} />
    </div>
  )
}
