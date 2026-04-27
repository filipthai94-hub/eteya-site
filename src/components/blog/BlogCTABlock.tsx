/**
 * BlogCTABlock — closing CTA i editorial-stil. Ingen yellow box,
 * ingen glow — bara en eyebrow-rad, en stark Barlow Condensed
 * heading, body-text, och ett mono arrow-link.
 */

import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { BlogLocale } from '@/lib/blog/types'

interface BlogCTABlockProps {
  locale: BlogLocale
  variant?: 'inline' | 'closing'
}

export default async function BlogCTABlock({
  locale,
  variant = 'closing',
}: BlogCTABlockProps) {
  const t = await getTranslations({ locale, namespace: 'blog.article' })
  const eyebrowText =
    locale === 'sv' ? 'NÄSTA STEG' : 'NEXT STEP'

  if (variant === 'inline') {
    return (
      <aside className="blog-cta-inline not-prose">
        <p className="blog-cta-inline-text">{t('ctaBody')}</p>
        <Link href="/kontakt" locale={locale} className="blog-cta-inline-button">
          {t('ctaButton')}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </aside>
    )
  }

  return (
    <section className="blog-cta-closing not-prose">
      <span className="blog-cta-eyebrow">{eyebrowText}</span>
      <h2 className="blog-cta-heading">{t('ctaHeading')}</h2>
      <p className="blog-cta-body">{t('ctaBody')}</p>
      <Link href="/kontakt" locale={locale} className="blog-cta-arrow">
        {t('ctaButton')}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </section>
  )
}
