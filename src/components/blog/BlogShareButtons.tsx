'use client'

/**
 * BlogShareButtons — LinkedIn (B2B-primärt), X, copy-link.
 *
 * Eteya DNA:
 * - Icon-only buttons med subtle border
 * - Hover: border-eteya-yellow/50, color-eteya-yellow
 * - 0.3s cubic-bezier(0.65,0,0.35,1) transition
 *
 * Variants:
 * - 'standard' — full med text label
 * - 'compact' — bara icons (för article-hero)
 */

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface BlogShareButtonsProps {
  url: string
  title: string
  compact?: boolean
}

export default function BlogShareButtons({
  url,
  title,
  compact = false,
}: BlogShareButtonsProps) {
  const t = useTranslations('blog.article')
  const [copied, setCopied] = useState(false)

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  const xUrl = `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt(t('shareCopy'), url)
    }
  }

  if (compact) {
    // Icon-only — för article-hero. Använder .blog-share-icon från globals.css
    const iconClasses = 'blog-share-icon'

    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={iconClasses}
          aria-label={t('shareLinkedIn')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={iconClasses}
          aria-label={t('shareX')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <button
          type="button"
          onClick={onCopy}
          className={iconClasses}
          aria-label={t('shareCopy')}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8l3 3 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  // Standard variant — med labels
  const buttonClasses =
    'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white/80 bg-transparent border border-white/10 rounded-lg hover:border-eteya-yellow/50 hover:text-eteya-yellow transition-all duration-300'

  return (
    <div className="flex flex-wrap gap-3">
      <span className="text-sm text-white/60 self-center mr-2">
        {t('shareLabel')}:
      </span>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        aria-label={t('shareLinkedIn')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        LinkedIn
      </a>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
        aria-label={t('shareX')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </a>
      <button
        type="button"
        onClick={onCopy}
        className={buttonClasses}
        aria-label={t('shareCopy')}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        {copied ? t('shareCopied') : t('shareCopy')}
      </button>
    </div>
  )
}
