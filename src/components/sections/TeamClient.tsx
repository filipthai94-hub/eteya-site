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
  initials?: string
  social?: {
    linkedin?: string
    email?: string
  }
}

export default function TeamClient({ label, heading, members }: {
  label: string
  heading: string
  members: TeamMember[]
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean)

      // Scroll reveal - cards slide up + fade in
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
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
        backgroundColor: '#080808', 
        paddingTop: '8rem', 
        paddingBottom: '8rem'
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '4rem',
          maxWidth: '700px',
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

        {/* Team Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
          perspective: '1000px',
        }}>
          {members.map((member, i) => {
            const initials = member.initials || member.name.split(' ').map(n => n[0]).join('')
            
            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: 'scale(1)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  willChange: 'auto',
                  minHeight: '520px',
                }}

              >
                {/* Image Container - 60% of card */}
                <div style={{
                  height: '312px',
                  width: '100%',
                  background: '#111111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Vit mjuk glow uppifrån */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }} />
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    />
                  ) : (
                    // Placeholder with initials - ENHANCED VISIBILITY
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'rgba(200,255,0,0.08)',
                      border: '2px solid rgba(200,255,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.6)',
                        letterSpacing: '0.05em',
                      }}>
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area - 40% of card */}
                <div style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  flex: 1,
                }}>
                  {/* Name */}
                  <h3 style={{ 
                    color: '#f5f5f5', 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}>
                    {member.name}
                  </h3>

                  {/* Role - ENHANCED VISIBILITY */}
                  <p style={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: '0.875rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.14em', 
                    margin: 0,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 500,
                  }}>
                    {member.role}
                  </p>

                  {/* Bio */}
                  <p style={{ 
                    color: 'rgba(255,255,255,0.65)', 
                    fontSize: '0.95rem', 
                    lineHeight: 1.6,
                    fontFamily: "'Geist', sans-serif",
                    margin: 0,
                  }}>
                    {member.bio}
                  </p>

                  {/* Social Icons - minimal, ingen bakgrund */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: 'auto',
                  }}>
                    {member.social?.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          transition: 'opacity 0.2s ease',
                          textDecoration: 'none',
                          opacity: 0.4,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.4'
                        }}
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                          style={{ color: '#ffffff' }}
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {member.social?.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          transition: 'opacity 0.2s ease',
                          textDecoration: 'none',
                          opacity: 0.4,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.4'
                        }}
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          style={{ color: '#ffffff' }}
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2"/>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
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
          section[style*="background-color"] > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          section[style*="background-color"] .team-card {
            min-height: auto !important;
          }
          section[style*="background-color"] [style*="height: 312px"] {
            height: 280px !important;
          }
          section[style*="background-color"] [style*="padding: 2rem"] {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}
