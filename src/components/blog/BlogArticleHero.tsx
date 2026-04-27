/**
 * BlogArticleHero — premium editorial article hero.
 *
 * Layout: top breadcrumb (mono back) → mono meta-row (date ● reading
 * time ● tag) → massive Barlow Condensed title → Geist lead-paragraph
 * → mono byline → hero image med corner-brackets.
 *
 * Konsekvent med listings editorial DNA:
 *   - Barlow Condensed för title (Eteya signature, samma som home/about)
 *   - JetBrains Mono för all meta (date, reading time, tag, byline)
 *   - Yellow används bara på bullet ● mellan meta-element
 *   - Corner-brackets på hero-bild (sharp corners, no border-radius)
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { BlogPost } from '@/lib/blog/types'
import { getAuthorName, getAuthorImage } from '@/lib/blog/format'

interface BlogArticleHeroProps {
  post: BlogPost
  url: string
}

/** Format datum till "27 APRIL, 2026" / "APRIL 27, 2026" mono-style */
function formatMonoDate(iso: string, locale: 'sv' | 'en'): string {
  const date = new Date(iso)
  if (locale === 'sv') {
    const months = [
      'JANUARI', 'FEBRUARI', 'MARS', 'APRIL', 'MAJ', 'JUNI',
      'JULI', 'AUGUSTI', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DECEMBER',
    ]
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
  }
  return date
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    .toUpperCase()
}

export default function BlogArticleHero({ post }: BlogArticleHeroProps) {
  const primaryTag = post.tags[0]
  const isSv = post.language === 'sv'
  const byPrefix = isSv ? 'AV' : 'BY'
  const backLabel = isSv ? 'TILLBAKA TILL BLOGG' : 'BACK TO BLOG'
  const minLabel = isSv ? 'MIN LÄSNING' : 'MIN READ'

  return (
    <header>
      {/* Top breadcrumb — mono uppercase, subtle */}
      <div className="blog-article-back-wrap">
        <Link
          href="/blogg"
          locale={post.language}
          className="blog-article-back"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M13 8H3M7 4L3 8l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {backLabel}
        </Link>
      </div>

      {/* TITLE BLOCK */}
      <div className="blog-article-title-block">
        {/* Mono meta-row: date ● reading time ● tag */}
        <div className="blog-article-meta-mono">
          <time dateTime={post.publishedDate}>
            {formatMonoDate(post.publishedDate, post.language)}
          </time>
          <span className="blog-article-meta-dot" aria-hidden="true">●</span>
          <span>{post.readingTime} {minLabel}</span>
          {primaryTag && (
            <>
              <span className="blog-article-meta-dot" aria-hidden="true">●</span>
              <span>{primaryTag.toUpperCase()}</span>
            </>
          )}
        </div>

        {/* Massive Eteya-signature title */}
        <h1 className="blog-article-title">{post.title}</h1>

        {/* Lead description */}
        <p className="blog-article-lead">{post.description}</p>

        {/* Mono byline matching listing pattern */}
        <Link
          href={{
            pathname: '/blogg/forfattare/[author]',
            params: { author: post.author },
          }}
          locale={post.language}
          className="blog-article-byline-link"
        >
          <Image
            src={getAuthorImage(post.author)}
            alt={getAuthorName(post.author)}
            width={36}
            height={36}
            className="blog-article-byline-photo"
          />
          <span className="blog-mono-byline">
            <span className="blog-mono-byline-prefix">{byPrefix}</span>
            {getAuthorName(post.author).toUpperCase()}
          </span>
        </Link>
      </div>

      {/* HERO IMAGE — corner-brackets, sharp corners */}
      <div className="blog-article-hero-image-wrap">
        <div className="blog-bracket-frame">
          <div className="blog-article-hero-image">
            <Image
              src={post.heroImage}
              alt={post.heroImageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  )
}
