/**
 * BlogArticleHero — magazine-style title-first article hero.
 * Använder dedikerade .blog-article-* CSS-klasser.
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { BlogPost } from '@/lib/blog/types'
import {
  formatBlogDate,
  formatReadingTime,
  getAuthorName,
  getAuthorImage,
} from '@/lib/blog/format'
import BlogShareButtons from './BlogShareButtons'

interface BlogArticleHeroProps {
  post: BlogPost
  url: string
}

export default function BlogArticleHero({
  post,
  url,
}: BlogArticleHeroProps) {
  const primaryTag = post.tags[0]

  return (
    <header>
      {/* Breadcrumb */}
      <div className="blog-article-breadcrumb-wrap">
        <Link
          href="/blogg"
          locale={post.language}
          className="blog-article-breadcrumb"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M13 8H3M7 4L3 8l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {post.language === 'sv' ? 'Tillbaka till blogg' : 'Back to blog'}
        </Link>
      </div>

      {/* TITLE BLOCK — 720px max */}
      <div className="blog-article-title-block">
        {primaryTag && (
          <span className="blog-article-kicker">{primaryTag}</span>
        )}

        <h1 className="blog-article-title">{post.title}</h1>

        <p className="blog-article-desc">{post.description}</p>

        <hr className="blog-article-divider" />

        <div className="blog-article-meta-row">
          <Link
            href={{
              pathname: '/blogg/forfattare/[author]',
              params: { author: post.author },
            }}
            locale={post.language}
            className="blog-article-author-link"
          >
            <Image
              src={getAuthorImage(post.author)}
              alt={getAuthorName(post.author)}
              width={36}
              height={36}
            />
            <div className="blog-article-author-info">
              <span className="blog-article-author-name">
                {getAuthorName(post.author)}
              </span>
              <span aria-hidden="true" className="sep">·</span>
              <time dateTime={post.publishedDate}>
                {formatBlogDate(post.publishedDate, post.language)}
              </time>
              <span aria-hidden="true" className="sep">·</span>
              <span>
                {formatReadingTime(post.readingTime, post.language)}
              </span>
            </div>
          </Link>

          <div style={{ flexShrink: 0 }}>
            <BlogShareButtons url={url} title={post.title} compact />
          </div>
        </div>
      </div>

      {/* HERO IMAGE — full container */}
      <div className="blog-article-hero-image-wrap">
        <div className="blog-article-hero-image">
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>
    </header>
  )
}
