/**
 * BlogHero — minimalistisk editorial intro för /blogg.
 *
 * Använder Eteyas standard-fonter:
 *   - h1: Barlow Condensed (var(--font-display)) — samma som resten av sajten
 *   - tagline: Geist (var(--font-body)) — body-text överallt
 *
 * Inga side-labels, eyebrow-rader eller stats — bara titel + tagline,
 * stilrent och konsekvent med övriga sub-page heros (About, Methodology).
 */

import { getTranslations } from 'next-intl/server'

interface BlogHeroProps {
  locale: 'sv' | 'en'
}

export default async function BlogHero({ locale }: BlogHeroProps) {
  const t = await getTranslations({ locale, namespace: 'blog.listing' })

  return (
    <section className="blog-hero-section" aria-labelledby="blog-hero-title">
      <div className="blog-hero-inner">
        <h1 id="blog-hero-title" className="blog-hero-h1">
          {t('heading')}
        </h1>
        <p className="blog-hero-tagline">{t('subheading')}</p>
      </div>
    </section>
  )
}
