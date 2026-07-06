"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, LogOut, HardHat } from "lucide-react"
import { nav } from "./CrmSidebar"

export default function CrmMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch("/api/crm/auth", { method: "DELETE" })
    router.push("/crm/login")
    router.refresh()
  }

  return (
    <div className="lg:hidden">
      <div className="sticky top-0 z-40 bg-[#0F2C5E] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#F97316] rounded-lg flex items-center justify-center shrink-0">
            <HardHat className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm font-montserrat">
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" className="text-white p-1.5">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-[#0F2C5E] flex flex-col">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold text-white text-sm font-montserrat">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {nav.map(({ label, href, icon: Icon }) => {
                const active = href === "/crm" ? pathname === "/crm" : pathname.startsWith(href)
                return (
                  <Link key={href} href={href} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-montserrat ${
                      active ? "bg-white/15 text-white" : "text-white"
                    }`}>
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                )
              })}
            </nav>
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
          </div>
        </div>
      )}
    </div>
  )
}
