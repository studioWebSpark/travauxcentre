"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CrmLogin() {
  const router   = useRouter()
  const [pw, setPw]     = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/crm/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    })
    if (res.ok) {
      router.push("/crm")
      router.refresh()
    } else {
      setError("Mot de passe incorrect")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F2C5E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
          <p className="text-slate-400 text-sm mt-2">Espace CRM — accès privé</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-lg font-bold text-[#0F2C5E] mb-5">Connexion</h1>
          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              autoFocus
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F2C5E] text-white font-semibold py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Accéder au CRM"}
          </button>
        </form>
      </div>
    </div>
  )
}
