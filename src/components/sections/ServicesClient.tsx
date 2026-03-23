'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

const IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80',
  'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=900&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80',
]

function ServiceRow({ item, index, image }: {
  item: { number: string; title: string; description: string }
  index: number; image: string
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imgContainerRef = useRef<HTMLDivElement>(null)
  const reversed = index % 2 === 1

  useEffect(() => {
    if (!rowRef.current) return
    const ctx = gsap.context(() => {
      gsap.set([textRef.current, imgContainerRef.current], { opacity: 1 })

      gsap.fromTo(textRef.current,
        { opacity: 0, x: reversed ? 40 : -40 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 80%' } }
      )
      gsap.fromTo(imgContainerRef.current,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 85%' } }
      )
    }, rowRef)
    return () => ctx.revert()
  }, [reversed])

  return (
    <div ref={rowRef} style={{
      borderBottom: `1px solid ${C.border}`,
      display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px',
    }}>
      <div ref={textRef} style={{
        padding: '4rem 3.5rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        order: reversed ? 1 : 0,
        backgroundColor: C.bg,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 800,
          color: 'transparent', WebkitTextStroke: `1px ${C.border}`,
          lineHeight: 1, display: 'block',
        }}>{item.number}</span>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
            color: C.primary, textTransform: 'uppercase',
            lineHeight: 0.95, marginBottom: '1.5rem',
          }}>{item.title}</h3>
          <p style={{ color: C.secondary, lineHeight: 1.75, fontSize: '0.9375rem', maxWidth: '28rem' }}>
            {item.description}
          </p>
        </div>
      </div>

      <div ref={imgContainerRef} style={{
        position: 'relative', overflow: 'hidden',
        order: reversed ? 0 : 1, minHeight: '320px',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'grayscale(60%) brightness(0.5)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: reversed
            ? `linear-gradient(to left, transparent 40%, ${C.bg} 95%)`
            : `linear-gradient(to right, transparent 40%, ${C.bg} 95%)`,
        }} />
      </div>
    </div>
  )
}

export default function ServicesClient({ label, heading, items }: {
  label: string; heading: string
  items: Array<{ number: string; title: string; description: string }>
}) {
  return (
    <section id="services" style={{ backgroundColor: C.bg }}>
      <div style={{
        maxWidth: '80rem', margin: '0 auto', padding: '6rem 2rem 3rem',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap', gap: '1rem',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          {label}
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: C.primary, textTransform: 'uppercase', lineHeight: 1, margin: 0,
        }}>{heading}</h2>
      </div>
      {items.map((item, i) => (
        <ServiceRow key={item.number} item={item} index={i} image={IMAGES[i]} />
      ))}
    </section>
  )
}
