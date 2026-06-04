import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/landing/Navbar"

// ─── Données statiques ────────────────────────────────────────────────────────

const categories = [
  { icon: "🧱", label: "Maçonnerie",         desc: "Murs, fondations, enduits" },
  { icon: "🔧", label: "Plomberie",           desc: "Sanitaires, chauffage, fuites" },
  { icon: "⚡", label: "Électricité",         desc: "Installation, mise aux normes" },
  { icon: "🎨", label: "Peinture",            desc: "Intérieur, extérieur, ravalement" },
  { icon: "🪚", label: "Menuiserie",          desc: "Portes, fenêtres, parquet" },
  { icon: "🏠", label: "Toiture",             desc: "Tuiles, zinguerie, isolation" },
  { icon: "⬜", label: "Carrelage",           desc: "Pose, joint, rénovation" },
  { icon: "🔥", label: "Chauffage",           desc: "Chaudière, pompe à chaleur" },
  { icon: "❄️", label: "Climatisation",       desc: "Installation, entretien" },
  { icon: "🌡️", label: "Isolation",           desc: "Combles, murs, sol" },
  { icon: "🌿", label: "Jardinage",           desc: "Aménagement, entretien" },
  { icon: "🏗️", label: "Rénovation générale", desc: "Tous corps d'état" },
]

const etapesClient = [
  { num: "01", titre: "Décrivez votre projet",   desc: "Renseignez le type de travaux, l'adresse et votre budget en quelques minutes." },
  { num: "02", titre: "Recevez des devis",        desc: "Des artisans qualifiés de votre région vous envoient leurs propositions." },
  { num: "03", titre: "Choisissez et suivez",     desc: "Acceptez le meilleur devis et suivez l'avancement du chantier en temps réel." },
]

const etapesArtisan = [
  { num: "01", titre: "Créez votre profil",       desc: "Renseignez vos spécialités, votre zone et vos certifications." },
  { num: "02", titre: "Répondez aux projets",      desc: "Parcourez les demandes dans votre secteur et envoyez vos devis." },
  { num: "03", titre: "Gérez vos chantiers",       desc: "Planifiez les tâches, publiez des rapports d'avancement et fidélisez vos clients." },
]

