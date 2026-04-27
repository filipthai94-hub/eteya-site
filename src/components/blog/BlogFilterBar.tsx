'use client'

/**
 * BlogFilterBar — horizontal pill-filter för tags.
 * Använder dedikerade .blog-pill* CSS-klasser.
 */

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
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
  const isAllActive = !activeTag

  if (tags.length === 0) return null

  return (
    <nav className="blog-filter-bar" aria-label={t('tagsLabel')}>
      <div className="blog-filter-inner">
        <div className="blog-filter-list">
          <Link
            href="/blogg"
            className={`blog-pill ${isAllActive ? 'blog-pill-active' : ''}`}
          >
            {t('allFilterLabel')}
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
                className={`blog-pill ${isActive ? 'blog-pill-active' : ''}`}
              >
                {tag.name}
                <span className="blog-pill-count">{tag.count}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
