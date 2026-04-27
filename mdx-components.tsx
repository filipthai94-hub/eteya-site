/**
 * MDX Components — global custom rendering för markdown-element i blog-artiklar.
 *
 * Denna fil KRÄVS av @next/mdx i App Router (Next.js 16 docs explicit).
 *
 * Mappar markdown → React-komponenter med Eteya-design (dark theme, brand colors).
 * Lokala overrides per sida möjliga via `<Article components={...} />`.
 */

import type { MDXComponents } from 'mdx/types'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

const components: MDXComponents = {
  // ── HEADINGS ────────────────────────────────────────
  // Eteya brand: DM Sans, vit, generös spacing. Tailwind typography prose-klassen
  // hanterar de flesta defaultsen — vi tweakar bara där det behövs.
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className="font-[family-name:var(--font-display,DM_Sans)] text-4xl md:text-5xl font-medium tracking-tight text-white mt-12 mb-6"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className="font-[family-name:var(--font-display,DM_Sans)] text-3xl md:text-4xl font-medium tracking-tight text-white mt-12 mb-4 scroll-mt-24"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className="font-[family-name:var(--font-display,DM_Sans)] text-2xl md:text-3xl font-medium tracking-tight text-white mt-10 mb-3 scroll-mt-24"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      className="text-xl md:text-2xl font-medium text-white mt-8 mb-3"
      {...props}
    />
  ),

  // ── PARAGRAPH + INLINE ──────────────────────────────
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="text-base md:text-lg leading-relaxed text-white/85 my-5" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<'em'>) => (
    <em className="italic text-white/90" {...props} />
  ),

  // ── LINKS ───────────────────────────────────────────
  // Internal links → next/Link (prefetching), external → vanlig <a> med target=_blank
  a: ({ href, children, ...rest }: ComponentPropsWithoutRef<'a'>) => {
    const isExternal = href?.startsWith('http')
    const linkClasses = 'text-eteya-yellow underline decoration-eteya-yellow/40 underline-offset-4 hover:decoration-eteya-yellow transition-colors'

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
          {...rest}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href || '#'} className={linkClasses} {...rest}>
        {children}
      </Link>
    )
  },

  // ── LISTS ───────────────────────────────────────────
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="list-disc list-outside pl-6 my-5 space-y-2 text-white/85 marker:text-eteya-yellow" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="list-decimal list-outside pl-6 my-5 space-y-2 text-white/85 marker:text-eteya-yellow marker:font-medium" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className="leading-relaxed text-base md:text-lg pl-2" {...props} />
  ),

  // ── BLOCKQUOTE ──────────────────────────────────────
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="border-l-4 border-eteya-yellow pl-6 my-8 italic text-xl md:text-2xl text-white/90 font-light"
      {...props}
    />
  ),

  // ── CODE ────────────────────────────────────────────
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-eteya-yellow"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="bg-black/40 border border-white/10 rounded-lg p-4 my-6 overflow-x-auto text-sm font-mono"
      {...props}
    />
  ),

  // ── TABLES (via remark-gfm) ─────────────────────────
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th className="border-b border-white/20 py-2 px-3 text-left font-semibold text-white" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td className="border-b border-white/10 py-2 px-3 text-white/85" {...props} />
  ),

  // ── HORIZONTAL RULE ─────────────────────────────────
  hr: (props: ComponentPropsWithoutRef<'hr'>) => (
    <hr className="border-white/10 my-12" {...props} />
  ),

  // ── IMAGES ──────────────────────────────────────────
  // Använder Next/Image för automatisk optimering (AVIF/WebP, lazy-loading,
  // responsive sizes). Authors skriver bara ![alt](path) i markdown.
  img: ({ src, alt, ...rest }: ComponentPropsWithoutRef<'img'>) => {
    if (!src || typeof src !== 'string') return null
    return (
      <span className="block my-8">
        <Image
          src={src}
          alt={alt || ''}
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
          className="rounded-lg w-full h-auto"
          {...(rest as Partial<ImageProps>)}
        />
        {alt && (
          <span className="block mt-2 text-sm text-white/60 text-center italic">
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
