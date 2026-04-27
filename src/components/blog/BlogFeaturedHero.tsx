/**
 * BlogFeaturedHero — Linear/Anthropic-stil split-hero för featured post.
 *
 * Layout:
 *   Desktop (>=1024px): [image 1.4fr | text 1fr] horizontal split
 *   Tablet/Mobile: stackat (image över text)
 *
 * Detta ersätter traditional hero header — featured post BLIR den
 * visuella heron. Editorial magazine-feel matchar Linear's blog och
 * Anthropic's news-section.
 *
 * Använder dedikerade .blog-featured-* CSS-klasser från globals.css.
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { BlogPostSummary } from '@/lib/blog/types'
import { formatBlogDate, getAuthorName, getAuthorImage } from '@/lib/blog/format'

interface BlogFeaturedHeroProps {
  post: BlogPostSummary
}

export default async function BlogFeaturedHero({ post }: BlogFeaturedHeroProps) {
  const t = await getTranslations({ locale: post.language, namespace: 'blog.article' })
  const primaryTag = post.tags[0]
  const readMoreText = post.language === 'sv' ? 'Läs artikel' : 'Read article'

  // Note: t('readingTime') referens reserveras för framtida bruk
  void t

  return (
    <section className="blog-featured-hero" aria-label="Featured article">
      <div className="blog-featured-grid">
        {/* IMAGE-sida — vänster på desktop */}
        <Link
          href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
          locale={post.language}
          className="blog-featured-image-link"
          aria-label={post.title}
        >
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="blog-featured-image"
            priority
          />
        </Link>

        {/* TEXT-sida — höger på desktop, vertikalt centrerad */}
        <div className="blog-featured-text">
          {primaryTag && (
            <span className="blog-featured-tag">{primaryTag}</span>
          )}

          <h2 className="blog-featured-title">
            <Link
              href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
              locale={post.language}
            >
              {post.title}
            </Link>
          </h2>

          <p className="blog-featured-desc">{post.description}</p>

          <hr className="blog-featured-divider" />

          <div className="blog-featured-byline">
            <Image
              src={getAuthorImage(post.author)}
              alt={getAuthorName(post.author)}
              width={36}
              height={36}
              className="blog-featured-byline-photo"
            />
            <div className="blog-featured-byline-info">
              <span className="blog-featured-byline-name">
                {getAuthorName(post.author)}
              </span>
              <span aria-hidden="true" className="blog-featured-byline-sep">·</span>
              <time
                dateTime={post.publishedDate}
                className="blog-featured-byline-date"
              >
                {formatBlogDate(post.publishedDate, post.language)}
              </time>
            </div>
          </div>

          <Link
            href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
            locale={post.language}
            className="blog-featured-cta"
          >
            {readMoreText}
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
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
        </div>
      </div>
    </section>
  )
}
