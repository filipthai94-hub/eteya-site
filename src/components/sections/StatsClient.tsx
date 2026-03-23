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
    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => setCount(Math.round(obj.val)),
    })
  }, [triggered, value])
  return <>{count}{suffix}</>
}

export default function StatsClient({ heading, items }: {
  heading: string
  items: Array<{ value: number; suffix: string; label: string }>
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => setTriggered(true),
      })
      gsap.fromTo('[data-stat]',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{
      backgroundColor: C.bg,
      paddingTop: '7rem', paddingBottom: '7rem',
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: C.secondary,
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.1em',
          marginBottom: '5rem',
          textAlign: 'center',
        }}>
          {heading}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', backgroundColor: C.border }}>
          {items.map((item, i) => (
            <div key={i} data-stat style={{
              backgroundColor: C.bg,
              padding: '3rem 2.5rem',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4rem, 8vw, 7rem)',
                fontWeight: 800,
                color: C.primary,
                lineHeight: 1,
                marginBottom: '0.75rem',
              }}>
                <CountUp value={item.value} suffix={item.suffix} triggered={triggered} />
              </div>
              <p style={{ color: C.secondary, fontSize: '0.875rem', lineHeight: 1.5 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
