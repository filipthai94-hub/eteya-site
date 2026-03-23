'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

function CountUp({ value, suffix, triggered }: { value: number; suffix: string; triggered: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!triggered) return
    const obj = { val: 0 }
    gsap.to(obj, { val: value, duration: 2.2, ease: 'power2.out', onUpdate: () => setCount(Math.round(obj.val)) })
  }, [triggered, value])
  return <>{count}{suffix}</>
}

export default function StatsClient({ heading, items }: {
  heading: string; items: Array<{ value: number; suffix: string; label: string }>
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current, start: 'top 70%',
        onEnter: () => setTriggered(true),
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ backgroundColor: C.bg, paddingTop: '7rem', paddingBottom: '7rem', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '5rem', textAlign: 'center' }}>
          {heading}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              padding: '3rem 2rem', textAlign: 'center',
              borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(4.5rem, 9vw, 8rem)',
                color: C.primary, lineHeight: 1, marginBottom: '1rem',
              }}>
                <CountUp value={item.value} suffix={item.suffix} triggered={triggered} />
              </div>
              <p style={{ color: C.secondary, fontSize: '0.8125rem', letterSpacing: '0.05em', lineHeight: 1.5 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
