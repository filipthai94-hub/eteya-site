/**
 * BlogHero — magazine-style intro section för /blogg.
 *
 * Layout: side-label "ETEYA INSIGHTS" + content (eyebrow → title → tagline → stats)
 * Visual language matchar resten (mono accents, blueprint grid bakgrund).
 *
 * Eteya DNA:
 *   - Barlow Condensed massive title (Eteya signature)
 *   - JetBrains Mono för eyebrow + stats (ChainGPT-feel)
 *   - Yellow #C8FF00 på 3 mikro-element (eyebrow line, stats accent, label edge)
 *   - Subtle 1px border-bottom mot featured section
 */

import { getTranslations } from 'next-intl/server'

interface BlogHeroProps {
  locale: 'sv' | 'en'
  articleCount: number
  latestUpdate?: string  // ISO date — visas i mono "UPDATED APRIL 2026"
}

function formatMonoMonthYear(iso: string, locale: 'sv' | 'en'): string {
  const date = new Date(iso)
  if (locale === 'sv') {
    const months = ['JANUARI', 'FEBRUARI', 'MARS', 'APRIL', 'MAJ', 'JUNI', 'JULI', 'AUGUSTI', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DECEMBER']
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
}

export default async function BlogHero({
  locale,
  articleCount,
  latestUpdate,
}: BlogHeroProps) {
  const t = await getTranslations({ locale, namespace: 'blog.listing' })

  const sideLabel = locale === 'sv' ? 'ETEYA' : 'ETEYA'
  const eyebrowText = locale === 'sv' ? 'INSIGHTS / VOL 01' : 'INSIGHTS / VOL 01'
  const articleLabel = locale === 'sv'
    ? `${articleCount} ${articleCount === 1 ? 'ARTIKEL' : 'ARTIKLAR'}`
    : `${articleCount} ${articleCount === 1 ? 'ARTICLE' : 'ARTICLES'}`
  const updatedLabel = locale === 'sv' ? 'UPPDATERAD' : 'UPDATED'

  return (
    <section className="blog-hero-section" aria-labelledby="blog-hero-title">
      <div className="blog-section-with-label">
        <div className="blog-section-label-col">
          <span className="blog-side-label">{sideLabel}</span>
        </div>

        <div className="blog-hero-content">
          <span className="blog-hero-eyebrow">{eyebrowText}</span>

          <h1 id="blog-hero-title" className="blog-hero-h1">
            {t('heading')}
          </h1>

          <p className="blog-hero-tagline">{t('subheading')}</p>

          <div className="blog-hero-stats">
            <span className="blog-hero-stats-accent">{articleLabel}</span>
            {latestUpdate && (
              <>
                <span className="blog-hero-stats-divider">·</span>
                <span>
                  {updatedLabel} {formatMonoMonthYear(latestUpdate, locale)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
