'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80',
  'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=900&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80',
]

function ServiceRow({ item, index, image }: {
  item: { number: string; title: string; description: string }
  index: number
  image: string
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const reversed = index % 2 === 1

  useEffect(() => {
    if (!rowRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(numRef.current,
        { opacity: 0, y: 50 },
        { opacity: 0.12, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 75%' } }
      )
      gsap.fromTo(textRef.current,
        { opacity: 0, x: reversed ? 60 : -60 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 75%' } }
      )
      gsap.fromTo(imgRef.current,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: rowRef.current, start: 'top 90%' } }
      )
    }, rowRef)
    return () => ctx.revert()
  }, [reversed])

  return (
    <div ref={rowRef} style={{
      borderBottom: `1px solid ${C.border}`,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '500px',
    }}>
      {/* Text */}
      <div ref={textRef} style={{
        padding: '4rem 3.5rem',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        order: reversed ? 1 : 0,
        backgroundColor: index % 2 === 1 ? C.surface : C.bg,
      }}>
        <span ref={numRef} style={{
          fontFamily: 'var(--font-display)',
          fontSize: '8rem', fontWeight: 800,
          color: C.primary, lineHeight: 1,
          opacity: 0.12, display: 'block',
        }}>
          {item.number}
        </span>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 4vw, 4rem)',
            color: C.primary, textTransform: 'uppercase',
            fontWeight: 700, lineHeight: 0.95,
            marginBottom: '1.5rem',
          }}>
            {item.title}
          </h3>
          <p style={{ color: C.secondary, lineHeight: 1.75, fontSize: '1rem', maxWidth: '30rem' }}>
            {item.description}
          </p>
        </div>
      </div>

      {/* Image */}
      <div ref={imgRef} style={{
        position: 'relative', overflow: 'hidden',
        order: reversed ? 0 : 1,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'grayscale(30%) brightness(0.55)',
          transition: 'transform 0.6s ease',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: reversed
            ? `linear-gradient(to left, transparent 50%, ${C.surface} 100%)`
            : `linear-gradient(to right, transparent 50%, ${C.bg} 100%)`,
        }} />
      </div>
    </div>
  )
}

export default function ServicesClient({
  label, heading, items
}: {
  label: string
  heading: string
  items: Array<{ number: string; title: string; description: string }>
}) {
  return (
    <section id="services" style={{ backgroundColor: C.bg }}>
      {/* Header */}
      <div style={{
        maxWidth: '80rem', margin: '0 auto',
        padding: '6rem 2rem 3rem',
        display: 'flex', alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${C.border}`,
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <p style={{ color: C.accent, fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          {label}
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: C.primary, textTransform: 'uppercase',
          fontWeight: 700, lineHeight: 1, margin: 0,
        }}>
          {heading}
        </h2>
      </div>

      {items.map((item, i) => (
        <ServiceRow key={item.number} item={item} index={i} image={SERVICE_IMAGES[i]} />
      ))}
    </section>
  )
}
