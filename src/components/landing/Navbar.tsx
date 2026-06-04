'use client'

import { useState } from "react"
import Link from "next/link"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold text-blue-600">Travaux</span>
          <span className="text-xl font-bold text-gray-900">Centre</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#comment-ca-marche" className="hover:text-gray-900 transition-colors">Comment ça marche</a>
          <a href="#categories"         className="hover:text-gray-900 transition-colors">Catégories</a>
          <a href="#avantages"          className="hover:text-gray-900 transition-colors">Avantages</a>
        </nav>

        {/* CTAs desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/signin"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Se connecter
          </Link>
          <Link href="/auth/signup"
            className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors">
            Commencer gratuitement
          </Link>
        </div>

        {/* Burger mobile */}
        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50" onClick={() => setOpen(!open)}>
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <a href="#comment-ca-marche" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Comment ça marche</a>
          <a href="#categories"         onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Catégories</a>
          <a href="#avantages"          onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Avantages</a>
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link href="/auth/signin"  className="text-center text-sm font-medium text-gray-700 border border-gray-200 py-2.5 rounded-xl">Se connecter</Link>
            <Link href="/auth/signup"  className="text-center text-sm font-semibold bg-blue-600 text-white py-2.5 rounded-xl">Commencer gratuitement</Link>
          </div>
        </div>
      )}
    </header>
  )
}
