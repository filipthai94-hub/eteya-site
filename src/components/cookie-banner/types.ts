/**
 * Cookie consent types — shared by banner UI and storage utilities.
 *
 * `necessary` is always `true` (required for the site to function — locked).
 * `analytics` and `marketing` are user-controlled.
 */

export type ConsentCategories = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

export const CONSENT_COOKIE = 'eteya_consent'
export const CONSENT_VERSION = 1
export const CONSENT_TTL_DAYS = 365 // IMY recommends max 12 months for consent records
