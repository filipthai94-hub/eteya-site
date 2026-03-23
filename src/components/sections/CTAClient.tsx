'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

export default function CTAClient({ headline, body, button }: { headline: string; body: string; button: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)

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
          <a ref={btnRef} href="#contact"
            onMouseEnter={() => gsap.to(btnRef.current, { backgroundColor: C.primary, color: C.bg, duration: 0.2 })}
            onMouseLeave={() => gsap.to(btnRef.current, { backgroundColor: 'transparent', color: C.primary, duration: 0.2 })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '1rem',
              border: `1px solid rgba(255,255,255,0.3)`,
              backgroundColor: 'transparent', color: C.primary,
              padding: '1.125rem 2.5rem', fontWeight: 600,
              textDecoration: 'none', fontSize: '0.8125rem',
              textTransform: 'uppercase', letterSpacing: '0.12em', flexShrink: 0,
            }}>
            {button} <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
