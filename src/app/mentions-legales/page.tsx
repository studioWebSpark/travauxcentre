import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: false },
}

export default function MentionsLegalesPage() {
  return (
    <div className="pt-28 pb-16 max-w-3xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-[#0F2C5E] mb-8" style={{ fontFamily: "var(--font-playfair), serif" }}>
        Mentions légales
      </h1>
      <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[#0F2C5E] mb-2">Éditeur du site</h2>
          <p><strong>Travaux Centre</strong><br/>
          Entreprise individuelle / SARL [à compléter]<br/>
          Siège social : Longuenesse, 62219 — Nord-Pas-de-Calais<br/>
          SIRET : [à compléter]<br/>
          Email : contact@travauxcentre.fr<br/>
          Tél : 03 XX XX XX XX</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-[#0F2C5E] mb-2">Hébergement</h2>
          <p>Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-[#0F2C5E] mb-2">Propriété intellectuelle</h2>
          <p>L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo) est la propriété exclusive de Travaux Centre et est protégé par les lois françaises et internationales sur la propriété intellectuelle.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-[#0F2C5E] mb-2">Données personnelles</h2>
          <p>Les données collectées via les formulaires sont utilisées uniquement pour traiter vos demandes. Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression. Contactez-nous à contact@travauxcentre.fr.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-[#0F2C5E] mb-2">Cookies</h2>
          <p>Ce site utilise uniquement des cookies techniques nécessaires au bon fonctionnement. Aucun cookie de traçage tiers n&apos;est utilisé.</p>
        </section>
      </div>
    </div>
  )
}
