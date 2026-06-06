import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/crm"
import { Calendar, MapPin, Clock, Phone, Check, AlertCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = { title: "Calendrier" }
export const dynamic = "force-dynamic"

export default async function CalendrierPage() {
  const plannings = await prisma.planning.findMany({
    include:  { lead: { select: { id: true, nom: true, telephone: true } } },
    orderBy:  { date: "asc" },
  })

  const now = new Date()
  const aVenir = plannings.filter((p) => new Date(p.date) >= now)
  const passes = plannings.filter((p) => new Date(p.date) < now)

  const confirmed = aVenir.filter((p) => p.statut === "CONFIRME")
  const pending   = aVenir.filter((p) => p.statut === "EN_ATTENTE")

  const getStatusLabel = (s: string) => {
    const map: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
      CONFIRME: {
        label: "Confirmé", icon: <Check className="w-3.5 h-3.5" />,
        color: "bg-green-50 border-green-200 text-green-700",
      },
      EN_ATTENTE: {
        label: "En attente", icon: <AlertCircle className="w-3.5 h-3.5" />,
        color: "bg-amber-50 border-amber-200 text-amber-700",
      },
      ANNULE: {
        label: "Annulé", icon: <AlertCircle className="w-3.5 h-3.5" />,
        color: "bg-red-50 border-red-200 text-red-700",
      },
    }
    return map[s] || map.EN_ATTENTE
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2C5E]">Calendrier des rendez-vous</h1>
        <p className="text-gray-500 text-sm mt-0.5">{aVenir.length} RDV à venir</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "À venir", value: aVenir.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Confirmés", value: confirmed.length, color: "text-green-600", bg: "bg-green-50" },
          { label: "En attente", value: pending.length, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* À venir */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#0F2C5E]">À venir</h2>
        {aVenir.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucun rendez-vous planifié</p>
        ) : (
          <div className="space-y-3">
            {aVenir.map((p) => {
              const date = new Date(p.date)
              const dateStr = date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })
              const heure = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
              const status = getStatusLabel(p.statut)

              return (
                <Link key={p.id} href={`/crm/leads/${p.lead.id}`}
                  className="group block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-[#0F2C5E]/20 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#0F2C5E] group-hover:underline text-sm">{p.lead.nom}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{p.typeRdv}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 shrink-0 ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{heure} — {p.duree} min</span>
                    </div>
                    {p.adresse && (
                      <div className="flex items-center gap-2 text-gray-600 truncate">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{p.adresse}</span>
                      </div>
                    )}
                    {!p.adresse && p.lead.telephone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <a href={`tel:${p.lead.telephone}`} className="text-[#0F2C5E] font-medium hover:underline">
                          {p.lead.telephone}
                        </a>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Passés */}
      {passes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-400">Rendez-vous passés ({passes.length})</h2>
          <div className="space-y-2 opacity-60">
            {passes.map((p) => {
              const date = new Date(p.date)
              const dateStr = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "2-digit" })
              const heure = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
              return (
                <div key={p.id} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  <span className="text-gray-600 font-medium">{p.lead.nom}</span>
                  <span className="text-gray-400">{dateStr} à {heure}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
