/**
 * MDX Components — minimal passthrough.
 *
 * All blog-prose-styling sker via .prose-blog CSS-class i globals.css.
 * Vi overridear bara <img> för Next/Image-optimering och custom <a> för
 * intern länk-routing via Next/Link.
 *
 * Denna fil KRÄVS av @next/mdx i App Router.
 */

import type { MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

const components: MDXComponents = {
  // Custom <a> — internal links → next/Link, external → vanlig <a> med target="_blank"
  a: ({ href, children, ...rest }: ComponentPropsWithoutRef<'a'>) => {
    const isExternal = href?.startsWith('http')

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href || '#'} {...rest}>
        {children}
      </Link>
    )
  },

  // Custom <img> — Next/Image med automatisk optimering (AVIF/WebP, lazy-load)
  img: ({ src, alt, ...rest }: ComponentPropsWithoutRef<'img'>) => {
    if (!src || typeof src !== 'string') return null
    return (
      <span className="block my-8">
        <Image
          src={src}
          alt={alt || ''}
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 720px"
          className="rounded-xl w-full h-auto"
          {...(rest as Partial<ImageProps>)}
        />
        {alt && (
          <span className="block mt-2 text-sm text-white/55 text-center italic">
            {alt}
          </span>
        )}
      </span>
    )
  },
}

export function useMDXComponents(): MDXComponents {
  return components
}
