"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit2, Check, X, Loader2 } from "lucide-react"

type Props = {
  leadId: string
  initialDescription: string
}

export default function ProjectDescriptionEditor({ leadId, initialDescription }: Props) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(initialDescription)
  const [loading, setLoading] = useState(false)

  async function saveDescription() {
    if (description === initialDescription) {
      setIsEditing(false)
      return
    }

    setLoading(true)
    const res = await fetch(`/api/crm/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    })

    if (res.ok) {
      setIsEditing(false)
      router.refresh()
    }
    setLoading(false)
  }

  function cancel() {
    setDescription(initialDescription)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="group">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs text-gray-400 font-medium">Description du projet</p>
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-lg"
            title="Éditer la description"
          >
            <Edit2 className="w-4 h-4 text-gray-400 hover:text-[#0F2C5E]" />
          </button>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed bg-[#F8F7F4] rounded-xl p-4">
          {description || <span className="text-gray-400 italic">Aucune description</span>}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-gray-400 font-medium">Description du projet</p>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none"
        rows={4}
        placeholder="Ajoutez la description du projet..."
      />
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={saveDescription}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2C5E] text-white rounded-lg text-sm font-semibold hover:bg-[#0d1f4a] disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Enregistrer
        </button>
        <button
          onClick={cancel}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
        >
          <X className="w-4 h-4" />
          Annuler
        </button>
      </div>
    </div>
  )
}
