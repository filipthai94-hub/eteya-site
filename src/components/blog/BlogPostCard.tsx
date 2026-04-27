/**
 * BlogPostCard — listing-card för en blog-post.
 *
 * Visas i grid på listing-page, tag-page, author-page och related-articles.
 * Server component (ingen interactivity) — pre-renderas snabbt.
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { BlogPostSummary } from '@/lib/blog/types'
import {
  formatBlogDate,
  formatReadingTime,
  getAuthorName,
} from '@/lib/blog/format'

interface BlogPostCardProps {
  post: BlogPostSummary
  /** Variant: standard eller featured (större) */
  variant?: 'standard' | 'featured'
}

export default function BlogPostCard({
  post,
  variant = 'standard',
}: BlogPostCardProps) {
  const isFeatured = variant === 'featured'
  const articlePath = `/blogg/${post.slug}` as const

  return (
    <article
      className={`group relative flex flex-col bg-et-surface border border-et-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-eteya-yellow/40 hover:-translate-y-1 ${
        isFeatured ? 'md:flex-row md:col-span-2 lg:col-span-3' : ''
      }`}
    >
      {/* Hero image — wrapper för aspect-ratio */}
      <Link
        href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
        locale={post.language}
        className={`relative block overflow-hidden ${
          isFeatured
            ? 'md:w-1/2 aspect-[16/10]'
            : 'aspect-[16/10]'
        }`}
        aria-label={post.title}
      >
        <Image
          src={post.heroImage}
          alt={post.heroImageAlt}
          fill
          sizes={
            isFeatured
              ? '(max-width: 768px) 100vw, 50vw'
              : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={isFeatured}
        />
        {/* Subtil gradient-overlay för text-läsbarhet om hover-state vill ha overlay-text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div
        className={`flex flex-col p-6 md:p-7 ${isFeatured ? 'md:w-1/2 md:p-10 md:justify-center' : ''}`}
      >
        {/* Tags-rad */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider font-medium text-eteya-yellow/90 px-2.5 py-1 bg-eteya-yellow/10 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3
          className={`font-[family-name:var(--font-display,DM_Sans)] font-medium tracking-tight text-white mb-3 ${
            isFeatured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
          }`}
        >
          <Link
            href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
            locale={post.language}
            className="hover:text-eteya-yellow transition-colors duration-200"
          >
            {post.title}
          </Link>
        </h3>

        {/* Description */}
        <p
          className={`text-white/70 leading-relaxed mb-5 ${
            isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base'
          } line-clamp-3`}
        >
          {post.description}
        </p>

        {/* Meta-rad */}
        <div className="flex items-center gap-3 text-xs text-white/50 mt-auto">
          <span>{getAuthorName(post.author)}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedDate}>
            {formatBlogDate(post.publishedDate, post.language)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{formatReadingTime(post.readingTime, post.language)}</span>
        </div>
      </div>
    </article>
  )
}
