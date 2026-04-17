'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import ButtonSwap from '@/components/ui/ButtonSwap'

interface MethodologyHeroClientProps {
  title: string
  subtitle: string
}

export default function MethodologyHeroClient({ title, subtitle }: MethodologyHeroClientProps) {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const letters = titleRef.current?.querySelectorAll('[data-letter]')
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo(titleRef.current,
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
    tl.fromTo(subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.6'
    )
  }, [])

  const letters = title.split('')
  // Optical kerning for AI-BESPARING
  const kerning: Record<number, string> = { 
    0: '-0.02em',  // A
    1: '0.02em',   // I
    3: '-0.02em',  // B
    10: '-0.02em', // N
    11: '0.02em',  // G
  }

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
      {/* Layer 1: Radial glow (EXAKT SOM AboutHeroClient) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Layer 2: Additional mesh gradients */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% 0%, 
            rgba(255, 255, 255, 0.08) 0%, 
            transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 50%, 
            rgba(255, 255, 255, 0.05) 0%, 
            transparent 50%),
          radial-gradient(ellipse 50% 35% at 20% 70%, 
            rgba(255, 255, 255, 0.06) 0%, 
            transparent 45%)
        `,
        backgroundSize: '120% 120%, 110% 110%, 105% 105%',
        backgroundPosition: '0% 0%, 0% 0%, 0% 0%',
        animation: 'meshFloat 30s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

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
        <div ref={titleRef}>
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

      {/* Subtitle + Savings + CTA - NO BOX */}
      <div ref={subtitleRef} style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '2rem 2.5rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        opacity: 0,
      }}>
        {/* Divider */}
        <div style={{
          width: '80px',
          height: '1px',
          background: 'rgba(255, 255, 255, 0.08)',
          margin: '24px auto 32px',
        }} />
        
        {/* Savings Number */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          color: '#f5f5f5',
          letterSpacing: '-0.02em',
          marginBottom: '12px',
          lineHeight: 1,
        }}>
          {subtitle}
        </div>
        
        {/* Source Text */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.4)',
          maxWidth: '480px',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}>
          Baserat på 56 verifierade automationer inom e-handel (&lt;10 anställda)
        </p>
        
        {/* CTA Button */}
        <ButtonSwap
          label="Beräkna din besparing"
          variant="white"
          arrow
          href="/#roi-calculator"
          size="lg"
        />
      </div>

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes meshFloat {
          0%, 100% {
            background-position: 0% 0%, 0% 0%, 0% 0%;
          }
          50% {
            background-position: 2% 1%, -1% 2%, 1% -1%;
          }
        }

        @media (max-width: 767px) {
          h1 { font-size: 22vw !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-letter] { opacity: 1 !important; transform: none !important; }
          div[style*="meshFloat"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
