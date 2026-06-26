"use client"

import { useEffect, useRef } from "react"
import { zones, LONGUENESSE, RAYON_KM } from "@/lib/zones"

type LeafletContainer = HTMLDivElement & { _leaflet_id?: number }

export default function ZoneMap() {
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(mapRef.current, {
        center:          [LONGUENESSE.lat, LONGUENESSE.lng],
        zoom:            9,
        scrollWheelZoom: false,
        zoomControl:     true,
      })

      instanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      L.circle([LONGUENESSE.lat, LONGUENESSE.lng], {
        radius:      RAYON_KM * 1000,
        color:       "#0F2C5E",
        fillColor:   "#0F2C5E",
        fillOpacity: 0.06,
        weight:      2,
        dashArray:   "8 6",
      }).addTo(map)

      const baseIcon = L.divIcon({
        html: `<div style="
          width:38px;height:38px;
          background:#0F2C5E;
          border:3px solid #F97316;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 3px 10px rgba(0,0,0,0.3);
        ">
          <svg width="16" height="16" fill="#F97316" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>`,
        className: "",
        iconSize:    [38, 38],
        iconAnchor:  [19, 38],
        popupAnchor: [0, -40],
      })

      L.marker([LONGUENESSE.lat, LONGUENESSE.lng], { icon: baseIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;min-width:160px">
            <p style="font-weight:700;color:#0F2C5E;font-size:14px;margin:0 0 4px">🏠 Notre siège</p>
            <p style="color:#F97316;font-size:13px;margin:0 0 8px;font-weight:600">Longuenesse — 62219</p>
            <p style="color:#555;font-size:12px;margin:0">Zone d'intervention : <strong>80 km</strong> à la ronde</p>
          </div>`,
          { maxWidth: 220 }
        )

      zones.forEach((zone) => {
        const color =
          zone.distanceKm < 20 ? "#16a34a" :
          zone.distanceKm < 45 ? "#0F2C5E" :
          "#6b7280"

        const zoneIcon = L.divIcon({
          html: `<div style="
            width:28px;height:28px;
            background:${color};
            border:2px solid white;
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 6px rgba(0,0,0,0.25);
            cursor:pointer;
          ">
            <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>`,
          className: "",
          iconSize:    [28, 28],
          iconAnchor:  [14, 28],
          popupAnchor: [0, -30],
        })

        L.marker([zone.lat, zone.lng], { icon: zoneIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;min-width:180px">
              <p style="font-weight:700;color:#0F2C5E;font-size:14px;margin:0 0 2px">${zone.nom}</p>
              <p style="color:#888;font-size:12px;margin:0 0 6px">${zone.codePostal} — ${zone.departement}</p>
              <p style="color:#555;font-size:12px;margin:0 0 8px">À <strong>${zone.distanceKm} km</strong> de Longuenesse</p>
              <a href="/zones-intervention/${zone.slug}"
                style="display:block;background:#0F2C5E;color:white;text-align:center;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;">
                Voir nos interventions →
              </a>
            </div>`,
            { maxWidth: 240 }
          )
      })

      const allCoords: [number, number][] = [
        [LONGUENESSE.lat, LONGUENESSE.lng],
        ...zones.map((z): [number, number] => [z.lat, z.lng]),
      ]
      map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] })

      // Add ARIA labels to marker icons for accessibility
      setTimeout(() => {
        const markers = mapRef.current?.querySelectorAll(".leaflet-marker-icon[role='button']")
        if (markers) {
          let markerIndex = 0
          markers.forEach((marker) => {
            if (markerIndex === 0) {
              marker.setAttribute("aria-label", "Notre siège à Longuenesse")
            } else if (markerIndex <= zones.length) {
              const zone = zones[markerIndex - 1]
              marker.setAttribute("aria-label", `${zone.nom}, ${zone.codePostal}`)
            }
            markerIndex++
          })
        }
      }, 100)
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

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden"
        style={{ height: 520 }}
        role="region"
        aria-label="Carte interactive des zones d'intervention de Travaux Centre dans un rayon de 80 km autour de Longuenesse"
      />
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-xl shadow-lg p-3 text-xs space-y-1.5">
        <div className="sr-only">Légende de la carte</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0F2C5E] border-2 border-[#F97316] inline-block" aria-hidden="true" />
          <span className="text-gray-700 font-semibold">Notre siège (Longuenesse)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600 inline-block" aria-hidden="true" />
          <span className="text-gray-700">Zone proche (&lt; 20 km)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0F2C5E] inline-block" aria-hidden="true" />
          <span className="text-gray-700">Zone intermédiaire (20–45 km)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" aria-hidden="true" />
          <span className="text-gray-700">Zone étendue (45–80 km)</span>
        </div>
      </div>
    </div>
  )
}
