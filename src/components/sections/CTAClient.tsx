'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

export default function CTAClient({ headline, body, button }: { headline: string; body: string; button: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [btnHover, setBtnHover] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 25, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.fromTo(contentRef.current!.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 90%', toggleActions: 'play none none none' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{
      position: 'relative', overflow: 'hidden',
      backgroundColor: C.surface, paddingTop: '9rem', paddingBottom: '9rem',
      borderTop: `1px solid ${C.border}`,
    }}>
      <div ref={bgRef} className="will-change-transform" style={{
        position: 'absolute', inset: '-20%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1800&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.04,
      }} />

      <div ref={contentRef} style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ width: '2.5rem', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: '3rem' }} />
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(4rem, 12vw, 11rem)',
          color: C.primary, textTransform: 'uppercase',
          lineHeight: 0.85, letterSpacing: '-0.03em', marginBottom: '4rem',
        }}>{headline}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', borderTop: `1px solid ${C.border}`, paddingTop: '2.5rem' }}>
          <p style={{ color: C.secondary, fontSize: '1rem', maxWidth: '34rem', lineHeight: 1.7, flex: 1 }}>
            {body}
          </p>
          <a href="#contact"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: btnHover ? '#d4ff1a' : C.accent,
              color: C.black,
              border: 'none',
              borderRadius: 0,
              height: '42px',
              padding: '0 1.375rem',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8125rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
              textDecoration: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: btnHover
                ? '0 2px 4px rgba(200,255,0,0.25), 0 4px 12px rgba(200,255,0,0.15)'
                : '0 1px 2px rgba(200,255,0,0.15), 0 2px 8px rgba(200,255,0,0.08)',
              transform: btnHover ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'all 0.15s',
            }}>
            {button}
          </a>
        </div>
      </div>
    </section>
  )
}
