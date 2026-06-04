import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Phone, Calendar, Shield, Trophy, Star, MapPin, ChevronDown, Building2, Hammer, TreePine, Wrench, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Travaux Centre | Entreprise de Travaux à Longuenesse et région (80km)",
}

const services = [
  {
    icon: Building2,
    title: "Rénovation Intérieure",
    desc: "Peinture, carrelage, parquet, plâtrerie, faux-plafonds — on transforme vos espaces avec soin et précision.",
    href: "/services/renovation-interieure",
  },
  {
    icon: Hammer,
    title: "Gros Œuvre & Maçonnerie",
    desc: "Murs porteurs, fondations, extensions, reprises en sous-œuvre — nos maçons certifiés assurent la solidité de votre bâti.",
    href: "/services/gros-oeuvre",
  },
  {
    icon: TreePine,
    title: "Aménagement Extérieur",
    desc: "Terrasses, allées, clôtures, dallages — on sublime vos extérieurs pour créer des espaces de vie agréables.",
    href: "/services/amenagement-exterieur",
  },
  {
    icon: Wrench,
    title: "Second Œuvre",
    desc: "Électricité, plomberie, isolation thermique et acoustique — des installations conformes aux normes en vigueur.",
    href: "/services/second-oeuvre",
  },
]

const avantages = [
  { icon: Check,    title: "Artisans locaux certifiés RGE", desc: "Nos équipes sont qualifiées et certifiées RGE pour vous garantir des travaux conformes aux normes." },
  { icon: Calendar, title: "Devis gratuit sous 48h",        desc: "Nous nous engageons à vous répondre rapidement. Visite sur site et chiffrage entièrement offerts." },
  { icon: Shield,   title: "Garantie décennale",            desc: "Tous nos travaux sont couverts par notre assurance décennale pour votre tranquillité d'esprit." },
  { icon: Trophy,   title: "+150 chantiers réalisés",       desc: "Des dizaines de clients satisfaits dans la région. Notre réputation se construit chantier après chantier." },
]

const etapes = [
  { num: "01", title: "Prise de contact",        desc: "Contactez-nous par téléphone, email ou formulaire. On échange sur votre projet en moins de 24h." },
  { num: "02", title: "Visite & devis gratuit",  desc: "On se déplace chez vous pour évaluer vos besoins et vous remettre un devis détaillé sans engagement." },
  { num: "03", title: "Réalisation des travaux", desc: "Nos artisans interviennent dans les délais convenus avec un suivi rigoureux de l'avancement du chantier." },
  { num: "04", title: "Réception & garantie",    desc: "On finalise ensemble la réception du chantier. Vos travaux sont garantis décennale et SAV réactif." },
]

const villes = [
  { nom: "Lens",             slug: "lens" },
  { nom: "Hénin-Beaumont",   slug: "henin-beaumont" },
  { nom: "Béthune",          slug: "bethune" },
  { nom: "Arras",            slug: "arras" },
  { nom: "Lille",            slug: "lille" },
  { nom: "Boulogne-sur-Mer", slug: "boulogne-sur-mer" },
  { nom: "Berck",            slug: "berck" },
  { nom: "Hazebrouck",       slug: "hazebrouck" },
  { nom: "Saint-Omer",       slug: null },
  { nom: "Calais",           slug: null },
  { nom: "Aire-sur-la-Lys",  slug: null },
  { nom: "Fruges",           slug: null },
]

const temoignages = [
  { nom: "Sophie M.",      ville: "Saint-Omer",  note: 5, texte: "Excellent travail pour notre rénovation complète. L'équipe est sérieuse, propre et respectueuse des délais. Je recommande vivement !" },
  { nom: "Jean-Pierre L.", ville: "Béthune",     note: 5, texte: "Devis rapide, prix honnête et résultat impeccable. Nos nouvelles cloisons et notre carrelage sont parfaits. Merci à toute l'équipe." },
  { nom: "Marie C.",       ville: "Longuenesse", note: 5, texte: "Terrasse et allée réalisées en 4 jours chrono. La finition est soignée et le suivi client excellent. Une entreprise de confiance." },
]

