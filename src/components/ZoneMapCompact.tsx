"use client"

import { useEffect, useRef } from "react"
import { zones, LONGUENESSE, RAYON_KM } from "@/lib/zones"

export default function ZoneMapCompact() {
  const mapRef      = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current) return
    // Leaflet marque le container avec _leaflet_id après init
    if ((mapRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) return

    let cancelled = false

    async function init() {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // Annulé si le composant a été démonté pendant le chargement async
      if (cancelled || !mapRef.current) return
      if ((mapRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(mapRef.current, {
        center:             [LONGUENESSE.lat, LONGUENESSE.lng],
        zoom:               8,
        scrollWheelZoom:    false,
        zoomControl:        false,
        attributionControl: false,
        dragging:           false,
      })

      instanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map)

      L.circle([LONGUENESSE.lat, LONGUENESSE.lng], {
        radius:      RAYON_KM * 1000,
        color:       "#0F2C5E",
        fillColor:   "#0F2C5E",
        fillOpacity: 0.07,
        weight:      2,
        dashArray:   "8 5",
      }).addTo(map)

      const baseIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:#0F2C5E;border:3px solid #F97316;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,.35)">
          <svg width="14" height="14" fill="#F97316" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        </div>`,
        className: "",
        iconSize:    [32, 32],
        iconAnchor:  [16, 32],
        popupAnchor: [0, -36],
      })

      L.marker([LONGUENESSE.lat, LONGUENESSE.lng], { icon: baseIcon, title: "Travaux Centre — Longuenesse", alt: "Travaux Centre — Longuenesse" })
        .addTo(map)
        .bindPopup(`<strong style="color:#0F2C5E">Travaux Centre</strong><br/><span style="font-size:12px;color:#F97316">Longuenesse — 62219</span>`)

      zones.forEach((z) => {
        const color = z.distanceKm < 20 ? "#16a34a" : z.distanceKm < 45 ? "#0F2C5E" : "#9ca3af"
        const icon = L.divIcon({
          html: `<div style="width:10px;height:10px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
          className: "",
          iconSize:   [10, 10],
          iconAnchor: [5, 5],
        })
        L.marker([z.lat, z.lng], { icon, title: `${z.nom}, ${z.distanceKm} km de Longuenesse`, alt: z.nom })
          .addTo(map)
          .bindPopup(`<a href="/zones-intervention/${z.slug}" style="color:#0F2C5E;font-weight:600;font-size:13px;text-decoration:none">${z.nom}</a><br/><span style="font-size:11px;color:#888">${z.distanceKm} km</span>`)
      })

      const bounds = L.latLngBounds([
        [LONGUENESSE.lat, LONGUENESSE.lng],
        ...zones.map((z): [number, number] => [z.lat, z.lng]),
      ])
      map.fitBounds(bounds, { padding: [20, 20] })
    }

    init().catch(console.error)

    return () => {
      cancelled = true
      if (instanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(instanceRef.current as any).remove()
        instanceRef.current = null
      }
    }
  }, [])

  return <div ref={mapRef} className="w-full h-full" />
}
