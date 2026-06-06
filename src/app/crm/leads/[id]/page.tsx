import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { STATUTS, PRIORITES, formatDate, formatEuro } from "@/lib/crm"
import LeadActions from "@/components/crm/LeadActions"
import NoteForm from "@/components/crm/NoteForm"
import EmailConfirmButton from "@/components/crm/EmailConfirmButton"
import { Phone, Mail, MapPin, Calendar, Euro, FileText, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { StatutLead } from "@/generated/prisma"

export const metadata: Metadata = { title: "Fiche lead" }
export const dynamic = "force-dynamic"

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  })
  if (!lead) notFound()

  const st = STATUTS[lead.statut]
  const pr = PRIORITES[lead.priorite]

  // Étapes pipeline
  const mainSteps: StatutLead[] = ["NOUVEAU", "CONTACTE", "DEVIS_ENVOYE", "GAGNE"]
  const currentIdx = mainSteps.indexOf(lead.statut as StatutLead)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/crm/leads" className="inline-flex items-center gap-1 text-gray-400 hover:text-[#0F2C5E] text-sm mb-3 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour aux leads
          </Link>
          <h1 className="text-2xl font-bold text-[#0F2C5E]">{lead.nom}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
            <span className={`text-xs font-semibold ${pr.color}`}>● Priorité {pr.label.toLowerCase()}</span>
            <span className="text-xs text-gray-400">Reçu le {formatDate(lead.createdAt)}</span>
          </div>
        </div>
        {/* Boutons action */}
        <div className="flex gap-2 flex-wrap">
          <a href={`tel:${lead.telephone}`} className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a3f7a] transition-colors">
            <Phone className="w-4 h-4" /> Appeler
          </a>
          <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#0F2C5E] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <Mail className="w-4 h-4" /> Email libre
          </a>
          <EmailConfirmButton leadId={lead.id} statut={lead.statut} />
        </div>
      </div>

      {/* Pipeline étapes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Progression</p>
        <div className="flex items-center gap-2 flex-wrap">
          {mainSteps.map((step, i) => {
            const s     = STATUTS[step]
            const done  = currentIdx > i
            const active = lead.statut === step
            return (
              <div key={step} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  active  ? `${s.bg} ${s.color} ring-2 ring-offset-1 ring-current` :
                  done    ? "bg-green-50 border-green-200 text-green-700" :
                            "bg-gray-50 border-gray-100 text-gray-400"
                }`}>
                  {done && !active && <span>✓</span>}
                  {s.label}
                </div>
                {i < mainSteps.length - 1 && <span className="text-gray-200">→</span>}
              </div>
            )
          })}
          {(lead.statut === "PERDU" || lead.statut === "EN_ATTENTE") && (
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${st.bg} ${st.color}`}>{st.label}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infos client */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Informations client</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Mail,     label: "Email",     value: lead.email,                   href: `mailto:${lead.email}` },
                { icon: Phone,    label: "Téléphone", value: lead.telephone,               href: `tel:${lead.telephone}` },
                { icon: MapPin,   label: "Ville",     value: `${lead.ville} (${lead.codePostal})`, href: null },
                { icon: FileText, label: "Source",    value: lead.source ?? "—",           href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F8F7F4] rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#0F2C5E]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-semibold text-[#0F2C5E] hover:underline">{value}</a>
                    ) : (
                      <p className="text-sm font-semibold text-gray-700">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Détails projet */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Détails du projet</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
              {[
                { label: "Type de travaux",  value: lead.typeTravaux },
                { label: "Surface",          value: lead.surface ? `${lead.surface} m²` : "—" },
                { label: "Budget estimé",    value: lead.budget ?? "—" },
                { label: "Date souhaitée",   value: lead.dateSouhaitee ? formatDate(lead.dateSouhaitee) : "—" },
                { label: "Montant devis",    value: formatEuro(lead.montantDevis) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#F8F7F4] rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#0F2C5E]">{value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">Description du projet</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-[#F8F7F4] rounded-xl p-4">{lead.description}</p>
            </div>
          </div>

          {/* Notes / Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Notes internes</h2>
            <NoteForm leadId={lead.id} />
            {lead.notes.length > 0 ? (
              <div className="mt-5 space-y-3">
                {lead.notes.map((note) => (
                  <div key={note.id} className="flex gap-3">
                    <div className="w-7 h-7 bg-[#0F2C5E] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                      {note.auteur[0]}
                    </div>
                    <div className="flex-1 bg-[#F8F7F4] rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#0F2C5E]">{note.auteur}</span>
                        <span className="text-xs text-gray-400">{formatDate(note.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.contenu}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-4 text-center py-4">Aucune note pour l&apos;instant</p>
            )}
          </div>
        </div>

        {/* Colonne droite — actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-[#0F2C5E] mb-4">Gestion du lead</h2>
            <LeadActions lead={{
              id:                 lead.id,
              statut:             lead.statut,
              priorite:           lead.priorite,
              montantDevis:       lead.montantDevis,
              dateContact:        lead.dateContact?.toISOString() ?? null,
              dateRdv:            lead.dateRdv?.toISOString() ?? null,
              commentaireInterne: lead.commentaireInterne,
            }} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h2 className="font-bold text-[#0F2C5E] mb-1">Historique</h2>
            {[
              { icon: Clock,    label: "Lead reçu",        value: formatDate(lead.createdAt) },
              { icon: Phone,    label: "Dernier contact",  value: formatDate(lead.dateContact) },
              { icon: Calendar, label: "RDV prévu",        value: formatDate(lead.dateRdv) },
              { icon: Euro,     label: "Devis envoyé",     value: formatEuro(lead.montantDevis) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <Icon className="w-4 h-4 text-gray-300 shrink-0" />
                <span className="text-gray-500 flex-1">{label}</span>
                <span className="font-medium text-[#0F2C5E]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
