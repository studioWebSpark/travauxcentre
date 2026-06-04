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
    "travaux longuenesse",
    "rénovation saint-omer",
    "maçon pas-de-calais",
    "entreprise travaux nord",
    "devis travaux gratuit",
    "rénovation intérieure nord",
    "artisan longuenesse",
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
    "Longuenesse", "Saint-Omer", "Arras", "Boulogne-sur-Mer",
    "Béthune", "Calais", "Lille", "Hazebrouck", "Aire-sur-la-Lys",
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
