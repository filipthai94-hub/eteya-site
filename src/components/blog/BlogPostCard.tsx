/**
 * BlogPostCard — magazine-style card med dedikerade .blog-card* CSS-klasser.
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { BlogPostSummary } from '@/lib/blog/types'
import {
  formatBlogDate,
  formatReadingTime,
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
              : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          }
          className="blog-card-image"
          priority={isFeatured}
        />
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {post.tags.length > 0 && (
          <div className="blog-card-tags">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="blog-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="blog-card-title">
          <Link
            href={{ pathname: '/blogg/[slug]', params: { slug: post.slug } }}
            locale={post.language}
          >
            {post.title}
          </Link>
        </h3>

        <p className="blog-card-desc">{post.description}</p>

        <div className="blog-card-meta">
          <Image
            src={getAuthorImage(post.author)}
            alt={getAuthorName(post.author)}
            width={isFeatured ? 36 : 28}
            height={isFeatured ? 36 : 28}
            className="blog-card-meta-photo"
          />
          <div className="blog-card-meta-info">
            <strong>{getAuthorName(post.author)}</strong>
            <span className="blog-card-meta-sep" aria-hidden="true">·</span>
            <time dateTime={post.publishedDate}>
              {formatBlogDate(post.publishedDate, post.language)}
            </time>
            <span className="blog-card-meta-sep" aria-hidden="true">·</span>
            <span>{formatReadingTime(post.readingTime, post.language)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
