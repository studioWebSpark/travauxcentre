"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const nav = [
  { label: "Services",      href: "/services" },
  { label: "Réalisations",  href: "/realisations" },
  { label: "À propos",      href: "/a-propos" },
  { label: "Contact",       href: "/contact" },
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={`text-2xl font-bold transition-colors ${
              scrolled ? "text-[#0F2C5E]" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-playfair), serif" }}
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
              className={`text-sm font-medium transition-colors hover:text-[#F97316] ${
                scrolled ? "text-[#0F2C5E]" : "text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/devis"
            className="bg-[#F97316] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
          >
            Devis Gratuit
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          className={`md:hidden p-2 ${scrolled ? "text-[#0F2C5E]" : "text-white"}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-lg">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#0F2C5E] font-medium hover:text-[#F97316] transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/devis"
            className="bg-[#F97316] text-white font-semibold px-5 py-2.5 rounded-lg text-center hover:bg-orange-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            Devis Gratuit
          </Link>
        </div>
      )}
    </header>
  )
}
