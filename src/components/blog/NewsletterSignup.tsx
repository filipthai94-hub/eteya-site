'use client'

/**
 * NewsletterSignup — slim email-form. Använder .blog-newsletter-* klasser.
 */

import { useState, type FormEvent } from 'react'
import { useTranslations, useLocale } from 'next-intl'

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterSignup() {
  const t = useTranslations('blog.article')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [gdprAccepted, setGdprAccepted] = useState(false)
  const [state, setState] = useState<SubmitState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !gdprAccepted || state === 'loading') return

    setState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Network error')
      }

      setState('success')
      setEmail('')
      setGdprAccepted(false)
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const eyebrowText = locale === 'sv' ? 'NYHETSBREV' : 'NEWSLETTER'

  return (
    <section className="blog-newsletter">
      <span className="blog-newsletter-eyebrow">{eyebrowText}</span>
      <h2 className="blog-newsletter-heading">{t('newsletterHeading')}</h2>
      <p className="blog-newsletter-body">{t('newsletterBody')}</p>

      <form onSubmit={handleSubmit} className="blog-newsletter-form">
        <div className="blog-newsletter-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletterPlaceholder')}
            disabled={state === 'loading' || state === 'success'}
            className="blog-newsletter-input"
          />
          <button
            type="submit"
            disabled={
              !email ||
              !gdprAccepted ||
              state === 'loading' ||
              state === 'success'
            }
            className="blog-newsletter-button"
          >
            {state === 'loading' ? '...' : state === 'success' ? '✓' : t('newsletterButton')}
            {state === 'idle' && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        <label className="blog-newsletter-gdpr">
          <input
            type="checkbox"
            checked={gdprAccepted}
            onChange={(e) => setGdprAccepted(e.target.checked)}
            disabled={state === 'loading' || state === 'success'}
            required
          />
          <span>{t('newsletterGdpr')}</span>
        </label>

        {state === 'success' && (
          <p className="blog-newsletter-feedback blog-newsletter-feedback-success">
            {t('newsletterSuccess')}
          </p>
        )}
        {state === 'error' && (
          <p className="blog-newsletter-feedback blog-newsletter-feedback-error" role="alert">
            {errorMsg || t('newsletterError')}
          </p>
        )}
      </form>
    </section>
  )
}
