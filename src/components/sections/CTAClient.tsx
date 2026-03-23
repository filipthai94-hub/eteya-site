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

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      // Parallax bg
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      // Content reveal
      gsap.fromTo(contentRef.current!.children,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: C.surface,
      paddingTop: '9rem',
      paddingBottom: '9rem',
    }}>
      <div ref={bgRef} className="will-change-transform" style={{
        position: 'absolute', inset: '-20%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1800&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.08,
      }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${C.surface} 40%, transparent 100%)` }} />

      <div ref={contentRef} style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ width: '3rem', height: '2px', backgroundColor: C.accent, marginBottom: '2.5rem' }} />
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4rem, 11vw, 10rem)',
          fontWeight: 800,
          color: C.primary,
          textTransform: 'uppercase',
          lineHeight: 0.88,
          letterSpacing: '-0.02em',
          marginBottom: '3rem',
        }}>
          {headline}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <p style={{ color: C.secondary, fontSize: '1.125rem', maxWidth: '34rem', lineHeight: 1.65 }}>
            {body}
          </p>
          <a href="#contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            backgroundColor: C.accent, color: C.bg,
            padding: '1.125rem 2.5rem', fontWeight: 700,
            textDecoration: 'none', fontSize: '0.8125rem',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            flexShrink: 0,
          }}>
            {button} <span style={{ fontSize: '1.1rem' }}>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
