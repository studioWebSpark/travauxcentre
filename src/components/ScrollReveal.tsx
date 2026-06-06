"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible")
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.05 }
    )

    // Petite frame pour laisser le DOM se stabiliser après la navigation
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll(".reveal, .reveal-children").forEach((el) => {
        // Éléments déjà dans le viewport → visibles immédiatement
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("visible")
        } else {
          observer.observe(el)
        }
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [pathname]) // Re-déclenche à chaque changement de page

  return null
}
