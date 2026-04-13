'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { AnimatedGridPattern } from '@/components/ui/AnimatedGridPattern'

export default function AboutHeroClient() {
  const heroRef = useRef<HTMLElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

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
    tl.fromTo(bottomRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.6'
    )
  }, [])

  const headline = 'OM OSS'
  const letters = headline.split('')
  // Optical kerning for O-M O-S-S
  const kerning: Record<number, string> = { 0: '-0.02em', 1: '0.02em', 3: '-0.02em' }

  return (
    <section ref={heroRef} style={{
      position: 'relative',
      height: '100vh',
      minHeight: '600px',
      backgroundColor: '#080808',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Layer 1: Radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(200,255,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Layer 2: Animated Grid */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <AnimatedGridPattern
          className="h-full w-full"
          style={{
            color: '#C8FF00',
            maskImage: 'radial-gradient(600px circle at center, white, transparent)',
            WebkitMaskImage: 'radial-gradient(600px circle at center, white, transparent)',
          }}
          width={40}
          height={40}
          numSquares={50}
          maxOpacity={0.15}
          duration={3}
          repeatDelay={1}
          strokeDasharray={4}
        />
      </div>

      {/* Layer 3: Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 2rem',
      }}>

        <div ref={nameRef}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(5rem, 12vw, 14rem)',
            color: '#f5f5f5',
            textTransform: 'uppercase',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
            display: 'flex',
            justifyContent: 'center',
          }}>
            {letters.map((letter, i) => (
              <span key={i} data-letter style={{ display: 'inline-block', opacity: 0, marginRight: kerning[i] || undefined }}>
                {letter}
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* Bottom subheadline */}
      <div ref={bottomRef} style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '2rem 2.5rem 3.5rem',
        display: 'flex',
        justifyContent: 'center',
        opacity: 0,
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'rgba(255, 255, 255, 0.6)',
          maxWidth: '36rem',
          lineHeight: 1.2,
          textAlign: 'center',
        }}>
          Vi gör AI praktiskt — inte teoretiskt
        </p>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 767px) {
          h1 { font-size: 22vw !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-letter] { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  )
}