'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitle from '@/components/ui/SectionTitle'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

type StoryPoint = {
  title: string
  text: string
}

export default function OurStoryClient({
  quote,
  points,
}: {
  quote: string
  points: StoryPoint[]
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const el = sectionRef.current!.querySelector('[data-story]')
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#080808',  // Korrekt huvudbakgrund
        paddingTop: '6rem',
        paddingBottom: '6rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* No background gradient - pure #0a0a0a */}

      <div
        style={{
          width: '100%',
          maxWidth: '1640px',
          margin: '0 auto',
          paddingInline: '62px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div data-story>
          {/* Quote - this is the main heading */}
          <p
            style={{
              margin: '0 0 4rem',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: C.primary,
              lineHeight: 1.1,
            }}
          >
            {quote}
          </p>

          {/* Points as Grid with Gradient Borders (Evervault style) */}
          <div
            style={{
              marginTop: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05), rgba(255,255,255,0.1))',
              borderRadius: '8px',
              padding: '1px',
            }}
          >
            {points.map((point, i) => (
              <div
                key={i}
                style={{
                  background: C.bg,
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: C.primary,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {point.title}
                </h3>
                <p
                  style={{
                    color: C.primary,
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    margin: 0,
                    opacity: 0.8,
                  }}
                >
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style>{`
        @media (max-width: 767px) {
          section[ref] {
            padding-top: 4rem !important;
            padding-bottom: 4rem !important;
          }
          section[ref] > div {
            padding-inline: 24px !important;
          }
          section[ref] h2,
          section[ref] p:first-of-type {
            font-size: 1.5rem !important;
          }
          section[ref] h3 {
            font-size: 1.125rem !important;
          }
          section[ref] p:last-of-type {
            font-size: 0.9375rem !important;
          }
          section[ref] [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          section[ref] [style*="padding: '2.5rem"] {
            padding: 1.5rem 1.25rem !important;
          }
        }
      `}</style>
    </section>
  )
}
