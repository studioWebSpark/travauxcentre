import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales | Travaux Centre",
  description: "Informations légales, droits, responsabilités et conditions d'utilisation du site Travaux Centre.",
  robots: { index: false, follow: false },
}

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
