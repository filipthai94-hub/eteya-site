/**
 * BlogRelatedArticles — visar 3 relaterade artiklar baserat på tag-overlap.
 *
 * Server component.
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

  return (
    <section className="my-16 pt-12 border-t border-et-border">
      <h2 className="text-2xl md:text-3xl font-medium text-white mb-8">
        {t('relatedHeading')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
