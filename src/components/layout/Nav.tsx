'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { C } from '@/lib/colors'

export default function Nav() {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const [onHero, setOnHero] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [btnHover, setBtnHover] = useState(false)

  const isEn = pathname.startsWith('/en')
  const locale = isEn ? 'en' : 'sv'
  const altHref = isEn ? pathname.replace(/^\/en/, '') || '/sv' : '/en' + pathname

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.85
      setOnHero(window.scrollY < threshold)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Colors based on scroll position
  const textColor = onHero ? C.black : C.primary
  const mutedColor = onHero ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'
  const hoverColor = onHero ? C.black : C.primary
  const mutedLocale = onHero ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)'

  // Button colors flip on hero
  const btnBg = onHero ? C.black : C.accent
  const btnColor = onHero ? C.accent : C.black
  const btnHoverBg = onHero ? '#2a2a2b' : '#d4ff1a'

  const ctaLabel = isEn ? 'Book a call' : 'Boka samtal'

  const navLinks = [
    { href: '#work', label: isEn ? 'Work' : 'Arbete' },
    { href: '#services', label: isEn ? 'Services' : 'Tjänster' },
    { href: '#contact', label: isEn ? 'Contact' : 'Kontakt' },
  ]

  return (
    <>
      <nav ref={navRef} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: onHero ? 'rgba(0,0,0,0)' : 'rgba(8,8,8,0.95)',
        backdropFilter: onHero ? 'none' : 'blur(20px)',
        WebkitBackdropFilter: onHero ? 'none' : 'blur(20px)',
        height: 80,
        padding: '0 40px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        transition: 'background-color 0.4s ease, backdrop-filter 0.4s ease',
      }}>
        {/* Column 1: Logo */}
        <div>
          <Link href={`/${locale}`} style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: textColor,
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}>
            ETEYA
          </Link>
        </div>

        {/* Column 2: Nav links (desktop only) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
        }} className="nav-desktop-links">
          {navLinks.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              mutedColor={mutedColor}
              hoverColor={hoverColor}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Column 3: CTA + locale toggle + hamburger */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '1.25rem',
        }}>
          {/* Locale toggle (desktop) */}
          <Link href={altHref} style={{
            color: mutedLocale,
            fontSize: '0.75rem',
            fontWeight: 500,
            textDecoration: 'none',
            letterSpacing: '0.05em',
            transition: 'color 0.3s ease',
          }} className="nav-desktop-only">
            {isEn ? 'SV' : 'EN'}
          </Link>

          {/* CTA button (desktop) */}
          <a
            href="#contact"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: btnHover ? btnHoverBg : btnBg,
              color: btnColor,
              border: 'none',
              borderRadius: 0,
              padding: '0 1.25rem',
              height: 40,
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '0.75rem',
              fontWeight: 500,
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: 'none',
              transform: btnHover ? 'translateY(-0.25rem)' : 'translateY(0)',
              transition: 'all 0.2s ease',
            }}
            className="nav-desktop-only"
          >
            {ctaLabel}
          </a>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMobileOpen(true)}
            className="nav-mobile-only"
            aria-label="Open menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            <span style={{ display: 'block', width: 24, height: 2, backgroundColor: textColor, transition: 'background-color 0.3s' }} />
            <span style={{ display: 'block', width: 24, height: 2, backgroundColor: textColor, transition: 'background-color 0.3s' }} />
            <span style={{ display: 'block', width: 24, height: 2, backgroundColor: textColor, transition: 'background-color 0.3s' }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          backgroundColor: 'rgba(8,8,8,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: 24,
            right: 40,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            color: C.primary,
            fontSize: '1.5rem',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Mobile nav links */}
        {navLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '1.25rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            {label}
          </a>
        ))}

        {/* Mobile CTA */}
        <a
          href="#contact"
          onClick={() => setMobileOpen(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: C.accent,
            color: C.black,
            border: 'none',
            borderRadius: 0,
            padding: '0 1.5rem',
            height: 44,
            fontFamily: 'var(--font-body), sans-serif',
            fontSize: '0.8rem',
            fontWeight: 500,
            textDecoration: 'none',
            marginTop: '0.5rem',
          }}
        >
          {ctaLabel}
        </a>

        {/* Mobile locale toggle */}
        <Link
          href={altHref}
          onClick={() => setMobileOpen(false)}
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.75rem',
            fontWeight: 500,
            textDecoration: 'none',
            letterSpacing: '0.05em',
            marginTop: '0.5rem',
          }}
        >
          {isEn ? 'SV' : 'EN'}
        </Link>
      </div>

      {/* Responsive CSS */}
      <style jsx global>{`
        .nav-desktop-links {
          display: flex !important;
        }
        .nav-desktop-only {
          display: inline-flex !important;
        }
        .nav-mobile-only {
          display: none !important;
        }
        @media (max-width: 768px) {
          .nav-desktop-links {
            display: none !important;
          }
          .nav-desktop-only {
            display: none !important;
          }
          .nav-mobile-only {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}

function NavLink({ href, children, mutedColor, hoverColor }: {
  href: string
  children: React.ReactNode
  mutedColor: string
  hoverColor: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-body), sans-serif',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: hovered ? hoverColor : mutedColor,
        textDecoration: 'none',
        transition: 'color 0.2s ease',
      }}
    >
      {children}
    </a>
  )
}
