'use client'
import { useEffect } from 'react'

export default function ScrollOnLoad() {
  useEffect(() => {
    // Scrolla till hash om det finns i URL
    const hash = window.location.hash.slice(1)
    if (hash === 'roi-calculator') {
      setTimeout(() => {
        const el = document.getElementById('roi-calculator')
        const navH = (document.querySelector('.en-topbar') as HTMLElement | null)?.offsetHeight ?? 80
        if (el && window.__lenis) {
          window.__lenis.scrollTo(el, { offset: navH + 15, duration: 1.2 })
        }
      }, 100)
    }
  }, [])
  
  return null
}
