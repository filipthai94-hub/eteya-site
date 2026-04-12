'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

type Stat = {
  value: string
  label: string
  icon?: string
}

export default function StatsSection({ stats }: {
  stats: Stat[]
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean)

      // Initial state
      gsap.set(cards, {
        opacity: 0,
        y: 30
      })

      // Scroll trigger animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out'
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ backgroundColor: '#0a0a0a', paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1.5rem',
                padding: '2.5rem 2rem',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderColor: C.accent,
                  duration: 0.4,
                  ease: 'power2.out'
                })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  duration: 0.4,
                  ease: 'power2.out'
                })
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${C.accent}08 0%, transparent 100%)`, pointerEvents: 'none' }} />
              {/* Optional icon */}
              {stat.icon && (
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '1rem',
                }}>
                  {stat.icon}
                </div>
              )}
              {/* Stat value - large, accent color */}
              <div style={{
                color: C.accent,
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
                marginBottom: '0.75rem',
              }}>
                {stat.value}
              </div>
              {/* Stat label */}
              <p style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
