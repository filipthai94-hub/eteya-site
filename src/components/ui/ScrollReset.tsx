'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    // Läs scroll-target från sessionStorage (satt av Nav.tsx vid cross-page navigation)
    const target = sessionStorage.getItem('scrollTarget')

    if (target) {
      // Rensa direkt så det inte används igen vid nästa navigation
      sessionStorage.removeItem('scrollTarget')

      // Vänta på att sidan och Lenis renderat klart
      setTimeout(() => {
        const el = document.getElementById(target)
        const navH = (document.querySelector('.en-topbar') as HTMLElement | null)?.offsetHeight ?? 80
        if (el && window.__lenis) {
          window.__lenis.scrollTo(el, { offset: navH + 15, duration: 1.2 })
        } else if (el) {
          // Lenis inte redo — fallback
          const top = el.getBoundingClientRect().top + window.scrollY - navH
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }, 300)
    } else {
      // Ingen target — scrolla till toppen
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true, force: true })
      } else {
        window.scrollTo(0, 0)
      }
    }
  }, [pathname])

  return null
}
