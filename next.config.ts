import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.openstreetmap.org" },
      { protocol: "https", hostname: "**.tile.openstreetmap.org" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",     value: "nosniff" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection",           value: "1; mode=block" },
        ],
      },
      {
        // HSTS uniquement en production (HTTPS requis)
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "https" }],
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // Cache des images statiques
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache des tuiles OpenStreetMap
        source: "/:path*",
        has: [{ type: "header", key: "host", value: "tile.openstreetmap.org" }],
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800" },
        ],
      },
    ]
  },
}

export default nextConfig
