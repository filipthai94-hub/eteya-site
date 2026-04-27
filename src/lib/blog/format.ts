/**
 * Format-utilities för blog — locale-aware datum, reading-time-strängar.
 */

import type { BlogLocale } from './types'

/** Formattera datum för blog-listing/article — kort format */
export function formatBlogDate(iso: string, locale: BlogLocale): string {
  const date = new Date(iso)
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-US', opts)
}

/** Reading-time-sträng på rätt språk */
export function formatReadingTime(minutes: number, locale: BlogLocale): string {
  if (locale === 'sv') {
    return minutes === 1 ? '1 min läsning' : `${minutes} min läsning`
  }
  return minutes === 1 ? '1 min read' : `${minutes} min read`
}

/** Author display-name */
export function getAuthorName(author: 'filip' | 'agit'): string {
  return author === 'filip' ? 'Filip Thai' : 'Agit Akalp'
}

/** Author role display per locale */
export function getAuthorRole(
  author: 'filip' | 'agit',
  locale: BlogLocale,
): string {
  if (author === 'filip') {
    return locale === 'sv' ? 'Grundare & VD' : 'CEO & Founder'
  }
  return 'Partner'
}

/** Author profil-path */
export function getAuthorPath(
  author: 'filip' | 'agit',
  locale: BlogLocale,
): string {
  const aboutPath = locale === 'sv' ? '/sv/om-oss' : '/en/about'
  return `${aboutPath}/${author}`
}

/** Author image-path */
export function getAuthorImage(author: 'filip' | 'agit'): string {
  return `/images/team/${author}.webp`
}
