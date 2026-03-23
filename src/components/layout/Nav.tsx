'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { C } from '@/lib/colors'

export default function Nav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const isEn = pathname.startsWith('/en')
  const altHref = isEn ? pathname.replace(/^\/en/, '') || '/sv' : '/en' + pathname

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    )
  }, [])

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: 'rgba(8,8,8,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: '80rem', margin: '0 auto', padding: '0 2rem',
        height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.625rem', fontWeight: 800,
          letterSpacing: '0.3em',
          color: C.primary, textDecoration: 'none',
          textTransform: 'uppercase',
        }}>
          ETEYA
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href={altHref} style={{
            color: C.secondary, fontSize: '0.75rem',
            letterSpacing: '0.15em', textDecoration: 'none',
            textTransform: 'uppercase',
          }}>
            {t('lang')}
          </Link>
          <a href="#contact" style={{
            display: 'inline-flex', alignItems: 'center',
            border: `1px solid ${C.accent}`, color: C.accent,
            padding: '0.625rem 1.5rem', fontSize: '0.75rem',
            textDecoration: 'none', textTransform: 'uppercase',
            letterSpacing: '0.12em', fontWeight: 600,
          }}>
            {t('cta')}
          </a>
        </div>
      </div>
    </nav>
  )
}
