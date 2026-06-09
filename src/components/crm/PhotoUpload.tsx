"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, Loader2 } from "lucide-react"

type Props = { chantierId: string; categorie: string }

export default function PhotoUpload({ chantierId, categorie }: Props) {
  const [loading, setLoading] = useState(false)
  const [desc,    setDesc]    = useState("")
  const inputRef              = useRef<HTMLInputElement>(null)
  const router                = useRouter()

  async function upload(file: File) {
    setLoading(true)
    const form = new FormData()
    form.append("file",        file)
    form.append("categorie",   categorie)
    form.append("description", desc)
    await fetch(`/api/crm/chantiers/${chantierId}/photos`, { method: "POST", body: form })
    setDesc(""); setLoading(false); router.refresh()
  }

  return (
    <div className="flex gap-2 items-center">
      <input ref={inputRef} type="text" value={desc} onChange={(e) => setDesc(e.target.value)}
        placeholder="Description (optionnel)"
        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
      <button
        disabled={loading}
        className="flex items-center gap-2 border border-dashed border-gray-200 text-gray-400 px-3 py-2 rounded-xl text-xs disabled:opacity-50"
        onClick={(e) => { e.preventDefault(); document.getElementById(`upload-${categorie}-${chantierId}`)?.click() }}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
        Ajouter photo
      </button>
      <input
        id={`upload-${categorie}-${chantierId}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f) }}
      />
    </div>
  )
}
