"use client"

import { useState, useMemo } from "react"
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import PlanningModal, { type PlanningFormData } from "@/components/crm/PlanningModal"

interface Planning {
  id: string
  date: Date
  typeRdv: string
  adresse: string | null
  notes: string | null
  duree: number
  statut: string
  lead: { id: string; nom: string; telephone: string | null }
}

interface CalendarClientProps {
  initialPlannings: Planning[]
}

export default function CalendarClient({ initialPlannings = [] }: CalendarClientProps) {
  const [viewMode, setViewMode] = useState<"week" | "month">("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [plannings, setPlannings] = useState(initialPlannings)

  const handleAddPlanning = async (data: PlanningFormData) => {
    try {
      const res = await fetch("/api/crm/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const newPlanning = await res.json()
        setPlannings([...plannings, newPlanning])
      }
    } catch (error) {
      console.error("Error adding planning:", error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getStatusLabel = (s: string) => {
    const map: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
      CONFIRME: {
        label: "Confirmé",
        icon: <Check className="w-3.5 h-3.5" />,
        color: "bg-green-50 border-green-200 text-green-700",
      },
      EN_ATTENTE: {
        label: "En attente",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        color: "bg-amber-50 border-amber-200 text-amber-700",
      },
      ANNULE: {
        label: "Annulé",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        color: "bg-red-50 border-red-200 text-red-700",
      },
    }
    return map[s] || map.EN_ATTENTE
  }

  const planningsByDate = useMemo(() => {
    const map = new Map<string, Planning[]>()
    plannings.forEach((p) => {
      const dateStr = new Date(p.date).toISOString().split("T")[0]
      if (!map.has(dateStr)) map.set(dateStr, [])
      map.get(dateStr)!.push(p)
    })
    return map
  }, [plannings])

  const getSelectedDayPlannings = () => {
    if (!selectedDay) return []
    const dateStr = selectedDay.toISOString().split("T")[0]
    return planningsByDate.get(dateStr) || []
  }

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDay(newDate)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />)
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        .toISOString()
        .split("T")[0]
      const dayPlannings = planningsByDate.get(dateStr) || []
      const isToday = new Date().toISOString().split("T")[0] === dateStr
      const isSelected =
        selectedDay &&
        selectedDay.getFullYear() === currentDate.getFullYear() &&
        selectedDay.getMonth() === currentDate.getMonth() &&
        selectedDay.getDate() === day

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`p-2 min-h-24 rounded-xl border cursor-pointer ${
            isSelected
              ? "bg-gradient-to-br from-[#F97316] to-orange-600 border-orange-500"
              : isToday
                ? "bg-blue-500/20 border-blue-500/30"
                : "bg-white/10 border-white/20 "
          }`}
        >
          <p
            className={`text-xs font-bold mb-1 font-montserrat ${
              isSelected ? "text-[#1a1a1a]" : isToday ? "text-blue-200" : "text-[#1a1a1a]"
            }`}
          >
            {day}
          </p>
          <div className="space-y-1">
            {dayPlannings.slice(0, 2).map((p) => {
              const heure = new Date(p.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
              return (
                <div
                  key={p.id}
                  className={`text-xs px-1.5 py-0.5 rounded truncate font-medium ${
                    isSelected
                      ? "bg-white/30 text-[#1a1a1a]"
                      : "bg-[#F97316]/60 text-[#1a1a1a]"
                  }`}
                >
                  {heure} {p.lead.nom}
                </div>
              )
            })}
            {dayPlannings.length > 2 && (
              <p
                className={`text-xs px-1.5 ${
                  isSelected ? "text-[#1a1a1a]/70" : "text-[#404040]"
                }`}
              >
                +{dayPlannings.length - 2} plus
              </p>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const now = new Date()
  const aVenir = plannings.filter((p) => new Date(p.date) >= now)
  const confirmed = aVenir.filter((p) => p.statut === "CONFIRME")
  const pending = aVenir.filter((p) => p.statut === "EN_ATTENTE")

  const monthName = currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] font-montserrat">Calendrier des rendez-vous</h1>
        <p className="text-[#404040] text-sm mt-0.5">{aVenir.length} RDV à venir</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "À venir", value: aVenir.length, color: "text-[#F97316]", bg: "bg-blue-500/40 border-blue-500/60" },
          { label: "Confirmés", value: confirmed.length, color: "text-green-700", bg: "bg-green-500/40 border-green-500/60" },
          { label: "En attente", value: pending.length, color: "text-amber-700", bg: "bg-amber-500/40 border-amber-500/60" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`glass rounded-[0.875rem] border p-4 ${bg}`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-[#1a1a1a] mt-0.5 font-medium uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 glass rounded-[0.875rem] border border-white/8 p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  viewMode === "month"
                    ? "bg-gradient-to-r from-[#F97316] to-orange-600 text-[#1a1a1a]"
                    : "bg-white/10 text-[#1a1a1a] border border-white/20 "
                }`}
              >
                Mois
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  viewMode === "week"
                    ? "bg-gradient-to-r from-[#F97316] to-orange-600 text-[#1a1a1a]"
                    : "bg-white/10 text-[#1a1a1a] border border-white/20 "
                }`}
              >
                Semaine
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
                className="p-2 rounded-lg "
              >
                <ChevronLeft className="w-4 h-4 text-[#333333]" />
              </button>

              <h2 className="text-base font-semibold text-[#1a1a1a] w-32 text-center capitalize font-montserrat">
                {monthName}
              </h2>

              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
                className="p-2 rounded-lg "
              >
                <ChevronRight className="w-4 h-4 text-[#333333]" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-[#1a1a1a] py-2 font-montserrat uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
        </div>

        {/* Selected day details */}
        <div className="space-y-4">
          {selectedDay && (
            <>
              <div className="glass rounded-[0.875rem] border border-white/8 p-6">
                <h3 className="text-base font-bold text-[#1a1a1a] mb-4 font-montserrat">
                  {selectedDay.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </h3>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full mb-4 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-[#F97316] to-orange-600 text-[#1a1a1a] "
                >
                  + Ajouter planning
                </button>

                <div className="space-y-3">
                  {getSelectedDayPlannings().length === 0 ? (
                    <p className="text-xs text-[#404040] text-center py-4">Aucun planning</p>
                  ) : (
                    getSelectedDayPlannings().map((p) => {
                      const status = getStatusLabel(p.statut)
                      const heure = new Date(p.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                      return (
                        <Link
                          key={p.id}
                          href={`/crm/leads/${p.lead.id}`}
                          className="block bg-[#F97316]/20 rounded-xl border-2 border-[#F97316]/60 p-4"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#F97316]">
                                {p.lead.nom}
                              </p>
                              <p className="text-xs text-[#1a1a1a] mt-1 font-semibold">{p.typeRdv}</p>
                            </div>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full border flex items-center gap-1 shrink-0 ${status.color}`}
                            >
                              {status.icon}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-[#1a1a1a] font-medium">
                              <Clock className="w-4 h-4 text-[#F97316] shrink-0" />
                              <span>{heure} — {p.duree} min</span>
                            </div>
                            {p.adresse && (
                              <div className="flex items-start gap-2 text-[#1a1a1a] font-medium">
                                <MapPin className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                                <span className="truncate">{p.adresse}</span>
                              </div>
                            )}
                            {p.notes && (
                              <div className="pt-2 border-t border-[#F97316]/40 mt-2">
                                <p className="text-[#1a1a1a] font-semibold">{p.notes}</p>
                              </div>
                            )}
                          </div>
                        </Link>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <PlanningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDay}
        onSubmit={handleAddPlanning}
      />
    </div>
  )
}
