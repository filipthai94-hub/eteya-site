/**
 * BlogFeaturedHero — ChainGPT-stil asymmetric hero med corner-brackets.
 *
 * Layout:
 *   Side-label "LATEST" | Text-content | Image med corner-brackets
 *
 * Eteya DNA-anpassningar:
 *   - Mono meta-text (date, byline) i JetBrains Mono
 *   - Yellow corner-brackets på image (signature)
 *   - Title bibehåller Barlow Wide för Eteya-feel
 *   - Subtle blueprint-grid syns i bakgrunden via .blog-page
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { BlogPostSummary } from '@/lib/blog/types'
import { formatBlogDate, getAuthorName, getAuthorImage } from '@/lib/blog/format'

interface BlogFeaturedHeroProps {
  post: BlogPostSummary
}

/** Format datum till "APRIL 27, 2026" mono-style */
function formatMonoDate(iso: string, locale: 'sv' | 'en'): string {
  const date = new Date(iso)
  if (locale === 'sv') {
    // Svenska: "27 APRIL, 2026"
    const months = ['JANUARI', 'FEBRUARI', 'MARS', 'APRIL', 'MAJ', 'JUNI', 'JULI', 'AUGUSTI', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DECEMBER']
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()
}

export default function BlogFeaturedHero({ post }: BlogFeaturedHeroProps) {
  const sectionLabel = post.language === 'sv' ? 'SENASTE' : 'LATEST'
  const byPrefix = post.language === 'sv' ? 'AV' : 'BY'
  // formatBlogDate fortfarande för screen-reader/datetime; mono visar formatMonoDate
  void formatBlogDate

  return (
    <section className="blog-section-with-label" aria-label="Featured article">
      {/* Side-label (vänster på desktop) */}
      <div className="blog-section-label-col">
        <span className="blog-side-label">{sectionLabel}</span>
      </div>

      {/* Hero-content: text + image grid */}
      <div className="blog-hero-chaingpt">
        {/* Text-sida (vänster på desktop) */}
        <div className="blog-hero-chaingpt-text">
          <span className="blog-mono-meta blog-mono-meta-bullet">
            {formatMonoDate(post.publishedDate, post.language)}
          </span>

          <h2 className="blog-hero-chaingpt-title">
            <Link
              href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
              locale={post.language}
            >
              {post.title}
            </Link>
          </h2>

          <div className="blog-hero-chaingpt-byline">
            <Image
              src={getAuthorImage(post.author)}
              alt={getAuthorName(post.author)}
              width={32}
              height={32}
              className="blog-hero-chaingpt-byline-photo"
            />
            <span className="blog-mono-byline">
              <span className="blog-mono-byline-prefix">{byPrefix}</span>
              {getAuthorName(post.author).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Image-sida (höger på desktop) — med corner-brackets */}
        <Link
          href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
          locale={post.language}
          className="blog-bracket-frame"
          aria-label={post.title}
        >
          <span className="blog-bracket-corners" aria-hidden="true" />
          <div className="blog-hero-chaingpt-image">
            <Image
              src={post.heroImage}
              alt={post.heroImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </Link>
      </div>
    </section>
  )
}