const stats = [
  { value: "150+", label: "Chantiers réalisés" },
  { value: "98%",  label: "Clients satisfaits" },
  { value: "80km", label: "Zone d'intervention" },
  { value: "10ans", label: "Garantie décennale" },
]

export default function Home() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f42] via-[#0F2C5E] to-[#1a3f7a]" />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='0' y='0' width='1' height='40' fill='%23fff'/%3E%3Crect x='0' y='0' width='40' height='1' fill='%23fff'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Orange accent blob */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#6B7280]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0F2C5E]/40 rounded-full blur-3xl" />

        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-5xl mx-auto">
          <Badge variant="ghost" className="mb-8 gap-2 text-sm px-5 py-2 border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#6B7280] animate-pulse" />
            Artisans certifiés RGE — Garantie décennale
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
            Vos Travaux,{" "}
            <span className="text-[#6B7280] italic">Notre Expertise</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Entreprise de travaux ancrée à Longuenesse, nous intervenons dans un rayon de{" "}
            <strong className="text-white">80km</strong> pour tous vos projets de rénovation,
            maçonnerie et aménagement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" variant="primary" className="shadow-xl shadow-gray-900/30 text-base">
              <Link href="/devis">
                Demander un Devis Gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-white" className="text-base">
              <Link href="/services">Découvrir nos services</Link>
            </Button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-4">
                <p className="text-2xl font-bold text-[#6B7280]">{s.value}</p>
                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge variant="outline" className="mb-4 text-[#6B7280] border-[#6B7280]/30">
              Ce que nous faisons
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0F2C5E]">
              Nos domaines d&apos;expertise
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
              De la rénovation intérieure au gros œuvre, nous couvrons l&apos;ensemble des corps
              de métier du bâtiment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-children">
            {services.map((s) => {
              const Icon = s.icon
              return (
                <Link key={s.title} href={s.href} className="group">
                  <Card className="h-full hover:shadow-lg hover:border-[#6B7280]/25 hover:-translate-y-1 transition-all duration-300">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-xl bg-[#0F2C5E]/5 flex items-center justify-center text-[#0F2C5E] mb-4 group-hover:bg-[#6B7280] group-hover:text-white transition-colors duration-300">
                        <Icon className="w-7 h-7" />
                      </div>
                      <CardTitle>{s.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-5">{s.desc}</CardDescription>
                      <span className="text-[#6B7280] text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        En savoir plus <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── POURQUOI NOUS ────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <Badge variant="outline" className="mb-4 text-[#6B7280] border-[#6B7280]/30">
                Pourquoi nous choisir
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#0F2C5E] mb-6">
                L&apos;artisanat local au service de votre projet
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8 text-lg">
                Depuis notre création, nous mettons la qualité d&apos;exécution, la transparence
                et la satisfaction client au cœur de chaque chantier. Nos artisans sont
                sélectionnés pour leur expertise et leur rigueur.
              </p>
              <Button asChild variant="default" size="lg">
                <Link href="/devis">
                  Obtenir un devis gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 reveal-children">
              {avantages.map((a) => {
                const Icon = a.icon
                return (
                  <Card key={a.title} className="bg-[#F8F7F4] border-0">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 bg-[#0F2C5E] rounded-xl flex items-center justify-center text-white mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-base">{a.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription>{a.desc}</CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0F2C5E] relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6B7280]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge variant="ghost" className="mb-4 border-white/20">
              Comment ça marche
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Notre processus en 4 étapes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-children">
            {etapes.map((e, i) => (
              <div key={e.num} className="relative text-center">
                {i < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[65%] right-0 h-px bg-white/15" />
                )}
                <div className="w-14 h-14 bg-[#6B7280] rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-5 relative z-10 shadow-lg shadow-gray-900/30">
                  {e.num}
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{e.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZONE D'INTERVENTION ──────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge variant="outline" className="mb-4 text-[#6B7280] border-[#6B7280]/30">
              Zone géographique
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0F2C5E]">
              Nous intervenons dans un rayon de 80km
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
              Basés à <strong className="text-[#0F2C5E]">Longuenesse (62219)</strong>, nous
              couvrons l&apos;ensemble du Nord-Pas-de-Calais.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal">
            {/* Map visualization */}
            <div className="relative bg-[#F8F7F4] rounded-3xl overflow-hidden aspect-square max-w-md mx-auto w-full flex items-center justify-center shadow-inner">
              <div className="relative flex items-center justify-center">
                {[288, 208, 144].map((size, idx) => (
                  <div
                    key={size}
                    className="absolute rounded-full border-2 border-[#0F2C5E] flex items-center justify-center"
                    style={{
                      width: size,
                      height: size,
                      opacity: 0.08 + idx * 0.05,
                    }}
                  />
                ))}
                <div className="w-16 h-16 rounded-full bg-[#0F2C5E] flex items-center justify-center shadow-xl relative z-10">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
              </div>
              <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-semibold tracking-wider uppercase">
                80 km
              </span>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <Badge variant="default" className="text-xs shadow-lg">
                  📍 Longuenesse
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-gray-500 mb-6 leading-relaxed text-lg">
                Nous couvrons notamment les villes suivantes et toutes les communes
                environnantes :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {villes.map((v) =>
                  v.slug ? (
                    <Link
                      key={v.nom}
                      href={`/zones-intervention/${v.slug}`}
                      className="flex items-center gap-2 bg-[#F8F7F4] rounded-xl px-3 py-2.5 border border-gray-100 hover:border-[#6B7280]/40 hover:bg-gray-50/40 transition-colors group"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                      <span className="text-[#0F2C5E] text-sm font-medium group-hover:text-[#6B7280] transition-colors">{v.nom}</span>
                    </Link>
                  ) : (
                    <div
                      key={v.nom}
                      className="flex items-center gap-2 bg-[#F8F7F4] rounded-xl px-3 py-2.5 border border-gray-100"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                      <span className="text-[#0F2C5E] text-sm font-medium">{v.nom}</span>
                    </div>
                  )
                )}
              </div>
              <p className="text-sm text-gray-400 italic mb-6">
                Votre ville n&apos;est pas listée ? Contactez-nous, nous étudions chaque demande.
              </p>
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">
                  Vérifier ma zone
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────── */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge variant="outline" className="mb-4 text-[#6B7280] border-[#6B7280]/30">
              Avis clients
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0F2C5E]">
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-children">
            {temoignages.map((t) => (
              <Card key={t.nom} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-7">
                  <div className="flex text-[#6B7280] mb-4 gap-0.5">
                    {Array.from({ length: t.note }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic text-sm">
                    &ldquo;{t.texte}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 bg-[#0F2C5E] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.nom[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F2C5E] text-sm">{t.nom}</p>
                      <p className="text-gray-400 text-xs">{t.ville}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0F2C5E] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='0' y='0' width='1' height='40' fill='%23fff'/%3E%3Crect x='0' y='0' width='40' height='1' fill='%23fff'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6B7280]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center reveal">
          <Badge variant="ghost" className="mb-6 border-white/20">
            <Zap className="w-3.5 h-3.5 text-[#6B7280]" />
            Démarrez votre projet
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Contactez-nous dès aujourd&apos;hui pour obtenir votre devis gratuit. Nos artisans
            se déplacent chez vous et vous remettent un chiffrage détaillé sous{" "}
            <strong className="text-white">48h</strong>, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="primary" className="shadow-xl shadow-gray-900/30 text-base">
              <Link href="/rendez-vous">
                <Calendar className="w-5 h-5" />
                Prendre Rendez-vous
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-white" className="text-base">
              <a href="tel:+33300000000">
                <Phone className="w-5 h-5" />
                03 XX XX XX XX
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
