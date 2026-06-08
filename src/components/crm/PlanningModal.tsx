"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface PlanningModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  onSubmit: (data: PlanningFormData) => Promise<void>
}

export interface PlanningFormData {
  date: string
  heure: string
  typeRdv: "RDV" | "Visite" | "Chantier"
  adresse: string
  notes: string
}

export default function PlanningModal({ isOpen, onClose, selectedDate, onSubmit }: PlanningModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PlanningFormData>({
    date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    heure: "09:00",
    typeRdv: "RDV",
    adresse: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
        heure: "09:00",
        typeRdv: "RDV",
        adresse: "",
        notes: "",
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#0F2C5E]">Ajouter un planning</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 "
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
                    required
                  />
                </div>

                {/* Heure */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Heure</label>
                  <input
                    type="time"
                    value={formData.heure}
                    onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
                    required
                  />
                </div>

                {/* Type RDV */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Type</label>
                  <select
                    value={formData.typeRdv}
                    onChange={(e) => setFormData({ ...formData, typeRdv: e.target.value as "RDV" | "Visite" | "Chantier" })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] bg-white"
                  >
                    <option value="RDV">RDV</option>
                    <option value="Visite">Visite</option>
                    <option value="Chantier">Chantier</option>
                  </select>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Adresse</label>
                  <input
                    type="text"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    placeholder="Adresse du RDV…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notes…"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-50 "
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-[#1a1a1a] bg-[#0F2C5E] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Ajout..." : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
