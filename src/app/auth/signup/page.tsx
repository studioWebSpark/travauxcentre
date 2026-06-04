'use client'

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function SignUpForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const initialRole  = searchParams.get("role") === "ARTISAN" ? "ARTISAN"
                     : searchParams.get("role") === "CLIENT"  ? "CLIENT"
                     : "" as "CLIENT" | "ARTISAN" | ""

  const [step, setStep]       = useState<1 | 2>(1)
  const [role, setRole]       = useState<"CLIENT" | "ARTISAN" | "">(initialRole)
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (step === 1) {
      if (!role) { setError("Choisissez votre profil"); return }
      setStep(2)
      return
    }

    if (form.password !== form.confirm) { setError("Les mots de passe ne correspondent pas"); return }
    if (form.password.length < 8)       { setError("Mot de passe trop court (8 caractères min)"); return }

    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name: form.name, email: form.email, password: form.password, role }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error ?? "Erreur lors de la création du compte"); setLoading(false); return }

    // On utilise le rôle confirmé par le serveur pour la redirection,
    // ce qui immunise contre toute perte de state React après le signIn
    const confirmedRole = data.role as string
    await signIn("credentials", { email: form.email, password: form.password, redirect: false })
    router.push(confirmedRole === "ARTISAN" ? "/onboarding/artisan" : "/onboarding/client")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-blue-600">Travaux</span>
          <span className="text-3xl font-bold text-gray-800">Centre</span>
          <p className="text-gray-500 mt-2 text-sm">Créez votre compte gratuitement</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Indicateur d'étape */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  s <= step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                }`}>{s}</div>
                {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? "bg-blue-600" : "bg-gray-100"}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <h1 className="text-xl font-bold text-gray-900 mb-4">Vous êtes…</h1>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: "CLIENT",  label: "Un particulier", icon: "🏠", desc: "Je cherche quelqu'un pour mes travaux" },
                    { value: "ARTISAN", label: "Un artisan",      icon: "🔧", desc: "Je propose mes services de travaux" },
                  ] as const).map(({ value, label, icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      data-role={value}
                      onClick={() => setRole(value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        role === value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">{icon}</div>
                      <p className="font-semibold text-gray-900 text-sm">{label}</p>
                      <p className="text-xs text-gray-500 mt-1">{desc}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="text-xl font-bold text-gray-900 mb-4">Vos informations</h1>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text" required autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email" required autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="vous@exemple.fr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <input
                    type="password" required autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="8 caractères minimum"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                  <input
                    type="password" required autoComplete="new-password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => { setStep(1); setError("") }}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? "Création..." : step === 1 ? "Continuer" : "Créer mon compte"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <Link href="/auth/signin" className="text-blue-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignUp() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center" />}>
      <SignUpForm />
    </Suspense>
  )
}
