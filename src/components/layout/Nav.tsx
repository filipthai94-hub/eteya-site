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
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      // Transparent overlay — hero syns bakom
      backgroundColor: 'transparent',
    }}>
      <div style={{
        maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem',
        height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{
          fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800,
          letterSpacing: '0.4em', color: C.primary, textDecoration: 'none',
          textTransform: 'uppercase',
        }}>
          ETEYA
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href={altHref} style={{
            color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem',
            letterSpacing: '0.2em', textDecoration: 'none', textTransform: 'uppercase',
          }}>{t('lang')}</Link>
          <a ref={btnRef} href="#contact"
            onMouseEnter={() => gsap.to(btnRef.current, {
              backgroundColor: C.accent,
              color: C.bg,
              borderColor: C.accent,
              duration: 0.18,
            })}
            onMouseLeave={() => gsap.to(btnRef.current, {
              backgroundColor: 'transparent',
              color: C.primary,
              borderColor: 'rgba(255,255,255,0.25)',
              duration: 0.18,
            })}
            style={{
              display: 'inline-flex', alignItems: 'center',
              border: `1px solid rgba(255,255,255,0.25)`,
              backgroundColor: 'transparent', color: C.primary,
              padding: '0.625rem 1.5rem', fontSize: '0.65rem',
              textDecoration: 'none', textTransform: 'uppercase',
              letterSpacing: '0.15em', fontWeight: 600,
            }}>{t('cta')}</a>
        </div>
      </div>
    </nav>
  )
}
