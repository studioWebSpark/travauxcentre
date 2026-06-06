"use client"

import { useEffect, useRef } from "react"
import { STATUTS } from "@/lib/crm"
import type { StatutLead, PrioriteLead } from "@/generated/prisma"

type Marker = {
  id: string; nom: string; ville: string; codePostal: string
  typeTravaux: string; statut: StatutLead; priorite: PrioriteLead
  telephone: string; email: string; montantDevis: number | null
}

const STATUS_COLOR: Record<StatutLead, string> = {
  NOUVEAU:      "#3b82f6",
  CONTACTE:     "#f59e0b",
  DEVIS_ENVOYE: "#8b5cf6",
  GAGNE:        "#22c55e",
  PERDU:        "#ef4444",
  EN_ATTENTE:   "#9ca3af",
}

type LeafletContainer = HTMLDivElement & { _leaflet_id?: number }

// Geocoding Nominatim (OpenStreetMap) — ville + code postal → lat/lng
async function geocode(ville: string, codePostal: string): Promise<[number, number] | null> {
  try {
    const q   = encodeURIComponent(`${ville}, ${codePostal}, France`)
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=fr`
    const res = await fetch(url, { headers: { "User-Agent": "TravauxCentreCRM/1.0" } })
    const data = await res.json()
    if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    return null
  } catch {
    return null
  }
}

export default function CrmMap({ markers }: { markers: Marker[] }) {
  const mapRef      = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current) return
    if ((mapRef.current as LeafletContainer)._leaflet_id) return

    let cancelled = false

    async function init() {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")
      if (cancelled || !mapRef.current) return
      if ((mapRef.current as LeafletContainer)._leaflet_id) return

      const map = L.map(mapRef.current, { center: [50.7336, 2.2621], zoom: 9, scrollWheelZoom: true })
      instanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap", maxZoom: 18,
      }).addTo(map)

      // Marqueur siège Longuenesse
      const hqIcon = L.divIcon({
        html: `<div style="width:36px;height:36px;background:#0F2C5E;border:3px solid #F97316;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,.35)"><span style="color:#F97316;font-size:15px;font-weight:bold">★</span></div>`,
        className: "", iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -38],
      })
      L.marker([50.7336, 2.2621], { icon: hqIcon })
        .addTo(map)
        .bindPopup("<strong style='color:#0F2C5E'>🏠 Travaux Centre</strong><br><small style='color:#888'>Longuenesse — Siège</small>")

      // Géocoder chaque lead et placer le marqueur
      const allCoords: [number, number][] = [[50.7336, 2.2621]]

      for (const m of markers) {
        if (cancelled) break

        // Petite pause entre les requêtes Nominatim (politesse)
        await new Promise((r) => setTimeout(r, 200))

        const coords = await geocode(m.ville, m.codePostal)
        if (!coords || cancelled) continue

        allCoords.push(coords)
        const [lat, lng] = coords
        const color = STATUS_COLOR[m.statut]
        const st    = STATUTS[m.statut]

        const icon = L.divIcon({
          html: `<div style="width:30px;height:30px;background:${color};border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3);cursor:pointer">
            <span style="color:white;font-size:11px;font-weight:bold">${m.nom[0].toUpperCase()}</span>
          </div>`,
          className: "", iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -32],
        })

        const montantStr = m.montantDevis
          ? `<p style="font-size:12px;color:#22c55e;font-weight:bold;margin:0 0 8px">${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(m.montantDevis)}</p>`
          : ""

        L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:210px">
              <p style="font-weight:700;color:#0F2C5E;font-size:14px;margin:0 0 3px">${m.nom}</p>
              <p style="color:#888;font-size:12px;margin:0 0 5px">📍 ${m.ville} (${m.codePostal})</p>
              <p style="font-size:12px;color:#555;margin:0 0 6px">📋 ${m.typeTravaux}</p>
              <span style="display:inline-block;background:${color}20;color:${color};border:1px solid ${color}50;border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700;margin-bottom:8px">${st.label}</span>
              ${montantStr}
              <div style="display:flex;gap:6px">
                <a href="tel:${m.telephone}" style="flex:1;background:#0F2C5E;color:white;text-align:center;padding:6px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none">📞 Appeler</a>
                <a href="/crm/leads/${m.id}" style="flex:1;background:#F4F5F7;color:#0F2C5E;text-align:center;padding:6px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none">Fiche →</a>
              </div>
            </div>
          `, { maxWidth: 270 })
      }

      // Ajuster la vue sur tous les points
      if (allCoords.length > 1) {
        map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] })
      }
    }

    init().catch(console.error)

    return () => {
      cancelled = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (instanceRef.current) { (instanceRef.current as any).remove(); instanceRef.current = null }
    }
  }, [markers])

  return <div ref={mapRef} className="w-full h-full" />
}
