'use client';

import { useState, useEffect } from 'react';
import { VaultBeams } from './VaultBeams';

const CONTACTS = [
  { 
    label: 'Telefon',
    value: '+46 73 982 39 62',
    href: 'tel:+46739823962',
    icon: (
      <svg className="contact-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
      </svg>
    )
  },
  {
    label: 'Email',
    value: 'kontakt@eteya.ai',
    href: 'mailto:kontakt@eteya.ai',
    icon: (
      <svg className="contact-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    )
  },
  {
    label: 'Website',
    value: 'etea.ai',
    href: 'https://etea.ai',
    target: '_blank' as const,
    rel: 'noopener noreferrer',
    icon: (
      <svg className="contact-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
      </svg>
    )
  },
];

export function VaultDesktop() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setMounted(true);
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1000);
    const t4 = setTimeout(() => setPhase(4), 1400);
    const t5 = setTimeout(() => setPhase(5), 1800);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5);
    };
  }, []);

  return (
    <div style={{
      backgroundColor: '#080808',
      color: '#F5F5F5',
      fontFamily: "'Geist', sans-serif",
      letterSpacing: '-0.01em',
      lineHeight: 1.75,
      overflowX: 'hidden',
      minHeight: '100vh',
    }}>
      {/* HERO */}
      <section className="hero" style={{
        position: 'relative',
        height: '100vh',
        minHeight: '700px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#080808',
      }}>
        <VaultBeams intensity="strong" />

        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 2rem',
        }}>
          {/* Profile Image */}
          <div style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            margin: '0 auto 3rem',
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 1.2s ease, transform 1.2s ease',
          }}>
            <div style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,255,0,0.2) 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite',
              zIndex: -1,
            }} />
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid rgba(200,255,0,0.3)',
              background: 'linear-gradient(135deg, rgba(200,255,0,0.1) 0%, rgba(200,255,0,0.05) 100%)',
              overflow: 'hidden',
            }}>
              <img
                src="/images/team/filip.png"
                alt="Filip Thai"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

          {/* Role */}
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(0.875rem, 1.2vw, 1.1rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '1rem',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            VD & Grundare
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(4rem, 10vw, 10rem)',
            textTransform: 'uppercase',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            color: '#F5F5F5',
            margin: '0 0 0.5rem 0',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}>
            Filip Thai
          </h1>

          {/* Title */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            color: 'rgba(255,255,255,0.6)',
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            Eteya Consulting AB
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" style={{
        padding: '6rem 2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div className="contact-list" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}>
          {CONTACTS.map((contact, index) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.target}
              rel={contact.rel}
              className="contact-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                color: '#F5F5F5',
                opacity: phase >= 4 ? 1 : 0,
                transform: phase >= 4 ? 'translateY(0)' : 'translateY(20px)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.paddingLeft = '1rem';
                e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.paddingLeft = '0';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                color: '#C8FF00',
                flexShrink: 0,
              }}>
                {contact.icon}
              </div>
              <div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '0.25rem',
                }}>
                  {contact.label}
                </div>
                <div style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 500,
                  fontSize: '1.125rem',
                }}>
                  {contact.value}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SOCIAL */}
      <section className="social-section" style={{
        padding: '4rem 2rem',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 500,
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '1.5rem',
        }}>
          Följ mig
        </p>
        <div className="social-links" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
        }}>
          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/filip-thai-10449a3b6/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            title="LinkedIn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              opacity: phase >= 5 ? 1 : 0,
              transform: phase >= 5 ? 'translateY(0)' : 'translateY(20px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(200,255,0,0.1)';
              e.currentTarget.style.borderColor = 'rgba(200,255,0,0.3)';
              e.currentTarget.style.color = '#C8FF00';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg className="social-icon" style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          {/* X / Twitter */}
          <a
            href="https://twitter.com/filipthai"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            title="X"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              opacity: phase >= 5 ? 1 : 0,
              transform: phase >= 5 ? 'translateY(0)' : 'translateY(20px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(200,255,0,0.1)';
              e.currentTarget.style.borderColor = 'rgba(200,255,0,0.3)';
              e.currentTarget.style.color = '#C8FF00';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg className="social-icon" style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{
        padding: '3rem 2rem 6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
      }}>
        {/* Boka möte */}
        <a
          href="https://cal.com/filip"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '1.25rem 2.5rem',
            borderRadius: '12px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '1rem',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            minWidth: '280px',
            background: 'linear-gradient(135deg, #C8FF00 0%, #A8E600 100%)',
            color: '#080808',
            opacity: phase >= 5 ? 1 : 0,
            transform: phase >= 5 ? 'translateY(0)' : 'translateY(20px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-24px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(200,255,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = phase >= 5 ? 'translateY(0)' : 'translateY(20px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg className="btn-icon" style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Boka ett möte
        </a>

        {/* Spara kontakt */}
        <a
          href="/api/vcard/filip"
          download="Filip-Thai.vcf"
          className="btn btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '1.25rem 2.5rem',
            borderRadius: '12px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '1rem',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.1)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            minWidth: '280px',
            background: 'rgba(255,255,255,0.03)',
            color: '#F5F5F5',
            opacity: phase >= 5 ? 1 : 0,
            transform: phase >= 5 ? 'translateY(0)' : 'translateY(20px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(-24px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = phase >= 5 ? 'translateY(0)' : 'translateY(20px)';
          }}
        >
          <svg className="btn-icon" style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Spara kontakt
        </a>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '0.875rem',
      }}>
        <p>
          © 2026 Eteya Consulting AB —{' '}
          <a
            href="/sv/om-oss"
            style={{
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#C8FF00'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            Tillbaka till teamet
          </a>
        </p>
      </footer>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .contact-item-icon {
          width: 24px;
          height: 24px;
        }
        .social-icon {
          width: 24px;
          height: 24px;
        }
        .btn-icon {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </div>
  );
}
