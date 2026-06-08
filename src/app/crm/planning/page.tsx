import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { STATUTS_CHANTIER } from "@/lib/chantier"

export const metadata: Metadata = { title: "Planning équipe" }
export const dynamic = "force-dynamic"

function getWeekDays(date: Date) {
  const monday = new Date(date)
  monday.setDate(date.getDate() - date.getDay() + 1)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default async function PlanningPage() {
  const today   = new Date()
  const weekDays = getWeekDays(today)
  const weekStart = weekDays[0]
  const weekEnd   = weekDays[6]

  const [plannings, chantiers] = await Promise.all([
    prisma.planning.findMany({
      where:   { date: { gte: weekStart, lte: new Date(weekEnd.getTime() + 86400000) } },
      include: { lead: { select: { nom: true, telephone: true, ville: true } } },
      orderBy: { date: "asc" },
    }),
    prisma.chantierCrm.findMany({
      where:   { statut: { in: ["EN_COURS", "PLANIFIE"] } },
      include: { lead: { select: { nom: true, telephone: true } } },
      orderBy: { dateDebut: "asc" },
    }),
  ])

  const fmtHour = (d: Date) => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  const fmtDate = (d: Date) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  const isToday = (d: Date) => new Date(d).toDateString() === today.toDateString()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2C5E]">Planning équipe</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Semaine du {fmtDate(weekDays[0])} au {fmtDate(weekDays[4])}
          </p>
        </div>
      </div>

      {/* Vue semaine */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDays.map((day, i) => (
            <div key={i} className={`px-3 py-3 text-center border-r last:border-r-0 border-gray-100 ${isToday(day) ? "bg-[#0F2C5E]/5" : ""}`}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {day.toLocaleDateString("fr-FR", { weekday: "short" })}
              </p>
              <p className={`text-lg font-bold mt-0.5 ${isToday(day) ? "text-[#0F2C5E]" : "text-gray-700"}`}>
                {day.getDate()}
              </p>
              {isToday(day) && <div className="w-1.5 h-1.5 bg-[#F97316] rounded-full mx-auto mt-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 min-h-48">
          {weekDays.map((day, i) => {
            const dayPlannings = plannings.filter(p =>
              new Date(p.date).toDateString() === day.toDateString()
            )
            return (
              <div key={i} className={`p-2 border-r last:border-r-0 border-gray-50 space-y-1.5 ${isToday(day) ? "bg-[#0F2C5E]/3" : ""}`}>
                {dayPlannings.map(p => (
                  <Link key={p.id} href={`/crm/leads/${p.leadId}`}
                    className="block bg-[#0F2C5E] text-white rounded-lg p-2 hover:bg-[#1a3f7a] transition-colors">
                    <p className="text-xs font-bold truncate">{p.lead.nom}</p>
                    <p className="text-xs opacity-70">{fmtHour(p.date)}</p>
                    <p className="text-xs opacity-60 truncate">{p.typeRdv}</p>
                    {p.adresse && <p className="text-xs opacity-50 truncate mt-0.5">📍 {p.adresse}</p>}
                  </Link>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Chantiers en cours */}
      <div>
        <h2 className="text-lg font-bold text-[#0F2C5E] mb-4">Chantiers actifs</h2>
        {chantiers.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8 bg-white rounded-2xl border border-gray-100">
            Aucun chantier en cours
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chantiers.map(c => {
              const st = STATUTS_CHANTIER[c.statut]
              return (
                <Link key={c.id} href={`/crm/chantiers/${c.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-[#0F2C5E]/20 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-[#0F2C5E] text-sm leading-snug flex-1">{c.titre}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ml-2 ${st.bg} ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">📍 {c.adresse}</p>
                  {c.lead && <p className="text-xs text-gray-500 mb-3">👤 {c.lead.nom}{c.lead.telephone ? ` · ${c.lead.telephone}` : ""}</p>}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Avancement</span><span className="font-bold text-[#0F2C5E]">{c.progression}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#0F2C5E] to-[#F97316] rounded-full"
                        style={{ width: `${c.progression}%` }} />
                    </div>
                  </div>
                  {(c.dateDebut || c.dateFin) && (
                    <div className="flex gap-3 text-xs text-gray-400 mt-2">
                      {c.dateDebut && <span>🗓 Début : {fmtDate(c.dateDebut)}</span>}
                      {c.dateFin   && <span>🏁 Fin : {fmtDate(c.dateFin)}</span>}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
