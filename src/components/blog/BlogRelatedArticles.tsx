/**
 * BlogRelatedArticles — visar 3 relaterade artiklar baserat på tag-overlap.
 * Editorial layout med side-label "RELATERAT" + grid av BlogPostCards.
 */

import { getTranslations } from 'next-intl/server'
import BlogPostCard from './BlogPostCard'
import type { BlogPostSummary, BlogLocale } from '@/lib/blog/types'

interface BlogRelatedArticlesProps {
  posts: BlogPostSummary[]
  locale: BlogLocale
}

export default async function BlogRelatedArticles({
  posts,
  locale,
}: BlogRelatedArticlesProps) {
  const t = await getTranslations({ locale, namespace: 'blog.article' })

  if (posts.length === 0) return null

  const sectionLabel = locale === 'sv' ? 'RELATERAT' : 'RELATED'

  return (
    <section
      className="blog-section-with-label blog-related-section"
      aria-label={t('relatedHeading')}
    >
      <div className="blog-section-label-col">
        <span className="blog-side-label">{sectionLabel}</span>
      </div>

      <div className="blog-related-grid">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
