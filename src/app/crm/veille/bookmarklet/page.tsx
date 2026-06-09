"use client"

import { useState, useEffect } from "react"
import { Copy, CheckCircle, ExternalLink, Bookmark, ChevronRight } from "lucide-react"

export default function BookmarkletPage() {
  const [copied, setCopied] = useState(false)
  const [step,   setStep]   = useState<"chrome"|"opera">("chrome")

  const [siteUrl, setSiteUrl] = useState("http://localhost:3000")
  useEffect(() => { setSiteUrl(window.location.origin) }, [])

  const bookmarkletCode = `javascript:(function(){
var u=window.location.href,src='manuel',t='',d='',v='',p='';
if(u.includes('leboncoin'))src='leboncoin';
else if(u.includes('vivastreet'))src='vivastreet';
else if(u.includes('allovoisin'))src='allovoisin';
else if(u.includes('facebook'))src='facebook';
function g(sel){var el=document.querySelector(sel);return el?el.textContent.trim():'';}
function ga(sel,attr){var el=document.querySelector(sel);return el?el.getAttribute(attr)||'':'';}
if(src==='leboncoin'){
  t=g('[data-qa-id="adview_title"]')||g('h1')||document.title;
  d=g('[data-qa-id="adview_body"]')||g('[class*="Description"]')||g('[class*="description"]');
  v=g('[data-qa-id="adview_location_informations"]')||g('[class*="location"]')||g('[class*="Location"]');
  p=g('[data-qa-id="adview_price"]')||ga('meta[property="og:price:amount"]','content');
}else if(src==='facebook'){
  t=g('h1')||g('[data-testid="marketplace-pdp-title"]')||document.title;
  d=g('[data-testid="marketplace-pdp-description"]')||g('[class*="description"]');
  v=g('[class*="location"]')||g('[data-testid="marketplace-pdp-location"]');
}else if(src==='vivastreet'){
  t=g('h1')||g('.listing-title')||document.title;
  d=g('.listing-description')||g('[class*="description"]');
  v=g('.listing-location')||g('[class*="location"]');
  p=g('.listing-price')||g('[class*="price"]');
}else{
  t=ga('meta[property="og:title"]','content')||g('h1')||document.title;
  d=ga('meta[property="og:description"]','content')||ga('meta[name="description"]','content');
  v=g('[class*="location"],[class*="ville"],[class*="city"]');
  p=g('[class*="price"],[class*="prix"]');
}
if(!t)t=document.title;
if(!d)d=ga('meta[property="og:description"]','content')||ga('meta[name="description"]','content');
var params=new URLSearchParams({
  titre:t.slice(0,200),
  description:d.slice(0,800),
  url:u,source:src,
  ville:v.slice(0,100),
  prix:p.slice(0,50)
});
window.open('${siteUrl}/crm/veille/capture?'+params.toString(),'_blank','width=650,height=750');
})();`.replace(/\n/g, "").replace(/  +/g, " ").trim()

  function copy() {
    navigator.clipboard.writeText(bookmarkletCode)
    setCopied(true); setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2C5E]">Installer le Bookmarklet</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Capturez n&apos;importe quelle annonce en un clic depuis LeBonCoin, Facebook, etc.
        </p>
      </div>

      {/* Étape 1 : Copier le code */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-[#0F2C5E] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</div>
          <h2 className="font-bold text-[#0F2C5E]">Copiez le code du bookmarklet</h2>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 font-mono text-xs text-gray-500 break-all mb-3 max-h-24 overflow-hidden">
          {bookmarkletCode.slice(0, 120)}…
        </div>
        <button onClick={copy}
          className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl ${
            copied ? "bg-green-50 border border-green-200 text-green-700" : "bg-[#0F2C5E] text-white "
          }`}>
          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "✓ Code copié !" : "Copier le code"}
        </button>
      </div>

      {/* Étape 2 : Choisir le navigateur */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-[#0F2C5E] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</div>
          <h2 className="font-bold text-[#0F2C5E]">Créer le favori dans votre navigateur</h2>
        </div>

        {/* Sélecteur navigateur */}
        <div className="flex gap-2 mb-5">
          <button onClick={() => setStep("chrome")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border ${
              step === "chrome" ? "bg-[#0F2C5E] text-white border-[#0F2C5E]" : "border-gray-200 text-gray-600 "
            }`}>
            Chrome
          </button>
          <button onClick={() => setStep("opera")}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border ${
              step === "opera" ? "bg-[#0F2C5E] text-white border-[#0F2C5E]" : "border-gray-200 text-gray-600 "
            }`}>
            Opera
          </button>
        </div>

        {/* Instructions Chrome */}
        {step === "chrome" && (
          <ol className="space-y-4">
            {[
              { n: 1, text: "Affichez la barre des favoris", detail: "Appuyez sur Ctrl + Maj + B (Windows) ou ⌘ + Maj + B (Mac)" },
              { n: 2, text: "Faites un clic droit sur la barre des favoris", detail: "Sur la zone vide à droite des favoris existants" },
              { n: 3, text: "Cliquez sur « Ajouter une page »", detail: "Une fenêtre s'ouvre avec deux champs : Nom et URL" },
              { n: 4, text: "Remplissez le formulaire", detail: 'Nom : "→ CRM TravauxCentre"  |  URL : collez le code copié à l\'étape 1' },
              { n: 5, text: "Cliquez sur Enregistrer", detail: "Le bouton apparaît dans votre barre de favoris" },
            ].map(({ n, text, detail }) => (
              <li key={n} className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{n}</div>
                <div>
                  <p className="text-sm font-semibold text-[#0F2C5E]">{text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {/* Instructions Opera */}
        {step === "opera" && (
          <ol className="space-y-4">
            {[
              { n: 1, text: "Affichez la barre des favoris", detail: "Appuyez sur Ctrl + Maj + B" },
              { n: 2, text: "Cliquez sur l'icône ♡ (favoris) dans la barre d'adresse", detail: "Sur n'importe quelle page — cela ouvre le gestionnaire de favoris" },
              { n: 3, text: "Cliquez sur « Gérer les favoris »", detail: "Puis « Ajouter un favori » ou clic droit → Nouveau favori" },
              { n: 4, text: "Remplissez le formulaire", detail: 'Nom : "→ CRM TravauxCentre"  |  URL : collez le code copié à l\'étape 1' },
              { n: 5, text: "Enregistrez", detail: "Le bouton apparaît dans votre barre de favoris" },
            ].map(({ n, text, detail }) => (
              <li key={n} className="flex gap-3">
                <div className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{n}</div>
                <div>
                  <p className="text-sm font-semibold text-[#0F2C5E]">{text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Étape 3 : Utilisation */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-[#0F2C5E] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</div>
          <h2 className="font-bold text-[#0F2C5E]">Utilisez-le sur n&apos;importe quel site</h2>
        </div>
        <div className="space-y-3">
          {[
            { icon: "🟠", label: "LeBonCoin", action: "Allez dans Services > Réparation/Travaux > Nord-Pas-de-Calais → ouvrez une annonce → cliquez le bookmarklet", url: "https://www.leboncoin.fr/recherche?category=30&text=renovation+travaux&locations=Nord-Pas-de-Calais" },
            { icon: "🔵", label: "Facebook", action: "Groupes locaux de travaux → copiez le texte → utilisez « Coller une annonce »", url: null },
            { icon: "🟣", label: "Vivastreet", action: "Section Services > Réparation et Travaux → ouvrez une annonce → cliquez le bookmarklet", url: "https://www.vivastreet.com/annonces+services/hauts-de-france" },
          ].map(({ icon, label, action, url }) => (
            <div key={label} className="flex items-start gap-3 p-3 bg-[#F8F7F4] rounded-xl">
              <span className="text-xl shrink-0">{icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-[#0F2C5E] text-sm">{label}</p>
                  {url && (
                    <a href={url} target="_blank"
                      className="text-xs text-[#0F2C5E] underline flex items-center gap-0.5">
                      Ouvrir <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500">{action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <p className="text-sm font-semibold text-green-700 mb-2">✅ Tester sans quitter cette page</p>
        <p className="text-xs text-green-600 mb-3">Cliquez ce bouton pour simuler une capture et vérifier que ça fonctionne :</p>
        <a
          href={`/crm/veille/capture?titre=Test annonce renovation maison&description=Particulier cherche artisan pour renovation complete salon 40m2 peinture carrelage&url=https://test.com/annonce/123&source=leboncoin`}
          target="_blank"
          className="inline-flex items-center gap-2 bg-green-600 text-[#1a1a1a] font-semibold px-4 py-2 rounded-xl text-sm ">
          <Bookmark className="w-4 h-4" /> Tester la capture →
        </a>
      </div>
    </div>
  )
}
