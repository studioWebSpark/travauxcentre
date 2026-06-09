import type { Metadata } from "next"
import { BookOpen, Users, Wrench, FileText, CreditCard, Calendar, Radar, MapPin, ChevronRight, CheckCircle, AlertCircle, Info } from "lucide-react"

export const metadata: Metadata = { title: "Guide CRM" }

const sections = [
  {
    id: "leads",
    icon: Users,
    color: "bg-blue-500",
    titre: "Leads",
    href: "/crm/leads",
    description: "Gérer vos prospects et clients entrants",
    steps: [
      { type: "info",    text: "Un lead = un client potentiel qui vous a contacté via le site ou manuellement ajouté" },
      { type: "action",  text: "Créer un lead : cliquer « Nouveau lead » et remplir nom, email, téléphone, type de travaux" },
      { type: "action",  text: "Changer le statut au fil du temps : Nouveau → Contacté → Devis envoyé → Gagné ou Perdu" },
      { type: "action",  text: "Ajouter des notes internes sur chaque lead (remarques, informations importantes)" },
      { type: "action",  text: "Modifier la description du projet directement depuis la fiche lead (clic sur le crayon)" },
      { type: "tip",     text: "Passer le lead en « Gagné » avant de créer un chantier associé" },
    ],
  },
  {
    id: "chantiers",
    icon: Wrench,
    color: "bg-amber-500",
    titre: "Chantiers",
    href: "/crm/chantiers",
    description: "Suivre vos chantiers en cours",
    steps: [
      { type: "info",    text: "Un chantier = un projet de travaux en cours, lié à un lead gagné" },
      { type: "action",  text: "Créer un chantier : remplir titre, adresse, budget estimé, dates début/fin, lier au lead" },
      { type: "action",  text: "Mettre à jour la progression (0% à 100%) au fil de l'avancement" },
      { type: "action",  text: "Ajouter des étapes de chantier avec statut (À faire / En cours / Terminée)" },
      { type: "action",  text: "Prendre des photos : catégorie Avant / Pendant / Après pour suivre l'évolution" },
      { type: "action",  text: "Rédiger des rapports journaliers (heures travaillées, description, météo)" },
      { type: "action",  text: "Enregistrer les dépenses (matériaux, main d'œuvre, sous-traitants)" },
      { type: "action",  text: "Partager le portail client : lien sécurisé pour que le client suive son chantier" },
      { type: "tip",     text: "Passer le statut en « Terminé » une fois tous les travaux achevés" },
    ],
  },
  {
    id: "devis",
    icon: FileText,
    color: "bg-green-500",
    titre: "Devis",
    href: "/crm/devis",
    description: "Créer et envoyer vos devis clients",
    steps: [
      { type: "info",    text: "Le devis se fait APRÈS la visite sur site — jamais avant. D'abord visiter, ensuite chiffrer." },
      { type: "info",    text: "Le devis = document que le client doit régler avant de recevoir la facture finale" },
      { type: "action",  text: "Créer un devis : choisir le chantier/lead, ajouter les lignes (description, quantité, prix unitaire), choisir la TVA" },
      { type: "action",  text: "Ajouter des étapes de paiement : ex. 40% à la signature + 60% à la fin (doit faire 100% au total)" },
      { type: "action",  text: "Les conditions de paiement sont auto-générées dans les notes du devis selon vos étapes" },
      { type: "action",  text: "Envoyer le devis par email : le client reçoit un PDF en pièce jointe + un lien pour l'accepter en ligne" },
      { type: "action",  text: "Copier le lien du devis pour l'envoyer manuellement (WhatsApp, SMS…)" },
      { type: "action",  text: "Télécharger le PDF depuis la liste des devis bouton « PDF »" },
      { type: "tip",     text: "Le client peut accepter le devis directement depuis le lien reçu par email" },
    ],
  },
  {
    id: "paiements",
    icon: CreditCard,
    color: "bg-orange-500",
    titre: "Étapes de paiement & Facture automatique",
    href: "/crm/devis",
    description: "Suivre les paiements et générer la facture",
    steps: [
      { type: "info",    text: "Les étapes de paiement se configurent lors de la création du devis (ex. 40% + 60%)" },
      { type: "action",  text: "Depuis la fiche devis : voir le bloc « Étapes de paiement » avec chaque étape et son montant" },
      { type: "action",  text: "Quand le client paie une étape : cliquer « Marquer payé » → l'étape passe en vert" },
      { type: "info",    text: "Quand TOUTES les étapes sont payées (100%) → la facture est générée AUTOMATIQUEMENT" },
      { type: "action",  text: "Le devis passe alors au statut « Facturé » (violet) dans la liste des devis" },
      { type: "action",  text: "Accéder à la facture depuis la liste devis → bouton « Facture »" },
      { type: "tip",     text: "La facture reprend exactement les mêmes lignes que le devis, liée définitivement à celui-ci" },
    ],
  },
  {
    id: "factures",
    icon: FileText,
    color: "bg-indigo-500",
    titre: "Factures",
    href: "/crm/factures",
    description: "Gérer vos factures et encaissements",
    steps: [
      { type: "info",    text: "Les factures sont créées automatiquement quand 100% des étapes du devis sont payées" },
      { type: "action",  text: "Voir toutes les factures dans la liste avec leur statut (Émise / Envoyée / Payée)" },
      { type: "action",  text: "Envoyer la facture par email au client : bouton « Envoyer »" },
      { type: "action",  text: "Marquer une facture comme payée : bouton « Marquer payée »" },
      { type: "action",  text: "Télécharger le PDF de la facture : bouton « PDF »" },
      { type: "tip",     text: "Une fois payée, la facture acquittée est envoyée automatiquement au client par email" },
    ],
  },
  {
    id: "planning",
    icon: Calendar,
    color: "bg-teal-500",
    titre: "Planning & Calendrier",
    href: "/crm/planning",
    description: "Organiser vos rendez-vous et interventions",
    steps: [
      { type: "info",    text: "Le planning liste tous vos rendez-vous liés à vos leads" },
      { type: "action",  text: "Ajouter un RDV depuis la fiche lead : choisir date, heure, type de RDV, adresse" },
      { type: "action",  text: "Le client reçoit un email de confirmation avec les détails du RDV" },
      { type: "action",  text: "Le calendrier affiche une vue mensuelle de tous vos RDV" },
      { type: "tip",     text: "Utiliser le calendrier pour éviter les doublons et planifier votre semaine" },
    ],
  },
  {
    id: "veille",
    icon: Radar,
    color: "bg-red-500",
    titre: "Veille marché",
    href: "/crm/veille",
    description: "Trouver de nouveaux clients automatiquement",
    steps: [
      { type: "info",    text: "La veille scanne les annonces de travaux (LeBonCoin, Vivastreet…) dans votre zone" },
      { type: "action",  text: "Cliquer « Lancer la veille » pour récupérer les annonces les plus récentes" },
      { type: "action",  text: "Chaque annonce a un score de pertinence — prioriser les scores élevés" },
      { type: "action",  text: "Convertir une annonce en lead d'un clic : le lead est créé automatiquement" },
      { type: "tip",     text: "Relancer la veille régulièrement (chaque matin) pour ne pas rater d'opportunités" },
    ],
  },
  {
    id: "carte",
    icon: MapPin,
    color: "bg-pink-500",
    titre: "Carte",
    href: "/crm/carte",
    description: "Visualiser vos leads et chantiers géographiquement",
    steps: [
      { type: "info",    text: "La carte affiche tous vos leads et chantiers sur une carte interactive" },
      { type: "action",  text: "Cliquer sur un point pour voir les détails du lead/chantier" },
      { type: "tip",     text: "Utile pour optimiser vos déplacements et voir la densité de vos clients par zone" },
    ],
  },
]

