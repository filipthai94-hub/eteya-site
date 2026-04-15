'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ButtonSwap from '@/components/ui/ButtonSwap'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

type Customer = {
  name: string
  bigNumber: string
  bigNumberLabel: string
  quote: string
  caseStudyUrl: string
  logo: string
}

export default function SocialProofClient({ title, subtitle, customers }: {
  title: string
  subtitle: string
  customers: Customer[]
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll('[data-customer]')
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.15, 
          ease: 'power3.out',
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 80%', 
            once: true 
          } 
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef} 
      style={{ 
        backgroundColor: '#0a0a0a', 
        paddingTop: '6rem', 
        paddingBottom: '6rem'
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '4rem',
          maxWidth: '800px',
          margin: '0 auto 4rem auto'
        }}>
          <p style={{ 
            color: 'rgba(255,255,255,0.35)', 
            fontSize: '0.75rem', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase', 
            marginBottom: '1rem',
            fontFamily: "'Barlow Condensed', sans-serif"
          }}>
            {title}
          </p>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: C.primary,
            textTransform: 'uppercase',
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>
            {subtitle}
          </h2>
        </div>

        {/* Customer Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {customers.map((customer, i) => (
            <div
              key={i}
              data-customer
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  borderColor: 'rgba(255,255,255,0.12)',
                  duration: 0.3
                })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  borderColor: 'rgba(255,255,255,0.06)',
                  duration: 0.3
                })
              }}
            >
              {/* Logo */}
              <div style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src={customer.logo}
                  alt={customer.name}
                  style={{
                    maxWidth: '160px',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    opacity: 0.9,
                  }}
                />
              </div>

              {/* Big Number */}
              <div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 700,
                  color: C.primary,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}>
                  {customer.bigNumber}
                </div>
                <div style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '0.5rem',
                  letterSpacing: '-0.01em'
                }}>
                  {customer.bigNumberLabel}
                </div>
              </div>

              {/* Quote */}
              <blockquote style={{
                margin: 0,
                padding: 0,
                border: 'none',
              }}>
                <p style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.65)',
                  fontStyle: 'italic',
                  margin: 0,
                }}>
                  "{customer.quote}"
                </p>
              </blockquote>

              {/* Customer Name */}
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {customer.name}
              </div>

              {/* Case Study Button */}
              <div style={{ marginTop: 'auto', display: 'inline-flex' }}>
                <ButtonSwap 
                  label="Läs hela caset" 
                  arrow 
                  href={customer.caseStudyUrl} 
                  size="lg" 
                  variant="white" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 767px) {
          section[style*="background-color"] {
            padding-top: 4rem !important;
            padding-bottom: 4rem !important;
          }
          section[style*="background-color"] > div {
            padding: 0 1.5rem !important;
          }
          section[style*="background-color"] > div > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          section[style*="background-color"] [data-customer] {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}
