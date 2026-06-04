'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/dashboard/client",                  label: "Vue d'ensemble", icon: "⊞" },
  { href: "/dashboard/client/projets/nouveau",  label: "Poster un projet", icon: "➕" },
  { href: "/dashboard/client/projets",          label: "Mes projets",    icon: "📁" },
  { href: "/dashboard/client/chantiers",        label: "Mes chantiers",  icon: "🏗️" },
  { href: "/dashboard/client/artisans",         label: "Trouver un artisan", icon: "🔍" },
]

export function Sidebar({ name, image }: { name?: string | null; image?: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-blue-600">Travaux</span>
        <span className="text-xl font-bold text-gray-800">Centre</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard/client" &&
              href !== "/dashboard/client/projets/nouveau" &&
              pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100 flex items-center gap-3">
        {image ? (
          <img src={image} alt="" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
            {name?.[0]?.toUpperCase() ?? "C"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{name ?? "Client"}</p>
          <p className="text-xs text-gray-400">Particulier</p>
        </div>
      </div>
    </aside>
  )
}
