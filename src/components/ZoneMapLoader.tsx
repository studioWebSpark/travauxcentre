"use client"

import dynamic from "next/dynamic"

const ZoneMap = dynamic(() => import("@/components/ZoneMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl bg-[#F8F7F4] border border-gray-200 flex items-center justify-center"
      style={{ height: 520 }}
    >
      <div className="text-center text-gray-400">
        <svg className="w-10 h-10 mx-auto mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-sm">Chargement de la carte…</p>
      </div>
    </div>
  ),
})

export default function ZoneMapLoader() {
  return <ZoneMap />
}
