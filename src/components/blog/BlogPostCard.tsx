/**
 * BlogPostCard — ChainGPT-stil simplified card.
 * Order: Image → Date → Title → Author photo + name.
 * Inga tags, inga descriptions på själva korten.
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { BlogPostSummary } from '@/lib/blog/types'
import {
  formatBlogDate,
  getAuthorName,
  getAuthorImage,
} from '@/lib/blog/format'

interface BlogPostCardProps {
  post: BlogPostSummary
  variant?: 'standard' | 'featured'
}

export default function BlogPostCard({
  post,
  variant = 'standard',
}: BlogPostCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <article className={`blog-card ${isFeatured ? 'blog-card-featured' : ''}`}>
      <Link
        href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
        locale={post.language}
        className="blog-card-image-wrap"
        aria-label={post.title}
      >
        <Image
          src={post.heroImage}
          alt={post.heroImageAlt}
          fill
          sizes={
            isFeatured
              ? '(max-width: 768px) 100vw, 90vw'
              : '(max-width: 768px) 100vw, 50vw'
          }
          className="blog-card-image"
          priority={isFeatured}
        />
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Date — först (ChainGPT-stil) */}
        <time dateTime={post.publishedDate} className="blog-card-date">
          {formatBlogDate(post.publishedDate, post.language)}
        </time>

        {/* Title — clean, no description below */}
        <h3 className="blog-card-title">
          <Link
            href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
            locale={post.language}
          >
            {post.title}
          </Link>
        </h3>

        {/* Author — photo + name only */}
        <div className="blog-card-meta">
          <Image
            src={getAuthorImage(post.author)}
            alt={getAuthorName(post.author)}
            width={isFeatured ? 32 : 28}
            height={isFeatured ? 32 : 28}
            className="blog-card-meta-photo"
          />
          <div className="blog-card-meta-info">
            <strong>{getAuthorName(post.author)}</strong>
          </div>
        </div>
      </div>
    </article>
  )
}
