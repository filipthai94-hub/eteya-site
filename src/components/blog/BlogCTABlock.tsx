/**
 * BlogCTABlock — re-användbar CTA inuti artikel-content + längst ner.
 *
 * Server component. Triggar ROI-modal eller länkar till Kontakt.
 */

import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { BlogLocale } from '@/lib/blog/types'

interface BlogCTABlockProps {
  locale: BlogLocale
  /** Variant: 'inline' (mitten av artikel, kompakt) eller 'closing' (botten, full) */
  variant?: 'inline' | 'closing'
}

export default async function BlogCTABlock({
  locale,
  variant = 'closing',
}: BlogCTABlockProps) {
  const t = await getTranslations({ locale, namespace: 'blog.article' })

  if (variant === 'inline') {
    return (
      <aside className="my-12 p-6 bg-eteya-yellow/5 border border-eteya-yellow/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 not-prose">
        <div className="flex-1">
          <p className="text-base text-white/90 font-medium">
            {t('ctaBody')}
          </p>
        </div>
        <Link
          href="/kontakt"
          locale={locale}
          className="inline-flex items-center justify-center px-5 py-3 bg-eteya-yellow text-black font-medium rounded-lg hover:bg-eteya-yellow/90 transition-colors flex-shrink-0"
        >
          {t('ctaButton')}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="ml-2"
            aria-hidden="true"
          >
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

  // Closing variant — full-width CTA-block
  return (
    <section className="my-16 p-8 md:p-12 bg-gradient-to-br from-eteya-yellow/10 via-et-surface to-et-surface border border-eteya-yellow/30 rounded-3xl text-center">
      <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
        {t('ctaHeading')}
      </h2>
      <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
        {t('ctaBody')}
      </p>
      <Link
        href="/kontakt"
        locale={locale}
        className="inline-flex items-center justify-center px-7 py-4 bg-eteya-yellow text-black font-medium rounded-lg hover:bg-eteya-yellow/90 transition-colors text-lg"
      >
        {t('ctaButton')}
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          className="ml-2"
          aria-hidden="true"
        >
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
