'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

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
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    )
    if (letters && letters.length > 0) {
      tl.fromTo(letters,
        { y: 60, opacity: 0 },
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
      height: '100vh',
      minHeight: '600px',
      backgroundColor: C.accent,
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      overflow: 'hidden',
    }}>
      {/* Hero video — desktop: täcker höger 55%, mobil: täcker hela */}
      <div ref={imgRef} style={{
        position: 'absolute',
        top: 0, bottom: 0,
        // Desktop: höger 55%
        right: 0,
        width: '55%',
        zIndex: 1,
        overflow: 'hidden',
        opacity: 0,
      }}
        className="hero-video-wrap"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Gradient — endast desktop */}
        <div className="hero-gradient" style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to right, ${C.accent} 0%, rgba(200,255,0,0.85) 15%, rgba(200,255,0,0.4) 40%, rgba(200,255,0,0) 70%)`,
          pointerEvents: 'none',
        }} />
      </div>
      <style>{`
        @media (max-width: 767px) {
          .hero-video-wrap {
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
          }
          .hero-gradient {
            display: none !important;
          }
          .hero-name-wrap {
            align-items: center !important;
            justify-content: center !important;
            padding: 0 1.5rem !important;
          }
          .hero-name-wrap > div {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          .hero-eteya {
            font-size: 28vw !important;
            justify-content: center !important;
          }
          .hero-role span {
            font-size: 0.65rem !important;
            letter-spacing: 0.12em !important;
          }
          .hero-subheadline {
            text-align: center !important;
            font-size: 0.95rem !important;
          }
        }
      `}</style>

      {/* RAD 1 — Nav spacer */}
      <div style={{ height: '4.5rem' }} />

      {/* RAD 2 — Namn vertikalt centrerat desktop, top-aligned mobil */}
      <div ref={nameRef} className="hero-name-wrap" style={{
        position: 'relative', zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        padding: '0 0 0 2.5rem',
        overflow: 'visible',
      }}>
        <div>
          {/* Fix 2: role-text mindre och diskret */}
          <div ref={roleRef} className="hero-role" style={{
            marginBottom: '0.75rem',
            opacity: 0,
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'rgba(0,0,0,0.55)',
            }}>{role}</span>
          </div>

          {/* GIGANTISKT NAMN */}
          <div className="hero-eteya" style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(5rem, 12vw, 14rem)',
            color: C.black,
            textTransform: 'uppercase',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
            display: 'flex',
          }}>
            {letters.map((letter, i) => (
              <span key={i} data-letter style={{ display: 'inline-block', opacity: 0 }}>
                {letter}
              </span>
            ))}
          </div>

          {/* Subheadline */}
          <div ref={bottomRef} style={{ marginTop: '1.5rem', opacity: 0 }}>
            <p className="hero-subheadline" style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'rgba(0,0,0,0.75)',
              maxWidth: '36rem',
              lineHeight: 1.2,
            }}>{subheadline}</p>
          </div>
        </div>
      </div>

      {/* RAD 3 — spacer */}
      <div />
    </section>
  )
}
