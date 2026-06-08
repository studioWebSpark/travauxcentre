"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const nav = [
  { label: "Services",     href: "/services" },
  { label: "Réalisations", href: "/realisations" },
  { label: "À propos",     href: "/a-propos" },
  { label: "Contact",      href: "/contact" },
]

const navVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
}

const curve = [0.22, 1, 0.36, 1] as [number, number, number, number]

const navItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: curve } },
}

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: curve } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" as const } },
}

const mobileLinkContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: curve } },
}

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (
    pathname.startsWith("/crm") ||
    pathname.startsWith("/client") ||
    pathname.startsWith("/devis") ||
    pathname.startsWith("/planning")
  ) {
    return null
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[9999]"
      initial={false}
      animate={
        scrolled
          ? { backgroundColor: "rgba(15,44,94,0.95)" }
          : { backgroundColor: "rgba(15,44,94,0)" }
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ backdropFilter: scrolled ? "blur(10px)" : "blur(0px)", WebkitBackdropFilter: scrolled ? "blur(10px)" : "blur(0px)", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F2C5E] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
            </svg>
          </div>
          <span className="text-xl font-[800] text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Travaux<span className="text-[#F97316]">Centre</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <motion.nav
          className="hidden md:flex items-center gap-7"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          {nav.map((item) => (
            <motion.div key={item.href} variants={navItemVariants}>
              <Link
                href={item.href}
                className="text-sm font-[500] text-black hover:text-[#F97316] transition-colors duration-200"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
          <motion.div variants={navItemVariants}>
            <Link
              href="/devis"
              className="btn-shine inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-[600] text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
              style={{ background: "linear-gradient(135deg, #F97316 0%, #EA6B0E 100%)" }}
            >
              Devis gratuit
            </Link>
          </motion.div>
        </motion.nav>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-[#0F2C5E] border-t border-white/10 px-4 pb-5 pt-3"
          >
            <motion.div
              className="flex flex-col gap-1"
              variants={mobileLinkContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {nav.map((item) => (
                <motion.div key={item.href} variants={mobileLinkVariants}>
                  <Link
                    href={item.href}
                    className="block text-black font-[500] px-3 py-3 rounded-xl hover:bg-white/10 hover:text-[#F97316] transition-colors text-sm"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={mobileLinkVariants} className="pt-2 mt-1 border-t border-white/10">
                <Link
                  href="/devis"
                  className="btn-shine block w-full text-center rounded-full py-3 text-sm font-[600] text-white"
                  style={{ background: "linear-gradient(135deg, #F97316 0%, #EA6B0E 100%)" }}
                  onClick={() => setOpen(false)}
                >
                  Devis gratuit
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
