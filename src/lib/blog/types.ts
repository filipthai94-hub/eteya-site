/**
 * BlogPost types — frontmatter + content för MDX-baserad blog.
 *
 * En artikel = en .mdx-fil i /content/blog/{locale}/{slug}.mdx med YAML
 * frontmatter på toppen + markdown/JSX content nedanför.
 */

export type BlogLocale = 'sv' | 'en'
export type BlogAuthor = 'filip' | 'agit'

/** Frontmatter parsed via gray-matter — råa fält från MDX */
export interface BlogFrontmatter {
  title: string
  description: string
  /** ISO-8601 datum, t.ex. '2026-04-27' */
  publishedDate: string
  /** ISO-8601 — när artikeln senast modifierades. Defaults till publishedDate */
  modifiedDate?: string
  author: BlogAuthor
  tags: string[]
  /** Path till hero-bild i /public/, t.ex. '/images/blog/foo-hero.webp' */
  heroImage: string
  heroImageAlt: string
  /** Featured-flagga för listing-page (en featured åt gången, latest med flagga) */
  featured?: boolean
  /** Slug för andra språkets version (för hreflang-linking) */
  relatedSlug?: string
  /** Override slug om filename inte ska matcha URL */
  slug?: string
  /** Visa "NÄSTA STEG" CTA-block i slutet av artikeln. Default false —
   *  CTA används bara på artiklar där det är ett naturligt nästa steg
   *  (case-studies, how-to-guider där boka-strategimöte gör mening).
   *  Sätts till true i frontmatter på de artiklar som ska ha CTA. */
  showCta?: boolean
}

/** Komplett post efter berikning av utilities */
export interface BlogPost extends BlogFrontmatter {
  /** URL-slug — auto från filename eller frontmatter override */
  slug: string
  /** Locale — auto från mapp-struktur */
  language: BlogLocale
  /** Artikel-innehåll som MDX-string (ej kompilerad — kompileras at render) */
  content: string
  /** Reading-time i minuter, auto-räknat */
  readingTime: number
  /** modifiedDate med fallback till publishedDate */
  modifiedDate: string
}

/** Listing-summary (utan full content för performance) */
export type BlogPostSummary = Omit<BlogPost, 'content'>

/** Tag med count för tag-cloud */
export interface BlogTag {
  /** Tag-slug t.ex. 'ai-telefonist' */
  slug: string
  /** Visat namn t.ex. 'AI-telefonist' */
  name: string
  /** Antal artiklar med denna tag */
  count: number
}
