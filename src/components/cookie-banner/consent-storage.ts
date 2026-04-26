'use client'

/**
 * Cookie consent storage utilities.
 *
 * Stores user choices in a first-party cookie (not localStorage) so that:
 * - Server can read consent state for SSR if needed later.
 * - Regulators expect to see consent records in cookies (auditable).
 * - Cookie chosen over localStorage per IMY guidance.
 *
 * Also bridges user choice to Google Consent Mode v2 via `gtag('consent', 'update', ...)`.
 */

import {
  CONSENT_COOKIE,
  CONSENT_TTL_DAYS,
  CONSENT_VERSION,
  type ConsentCategories,
} from './types'

type StoredConsent = {
  v: number
  ts: number
  categories: ConsentCategories
}

export function readConsent(): StoredConsent | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`${CONSENT_COOKIE}=([^;]+)`))
  if (!match) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1])) as StoredConsent
    // Bump version to force re-consent if categories change in future
    if (parsed.v !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function writeConsent(categories: ConsentCategories) {
  const data: StoredConsent = {
    v: CONSENT_VERSION,
    ts: Date.now(),
    categories,
  }
  const maxAge = CONSENT_TTL_DAYS * 24 * 60 * 60
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(data))}; ` +
    `max-age=${maxAge}; path=/; SameSite=Lax; Secure`
  applyToGoogleConsent(categories)
}

/**
 * Apply consent state to Google Consent Mode v2.
 *
 * Called on:
 * 1. Initial mount (re-applies stored consent so GA4 knows current state).
 * 2. After user accepts/rejects/customizes (updates GA4 in real-time).
 *
 * Must run AFTER ConsentDefault has set initial denied state — that's why
 * we check for window.gtag existence (script tag is `beforeInteractive`).
 */
export function applyToGoogleConsent(categories: ConsentCategories) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return

  window.gtag('consent', 'update', {
    analytics_storage: categories.analytics ? 'granted' : 'denied',
    ad_storage: categories.marketing ? 'granted' : 'denied',
    ad_user_data: categories.marketing ? 'granted' : 'denied',
    ad_personalization: categories.marketing ? 'granted' : 'denied',
  })
}

/**
 * Reset consent — used by "Manage cookies" footer link to re-show banner.
 * Clears cookie + reloads so banner re-renders from scratch.
 */
export function resetConsent() {
  document.cookie = `${CONSENT_COOKIE}=; max-age=0; path=/; SameSite=Lax; Secure`
  if (typeof window !== 'undefined') window.location.reload()
}
