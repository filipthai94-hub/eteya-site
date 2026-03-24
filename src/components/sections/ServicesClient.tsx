'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { C } from '@/lib/colors'

function ServiceRow({ item, isLast }: {
  item: { number: string; title: string; description: string; detail: string }
  isLast: boolean
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const titleBlackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    // Fill animation: vitt täcker in från vänster
    gsap.to(fillRef.current, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.55,
      ease: 'power3.inOut',
    })
    // Titel i svart version visas
    gsap.to(titleBlackRef.current, { opacity: 1, duration: 0.3, delay: 0.1 })
    // Content slides in
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, delay: 0.15 }
    )
  }

  const handleLeave = () => {
    gsap.to(fillRef.current, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 0.45,
      ease: 'power3.inOut',
    })
    gsap.to(titleBlackRef.current, { opacity: 0, duration: 0.2 })
    gsap.to(contentRef.current, { opacity: 0, duration: 0.2 })
  }

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        borderBottom: isLast ? 'none' : `1px solid rgba(255,255,255,0.08)`,
        height: '160px',
        cursor: 'default',
        overflow: 'hidden',
      }}>

      {/* Bakgrundslager — vit fill (clipPath animeras) */}
      <div ref={fillRef} style={{
        position: 'absolute', inset: 0,
        backgroundColor: C.accent,
        clipPath: 'inset(0 100% 0 0)',
        zIndex: 1,
      }} />

      {/* Vit version av raden (standard) */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', alignItems: 'center',
        padding: '0 2.5rem',
        gap: '3rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          color: 'rgba(255,255,255,0.15)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          flexShrink: 0, width: '2rem',
        }}>{item.number}</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(3rem, 6vw, 6rem)',
          color: C.primary,
          textTransform: 'uppercase' as const,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          flex: 1,
        }}>{item.title}</span>
        <div ref={contentRef} style={{
          opacity: 0, maxWidth: '32rem', textAlign: 'right',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            {item.description}
          </p>
        </div>
      </div>

      {/* Svart version av raden (hover — ovanpå vit fill) */}
      <div ref={titleBlackRef} style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', alignItems: 'center',
        padding: '0 2.5rem',
        gap: '3rem',
        opacity: 0,
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          color: 'rgba(0,0,0,0.25)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          flexShrink: 0, width: '2rem',
        }}>{item.number}</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(3rem, 6vw, 6rem)',
          color: C.bg,
          textTransform: 'uppercase' as const,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          flex: 1,
        }}>{item.title}</span>
        <div style={{ maxWidth: '32rem', textAlign: 'right' }}>
          <p style={{ color: 'rgba(0,0,0,0.65)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            {item.detail}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ServicesClient({ labelJa, labelEn, heading, items }: {
  labelJa: string; labelEn: string; heading: string
  items: Array<{ number: string; title: string; description: string; detail: string }>
}) {
  return (
    <section id="services" style={{
      backgroundColor: C.bg,
      borderTop: `1px solid rgba(255,255,255,0.07)`,
      paddingBottom: '2rem',
    }}>
      {/* Section header */}
      <div style={{
        maxWidth: '90rem', margin: '0 auto', padding: '5rem 2.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap', gap: '1.5rem',
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '1rem' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              color: 'rgba(255,255,255,0.15)',
              letterSpacing: '0.05em',
            }}>{labelJa}</span>
            <span style={{
              color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>{labelEn}</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
            color: C.primary, textTransform: 'uppercase',
            lineHeight: 1, letterSpacing: '-0.02em', margin: 0,
          }}>{heading}</h2>
        </div>
        <p style={{
          color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem',
          maxWidth: '28rem', lineHeight: 1.7,
        }}>
          Hover för att läsa mer om varje tjänst.
        </p>
      </div>

      {/* Service-rader */}
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 0' }}>
        {items.map((item, i) => (
          <ServiceRow key={item.number} item={item} isLast={i === items.length - 1} />
        ))}
      </div>
    </section>
  )
}
