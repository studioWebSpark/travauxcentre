"use client"

import { useState } from "react"
import { Bookmark, Copy, CheckCircle, ExternalLink } from "lucide-react"

export default function BookmarkletPage() {
  const [copied, setCopied] = useState(false)

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"

  // Le bookmarklet — capture titre + description + URL + source (leboncoin/autre)
  const bookmarkletCode = `javascript:(function(){
var t=document.title||'';
var d='';
var u=window.location.href;
var src='manuel';
if(u.includes('leboncoin')) src='leboncoin';
else if(u.includes('vivastreet')) src='vivastreet';
else if(u.includes('allovoisin')) src='allovoisin';
else if(u.includes('facebook')) src='facebook';
var metas=document.querySelectorAll('meta[name="description"],meta[property="og:description"]');
if(metas.length>0) d=metas[0].getAttribute('content')||'';
var h1=document.querySelector('h1');
if(h1) t=h1.textContent.trim()||t;
var body=document.querySelector('[class*="description"],[class*="body"],[id*="description"]');
if(body && !d) d=body.textContent.slice(0,500).trim();
fetch('${siteUrl}/api/crm/veille/capture',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({titre:t,description:d||t,url:u,source:src})
}).then(r=>r.json()).then(function(j){
  if(j.duplicate) alert('✅ Déjà dans votre CRM !');
  else if(j.success) alert('✅ Annonce ajoutée ! Score IA: '+j.score+'/100');
  else alert('❌ Erreur: '+JSON.stringify(j));
}).catch(function(){alert('❌ Impossible de contacter le CRM');});
})();`.replace(/\s+/g, " ").trim()

  function copy() {
    navigator.clipboard.writeText(bookmarkletCode)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2C5E]">Bookmarklet CRM</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Capturez n&apos;importe quelle annonce depuis LeBonCoin, Facebook, ou n&apos;importe quel site
        </p>
      </div>

      {/* Explication */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h2 className="font-bold text-blue-800 mb-2">Comment ça fonctionne ?</h2>
        <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
          <li>Glissez le bouton ci-dessous dans votre barre de favoris</li>
          <li>Naviguez sur LeBonCoin, Facebook, ou n&apos;importe quel site</li>
          <li>Ouvrez une annonce qui vous intéresse</li>
          <li>Cliquez sur <strong>&quot;→ CRM TravauxCentre&quot;</strong> dans vos favoris</li>
          <li>L&apos;annonce est ajoutée et analysée par l&apos;IA automatiquement !</li>
        </ol>
      </div>

      {/* Bouton à glisser */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <p className="text-sm text-gray-500 mb-6">
          👇 <strong>Glissez ce bouton</strong> vers votre barre de favoris
        </p>

        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href={bookmarkletCode}
            className="inline-flex items-center gap-2 bg-[#0F2C5E] text-white font-bold px-6 py-3 rounded-xl cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl transition-shadow text-base"
            onClick={(e) => { e.preventDefault(); alert("Glissez ce bouton vers votre barre de favoris !") }}
          >
            <Bookmark className="w-5 h-5" />
            → CRM TravauxCentre
          </a>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 mb-3">Ou copiez le code manuellement et créez un favori :</p>
          <button onClick={copy}
            className="inline-flex items-center gap-2 border border-gray-200 text-[#0F2C5E] font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copié !" : "Copier le code"}
          </button>
        </div>
      </div>

      {/* Sites compatibles */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#0F2C5E] mb-4">Sites compatibles</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "LeBonCoin", url: "https://www.leboncoin.fr/recherche?category=30&text=renovation&locations=Nord-Pas-de-Calais", icon: "🟠", tip: "Cherche dans Services > Réparation/Travaux" },
            { name: "Facebook", url: "https://www.facebook.com/groups/", icon: "🔵", tip: "Groupes locaux de travaux et renovation" },
            { name: "Vivastreet", url: "https://www.vivastreet.com/annonces/hauts-de-france", icon: "🟣", tip: "Section Services" },
            { name: "AlloVoisin", url: "https://www.allovoisin.com", icon: "👥", tip: "Demandes de services proches" },
            { name: "Nextdoor", url: "https://nextdoor.fr", icon: "🏘️", tip: "Réseau de quartier" },
            { name: "Groupes WhatsApp", url: "#", icon: "💬", tip: "Copiez le texte → Coller annonce" },
          ].map(({ name, url, icon, tip }) => (
            <div key={name} className="flex items-start gap-3 p-3 bg-[#F8F7F4] rounded-xl">
              <span className="text-xl shrink-0">{icon}</span>
              <div>
                <p className="font-semibold text-[#0F2C5E] text-sm">{name}</p>
                <p className="text-xs text-gray-400">{tip}</p>
                {url !== "#" && (
                  <a href={url} target="_blank" className="text-xs text-[#0F2C5E] hover:underline inline-flex items-center gap-0.5 mt-1">
                    Ouvrir <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions Facebook */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h2 className="font-bold text-amber-800 mb-2">💡 Astuce Facebook</h2>
        <p className="text-sm text-amber-700">
          Rejoignez les groupes Facebook locaux de votre zone :<br/>
          <strong>&quot;Travaux et rénovation Nord-Pas-de-Calais&quot;</strong>,{" "}
          <strong>&quot;Artisans 62&quot;</strong>,{" "}
          <strong>&quot;Petits travaux Longuenesse Saint-Omer&quot;</strong>.<br/>
          Quand vous voyez une annonce intéressante, cliquez sur le bookmarklet ou utilisez{" "}
          <a href="/crm/veille" className="font-semibold underline">Coller une annonce</a>.
        </p>
      </div>
    </div>
  )
}
