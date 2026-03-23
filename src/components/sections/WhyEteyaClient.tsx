'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

export default function WhyEteyaClient({
  label, heading, items
}: {
  label: string
  heading: string
  items: Array<{ title: string; body: string }>
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !itemsRef.current) return
    const ctx = gsap.context(() => {
      const rows = itemsRef.current!.querySelectorAll('[data-item]')
      gsap.fromTo(rows,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: itemsRef.current, start: 'top 75%' },
        }
      )
      // Animate lines
      const lines = itemsRef.current!.querySelectorAll('[data-line]')
      gsap.fromTo(lines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.inOut',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: itemsRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ backgroundColor: C.surface, paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '6rem', alignItems: 'start' }}>
          <div>
            <p style={{ color: C.accent, fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {label}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              color: C.primary, textTransform: 'uppercase',
              lineHeight: 1,
            }}>
              {heading}
            </h2>
          </div>

          <div ref={itemsRef}>
            {items.map((item, i) => (
              <div key={i} data-item style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div data-line style={{ height: '1px', backgroundColor: C.border, marginBottom: '2rem' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                  <h3 style={{ color: C.primary, fontWeight: 500, fontSize: '1rem' }}>{item.title}</h3>
                  <p style={{ color: C.secondary, fontSize: '0.9375rem', lineHeight: 1.75 }}>{item.body}</p>
                </div>
              </div>
            ))}
            <div style={{ height: '1px', backgroundColor: C.border }} />
          </div>
        </div>
      </div>
    </section>
  )
}
