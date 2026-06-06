import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import ZoneMapCompactLoader from "@/components/ZoneMapCompactLoader"

export const metadata: Metadata = {
  title: "Travaux Centre | Entreprise de Travaux à Longuenesse et région (80km)",
}

function IconHome()    { return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V12h6v9"/></svg> }
function IconBrick()   { return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="4" rx="1" strokeWidth={1.5}/><rect x="2" y="13" width="20" height="4" rx="1" strokeWidth={1.5}/><line x1="7" y1="7" x2="7" y2="11" strokeWidth={1.5}/><line x1="12" y1="13" x2="12" y2="17" strokeWidth={1.5}/></svg> }
function IconTree()    { return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22V12m0 0l-4-4m4 4l4-4M6 12l-2-3h16l-2 3"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9L6 6h12l-2 3"/></svg> }
function IconWrench()  { return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> }
function IconStar()    { return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> }
function IconCheck()   { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> }
function IconPhone()   { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> }
function IconCalendar(){ return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2}/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth={2}/></svg> }
function IconShield()  { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> }
function IconTrophy()  { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-2m6 2v-2M12 17v-4m-5.5-7H5a2 2 0 00-2 2v1a5.5 5.5 0 0011 0V8a2 2 0 00-2-2h-1.5m-3 0V4a1 1 0 011-1h2a1 1 0 011 1v2m-4 0h4"/></svg> }

const services = [
  { icon: <IconHome />,   title: "Rénovation Intérieure",     desc: "Peinture, carrelage, parquet, plâtrerie, faux-plafonds — on transforme vos espaces avec soin et précision.",                 href: "/services/renovation-interieure", img: "/images/renovation-interieure.jpg" },
  { icon: <IconBrick />,  title: "Gros Œuvre & Maçonnerie",   desc: "Murs porteurs, fondations, extensions, reprises en sous-œuvre — nos maçons certifiés assurent la solidité de votre bâti.",  href: "/services/gros-oeuvre",           img: "/images/gros-oeuvre.jpg" },
  { icon: <IconTree />,   title: "Aménagement Extérieur",     desc: "Terrasses, allées, clôtures, dallages — on sublime vos extérieurs pour créer des espaces de vie agréables.",                  href: "/services/amenagement-exterieur", img: "/images/amenagement-exterieur.jpg" },
  { icon: <IconWrench />, title: "Second Œuvre",              desc: "Électricité, plomberie, isolation thermique et acoustique — des installations conformes aux normes en vigueur.",               href: "/services/second-oeuvre",         img: "/images/second-oeuvre.jpg" },
]

const avantages = [
  { icon: <IconCheck />,    title: "Artisans locaux certifiés RGE", desc: "Nos équipes sont qualifiées et certifiées RGE pour vous garantir des travaux conformes aux normes." },
  { icon: <IconCalendar />, title: "Devis gratuit sous 48h",        desc: "Nous nous engageons à vous répondre rapidement. Visite sur site et chiffrage entièrement offerts." },
  { icon: <IconShield />,   title: "Garantie décennale",            desc: "Tous nos travaux sont couverts par notre assurance décennale pour votre tranquillité d'esprit." },
  { icon: <IconTrophy />,   title: "+150 chantiers réalisés",       desc: "Des dizaines de clients satisfaits dans la région. Notre réputation se construit chantier après chantier." },
]

const etapes = [
  { num: "01", title: "Prise de contact",        desc: "Contactez-nous par téléphone, email ou formulaire. On échange sur votre projet en moins de 24h." },
  { num: "02", title: "Visite & devis gratuit",  desc: "On se déplace chez vous pour évaluer vos besoins et vous remettre un devis détaillé sans engagement." },
  { num: "03", title: "Réalisation des travaux", desc: "Nos artisans interviennent dans les délais convenus avec un suivi rigoureux de l'avancement du chantier." },
  { num: "04", title: "Réception & garantie",    desc: "On finalise ensemble la réception du chantier. Vos travaux sont garantis décennale et SAV réactif." },
]

const villes = [
  "Saint-Omer", "Arras", "Boulogne-sur-Mer",
  "Béthune", "Calais", "Hazebrouck",
  "Aire-sur-la-Lys", "Fruges", "Lumbres",
]

const temoignages = [
  { nom: "Sophie M.",       ville: "Saint-Omer",  note: 5, texte: "Excellent travail pour notre rénovation complète. L'équipe est sérieuse, propre et respectueuse des délais. Je recommande vivement !" },
  { nom: "Jean-Pierre L.",  ville: "Béthune",     note: 5, texte: "Devis rapide, prix honnête et résultat impeccable. Nos nouvelles cloisons et notre carrelage sont parfaits. Merci à toute l'équipe." },
  { nom: "Marie C.",        ville: "Longuenesse", note: 5, texte: "Terrasse et allée réalisées en 4 jours chrono. La finition est soignée et le suivi client excellent. Une entreprise de confiance." },
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image src="/images/hero.jpg" alt="Chantier de rénovation Travaux Centre" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[#0F2C5E]/70" aria-hidden />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            Artisans certifiés RGE — Garantie décennale
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Vos Travaux,{" "}
            <span className="text-[#F97316]">Notre Expertise</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Entreprise de travaux ancrée à Longuenesse, nous intervenons dans un rayon de 80km pour
            tous vos projets de rénovation, maçonnerie et aménagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/devis" className="bg-[#F97316] text-white font-semibold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg text-lg">
              Demander un Devis Gratuit
            </Link>
            <Link href="/services" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-lg">
              Nos Services
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-300 text-sm">
            <div className="flex items-center gap-2"><IconCheck /><span>Devis sous 48h</span></div>
            <div className="flex items-center gap-2"><IconShield /><span>Garantie décennale</span></div>
            <div className="flex items-center gap-2"><IconPhone /><span>Disponible 7j/7</span></div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Ce que nous faisons</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Nos domaines d&apos;expertise
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              De la rénovation intérieure au gros œuvre, nous couvrons l&apos;ensemble des corps de métier du bâtiment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-children">
            {services.map((s) => (
              <Link key={s.title} href={s.href} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#F97316]/30 transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <Image src={s.img} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-[#0F2C5E]/30 group-hover:bg-[#0F2C5E]/10 transition-colors" />
                  <div className="absolute top-3 left-3 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0F2C5E] shadow">
                    {s.icon}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0F2C5E] text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  <div className="mt-4 text-[#F97316] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    En savoir plus
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Pourquoi nous choisir</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E] mb-6" style={{ fontFamily: "var(--font-playfair), serif" }}>
                L&apos;artisanat local au service de votre projet
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Depuis notre création, nous mettons la qualité d&apos;exécution, la transparence et la satisfaction client
                au cœur de chaque chantier. Nos artisans sont sélectionnés pour leur expertise et leur rigueur.
              </p>
              <Link href="/devis" className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors">
                Obtenir un devis gratuit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 reveal-children">
              {avantages.map((a) => (
                <div key={a.title} className="bg-[#F8F7F4] rounded-2xl p-6 border border-gray-100">
                  <div className="w-11 h-11 bg-[#0F2C5E] rounded-lg flex items-center justify-center text-white mb-4">{a.icon}</div>
                  <h3 className="font-bold text-[#0F2C5E] mb-2">{a.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="py-20 bg-[#0F2C5E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Comment ça marche</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-playfair), serif" }}>Notre processus en 4 étapes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-children">
            {etapes.map((e, i) => (
              <div key={e.num} className="relative text-center">
                {i < etapes.length - 1 && <div className="hidden lg:block absolute top-7 left-[60%] right-0 h-px bg-white/20" />}
                <div className="w-14 h-14 bg-[#F97316] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-5 relative z-10">{e.num}</div>
                <h3 className="font-bold text-white text-lg mb-3">{e.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZONE D'INTERVENTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Zone géographique</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]" style={{ fontFamily: "var(--font-playfair), serif" }}>
              Nous intervenons dans un rayon de 80km
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Basés à <strong>Longuenesse (62219)</strong>, nous couvrons l&apos;ensemble du Nord-Pas-de-Calais.
            </p>
          </div>
          {/* Carte compacte + infos côte à côte */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch reveal">
            {/* Carte — 3/5 */}
            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ minHeight: 340 }}>
              <ZoneMapCompactLoader />
            </div>

            {/* Infos — 2/5 */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div>
                <p className="text-gray-600 mb-5 leading-relaxed text-sm">
                  Nous couvrons <strong>26 communes</strong> et toutes les localités environnantes. Cliquez sur un point pour accéder à la page de votre ville.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-green-600 shrink-0" />
                    <span className="text-gray-600"><strong>Zone proche</strong> — &lt; 20 km</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-[#0F2C5E] shrink-0" />
                    <span className="text-gray-600"><strong>Zone intermédiaire</strong> — 20 à 45 km</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
                    <span className="text-gray-600"><strong>Zone étendue</strong> — 45 à 80 km</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {villes.map((v) => (
                    <span key={v} className="bg-[#F8F7F4] text-[#0F2C5E] text-xs font-medium px-2.5 py-1 rounded-full border border-gray-100">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/zones-intervention" className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#1a3f7a] transition-colors text-sm">
                  Voir toutes nos zones
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link href="/devis" className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white font-semibold px-5 py-3 rounded-xl hover:bg-orange-600 transition-colors text-sm">
                  Devis gratuit sous 48h
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-20 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Avis clients</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F2C5E]" style={{ fontFamily: "var(--font-playfair), serif" }}>Ce que disent nos clients</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-children">
            {temoignages.map((t) => (
              <div key={t.nom} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                <div className="flex text-[#F97316] mb-4">
                  {Array.from({ length: t.note }).map((_, i) => <IconStar key={i} />)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">&ldquo;{t.texte}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2C5E] rounded-full flex items-center justify-center text-white font-bold text-sm">{t.nom[0]}</div>
                  <div>
                    <p className="font-semibold text-[#0F2C5E] text-sm">{t.nom}</p>
                    <p className="text-gray-400 text-xs">{t.ville}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0F2C5E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Contactez-nous dès aujourd&apos;hui pour obtenir votre devis gratuit. Nos artisans se déplacent chez vous
            et vous remettent un chiffrage détaillé sous 48h, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rendez-vous" className="bg-[#F97316] text-white font-semibold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg text-lg">
              Prendre Rendez-vous
            </Link>
            <a href="tel:+33300000000" className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-lg flex items-center justify-center gap-2">
              <IconPhone />
              03 XX XX XX XX
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
