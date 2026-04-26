'use client'

/**
 * Cookie Consent Banner — Eteya design DNA.
 *
 * Pattern: bottom-bar with three equal-prominence buttons
 * (Reject all / Customize / Accept all) — CNIL/IMY-compliant.
 *
 * Mounting strategy: only renders client-side after `useEffect` fires.
 * Server-rendered HTML never includes this banner — avoids hydration mismatch.
 *
 * On every page load, re-applies stored consent to `gtag` so GA4
 * stays in sync with the user's previous choice.
 */

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  applyToGoogleConsent,
  readConsent,
  writeConsent,
} from './consent-storage'
import s from './CookieBanner.module.css'

const CHECK_PATH = 'M2 6 L6 10 L14 2'

export function CookieBanner() {
  const t = useTranslations('cookieBanner')
  const locale = useLocale()
  const privacyHref = locale === 'sv' ? '/sv/integritetspolicy' : '/en/privacy-policy'

  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  // Hydration-safe mount + re-apply previous consent to gtag
  useEffect(() => {
    setMounted(true)
    const existing = readConsent()
    if (!existing) {
      setShow(true)
    } else {
      applyToGoogleConsent(existing.categories)
    }

    // Listen for "Manage cookies" footer link → re-show banner
    const onShow = () => setShow(true)
    window.addEventListener('eteya:show-cookie-banner', onShow)
    return () => window.removeEventListener('eteya:show-cookie-banner', onShow)
  }, [])

  if (!mounted || !show) return null

  const acceptAll = () => {
    writeConsent({ necessary: true, analytics: true, marketing: true })
    setShow(false)
  }
  const rejectAll = () => {
    writeConsent({ necessary: true, analytics: false, marketing: false })
    setShow(false)
  }
  const saveCustom = () => {
    writeConsent({ necessary: true, analytics, marketing })
    setShow(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className={s.root}
    >
      <div className={s.inner}>
        <div className={s.content}>
          <p id="cookie-banner-title" className={s.title}>
            {t('title')}
          </p>
          <p className={s.description}>
            {t('description')}{' '}
            <a href={privacyHref} className={s.link}>
              {t('readMore')}
            </a>
          </p>

          {showDetails && (
            <div className={s.details}>
              {/* Necessary — locked */}
              <label className={s.category} data-locked="true">
                <span className={`${s.check} ${s.checkLocked}`}>
                  <svg viewBox="0 0 16 12" fill="none" aria-hidden>
                    <path
                      d={CHECK_PATH}
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className={s.categoryText}>
                  <span className={s.categoryName}>{t('necessary')}</span>
                  {t('necessaryDesc')}
                </span>
              </label>

              {/* Analytics */}
              <label className={s.category}>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className={s.hiddenInput}
                />
                <span className={`${s.check} ${analytics ? s.checkOn : ''}`}>
                  <svg viewBox="0 0 16 12" fill="none" aria-hidden>
                    <path
                      d={CHECK_PATH}
                      stroke="#080808"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className={s.categoryText}>
                  <span className={s.categoryName}>{t('analytics')}</span>
                  {t('analyticsDesc')}
                </span>
              </label>

              {/* Marketing */}
              <label className={s.category}>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className={s.hiddenInput}
                />
                <span className={`${s.check} ${marketing ? s.checkOn : ''}`}>
                  <svg viewBox="0 0 16 12" fill="none" aria-hidden>
                    <path
                      d={CHECK_PATH}
                      stroke="#080808"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className={s.categoryText}>
                  <span className={s.categoryName}>{t('marketing')}</span>
                  {t('marketingDesc')}
                </span>
              </label>
            </div>
          )}
        </div>

        <div className={s.actions}>
          {showDetails ? (
            <button onClick={saveCustom} className={s.btn} type="button">
              {t('saveChoices')}
            </button>
          ) : (
            <button
              onClick={() => setShowDetails(true)}
              className={s.btn}
              type="button"
            >
              {t('customize')}
            </button>
          )}
          <button onClick={rejectAll} className={s.btn} type="button">
            {t('rejectAll')}
          </button>
          <button
            onClick={acceptAll}
            className={`${s.btn} ${s.btnPrimary}`}
            type="button"
          >
            {t('acceptAll')}
          </button>
        </div>
      </div>
    </div>
  )
}
