'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { C } from '@/lib/colors'

gsap.registerPlugin(ScrollTrigger)

type TeamMember = {
  name: string
  role: string
  bio: string
  image?: string
}

export default function TeamClient({ label, heading, members, teamNote }: {
  label: string
  heading: string
  members: TeamMember[]
  teamNote?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean)

      gsap.set(cards, { opacity: 0, y: 30 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out'
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef} 
      style={{ 
        backgroundColor: '#0a0a0a', 
        paddingTop: '8rem', 
        paddingBottom: '8rem'
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '5rem',
          maxWidth: '700px',
          margin: '0 auto 5rem auto'
        }}>
          <p style={{ 
            color: 'rgba(255,255,255,0.35)', 
            fontSize: '0.75rem', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase', 
            marginBottom: '1rem',
            fontFamily: "'Barlow Condensed', sans-serif"
          }}>
            {label}
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
            {heading}
          </h2>
        </div>

        {/* Team Grid - 2 cards side by side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {members.map((member, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
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
              {/* Team member image - circular placeholder */}
              {member.image && (
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '2rem',
                  backgroundColor: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      // Fallback om bilden inte laddar - visa initials
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const placeholder = target.parentElement
                      if (placeholder) {
                        const initials = member.name.split(' ').map(n => n[0]).join('')
                        placeholder.innerHTML = `<span style="font-family: 'DM Sans', sans-serif; font-size: 2rem; font-weight: 600; color: rgba(255,255,255,0.3);">${initials}</span>`
                      }
                    }}
                  />
                </div>
              )}

              {/* Name */}
              <h3 style={{ 
                color: C.primary, 
                fontSize: '2rem', 
                fontWeight: 600, 
                marginBottom: '0.75rem',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '-0.02em'
              }}>
                {member.name}
              </h3>

              {/* Role */}
              <p style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '0.9rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em', 
                marginBottom: '1.5rem',
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500
              }}>
                {member.role}
              </p>

              {/* Bio */}
              <p style={{ 
                color: 'rgba(255,255,255,0.75)', 
                fontSize: '1rem', 
                lineHeight: 1.7,
                fontFamily: "'Geist', sans-serif",
                margin: '0 0 1.5rem 0'
              }}>
                {member.bio}
              </p>

              {/* LinkedIn icon (non-clickable) */}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.05)',
                marginTop: 'auto',
              }}>
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </span>
            </div>
          ))}
        </div>

        {/* Team note */}
        {teamNote && (
          <p style={{ 
            color: 'rgba(255,255,255,0.4)', 
            fontSize: '0.9rem', 
            textAlign: 'center', 
            marginTop: '4rem',
            fontFamily: "'Geist', sans-serif"
          }}>
            {teamNote}
          </p>
        )}
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
          section[style*="background-color"] > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          section[style*="background-color"] [data-customer] {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}
