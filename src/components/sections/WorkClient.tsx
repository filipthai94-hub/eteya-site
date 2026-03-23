'use client'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { C } from '@/lib/colors'

const WORK_IMAGES = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
]

function WorkRow({ item, index, image }: {
  item: { name: string; tags: string; description: string }
  index: number; image: string
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const handleEnter = () => {
    setHovered(true)
    gsap.to(imgRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
    gsap.to(rowRef.current!.querySelector('[data-name]'), { x: 12, duration: 0.3, ease: 'power2.out' })
  }
  const handleLeave = () => {
    setHovered(false)
    gsap.to(imgRef.current, { opacity: 0, scale: 0.97, duration: 0.3, ease: 'power2.in' })
    gsap.to(rowRef.current!.querySelector('[data-name]'), { x: 0, duration: 0.3, ease: 'power2.out' })
  }

  return (
    <div ref={rowRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        borderBottom: `1px solid rgba(255,255,255,0.07)`,
        padding: '2.5rem 0',
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
      }}>
      {/* Hover-bild */}
      <div ref={imgRef} style={{
        position: 'absolute',
        right: '8rem',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '280px',
        height: '180px',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0,
        scale: 0.97,
        zIndex: 10,
        pointerEvents: 'none',
        filter: 'grayscale(20%) brightness(0.85)',
      } as React.CSSProperties} />

      {/* Vänster: nummer + namn */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem', flex: 1, minWidth: 0 }}>
        <span style={{
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.1em',
          flexShrink: 0,
          fontFamily: 'var(--font-display)',
        }}>0{index + 1}</span>
        <span data-name style={{
          fontFamily: 'var(--font-display)',
          fontWeight: hovered ? 700 : 400,
          fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)',
          color: C.primary,
          textTransform: 'uppercase' as const,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          transition: 'font-weight 0.2s',
          whiteSpace: 'nowrap' as const,
        }}>{item.name}</span>
      </div>

      {/* Höger: tags + description */}
      <div style={{ textAlign: 'right', flexShrink: 0, maxWidth: '28rem' }}>
        <div style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          marginBottom: '0.4rem',
        }}>{item.tags}</div>
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          display: hovered ? 'block' : 'none',
          maxWidth: '22rem',
          marginLeft: 'auto',
        }}>{item.description}</p>
      </div>
    </div>
  )
}

export default function WorkClient({ labelJa, labelEn, heading, items }: {
  labelJa: string; labelEn: string; heading: string
  items: Array<{ name: string; tags: string; description: string }>
}) {
  return (
    <section id="work" style={{
      backgroundColor: C.bg,
      borderTop: `1px solid rgba(255,255,255,0.07)`,
      paddingTop: '6rem',
      paddingBottom: '4rem',
    }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '4rem',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '1rem',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                color: 'rgba(255,255,255,0.15)',
                letterSpacing: '0.05em',
              }}>{labelJa}</span>
              <span style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}>{labelEn}</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
              color: C.primary,
              textTransform: 'uppercase',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              margin: 0,
            }}>{heading}</h2>
          </div>
        </div>

        {/* Projekt-rader */}
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.07)` }}>
          {items.map((item, i) => (
            <WorkRow key={i} item={item} index={i} image={WORK_IMAGES[i]} />
          ))}
        </div>
      </div>
    </section>
  )
}
