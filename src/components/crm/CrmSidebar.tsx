"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Kanban, LogOut, HardHat, MapPin, Calendar } from "lucide-react"
import type { getLevelInfo } from "@/lib/xp"

type XpInfo = ReturnType<typeof getLevelInfo>

const nav = [
  { label: "Dashboard",  href: "/crm",          icon: LayoutDashboard },
  { label: "Leads",      href: "/crm/leads",     icon: Users },
  { label: "Pipeline",   href: "/crm/pipeline",  icon: Kanban },
  { label: "Carte",      href: "/crm/carte",     icon: MapPin },
  { label: "Calendrier", href: "/crm/calendrier", icon: Calendar },
]

export default function CrmSidebar({ xp }: { xp: XpInfo }) {
  const pathname = usePathname()
  const router   = useRouter()

  async function logout() {
    await fetch("/api/crm/auth", { method: "DELETE" })
    router.push("/crm/login")
    router.refresh()
  }

  return (
    <aside className="w-56 shrink-0 bg-[#0F2C5E] min-h-screen flex-col hidden lg:flex">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center">
            <HardHat className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
        </div>
        <p className="text-slate-500 text-xs mt-1 ml-10">CRM</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = href === "/crm" ? pathname === "/crm" : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-white/15 text-white" : "text-slate-400 hover:bg-white/8 hover:text-white"
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* XP Block */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{xp.current.icon}</span>
            <span className="text-xs font-bold text-white">{xp.current.label}</span>
          </div>
          <span className="text-xs font-bold" style={{ color: xp.current.color }}>{xp.totalXp} XP</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${xp.progress}%`, background: xp.current.color }} />
        </div>
        {xp.next && (
          <p className="text-xs text-slate-600 mt-1 truncate">{xp.next.min - xp.totalXp} XP → {xp.next.label}</p>
        )}
      </div>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-white/10">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/8 hover:text-white transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 transition-colors mt-1">
          ← Retour au site
        </Link>
      </div>
    </aside>
  )
}