const typeBadge = {
  info:    { icon: Info,         color: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-100",  label: "Info" },
  action:  { icon: ChevronRight, color: "text-gray-700",  bg: "bg-gray-50",  border: "border-gray-100",  label: "" },
  tip:     { icon: CheckCircle,  color: "text-green-600", bg: "bg-green-50", border: "border-green-100", label: "Conseil" },
  warning: { icon: AlertCircle,  color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Attention" },
}

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#0F2C5E] rounded-2xl flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C5E] font-montserrat">Guide du CRM</h1>
          <p className="text-gray-500 text-sm mt-1">Fiche technique — toutes les fonctionnalités de Travaux Centre CRM</p>
        </div>
      </div>

      {/* Sommaire */}
      <div className="bg-[#F8F7F4] rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Sommaire</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <a key={s.id} href={`#${s.id}`}
                className="flex items-center gap-2 text-sm text-[#0F2C5E] font-medium hover:underline">
                <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {s.titre}
              </a>
            )
          })}
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const Icon = section.icon
        return (
          <div key={section.id} id={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* En-tête section */}
            <div className="flex items-center gap-4 p-6 border-b border-gray-50">
              <div className={`w-10 h-10 ${section.color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-[#0F2C5E] text-lg font-montserrat">{section.titre}</h2>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <a href={section.href}
                className="text-xs text-[#F97316] font-semibold border border-[#F97316]/30 px-3 py-1.5 rounded-lg hover:bg-[#F97316]/5 shrink-0">
                Ouvrir →
              </a>
            </div>

            {/* Étapes */}
            <div className="p-6 space-y-2">
              {section.steps.map((step, i) => {
                const badge = typeBadge[step.type as keyof typeof typeBadge]
                const BadgeIcon = badge.icon
                return (
                  <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${badge.bg} ${badge.border}`}>
                    <BadgeIcon className={`w-4 h-4 mt-0.5 shrink-0 ${badge.color}`} />
                    <p className="text-sm text-gray-700 leading-relaxed">{step.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Footer */}
      <div className="bg-[#0F2C5E] rounded-2xl p-6 text-center">
        <p className="text-white font-semibold font-montserrat mb-1">Travaux Centre CRM</p>
        <p className="text-slate-400 text-sm">Un problème ? Contactez le support ou consultez cette page à tout moment.</p>
      </div>
    </div>
  )
}
