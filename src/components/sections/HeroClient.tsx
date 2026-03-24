'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'
import HeroCanvas from '@/components/animations/HeroCanvas'
import Button from '@/components/ui/Button'

gsap.registerPlugin(ScrollTrigger)

export default function HeroClient({
  role, headline, subheadline, ctaPrimary, ctaSecondary,
}: {
  role: string; headline: string; subheadline: string
  ctaPrimary: string; ctaSecondary: string; scrollLabel: string
}) {
  const heroRef = useRef<HTMLElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const letters = nameRef.current?.querySelectorAll('[data-letter]')
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo(roleRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 }
    )
    if (letters && letters.length > 0) {
      tl.fromTo(letters,
        { y: 140, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.05 },
        '-=0.4'
      )
    }
    tl.fromTo(imgRef.current,
      { opacity: 0, scale: 1.03 },
      { opacity: 1, scale: 1, duration: 1.2 },
      '-=0.8'
    )
    tl.fromTo(bottomRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.6'
    )
  }, [])

  const letters = headline.split('')

  return (
    <section ref={heroRef} id="hero" style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: C.accent, // #C8FF00 lime
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      overflow: 'hidden',
    }}>
      {/* Svarta partiklar på lime */}
      <HeroCanvas />

      {/* Bild höger — svartvit, blöder in från höger */}
      <div ref={imgRef} style={{
        position: 'absolute',
        right: 0, top: 0, bottom: 0,
        width: '48%',
        zIndex: 1,
        backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(100%) brightness(0.7)',
        maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 35%, black 70%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 35%, black 70%)',
      }} />

      {/* Gradient lime → transparent på bildsidan */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `linear-gradient(to right, ${C.accent} 30%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* RAD 1 — Nav spacer + roll-text */}
      <div style={{ height: '4.5rem' }} /> {/* nav spacer */}

      {/* RAD 2 — Namn centrerat */}
      <div ref={nameRef} style={{
        position: 'relative', zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        padding: '0 0 0 2.5rem',
        overflow: 'visible',
      }}>
        {/* Roll-text — ovanför namnet */}
        <div>
          <div ref={roleRef} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            marginBottom: '1.5rem',
          }}>
            <span style={{
              display: 'inline-block',
              width: '6px', height: '6px',
              backgroundColor: C.black,
              borderRadius: '50%',
            }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: C.black,
            }}>{role}</span>
          </div>

          {/* GIGANTISKT NAMN */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(5rem, 12vw, 14rem)',
            color: C.black,
            textTransform: 'uppercase',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
            overflow: 'visible',
            display: 'flex',
          }}>
            {letters.map((letter, i) => (
              <span key={i} data-letter style={{ display: 'inline-block' }}>
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RAD 3 — Bottom bar */}
      <div ref={bottomRef} style={{
        position: 'relative', zIndex: 10,
        padding: '2rem 2.5rem 3.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '2rem',
        borderTop: `1px solid rgba(0,0,0,0.12)`,
      }}>
        <div>
          <p style={{
            color: 'rgba(0,0,0,0.5)',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}>Sweden · Est. 2025</p>
          <p style={{
            color: 'rgba(0,0,0,0.6)',
            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
            maxWidth: '36rem',
            lineHeight: 1.65,
          }}>{subheadline}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Primär knapp */}
          <Button variant="primary" href="#work" style={{
            background: '#121213',
            color: '#C8FF00',
            border: '1px solid #121213',
          }}>{ctaPrimary}</Button>
          {/* Sekundär — outline */}
          <Button variant="secondary" href="#contact" style={{
            color: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(0,0,0,0.2)',
          }}>{ctaSecondary}</Button>
        </div>
      </div>
    </section>
  )
}


