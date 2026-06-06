import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://travauxcentre.fr"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Travaux Centre | Entreprise de Travaux à Longuenesse et région (80km)",
    template: "%s | Travaux Centre",
  },
  description:
    "Travaux Centre, votre entreprise de rénovation et travaux à Longuenesse. Devis gratuit sous 48h. Rénovation intérieure, maçonnerie, aménagement extérieur. Intervention dans un rayon de 80km.",
  keywords: [
    // Ville siège
    "travaux longuenesse", "artisan longuenesse", "rénovation longuenesse",
    "entreprise travaux pas-de-calais", "devis travaux gratuit",
    // Zones proches
    "travaux saint-omer", "artisan saint-omer", "rénovation saint-omer",
    "travaux lumbres", "artisan aire-sur-la-lys", "travaux fauquembergues",
    // Zones intermédiaires
    "artisan calais", "travaux calais", "rénovation calais",
    "travaux hazebrouck", "artisan hazebrouck",
    "travaux béthune", "rénovation béthune",
    "artisan desvres", "travaux marquise", "rénovation lillers",
    "travaux hesdin", "artisan bruay-la-buissière",
    "rénovation montreuil-sur-mer", "travaux étaples",
    "artisan saint-pol-sur-ternoise", "rénovation ardres",
    // Zones étendues
    "travaux lens", "artisan lens", "rénovation lens",
    "travaux arras", "artisan arras",
    "travaux lille", "rénovation lille métropole",
    "artisan berck", "travaux berck",
    "rénovation dunkerque", "travaux dunkerque",
    "travaux gravelines", "artisan le-touquet",
    "rénovation hénin-beaumont", "travaux doullens",
    // Génériques
    "rénovation intérieure nord", "maçon pas-de-calais",
    "artisan rge nord pas de calais", "devis rénovation 48h",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Travaux Centre",
    title: "Travaux Centre | Entreprise de Travaux à Longuenesse",
    description:
      "Rénovation intérieure, maçonnerie, aménagement extérieur. Devis gratuit sous 48h. Zone d'intervention : 80km autour de Longuenesse.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Travaux Centre — Longuenesse" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travaux Centre | Entreprise de Travaux à Longuenesse",
    description: "Devis gratuit sous 48h. Artisans certifiés RGE. Garantie décennale.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Travaux Centre",
  url: siteUrl,
  telephone: "+33300000000",
  email: "contact@travauxcentre.fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "",
    addressLocality: "Longuenesse",
    postalCode: "62219",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 50.7336,
    longitude: 2.2621,
  },
  areaServed: [
    // < 20 km
    { "@type": "City", name: "Longuenesse",            postalCode: "62219", addressCountry: "FR" },
    { "@type": "City", name: "Saint-Omer",             postalCode: "62500", addressCountry: "FR" },
    { "@type": "City", name: "Lumbres",                postalCode: "62380", addressCountry: "FR" },
    { "@type": "City", name: "Fauquembergues",         postalCode: "62560", addressCountry: "FR" },
    { "@type": "City", name: "Aire-sur-la-Lys",        postalCode: "62120", addressCountry: "FR" },
    // 20–45 km
    { "@type": "City", name: "Ardres",                 postalCode: "62610", addressCountry: "FR" },
    { "@type": "City", name: "Fruges",                 postalCode: "62310", addressCountry: "FR" },
    { "@type": "City", name: "Desvres",                postalCode: "62240", addressCountry: "FR" },
    { "@type": "City", name: "Hazebrouck",             postalCode: "59190", addressCountry: "FR" },
    { "@type": "City", name: "Lillers",                postalCode: "62190", addressCountry: "FR" },
    { "@type": "City", name: "Marquise",               postalCode: "62250", addressCountry: "FR" },
    { "@type": "City", name: "Hesdin",                 postalCode: "62140", addressCountry: "FR" },
    { "@type": "City", name: "Bruay-la-Buissière",     postalCode: "62700", addressCountry: "FR" },
    { "@type": "City", name: "Calais",                 postalCode: "62100", addressCountry: "FR" },
    { "@type": "City", name: "Étaples-sur-Mer",        postalCode: "62630", addressCountry: "FR" },
    { "@type": "City", name: "Montreuil-sur-Mer",      postalCode: "62170", addressCountry: "FR" },
    { "@type": "City", name: "Saint-Pol-sur-Ternoise", postalCode: "62130", addressCountry: "FR" },
    // 45–80 km
    { "@type": "City", name: "Le Touquet-Paris-Plage", postalCode: "62520", addressCountry: "FR" },
    { "@type": "City", name: "Béthune",                postalCode: "62400", addressCountry: "FR" },
    { "@type": "City", name: "Gravelines",             postalCode: "59820", addressCountry: "FR" },
    { "@type": "City", name: "Berck-sur-Mer",          postalCode: "62600", addressCountry: "FR" },
    { "@type": "City", name: "Lens",                   postalCode: "62300", addressCountry: "FR" },
    { "@type": "City", name: "Arras",                  postalCode: "62000", addressCountry: "FR" },
    { "@type": "City", name: "Hénin-Beaumont",         postalCode: "62110", addressCountry: "FR" },
    { "@type": "City", name: "Dunkerque",              postalCode: "59140", addressCountry: "FR" },
    { "@type": "City", name: "Lille",                  postalCode: "59000", addressCountry: "FR" },
    { "@type": "City", name: "Doullens",               postalCode: "80600", addressCountry: "FR" },
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "18:00" },
  ],
  priceRange: "€€",
  description:
    "Entreprise de travaux à Longuenesse : rénovation intérieure, maçonnerie, aménagement extérieur, second œuvre. Devis gratuit sous 48h.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Nos services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rénovation intérieure" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Gros œuvre & Maçonnerie" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Aménagement extérieur" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Second œuvre" } },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  )
}
