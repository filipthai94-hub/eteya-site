'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

export default function WhyEteyaClient({ label, heading, items }: {
  label: string; heading: string; items: Array<{ title: string; body: string }>
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const rows = sectionRef.current!.querySelectorAll('[data-item]')
      gsap.fromTo(rows,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ backgroundColor: C.bg, paddingTop: '6rem', paddingBottom: '6rem', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '6rem', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '6rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              {label}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(2rem, 3vw, 3rem)',
              color: C.primary, textTransform: 'uppercase', lineHeight: 1,
            }}>{heading}</h2>
          </div>
          <div>
            {items.map((item, i) => (
              <div key={i} data-item style={{ borderTop: `1px solid ${C.border}`, padding: '2.25rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
                  <h3 style={{ color: C.primary, fontWeight: 500, fontSize: '0.9375rem', lineHeight: 1.4 }}>{item.title}</h3>
                  <p style={{ color: C.secondary, fontSize: '0.9375rem', lineHeight: 1.75 }}>{item.body}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
