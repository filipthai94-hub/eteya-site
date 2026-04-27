'use client'

/**
 * NewsletterSignup — email-form i artikel-slut.
 *
 * Client component. Postar till /api/newsletter som via Resend Audience-API
 * lägger till prenumeranten.
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

  return (
    <section className="my-16 p-8 md:p-10 bg-et-surface border border-et-border rounded-2xl not-prose">
      <h2 className="text-2xl md:text-3xl font-medium text-white mb-3">
        {t('newsletterHeading')}
      </h2>
      <p className="text-white/70 leading-relaxed mb-6">
        {t('newsletterBody')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
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
            className="flex-1 px-4 py-3 bg-black/40 border border-et-border rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-eteya-yellow/50 transition-colors text-base"
          />
          <button
            type="submit"
            disabled={
              !email ||
              !gdprAccepted ||
              state === 'loading' ||
              state === 'success'
            }
            className="px-6 py-3 bg-eteya-yellow text-black font-medium rounded-lg hover:bg-eteya-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {state === 'loading'
              ? '...'
              : state === 'success'
                ? '✓'
                : t('newsletterButton')}
          </button>
        </div>

        <label className="flex items-start gap-3 text-sm text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={gdprAccepted}
            onChange={(e) => setGdprAccepted(e.target.checked)}
            disabled={state === 'loading' || state === 'success'}
            className="mt-1 w-4 h-4 accent-eteya-yellow"
            required
          />
          <span>{t('newsletterGdpr')}</span>
        </label>

        {state === 'success' && (
          <p className="text-sm text-eteya-yellow font-medium">
            {t('newsletterSuccess')}
          </p>
        )}
        {state === 'error' && (
          <p className="text-sm text-red-400" role="alert">
            {errorMsg || t('newsletterError')}
          </p>
        )}
      </form>
    </section>
  )
}
