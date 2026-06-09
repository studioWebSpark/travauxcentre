"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Kanban, LogOut, HardHat, MapPin, Calendar, Wrench, FileText, Radar, CalendarDays, BookOpen } from "lucide-react"
const nav = [
  { label: "Dashboard",  href: "/crm",           icon: LayoutDashboard },
  { label: "Leads",      href: "/crm/leads",      icon: Users },
  { label: "Chantiers",  href: "/crm/chantiers",  icon: Wrench },
  { label: "Devis",      href: "/crm/devis",      icon: FileText },
  { label: "Factures",   href: "/crm/factures",   icon: FileText },
  { label: "Planning",   href: "/crm/planning",    icon: CalendarDays },
  { label: "Calendrier", href: "/crm/calendrier",  icon: Calendar },
  { label: "Veille",     href: "/crm/veille",      icon: Radar },
  { label: "Carte",      href: "/crm/carte",      icon: MapPin },
  { label: "Guide",      href: "/crm/guide",      icon: BookOpen },
]

export default function CrmSidebar() {
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
          <span className="font-bold text-white text-sm font-montserrat">
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
        </div>
        <p className="text-[#555555] text-xs mt-1 ml-10 font-montserrat font-medium">CRM</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = href === "/crm" ? pathname === "/crm" : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-montserrat ${
                active ? "bg-white/15 text-white" : "text-white"
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-white/10">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white w-full font-medium">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white mt-1 font-medium">
          ← Retour au site
        </Link>
      </div>
    </aside>
  )
}
