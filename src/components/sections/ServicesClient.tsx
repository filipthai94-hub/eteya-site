'use client'
import { useState } from 'react'
import Image from 'next/image'

const SERVICES = [
  {
    number: '01',
    title: 'AI Agents',
    image: '/images/service-ai-agents.png',
    items: ['Kundtjänst', 'Leadsgenerering', 'Bokningar', 'Orderhantering', 'Intern support', 'Uppföljning'],
  },
  {
    number: '02',
    title: 'Automation',
    image: '/images/service-automation.png',
    items: ['E-postautomation', 'Fakturahantering', 'Lead-flöden', 'Rapportering', 'Systemsynk', 'Aviseringar'],
  },
  {
    number: '03',
    title: 'AI Products',
    image: '/images/service-ai-products.png',
    items: ['Webbapplikationer', 'Interna verktyg', 'API-integrationer', 'Databaslösningar', 'MVP på veckor', 'Skräddarsydd AI'],
  },
]

function ServiceCard({ service, index, isActive, onToggle }: {
  service: typeof SERVICES[0]
  index: number
  isActive: boolean
  onToggle: () => void
}) {
  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      ...(index === 0 ? { borderTop: '1px solid rgba(255,255,255,0.1)' } : {}),
    }}>
      {/* Title row */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
          padding: '35px 10.5px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 'clamp(1.5rem, 3vw, 45.5px)',
          fontWeight: 400,
          color: '#fff',
          userSelect: 'none',
        }}
      >
        {/* Arrow icon */}
        <span style={{
          display: 'inline-block',
          width: 45,
          height: 45,
          flexShrink: 0,
          transition: 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)',
          transform: isActive ? 'rotate(45deg)' : 'rotate(-45deg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56' fill='none'%3E%3Cpath d='M42.9727 41.7372L11.6671 10.4316' stroke='white' stroke-width='2' stroke-linecap='square'/%3E%3Cpath d='M44.334 15.8765L44.334 43.0987L17.1118 43.0987' stroke='white' stroke-width='2' stroke-linecap='square'/%3E%3C/svg%3E")`,
        }} />

        {/* Title */}
        <span style={{ flex: 1 }}>{service.title}</span>

        {/* Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '17.5px', flexShrink: 0 }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 400, color: '#fff' }}>{service.number}</span>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '12.25px', alignItems: 'flex-end' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{
                display: 'inline-block',
                width: '0.0625rem',
                backgroundColor: i === index ? '#fff' : 'rgba(255,255,255,0.4)',
                height: isActive && i === index ? '3.625rem' : '0.75rem',
                transition: 'height 0.5s cubic-bezier(0.65, 0, 0.35, 1)',
                flexShrink: 0,
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <div style={{
        display: 'grid',
        gridTemplateRows: isActive ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.5s cubic-bezier(0.65, 0, 0.35, 1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            padding: '1.5rem 10.5px 2.5rem',
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}>
            {/* Image */}
            <div style={{ position: 'relative', borderRadius: 0 }}>
              <Image
                src={service.image}
                alt={service.title}
                width={762}
                height={482}
                style={{ width: '100%', height: 'auto', mixBlendMode: 'screen' }}
              />
            </div>

            {/* List + button */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {service.items.map((item) => (
                  <li key={item} style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}>
                    <span style={{ opacity: 0.4, fontSize: '0.7em' }}>○</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#C8FF00',
                  color: '#121213',
                  border: 'none',
                  borderRadius: 0,
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '0 24px',
                  height: '48px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  width: 'fit-content',
                  transition: 'background 0.4s ease, transform 0.4s ease',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#b8ef00'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '#C8FF00'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                }}
              >
                Läs mer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ServicesClient() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="services" style={{
      backgroundColor: '#080808',
      padding: '80px 62px',
    }}>
      {/* Heading */}
      <h2 style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 'clamp(2.75rem, 6.5vw, 98px)',
        fontWeight: 300,
        color: '#fff',
        marginBottom: '68px',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        TJÄNSTER
      </h2>

      {/* Cards */}
      <div>
        {SERVICES.map((service, i) => (
          <ServiceCard
            key={service.number}
            service={service}
            index={i}
            isActive={activeIndex === i}
            onToggle={() => setActiveIndex(activeIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  )
}
