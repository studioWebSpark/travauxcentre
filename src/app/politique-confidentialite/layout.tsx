import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Travaux Centre",
  description: "Comment nous collectons, utilisons et protégeons vos données personnelles. Conforme au RGPD.",
  robots: { index: false, follow: false },
}

export default function PolitiqueConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
