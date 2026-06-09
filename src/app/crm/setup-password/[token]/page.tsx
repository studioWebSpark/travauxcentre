"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, Lock, CheckCircle } from "lucide-react"

export default function SetupPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")
  const [error,     setError]     = useState("")
  const [done,      setDone]      = useState(false)
  const [loading,   setLoading]   = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas"); return }
    if (password.length < 8)  { setError("Minimum 8 caractères requis"); return }
    setLoading(true); setError("")
    const res = await fetch("/api/crm/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })
    if (res.ok) { setDone(true); setTimeout(() => router.push("/crm/login"), 2500) }
    else        { const d = await res.json(); setError(d.error ?? "Lien invalide ou expiré"); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0F2C5E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-white">
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
          <p className="text-white/60 text-sm mt-2">Configuration du mot de passe</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="font-bold text-[#0F2C5E] text-lg">Mot de passe défini !</p>
              <p className="text-gray-500 text-sm mt-1">Redirection vers la connexion…</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h1 className="font-bold text-[#0F2C5E] text-lg mb-4">Définir mon mot de passe</h1>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    required minLength={8} placeholder="Minimum 8 caractères"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    required placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#0F2C5E] text-white font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Enregistrement…" : "Enregistrer le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
