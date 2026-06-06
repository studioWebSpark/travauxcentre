"use client"

import dynamic from "next/dynamic"

const ZoneMapCompact = dynamic(() => import("@/components/ZoneMapCompact"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl" />
  ),
})

export default function ZoneMapCompactLoader() {
  return <ZoneMapCompact />
}
