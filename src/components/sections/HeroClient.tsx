'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

export default function HeroClient({
  role, headline, subheadline, ctaPrimary, ctaSecondary, scrollLabel
}: {
  role: string; headline: string; subheadline: string
  ctaPrimary: string; ctaSecondary: string; scrollLabel: string
}) {
  const heroRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Bokstav-för-bokstav stagger animation
    const letters = nameRef.current?.querySelectorAll('[data-letter]')
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo(roleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 }
    )
    if (letters && letters.length > 0) {
      tl.fromTo(letters,
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.04 },
        '-=0.3'
      )
    }
    tl.fromTo(bottomRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )

    // Parallax på bakgrundsbild
    gsap.to(bgRef.current, {
      yPercent: 35,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, [])

  // Dela upp "ETEYA" i bokstäver för stagger
  const letters = headline.split('')

  return (
    <section ref={heroRef} style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: C.bg,
    }}>
      {/* Bakgrundsbild med parallax */}
      <div ref={bgRef} className="will-change-transform" style={{
        position: 'absolute', inset: '-20%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1800&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.18,
      }} />
      {/* Gradient — darknar mot botten */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom, transparent 40%, ${C.bg} 100%)`,
        zIndex: 1,
      }} />

      {/* Nav-höjd spacer */}
      <div style={{ height: '4.5rem', flexShrink: 0 }} />

      {/* Övre rad — role + location */}
      <div ref={roleRef} style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '3rem 2.5rem 0',
        flex: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Accentpunkt */}
          <span style={{
            display: 'inline-block',
            width: '8px', height: '8px',
            backgroundColor: C.accent,
            borderRadius: '50%',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: C.primary,
          }}>{role}</span>
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>Sweden · Est. 2025</span>
      </div>

      {/* Gigantiskt namn — blöder ut ur skärmen */}
      <div ref={nameRef} style={{
        position: 'relative', zIndex: 10,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '0 0 0 2rem',
        overflow: 'visible',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          // Stor nog att blöda ut — ca 20vw per bokstav för 5 bokstäver
          fontSize: 'clamp(5rem, 28vw, 30rem)',
          color: C.primary,
          textTransform: 'uppercase',
          lineHeight: 0.82,
          letterSpacing: '-0.04em',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          // Låt den blöda ut åt höger
          marginRight: '-2rem',
          display: 'flex',
        }}>
          {letters.map((letter, i) => (
            <span
              key={i}
              data-letter
              style={{ display: 'inline-block' }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Nedre rad — accent-linje + subheadline + knappar */}
      <div ref={bottomRef} style={{
        position: 'relative', zIndex: 10,
        padding: '2rem 2.5rem 3.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '2rem',
        borderTop: `1px solid rgba(255,255,255,0.08)`,
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
          maxWidth: '38rem',
          lineHeight: 1.7,
        }}>{subheadline}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <HoverBtn href="#work" accent>{ctaPrimary}</HoverBtn>
          <HoverBtn href="#contact">{ctaSecondary}</HoverBtn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', right: '2.5rem', bottom: '3rem', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
      }}>
        <div style={{
          width: '1px', height: '3.5rem',
          backgroundColor: C.accent,
          opacity: 0.6,
        }} />
        <span style={{
          color: C.accent,
          opacity: 0.6,
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          writingMode: 'vertical-rl',
        }}>{scrollLabel}</span>
      </div>
    </section>
  )
}

function HoverBtn({ href, children, accent }: {
  href: string; children: React.ReactNode; accent?: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <a ref={ref} href={href}
      onMouseEnter={() => gsap.to(ref.current, {
        backgroundColor: accent ? C.accent : C.primary,
        color: C.bg,
        borderColor: accent ? C.accent : C.primary,
        duration: 0.18,
      })}
      onMouseLeave={() => gsap.to(ref.current, {
        backgroundColor: 'transparent',
        color: accent ? C.accent : C.primary,
        borderColor: accent ? C.accent : 'rgba(255,255,255,0.25)',
        duration: 0.18,
      })}
      style={{
        display: 'inline-flex', alignItems: 'center',
        border: `1px solid ${accent ? C.accent : 'rgba(255,255,255,0.25)'}`,
        backgroundColor: 'transparent',
        color: accent ? C.accent : C.primary,
        padding: '0.875rem 2rem',
        fontWeight: 600,
        textDecoration: 'none',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
      }}>
      {children}
    </a>
  )
}
