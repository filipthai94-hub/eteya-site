/**
 * BlogPostCard — ChainGPT rect-style card.
 * Order: Date (mono) → Image (corner-brackets) → Title → Author byline (mono)
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { BlogPostSummary } from '@/lib/blog/types'
import { getAuthorName, getAuthorImage } from '@/lib/blog/format'

interface BlogPostCardProps {
  post: BlogPostSummary
  variant?: 'standard' | 'featured'
}

function formatMonoDate(iso: string, locale: 'sv' | 'en'): string {
  const date = new Date(iso)
  if (locale === 'sv') {
    const months = ['JANUARI', 'FEBRUARI', 'MARS', 'APRIL', 'MAJ', 'JUNI', 'JULI', 'AUGUSTI', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DECEMBER']
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const byPrefix = post.language === 'sv' ? 'AV' : 'BY'

  return (
    <article className="blog-card-rect">
      {/* Date först, ovanför image */}
      <span className="blog-mono-meta blog-mono-meta-bullet">
        {formatMonoDate(post.publishedDate, post.language)}
      </span>

      {/* Image med corner-brackets */}
      <Link
        href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
        locale={post.language}
        className="blog-bracket-frame"
        aria-label={post.title}
      >
        <span className="blog-bracket-corners" aria-hidden="true" />
        <div className="blog-card-rect-image">
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </Link>

      {/* Title */}
      <h3 className="blog-card-rect-title">
        <Link
          href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
          locale={post.language}
        >
          {post.title}
        </Link>
      </h3>

      {/* Byline mono "BY FILIP THAI" */}
      <div className="blog-card-rect-byline">
        <Image
          src={getAuthorImage(post.author)}
          alt={getAuthorName(post.author)}
          width={24}
          height={24}
          className="blog-card-rect-byline-photo"
        />
        <span className="blog-mono-byline">
          <span className="blog-mono-byline-prefix">{byPrefix}</span>
          {getAuthorName(post.author).toUpperCase()}
        </span>
      </div>
    </article>
  )
}
