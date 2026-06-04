"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, HardHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Services",     href: "/services" },
  { label: "Zones",        href: "/zones-intervention" },
  { label: "Réalisations", href: "/realisations" },
  { label: "À propos",     href: "/a-propos" },
  { label: "Contact",      href: "/contact" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
            scrolled ? "bg-[#0F2C5E]" : "bg-white/15"
          )}>
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <span
            className={cn(
              "text-xl font-bold transition-colors",
              scrolled ? "text-[#0F2C5E]" : "text-white"
            )}
          >
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#F97316]",
                scrolled ? "text-gray-600" : "text-white/85"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="primary" size="sm" className="px-5">
            <Link href="/devis">Devis Gratuit</Link>
          </Button>
        </nav>

        {/* Mobile burger */}
        <button
          className={cn(
            "md:hidden p-2 rounded-lg transition-colors",
            scrolled ? "text-[#0F2C5E] hover:bg-gray-100" : "text-white hover:bg-white/10"
          )}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-5 flex flex-col gap-1 shadow-lg">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 font-medium px-3 py-2.5 rounded-lg hover:bg-[#F8F7F4] hover:text-[#F97316] transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 mt-1 border-t border-gray-100">
            <Button asChild variant="primary" className="w-full">
              <Link href="/devis" onClick={() => setOpen(false)}>
                Devis Gratuit
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
