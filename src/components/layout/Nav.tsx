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
  const btnRef = useRef<HTMLAnchorElement>(null)
  const isEn = pathname.startsWith('/en')
  const altHref = isEn ? pathname.replace(/^\/en/, '') || '/sv' : '/en' + pathname

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.4 }
    )
  }, [])

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: 'rgba(8,8,8,0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: '80rem', margin: '0 auto', padding: '0 2rem',
        height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{
          fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800,
          letterSpacing: '0.4em', color: C.primary, textDecoration: 'none',
          textTransform: 'uppercase',
        }}>
          ETEYA
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link href={altHref} style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem',
            letterSpacing: '0.2em', textDecoration: 'none', textTransform: 'uppercase',
          }}>{t('lang')}</Link>
          <a ref={btnRef} href="#contact"
            onMouseEnter={() => gsap.to(btnRef.current, { backgroundColor: C.primary, color: C.bg, duration: 0.2 })}
            onMouseLeave={() => gsap.to(btnRef.current, { backgroundColor: 'transparent', color: C.primary, duration: 0.2 })}
            style={{
              display: 'inline-flex', alignItems: 'center',
              border: `1px solid rgba(255,255,255,0.25)`,
              backgroundColor: 'transparent', color: C.primary,
              padding: '0.625rem 1.5rem', fontSize: '0.7rem',
              textDecoration: 'none', textTransform: 'uppercase',
              letterSpacing: '0.15em', fontWeight: 600,
            }}>{t('cta')}</a>
        </div>
      </div>
    </nav>
  )
}
