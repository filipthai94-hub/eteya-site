/**
 * BlogArticleHero — top-section av en blog-artikel.
 *
 * Innehåller: kategori-tag, title, description, author + meta + reading-time, hero-image.
 * Server component.
 */

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { BlogPost } from '@/lib/blog/types'
import {
  formatBlogDate,
  formatReadingTime,
  getAuthorName,
  getAuthorImage,
  getAuthorPath,
} from '@/lib/blog/format'
import { slugifyTag } from '@/lib/blog/tags'

interface BlogArticleHeroProps {
  post: BlogPost
}

export default function BlogArticleHero({ post }: BlogArticleHeroProps) {
  return (
    <header className="relative">
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-12">
        {/* Tags-rad */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={{
                  pathname: '/blogg/tag/[tag]',
                  params: { tag: slugifyTag(tag) },
                }}
                locale={post.language}
                className="text-xs uppercase tracking-wider font-medium text-eteya-yellow/90 px-3 py-1.5 bg-eteya-yellow/10 rounded-full hover:bg-eteya-yellow/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-[family-name:var(--font-display,DM_Sans)] text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 leading-[1.1]">
          {post.title}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-3xl">
          {post.description}
        </p>

        {/* Author + meta-rad */}
        <div className="flex items-center gap-4 text-sm text-white/60 border-t border-et-border pt-6">
          <Link
            href={{
              pathname: '/blogg/forfattare/[author]',
              params: { author: post.author },
            }}
            locale={post.language}
            className="flex items-center gap-3 hover:text-white transition-colors"
          >
            <Image
              src={getAuthorImage(post.author)}
              alt={getAuthorName(post.author)}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="font-medium text-white">
              {getAuthorName(post.author)}
            </span>
          </Link>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedDate}>
            {formatBlogDate(post.publishedDate, post.language)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{formatReadingTime(post.readingTime, post.language)}</span>
        </div>
      </div>

      {/* Hero image — full bredd, max 1200px */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-et-surface">
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  )
}
