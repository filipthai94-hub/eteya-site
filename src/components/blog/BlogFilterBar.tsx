'use client'

/**
 * BlogFilterBar — ChainGPT rect-pills med side-label "CATEGORIES".
 * Layout: Side-label vänster | Pills + search höger
 */

import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import type { BlogTag } from '@/lib/blog/types'

interface BlogFilterBarProps {
  tags: BlogTag[]
  activeTag?: string
}

export default function BlogFilterBar({
  tags,
  activeTag,
}: BlogFilterBarProps) {
  const t = useTranslations('blog.listing')
  const locale = useLocale()
  const isAllActive = !activeTag

  if (tags.length === 0) return null

  const sectionLabel = locale === 'sv' ? 'KATEGORIER' : 'CATEGORIES'

  return (
    <section className="blog-section-with-label" aria-label={t('tagsLabel')}>
      <div className="blog-section-label-col">
        <span className="blog-side-label">{sectionLabel}</span>
      </div>

      <nav>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Link
            href="/blogg"
            className={`blog-pill-rect ${isAllActive ? 'blog-pill-rect-active' : ''}`}
          >
            {t('allFilterLabel').toUpperCase()}
          </Link>

          {tags.map((tag) => {
            const isActive = activeTag === tag.slug
            return (
              <Link
                key={tag.slug}
                href={{
                  pathname: '/blogg/tag/[tag]',
                  params: { tag: tag.slug },
                }}
                className={`blog-pill-rect ${isActive ? 'blog-pill-rect-active' : ''}`}
              >
                {tag.name.toUpperCase()}
                <span className="blog-pill-rect-count">{tag.count}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </section>
  )
}