const avantages = [
  { icon: "🔒", titre: "Artisans vérifiés",       desc: "Chaque profil artisan est contrôlé : SIRET, assurances et qualifications vérifiés avant activation." },
  { icon: "💬", titre: "Messagerie intégrée",      desc: "Échangez directement avec les artisans ou vos clients sans quitter la plateforme." },
  { icon: "📊", titre: "Suivi en temps réel",      desc: "Avancement des tâches, rapports photos et jalons : tout le chantier centralisé en un endroit." },
  { icon: "⭐", titre: "Avis certifiés",           desc: "Seuls les clients ayant réellement travaillé avec un artisan peuvent laisser un avis." },
  { icon: "💶", titre: "Devis gratuits",           desc: "Recevez jusqu'à 5 devis sans engagement ni frais cachés. Vous choisissez librement." },
  { icon: "🛡️", titre: "Paiement sécurisé",        desc: "Vos paiements sont sécurisés et libérés uniquement à la validation des travaux." },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  // Stats réelles depuis Supabase
  const [nbArtisans, nbProjets, nbChantiers] = await Promise.all([
    prisma.artisanProfile.count({ where: { disponible: true } }),
    prisma.projet.count(),
    prisma.chantier.count({ where: { statut: "TERMINE" } }),
  ])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Fond dégradé */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            La plateforme de mise en relation travaux n°1
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            Trouvez l'artisan{" "}
            <span className="relative">
              <span className="text-blue-600">parfait</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 9C50 3 150 1 298 9" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
            <br />pour vos travaux
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Décrivez votre projet, recevez des devis d'artisans qualifiés de votre région
            et suivez l'avancement de vos chantiers — tout en un seul endroit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?role=CLIENT"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5">
              🏠 Je cherche un artisan
            </Link>
            <Link href="/auth/signup?role=ARTISAN"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold text-lg px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:-translate-y-0.5">
              🔧 Je suis artisan
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-5">Inscription gratuite · Sans engagement · Devis en 24h</p>
        </div>

        {/* Stats mini sous le hero */}
        <div className="max-w-3xl mx-auto px-6 mt-16">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100 grid grid-cols-3 divide-x divide-gray-100">
            {[
              { value: nbArtisans > 0 ? `${nbArtisans}+` : "500+", label: "Artisans certifiés" },
              { value: nbProjets  > 0 ? `${nbProjets}+`  : "2 000+", label: "Projets publiés" },
              { value: nbChantiers > 0 ? `${nbChantiers}+` : "1 500+", label: "Chantiers réalisés" },
            ].map(({ value, label }) => (
              <div key={label} className="py-6 text-center">
                <p className="text-3xl font-extrabold text-blue-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────────── */}
      <section id="comment-ca-marche" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple & rapide</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Comment ça marche ?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Côté client */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">🏠</div>
                <h3 className="text-xl font-bold text-gray-900">Pour les particuliers</h3>
              </div>
              <div className="space-y-6">
                {etapesClient.map((e, i) => (
                  <div key={e.num} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {e.num}
                      </div>
                      {i < etapesClient.length - 1 && (
                        <div className="w-0.5 h-full bg-blue-100 mt-2 mb-0" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-gray-900 mb-1">{e.titre}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/auth/signup"
                className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors">
                Déposer un projet gratuitement →
              </Link>
            </div>

            {/* Côté artisan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🔧</div>
                <h3 className="text-xl font-bold text-gray-900">Pour les artisans</h3>
              </div>
              <div className="space-y-6">
                {etapesArtisan.map((e, i) => (
                  <div key={e.num} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {e.num}
                      </div>
                      {i < etapesArtisan.length - 1 && (
                        <div className="w-0.5 h-full bg-orange-100 mt-2 mb-0" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-gray-900 mb-1">{e.titre}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/auth/signup"
                className="mt-2 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition-colors">
                Créer mon profil artisan →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATÉGORIES ────────────────────────────────────────────────────── */}
      <section id="categories" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Tous corps de métier</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Quel type de travaux ?</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Des artisans spécialisés dans chaque domaine, prêts à intervenir chez vous.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/auth/signup`}
                className="group flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md transition-all cursor-pointer"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <p className="font-semibold text-gray-900 text-sm mb-1">{cat.label}</p>
                <p className="text-xs text-gray-400">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVANTAGES ─────────────────────────────────────────────────────── */}
      <section id="avantages" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Pourquoi nous choisir</p>
            <h2 className="text-4xl font-extrabold text-gray-900">La plateforme qui vous simplifie la vie</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {avantages.map((a) => (
              <div key={a.titre}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-4">
                  {a.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{a.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Ils nous font confiance</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Ce qu'ils en disent</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                name: "Sophie M.", role: "Particulière à Lyon",
                avatar: "S", color: "bg-pink-100 text-pink-600",
                text: "J'ai reçu 4 devis en moins de 48h pour ma rénovation de salle de bain. L'artisan choisi était parfait, et j'ai pu suivre l'avancement depuis mon téléphone.",
                note: 5,
              },
              {
                name: "Marc D.", role: "Plombier indépendant",
                avatar: "M", color: "bg-blue-100 text-blue-600",
                text: "Depuis que j'utilise TravauxCentre, j'ai rempli mon planning de 3 mois en avance. Le suivi de chantier intégré me fait gagner un temps précieux.",
                note: 5,
              },
              {
                name: "Claire B.", role: "Propriétaire à Bordeaux",
                avatar: "C", color: "bg-green-100 text-green-600",
                text: "Interface très simple, artisans sérieux et réactifs. Le devis détaillé et les rapports d'avancement m'ont rassuré tout au long du chantier.",
                note: 5,
              },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.note }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 -z-10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -z-10" />

        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Rejoignez des milliers de clients et d'artisans qui font confiance à TravauxCentre.
            Inscription gratuite, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-blue-700 font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5">
              Commencer gratuitement →
            </Link>
            <Link href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all">
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="mb-4">
                <span className="text-xl font-bold text-blue-400">Travaux</span>
                <span className="text-xl font-bold text-white">Centre</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                La plateforme de mise en relation entre particuliers et artisans qualifiés pour tous vos projets de travaux.
              </p>
            </div>

            {/* Particuliers */}
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Particuliers</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Déposer un projet</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Trouver un artisan</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">Mon espace client</Link></li>
              </ul>
            </div>

            {/* Artisans */}
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Artisans</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Créer mon profil</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">Mon espace artisan</Link></li>
                <li><a href="#avantages"       className="hover:text-white transition-colors">Nos avantages</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p>© {new Date().getFullYear()} TravauxCentre. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
