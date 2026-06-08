"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send } from "lucide-react"

export default function NoteChantierForm({ chantierId }: { chantierId: string }) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    await fetch(`/api/crm/chantiers/${chantierId}/notes`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenu: text }),
    })
    setText(""); setLoading(false); router.refresh()
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2}
        placeholder="Ajouter une note sur ce chantier…"
        className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E] resize-none" />
      <button type="submit" disabled={loading || !text.trim()}
        className="bg-[#0F2C5E] text-white px-3 py-2.5 rounded-xl disabled:opacity-40 shrink-0">
        <Send className="w-4 h-4" />
      </button>
    </form>
  )
}
