'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

export default function HeroClient({ subheadline, ctaPrimary, ctaSecondary, scrollLabel }: {
  subheadline: string; ctaPrimary: string; ctaSecondary: string; scrollLabel: string
}) {
  const heroRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.fromTo(line1Ref.current, { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo(line2Ref.current, { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.7')
      .fromTo(bottomRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')

    gsap.to(bgRef.current, {
      yPercent: 35,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, [])

  return (
    <section ref={heroRef} style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      overflow: 'hidden', backgroundColor: C.bg,
    }}>
      <div ref={bgRef} className="will-change-transform" style={{
        position: 'absolute', inset: '-20%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1800&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to top, ${C.bg} 20%, rgba(8,8,8,0.3) 65%, transparent 100%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 10, padding: '0 2rem 5rem' }}>
        <div ref={line1Ref}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(5rem, 18vw, 16rem)',
            color: C.primary, textTransform: 'uppercase',
            lineHeight: 0.85, letterSpacing: '-0.03em',
          }}>AI SOM</div>
        </div>
        <div ref={line2Ref} style={{ marginBottom: '4rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(5rem, 18vw, 16rem)',
            color: 'transparent',
            WebkitTextStroke: `2px ${C.primary}`,
            textTransform: 'uppercase',
            lineHeight: 0.85, letterSpacing: '-0.03em',
          }}>DRIVER DIG.</div>
        </div>

        <div ref={bottomRef} style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem',
          borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: '2rem',
        }}>
          <p style={{ color: C.secondary, fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.7 }}>
            {subheadline}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <HoverBtn href="#services" filled>{ctaPrimary}</HoverBtn>
            <HoverBtn href="#contact">{ctaSecondary}</HoverBtn>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '2.5rem', right: '2.5rem', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
      }}>
        <div style={{ width: '1px', height: '4rem', backgroundColor: 'rgba(255,255,255,0.3)' }} />
        <span style={{ color: C.secondary, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>
          {scrollLabel}
        </span>
      </div>
    </section>
  )
}

function HoverBtn({ href, children, filled }: { href: string; children: React.ReactNode; filled?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <a ref={ref} href={href}
      onMouseEnter={() => gsap.to(ref.current, { backgroundColor: filled ? 'transparent' : C.primary, color: filled ? C.primary : C.bg, duration: 0.2 })}
      onMouseLeave={() => gsap.to(ref.current, { backgroundColor: filled ? C.primary : 'transparent', color: filled ? C.bg : C.primary, duration: 0.2 })}
      style={{
        display: 'inline-flex', alignItems: 'center',
        border: `1px solid ${C.primary}`,
        backgroundColor: filled ? C.primary : 'transparent',
        color: filled ? C.bg : C.primary,
        padding: '0.875rem 2rem', fontWeight: 600,
        textDecoration: 'none', fontSize: '0.8125rem',
        textTransform: 'uppercase', letterSpacing: '0.12em',
        transition: 'none',
      }}>
      {children}
    </a>
  )
}
