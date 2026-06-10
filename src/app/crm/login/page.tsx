"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Lock, Send } from "lucide-react"

export default function CrmLogin() {
  const router  = useRouter()
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)
  const [tab,      setTab]      = useState<"login" | "setup">("login")
  const [email,    setEmail]    = useState("contact.travauxcentre@gmail.com")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [msg,      setMsg]      = useState("")
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    fetch("/api/crm/auth/needs-setup")
      .then(r => r.ok ? r.json() : { needsSetup: false })
      .then(d => {
        setNeedsSetup(d.needsSetup ?? false)
        if (d.needsSetup) setTab("setup")
      })
      .catch(() => setNeedsSetup(false))
  }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    const res = await fetch("/api/crm/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) { router.push("/crm"); router.refresh() }
    else        { setError("Email ou mot de passe incorrect"); setLoading(false) }
  }

  async function sendSetup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(""); setMsg("")
    const res = await fetch("/api/crm/auth/send-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (res.ok) setMsg("Email envoyé ! Vérifiez votre boîte mail.")
    else        setError("Erreur lors de l'envoi. Vérifiez votre connexion.")
    setLoading(false)
  }

  if (needsSetup === null) {
    return (
      <div className="min-h-screen bg-[#0F2C5E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F2C5E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-white">
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
          <p className="text-white/60 text-sm mt-2">Espace CRM — accès privé</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Onglets — "Définir mot de passe" seulement si pas encore configuré */}
          {needsSetup && (
            <div className="flex border-b border-gray-100">
              <button onClick={() => { setTab("login"); setError(""); setMsg("") }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "login" ? "text-[#0F2C5E] border-b-2 border-[#0F2C5E]" : "text-gray-400"}`}>
                Connexion
              </button>
              <button onClick={() => { setTab("setup"); setError(""); setMsg("") }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "setup" ? "text-[#F97316] border-b-2 border-[#F97316]" : "text-gray-400"}`}>
                Définir mon mot de passe
              </button>
            </div>
          )}

          <div className="p-8">
            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
            )}
            {msg && (
              <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">{msg}</p>
            )}

            {tab === "login" ? (
              <form onSubmit={login} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2C5E]" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[#0F2C5E] text-white font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Connexion…" : "Accéder au CRM"}
                </button>
              </form>
            ) : (
              <form onSubmit={sendSetup} className="space-y-4">
                <p className="text-sm text-gray-500">Vous recevrez un lien par email pour définir votre mot de passe.</p>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email CRM</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[#F97316] text-white font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {loading ? "Envoi…" : "Envoyer le lien"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
