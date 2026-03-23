'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { C } from '@/lib/colors'

export default function HeroClient({
  subheadline, ctaPrimary, ctaSecondary, scrollLabel
}: {
  subheadline: string
  ctaPrimary: string
  ctaSecondary: string
  scrollLabel: string
}) {
  const heroRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Staggered text entrance
    tl.fromTo(line1Ref.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 })
      .fromTo(line2Ref.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.6')
      .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')

    // Parallax on scroll
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }
  }, [])

  return (
    <section ref={heroRef} style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      backgroundColor: C.bg,
    }}>
      {/* Parallax BG */}
      <div ref={bgRef} className="will-change-transform" style={{
        position: 'absolute',
        inset: '-20%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1800&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.2,
      }} />
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to top, ${C.bg} 25%, rgba(8,8,8,0.4) 70%, transparent 100%)`,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 2rem 5rem' }}>
        {/* Headline line 1 */}
        <div ref={line1Ref} style={{ overflow: 'hidden' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(5rem, 17vw, 15rem)',
            color: C.primary,
            textTransform: 'uppercase',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            fontWeight: 800,
          }}>
            AI SOM
          </div>
        </div>
        {/* Headline line 2 */}
        <div ref={line2Ref} style={{ overflow: 'hidden', marginBottom: '3rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(5rem, 17vw, 15rem)',
            textTransform: 'uppercase',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            fontWeight: 800,
          }}>
            <span style={{ color: C.accent }}>DRIVER</span>
            <span style={{ color: C.primary }}> DIG.</span>
          </div>
        </div>

        {/* Bottom row */}
        <div ref={ctaRef} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <p ref={subRef} style={{
            color: C.secondary,
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            maxWidth: '38rem',
            lineHeight: 1.6,
          }}>
            {subheadline}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexShrink: 0, alignItems: 'center' }}>
            <a href="#services" style={{
              display: 'inline-flex', alignItems: 'center',
              backgroundColor: C.accent, color: C.bg,
              padding: '1rem 2rem', fontWeight: 700,
              textDecoration: 'none', fontSize: '0.8125rem',
              textTransform: 'uppercase', letterSpacing: '0.12em',
            }}>
              {ctaPrimary}
            </a>
            <a href="#contact" style={{
              display: 'inline-flex', alignItems: 'center',
              border: `1px solid rgba(255,255,255,0.2)`, color: C.primary,
              padding: '1rem 2rem', fontWeight: 500,
              textDecoration: 'none', fontSize: '0.8125rem',
              textTransform: 'uppercase', letterSpacing: '0.12em',
            }}>
              {ctaSecondary}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2rem', right: '2.5rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        zIndex: 10,
      }}>
        <span style={{
          color: C.secondary, fontSize: '0.625rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          writingMode: 'vertical-rl',
        }}>
          {scrollLabel}
        </span>
        <div style={{ width: '1px', height: '3rem', backgroundColor: C.accent, opacity: 0.5 }} />
      </div>
    </section>
  )
}
