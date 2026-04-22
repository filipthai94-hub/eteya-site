'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { AnimatedGridPattern } from '@/components/ui/AnimatedGridPattern'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { sendContactEmail } from '@/app/[locale]/actions/contact'
import { C } from '@/lib/colors'
import ButtonStripe from '@/components/ui/ButtonStripe'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: { sitekey: string; callback?: (token: string) => void; theme?: string }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

function SubmitButton({ label, loadingLabel, turnstileToken }: { 
  label: string
  loadingLabel: string
  turnstileToken: string
}) {
  const { pending } = useFormStatus()

  return (
    <ButtonStripe type="submit" disabled={pending || !turnstileToken} fullWidth>
      {pending ? loadingLabel : label}
    </ButtonStripe>
  )
}

const inputStyle = {
  width: '100%',
  backgroundColor: 'transparent' as const,
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.15)',
  color: '#FFFFFF',
  padding: '1rem 0',
  fontSize: '1rem',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  transition: 'border-color 0.2s',
}



export default function Contact() {
  const t = useTranslations('contact')
  const [state, action] = useActionState(sendContactEmail, null)
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const turnstileWidgetRef = useRef<string | null>(null)

  // Custom select state
  const [serviceOpen, setServiceOpen] = useState(false)
  const [serviceValue, setServiceValue] = useState('')
  const [serviceHighlight, setServiceHighlight] = useState(-1)
  const serviceRef = useRef<HTMLDivElement>(null)

  // Load Cloudflare Turnstile script
  useEffect(() => {
    if (window.turnstile) {
      initTurnstile()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.onload = initTurnstile
    document.body.appendChild(script)

    return () => {
      if (turnstileWidgetRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetRef.current)
      }
    }
  }, [])

  const initTurnstile = () => {
    if (!window.turnstile) return

    turnstileWidgetRef.current = window.turnstile.render('#turnstile-widget', {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
      callback: (token: string) => {
        setTurnstileToken(token)
      },
      theme: 'dark',
    })
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) {
        setServiceOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Hero refs
  const heroRef = useRef<HTMLElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const letters = nameRef.current?.querySelectorAll('[data-letter]')
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo(roleRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    )
    if (letters && letters.length > 0) {
      tl.fromTo(letters,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.05 },
        '-=0.4'
      )
    }
    tl.fromTo(bottomRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.6'
    )
  }, [])

  const headline = t('hero_headline')
  const letters = headline.split('')
  // Optical kerning for K-O-N-T-A-K-T
  const kerning: Record<number, string> = { 0: '-0.02em', 2: '0.01em', 5: '-0.01em' }

  return (
    <>
      {/* ── Hero Section ── */}
      <section ref={heroRef} style={{
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        backgroundColor: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Layer 1: Radial glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(200,255,0,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Layer 2: Animated Grid */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <AnimatedGridPattern
            className="h-full w-full"
            style={{
              color: '#C8FF00',
              maskImage: 'radial-gradient(600px circle at center, white, transparent)',
              WebkitMaskImage: 'radial-gradient(600px circle at center, white, transparent)',
            }}
            width={40}
            height={40}
            numSquares={50}
            maxOpacity={0.15}
            duration={3}
            repeatDelay={1}
            strokeDasharray={4}
          />
        </div>

        {/* Layer 3: Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 2rem',
        }}>
          {/* Hidden role ref for GSAP (not visually rendered) */}
          <div ref={roleRef} style={{ height: 0, overflow: 'hidden' }} />

          <div ref={nameRef}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(5rem, 12vw, 14rem)',
              color: '#f5f5f5',
              textTransform: 'uppercase',
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              whiteSpace: 'nowrap',
              display: 'flex',
              justifyContent: 'center',
            }}>
              {letters.map((letter, i) => (
                <span key={i} data-letter style={{ display: 'inline-block', opacity: 0, marginRight: kerning[i] || undefined }}>
                  {letter}
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* Bottom subheadline */}
        <div ref={bottomRef} style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '2rem 2.5rem 3.5rem',
          display: 'flex',
          justifyContent: 'center',
          opacity: 0,
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: '36rem',
            lineHeight: 1.2,
            textAlign: 'center',
          }}>
            {t('hero_subheading')}
          </p>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section id="contact" style={{ fontFamily: 'var(--font-body)', backgroundColor: C.bg, paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="contact-inner">
          <span className="contact-corner tl" />
          <span className="contact-corner tr" />
          <span className="contact-corner bl" />
          <span className="contact-corner br" />
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '4rem', alignItems: 'stretch' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Section label */}
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                {t('section_label')}
              </p>

              {/* Heading */}
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'clamp(2.5rem, 4vw, 5rem)',
                color: '#f5f5f5', textTransform: 'uppercase', lineHeight: 0.9,
                marginBottom: '2rem',
              }}>{t('heading')}</h2>

              {/* Subheading */}
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.9375rem, 1.1vw, 1.1rem)', lineHeight: 1.7, marginBottom: '2rem' }}>
                {t('subheading')}
              </p>

              {/* Kontaktinfo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>{t('email_label')}</p>
                  </div>
                  <a href="mailto:kontakt@eteya.ai"
                    style={{ color: '#f5f5f5', fontSize: '1.0625rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#f5f5f5')}>
                    kontakt@eteya.ai
                  </a>
                </div>
                {/* Telefon — tillfälligt borttagen tills företagsabonnemang finns */}
                {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>TELEFON</p>
                  </div>
                  <p style={{ color: '#f5f5f5', fontSize: '1.0625rem', margin: 0 }}>+46 8 123 45 67</p>
                </div> */}
                {/* Adress & Orgnr */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>{t('address_label')}</p>
                  </div>
                  <p style={{ color: '#f5f5f5', fontSize: '1.0625rem', margin: 0 }}>
                    {t('address').split(',')[0]}<br/>
                    {t('address').split(',').slice(1).join(',').trim()}<br/>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9375rem' }}>{t('org_nr')}</span>
                  </p>
                </div>
                {/* Öppettider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0 }}>{t('hours_label')}</p>
                  </div>
                  <p style={{ color: '#f5f5f5', fontSize: '1.0625rem', margin: 0 }}>
                    {t('hours')}
                  </p>
                </div>
              </div>

              {/* Social icons — footer style */}
              <div style={{ display: 'flex', gap: '14px', marginTop: 'auto', paddingTop: '3rem' }}>
                {[
                  { label: 'Instagram', href: '#', d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z', fill: true },
                  { label: 'LinkedIn', href: '#', d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', fill: false },
                  { label: 'Facebook', href: '#', d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', fill: false },
                  { label: 'X', href: '#', d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', fill: true },
                ].map(({ label, href, d, fill }) => (
                  <a key={label} href={href} aria-label={label} className="contact-social-link">
                    <svg className="contact-social-svg" width="17" height="17" viewBox="0 0 24 24"
                      fill={fill ? 'currentColor' : 'none'}
                      stroke={fill ? 'none' : 'currentColor'}
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={d} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Vertical separator */}
            <div className="contact-separator" />

            {/* Right column — form */}
            <form action={action} className="contact-form-glow" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
              <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />

              {/* Row 1: Name + Email */}
              <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ marginTop: '0' }}>
                  <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    {t('fields.name.label')}
                  </label>
                  <input type="text" name="name" required placeholder={t('fields.name.placeholder')}
                    style={{ ...inputStyle }}
                    onFocus={e => (e.target.style.borderBottomColor = '#C8FF00')}
                    onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
                </div>
                <div style={{ marginTop: '0' }}>
                  <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    {t('fields.email.label')}
                  </label>
                  <input type="email" name="email" required placeholder={t('fields.email.placeholder')}
                    style={{ ...inputStyle }}
                    onFocus={e => (e.target.style.borderBottomColor = '#C8FF00')}
                    onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
                </div>
              </div>

              {/* Company */}
              <div style={{ marginTop: '0' }}>
                <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  {t('fields.company.label')}
                </label>
                <input type="text" name="company" placeholder={t('fields.company.placeholder')}
                  style={{ ...inputStyle }}
                  onFocus={e => (e.target.style.borderBottomColor = '#C8FF00')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
              </div>

              {/* Service dropdown — custom */}
              <div style={{ marginTop: '0', position: 'relative' }} ref={serviceRef}>
                <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  {t('fields.service.label')}
                </label>
                {/* Hidden input for form submission */}
                <input type="hidden" name="service" value={serviceValue} />

                {/* Trigger */}
                <div
                  role="combobox"
                  aria-expanded={serviceOpen}
                  aria-haspopup="listbox"
                  aria-label={t('fields.service.label')}
                  tabIndex={0}
                  onClick={() => setServiceOpen(o => !o)}
                  onKeyDown={e => {
                    const opts = ['ai-automation','ai-strategy','integration','training','other']
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setServiceOpen(o => !o) }
                    if (e.key === 'Escape') setServiceOpen(false)
                    if (e.key === 'ArrowDown') { e.preventDefault(); setServiceHighlight(h => Math.min(h + 1, opts.length - 1)); if (!serviceOpen) setServiceOpen(true) }
                    if (e.key === 'ArrowUp') { e.preventDefault(); setServiceHighlight(h => Math.max(h - 1, 0)) }
                    if ((e.key === 'Enter' || e.key === ' ') && serviceHighlight >= 0 && serviceOpen) { e.preventDefault(); setServiceValue(opts[serviceHighlight]); setServiceOpen(false) }
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: `1px solid ${serviceOpen ? '#C8FF00' : 'rgba(255,255,255,0.15)'}`,
                    padding: '1rem 0', cursor: 'pointer', outline: 'none',
                    color: serviceValue ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                    fontSize: '1rem', fontFamily: 'var(--font-body)',
                    transition: 'border-color 0.2s',
                    userSelect: 'none' as const,
                  }}
                >
                  <span>
                    {serviceValue
                      ? t(`fields.service.options.${serviceValue.replace('-','_')}`)
                      : t('fields.service.placeholder')}
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'transform 0.2s', transform: serviceOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                  >
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </div>

                {/* Dropdown list */}
                {serviceOpen && (
                  <ul
                    role="listbox"
                    style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                      backgroundColor: '#0f0f0f',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)',
                      zIndex: 1000, margin: 0, padding: '4px',
                      listStyle: 'none',
                      animation: 'selectDropIn 150ms cubic-bezier(0.16,1,0.3,1) forwards',
                    }}
                  >
                    {([
                      { value: 'ai-automation', label: t('fields.service.options.ai_automation') },
                      { value: 'ai-strategy',   label: t('fields.service.options.ai_strategy') },
                      { value: 'integration',   label: t('fields.service.options.integration') },
                      { value: 'training',      label: t('fields.service.options.training') },
                      { value: 'other',         label: t('fields.service.options.other') },
                    ] as { value: string; label: string }[]).map((opt, i) => (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={serviceValue === opt.value}
                        onMouseEnter={() => setServiceHighlight(i)}
                        onMouseLeave={() => setServiceHighlight(-1)}
                        onClick={() => { setServiceValue(opt.value); setServiceOpen(false) }}
                        style={{
                          height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0 12px', borderRadius: '5px', cursor: 'pointer',
                          fontSize: '0.9375rem', fontFamily: 'var(--font-body)',
                          transition: 'background 0.1s',
                          backgroundColor: serviceValue === opt.value
                            ? 'rgba(200,255,0,0.08)'
                            : serviceHighlight === i ? '#1a1a1a' : 'transparent',
                          color: serviceValue === opt.value ? '#C8FF00' : '#f5f5f5',
                        }}
                      >
                        <span>{opt.label}</span>
                        {serviceValue === opt.value && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Message textarea */}
              <div style={{ marginTop: '0' }}>
                <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  {t('fields.message.label')}
                </label>
                <textarea name="message" required rows={5} placeholder={t('fields.message.placeholder')}
                  style={{ ...inputStyle, resize: 'none' as const, minHeight: '120px' }}
                  onFocus={e => (e.target.style.borderBottomColor = '#C8FF00')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)')} />
              </div>

              {/* Cloudflare Turnstile */}
              <div id="turnstile-widget" style={{ marginTop: '1rem', marginBottom: '1rem' }} />

              {/* Submit */}
              <div style={{ marginTop: '0' }}>
                <SubmitButton label={t('submit')} loadingLabel={t('submit_loading')} turnstileToken={turnstileToken} />
              </div>

              {state?.success && (
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginTop: '0' }}>{t('success')}</p>
              )}
              {(state as { error?: string } | null)?.error && (
                <p style={{ color: '#f87171', fontSize: '0.875rem', marginTop: '0' }}>
                  {(state as { error: string }).error}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        .contact-inner {
          position: relative;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 5rem 6rem;
          max-width: 88rem;
          margin: 0 auto;
        }
        @media (min-width: 901px) {
          .contact-inner {
            border-width: 2px;
          }
        }
        .contact-corner {
          position: absolute;
          width: 20px;
          height: 20px;
        }
        .contact-corner::before,
        .contact-corner::after {
          content: '';
          position: absolute;
          background: #ffffff;
        }
        .contact-corner::before { width: 20px; height: 2px; top: 50%; left: 0; margin-top: -1px; }
        .contact-corner::after  { width: 2px; height: 20px; left: 50%; top: 0; margin-left: -1px; }
        .contact-corner.tl { top: -10px; left: -10px; }
        .contact-corner.tr { top: -10px; right: -10px; }
        .contact-corner.bl { bottom: -10px; left: -10px; }
        .contact-corner.br { bottom: -10px; right: -10px; }
        .contact-separator {
          width: 1px;
          background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent 100%);
          align-self: stretch;
        }
        .contact-form-glow::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(255,255,255,0.10) 0%,
            rgba(255,255,255,0.04) 35%,
            rgba(255,255,255,0.01) 55%,
            transparent 70%
          );
          filter: blur(80px);
          will-change: transform;
          pointer-events: none;
          z-index: 0;
        }
        @media (max-width: 900px) {
          .contact-separator { display: none !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .contact-inner { padding: 2rem !important; }
        }
        @media (max-width: 767px) {
          .contact-form-row { grid-template-columns: 1fr !important; gap: 0 !important; }
          h1 { font-size: 22vw !important; }
        }
        .contact-social-link {
          width: 48px;
          height: 48px;
          background-color: rgba(255,255,255,0.06);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: background-color 0.3s;
          text-decoration: none;
          color: #ffffff;
          flex-shrink: 0;
        }
        .contact-social-link:hover {
          background-color: #ffffff;
        }
        .contact-social-link:active {
          transform: scale(0.9);
          transition: transform 0.15s;
        }
        .contact-social-link:hover .contact-social-svg {
          animation: contactSocialSlide 0.3s both;
          color: #080808;
          fill: #080808;
          stroke: #080808;
        }
        .contact-social-link:focus-visible {
          outline: 2px solid #C8FF00;
          outline-offset: 2px;
        }
        .contact-social-svg {
          transition: color 0.3s;
          color: #ffffff;
        }
        .contact-social-svg path {
          fill: inherit;
        }
        @keyframes contactSocialSlide {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes selectDropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-letter] { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </>
  )
}