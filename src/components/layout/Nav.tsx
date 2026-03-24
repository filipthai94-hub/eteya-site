'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { C } from '@/lib/colors'

const BLACK = '#121213'

export default function Nav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const isEn = pathname.startsWith('/en')
  const altHref = isEn ? pathname.replace(/^\/en/, '') || '/sv' : '/en' + pathname

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 }
    )

    const handleScroll = () => {
      // Hero är ~100vh
      const heroHeight = window.innerHeight
      setScrolled(window.scrollY > heroHeight * 0.85)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const textColor = scrolled ? C.primary : BLACK
  const mutedColor = scrolled ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)'

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid rgba(255,255,255,0.06)` : '1px solid transparent',
      transition: 'background-color 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease',
    }}>
      <div style={{
        maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem',
        height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a href="/" style={{
          fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800,
          letterSpacing: '0.4em', color: textColor, textDecoration: 'none',
          textTransform: 'uppercase',
          transition: 'color 0.4s ease',
        }}>
          ETEYA
        </a>

        {/* Mitten — nav-länkar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {[
            { href: '#work', label: 'Arbete' },
            { href: '#services', label: 'Tjänster' },
            { href: '#contact', label: 'Kontakt' },
          ].map(({ href, label }) => (
            <NavLink key={href} href={href} color={mutedColor} scrolled={scrolled}>{label}</NavLink>
          ))}
        </div>

        {/* Höger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href={altHref} style={{
            color: mutedColor, fontSize: '0.65rem',
            letterSpacing: '0.2em', textDecoration: 'none', textTransform: 'uppercase',
            transition: 'color 0.4s ease',
          }}>{t('lang')}</Link>

          <a ref={btnRef} href="#contact"
            onMouseEnter={() => gsap.to(btnRef.current, {
              backgroundColor: scrolled ? C.accent : BLACK,
              color: scrolled ? BLACK : C.accent,
              borderColor: scrolled ? C.accent : BLACK,
              duration: 0.18,
            })}
            onMouseLeave={() => gsap.to(btnRef.current, {
              backgroundColor: 'transparent',
              color: textColor,
              borderColor: scrolled ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)',
              duration: 0.18,
            })}
            style={{
              display: 'inline-flex', alignItems: 'center',
              border: `1px solid ${scrolled ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)'}`,
              backgroundColor: 'transparent',
              color: textColor,
              padding: '0.625rem 1.5rem', fontSize: '0.65rem',
              textDecoration: 'none', textTransform: 'uppercase',
              letterSpacing: '0.15em', fontWeight: 600,
              transition: 'color 0.4s ease, border-color 0.4s ease',
            }}>{t('cta')}</a>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children, color, scrolled }: {
  href: string; children: React.ReactNode; color: string; scrolled: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <a ref={ref} href={href}
      onMouseEnter={() => gsap.to(ref.current, { color: scrolled ? C.accent : BLACK, duration: 0.15 })}
      onMouseLeave={() => gsap.to(ref.current, { color, duration: 0.15 })}
      style={{
        color,
        fontSize: '0.7rem',
        letterSpacing: '0.12em',
        textDecoration: 'none',
        textTransform: 'uppercase',
        fontWeight: 500,
        transition: 'color 0.4s ease',
      }}>
      {children}
    </a>
  )
}
