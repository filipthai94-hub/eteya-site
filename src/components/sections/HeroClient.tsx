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
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.fromTo(roleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo(nameRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.5')
      .fromTo(bottomRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')

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
  }, [])

  return (
    <section ref={heroRef} style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      backgroundColor: C.bg,
      paddingTop: '4.5rem', // nav height
    }}>
      {/* Bakgrundsbild */}
      <div ref={bgRef} className="will-change-transform" style={{
        position: 'absolute', inset: '-20%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1800&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.07,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom, transparent 50%, ${C.bg} 100%)`,
      }} />

      {/* Övre del — role + location */}
      <div ref={roleRef} style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '3rem 2.5rem 0',
        maxWidth: '90rem', margin: '0 auto', width: '100%',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(0.875rem, 1.5vw, 1.1rem)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.5)',
        }}>{role}</span>
        <span style={{
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>Sweden · Est. 2025</span>
      </div>

      {/* Gigantiskt namn */}
      <div ref={nameRef} style={{
        position: 'relative', zIndex: 10,
        padding: '0 1.5rem',
        maxWidth: '90rem', margin: '0 auto', width: '100%',
        overflow: 'hidden',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(5rem, 19vw, 18rem)',
          color: C.primary,
          textTransform: 'uppercase',
          lineHeight: 0.82,
          letterSpacing: '-0.04em',
          userSelect: 'none',
        }}>
          {headline}
        </div>
      </div>

      {/* Nedre del — subheadline + knappar */}
      <div ref={bottomRef} style={{
        position: 'relative', zIndex: 10,
        padding: '2rem 2.5rem 3.5rem',
        maxWidth: '90rem', margin: '0 auto', width: '100%',
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
          <OutlineBtn href="#work" filled>{ctaPrimary}</OutlineBtn>
          <OutlineBtn href="#contact">{ctaSecondary}</OutlineBtn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', right: '2.5rem', bottom: '3rem', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
      }}>
        <div style={{ width: '1px', height: '3.5rem', backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <span style={{
          color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem',
          letterSpacing: '0.3em', textTransform: 'uppercase',
          writingMode: 'vertical-rl',
        }}>{scrollLabel}</span>
      </div>
    </section>
  )
}

function OutlineBtn({ href, children, filled }: { href: string; children: React.ReactNode; filled?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <a ref={ref} href={href}
      onMouseEnter={() => gsap.to(ref.current, {
        backgroundColor: C.primary,
        color: C.bg,
        duration: 0.18,
      })}
      onMouseLeave={() => gsap.to(ref.current, {
        backgroundColor: filled ? C.primary : 'transparent',
        color: filled ? C.bg : C.primary,
        duration: 0.18,
      })}
      style={{
        display: 'inline-flex', alignItems: 'center',
        border: `1px solid ${filled ? C.primary : 'rgba(255,255,255,0.25)'}`,
        backgroundColor: filled ? C.primary : 'transparent',
        color: filled ? C.bg : C.primary,
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
