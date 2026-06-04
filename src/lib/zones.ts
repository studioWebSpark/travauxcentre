export type Zone = {
  slug: string
  nom: string
  codePostal: string
  departement: string
  intro: string
  contexte: string
  projetsFrequents: string[]
  particularites: string
}

export const zones: Zone[] = [
  {
    slug: "lens",
    nom: "Lens",
    codePostal: "62300",
    departement: "Pas-de-Calais",
    intro:
      "Lens et son agglomération vivent une transformation profonde. Ancienne cité minière réinventée autour de la culture et du sport, la ville attire de nombreux projets de rénovation dans ses maisons de ville, corons réhabilités et logements du centre.",
    contexte:
      "Le bassin minier lensois concentre un parc immobilier ancien en pleine mutation. Nombreuses rénovations de maisons en brique, remises aux normes électriques et thermiques, et extensions pour adapter les logements aux besoins d'aujourd'hui.",
    projetsFrequents: [
      "Rénovation complète de maisons en brique",
      "Isolation thermique (ITE/ITI) — éligible MaPrimeRénov'",
      "Mise aux normes électrique NF C15-100",
      "Extension et aménagement de combles",
      "Ravalement de façade et enduits",
      "Pose de carrelage et parquet",
    ],
    particularites:
      "Les maisons typiques du bassin minier (corons, maisons de ville en brique rouge) ont des caractéristiques techniques spécifiques que nos artisans maîtrisent parfaitement.",
  },
  {
    slug: "henin-beaumont",
    nom: "Hénin-Beaumont",
    codePostal: "62110",
    departement: "Pas-de-Calais",
    intro:
      "Hénin-Beaumont, au cœur du bassin minier, concentre un tissu résidentiel dense de maisons anciennes et de pavillons en cours de réhabilitation. La ville connaît une dynamique de renouveau urbain favorable aux projets de rénovation.",
    contexte:
      "Entre Lens et Carvin, Hénin-Beaumont présente un habitat majoritairement ancien avec de nombreuses opportunités de remise à neuf : isolation, électricité, plomberie et embellissement intérieur.",
    projetsFrequents: [
      "Rénovation intérieure globale",
      "Isolation des murs et combles",
      "Remplacement de chaudière et plomberie",
      "Peinture et revêtements de sol",
      "Aménagement de salle de bain",
      "Création de terrasse ou dalle extérieure",
    ],
    particularites:
      "Nous intervenons régulièrement dans cette zone et connaissons les spécificités des constructions du secteur minier. Déplacement rapide depuis notre base de Longuenesse.",
  },
  {
    slug: "bethune",
    nom: "Béthune",
    codePostal: "62400",
    departement: "Pas-de-Calais",
    intro:
      "Béthune, sous-préfecture dynamique du Pas-de-Calais, bénéficie d'un tissu économique actif et d'un parc immobilier varié allant des maisons bourgeoises du centre aux pavillons périphériques. Nos équipes interviennent régulièrement dans l'arrondissement.",
    contexte:
      "La région béthunoise mêle habitat ancien de centre-ville et zones pavillonnaires des années 70-90. Les projets vont de la remise à neuf totale à l'amélioration ciblée (isolation, cuisine, salle de bain).",
    projetsFrequents: [
      "Rénovation de maisons bourgeoises",
      "Extension de pavillon",
      "Isolation thermique par l'extérieur",
      "Mise aux normes électriques",
      "Carrelage et parquet haut de gamme",
      "Aménagement extérieur (terrasse, allée)",
    ],
    particularites:
      "Béthune fait partie de notre zone d'intervention historique. Nos artisans connaissent bien les matériaux et techniques adaptés aux constructions locales.",
  },
  {
    slug: "arras",
    nom: "Arras",
    codePostal: "62000",
    departement: "Pas-de-Calais",
    intro:
      "Arras, préfecture du Pas-de-Calais et ville d'art et d'histoire, recèle un patrimoine bâti exceptionnel. Ses hôtels particuliers, maisons flamandes à pignons et immeubles du centre-ville demandent une expertise artisanale soignée que nos équipes maîtrisent.",
    contexte:
      "La préfecture attire propriétaires et investisseurs souhaitant rénover un bien en centre historique ou dans les quartiers périphériques en développement. Les contraintes ABF (Architectes des Bâtiments de France) peuvent s'appliquer et nos équipes savent les gérer.",
    projetsFrequents: [
      "Rénovation de biens en secteur sauvegardé",
      "Ravalement et enduits de façade en pierre",
      "Réfection de toiture et charpente",
      "Plâtrerie et enduits intérieurs traditionnels",
      "Second œuvre complet (élec, plomberie, isolation)",
      "Aménagement de combles et sous-pentes",
    ],
    particularites:
      "Nos artisans ont l'habitude de travailler sur le bâti ancien et savent préserver les éléments architecturaux remarquables tout en modernisant les installations.",
  },
  {
    slug: "lille",
    nom: "Lille",
    codePostal: "59000",
    departement: "Nord",
    intro:
      "Capitale des Hauts-de-France, Lille et sa métropole (MEL) représentent un marché immobilier dynamique où la rénovation de l'habitat ancien côtoie la mise aux normes de logements locatifs. Nos équipes se déplacent dans toute la métropole lilloise.",
    contexte:
      "Du Vieux-Lille aux communes périphériques (Villeneuve-d'Ascq, Roubaix, Tourcoing, Marcq-en-Barœul…), la MEL offre une grande diversité de chantiers. L'encadrement des loyers pousse les propriétaires à optimiser leurs biens, notamment par l'isolation et la rénovation intérieure.",
    projetsFrequents: [
      "Rénovation d'appartements anciens (haussmanniens, flamands)",
      "Mise aux normes DPE — isolation renforcée",
      "Remise à neuf pour mise en location",
      "Second œuvre complet de maisons de ville",
      "Gros œuvre : ouvertures, extensions",
      "Aménagement extérieur en zone urbaine dense",
    ],
    particularites:
      "La distance depuis Longuenesse (env. 45 km) reste dans notre zone d'intervention. Nous planifions les chantiers lillois groupés pour optimiser les déplacements.",
  },
  {
    slug: "boulogne-sur-mer",
    nom: "Boulogne-sur-Mer",
    codePostal: "62200",
    departement: "Pas-de-Calais",
    intro:
      "Premier port de pêche de France, Boulogne-sur-Mer associe un centre historique médiéval à un vaste tissu résidentiel en bord de mer. L'air iodé et l'humidité côtière imposent des matériaux et techniques spécifiques que nos artisans maîtrisent.",
    contexte:
      "Les propriétaires boulonnais font face à des contraintes particulières : humidité, vent, exposition marine. Les travaux d'isolation, de ravalement et d'étanchéité sont fréquents. La résidence secondaire est aussi bien représentée sur la côte.",
    projetsFrequents: [
      "Ravalement et traitement anti-humidité",
      "Isolation adaptée au climat côtier",
      "Rénovation de résidences secondaires",
      "Remise en état de maisons de pêcheurs",
      "Aménagement extérieur résistant aux intempéries",
      "Second œuvre : VMC, chauffage, plomberie",
    ],
    particularites:
      "Nous sélectionnons des matériaux adaptés aux environnements côtiers : peintures anti-sel, bardages résistants, menuiseries renforcées contre les embruns.",
  },
  {
    slug: "berck",
    nom: "Berck",
    codePostal: "62600",
    departement: "Pas-de-Calais",
    intro:
      "Station balnéaire de la Côte d'Opale, Berck-sur-Mer concentre un parc immobilier touristique important : villas Belle Époque, appartements vue mer, maisons de famille à rénover entre deux saisons.",
    contexte:
      "Berck attire des propriétaires de résidences secondaires souhaitant rénover leur bien pendant la basse saison. Les travaux sont souvent globaux (rénovation complète) avec des contraintes de délai avant la saison estivale.",
    projetsFrequents: [
      "Rénovation complète de villas et maisons de vacances",
      "Remise à neuf avant mise en location saisonnière",
      "Isolation et chauffage pour résidences secondaires",
      "Ravalement et entretien de façades exposées",
      "Terrasse et aménagement extérieur",
      "Mise aux normes électriques et plomberie",
    ],
    particularites:
      "Nos équipes planifient les chantiers à Berck en basse saison (octobre à avril) pour maximiser l'accès aux logements. Devis rapide pour respecter vos contraintes de calendrier.",
  },
  {
    slug: "hazebrouck",
    nom: "Hazebrouck",
    codePostal: "59190",
    departement: "Nord",
    intro:
      "Capitale de la Flandre intérieure, Hazebrouck est une ville à taille humaine entourée d'un tissu rural riche. Les maisons flamandes en brique et les fermes réhabilitées y forment un patrimoine bâti caractéristique que nos artisans connaissent bien.",
    contexte:
      "L'architecture flamande typique de la région demande un savoir-faire particulier pour les rénovations : joints de briques, charpentes en bois massif, enduits à la chaux. Nos équipes sont à l'aise avec ces techniques traditionnelles.",
    projetsFrequents: [
      "Rénovation de maisons flamandes en brique",
      "Réfection de toiture et charpente bois",
      "Isolation et second œuvre de fermes réhabilitées",
      "Aménagement de grange ou dépendance",
      "Ravalement et rejointoiement de façades",
      "Extension et véranda",
    ],
    particularites:
      "Hazebrouck est dans notre zone historique d'intervention depuis notre création. Nos artisans connaissent les matériaux locaux et les techniques adaptées à l'architecture flamande.",
  },
]

export function getZone(slug: string): Zone | undefined {
  return zones.find((z) => z.slug === slug)
}
