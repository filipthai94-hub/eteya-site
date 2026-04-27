/**
 * Blog-utilities — server-only filsystem-läsning av MDX-artiklar.
 *
 * Path: /content/blog/{locale}/{slug}.mdx
 *
 * Användning från Server Components:
 *   const posts = await getAllPosts('sv')
 *   const post = await getPostBySlug('sv', 'ai-telefonist-restaurang')
 *
 * Säkerhet: import 'server-only' garanterar att fs-anrop aldrig hamnar i client bundle.
 */

import 'server-only'

import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type {
  BlogFrontmatter,
  BlogLocale,
  BlogPost,
  BlogPostSummary,
} from './types'

/** Absolute path till content-mapp för given locale */
function getContentDir(locale: BlogLocale): string {
  return path.join(process.cwd(), 'content', 'blog', locale)
}

/** Lista alla .mdx-filer för given locale */
async function listMdxFiles(locale: BlogLocale): Promise<string[]> {
  const dir = getContentDir(locale)
  try {
    const files = await fs.readdir(dir)
    return files.filter((f) => f.endsWith('.mdx'))
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw err
  }
}

/** Validera att frontmatter har alla required fält */
function validateFrontmatter(
  fm: { [key: string]: unknown },
  filename: string,
): asserts fm is BlogFrontmatter & { [key: string]: unknown } {
  const required = [
    'title',
    'description',
    'publishedDate',
    'author',
    'tags',
    'heroImage',
    'heroImageAlt',
  ]
  for (const key of required) {
    if (!(key in fm) || fm[key] === undefined || fm[key] === null) {
      throw new Error(
        `Blog post ${filename} saknar required frontmatter-fält: "${key}"`,
      )
    }
  }
  if (!Array.isArray(fm.tags)) {
    throw new Error(`Blog post ${filename}: "tags" måste vara en array`)
  }
  if (!['filip', 'agit'].includes(fm.author as string)) {
    throw new Error(
      `Blog post ${filename}: "author" måste vara 'filip' eller 'agit'`,
    )
  }
}

/** Konvertera filnamn → slug (utan .mdx) */
function filenameToSlug(filename: string): string {
  return filename.replace(/\.mdx$/, '')
}

/** Parse en enskild .mdx-fil till BlogPost */
async function parseMdxFile(
  locale: BlogLocale,
  filename: string,
): Promise<BlogPost> {
  const filepath = path.join(getContentDir(locale), filename)
  const raw = await fs.readFile(filepath, 'utf-8')
  const parsed = matter(raw)

  validateFrontmatter(parsed.data, filename)

  const slug = parsed.data.slug || filenameToSlug(filename)
  const stats = readingTime(parsed.content)

  return {
    ...parsed.data,
    slug,
    language: locale,
    content: parsed.content,
    readingTime: Math.max(1, Math.ceil(stats.minutes)),
    modifiedDate: parsed.data.modifiedDate || parsed.data.publishedDate,
    featured: parsed.data.featured ?? false,
  }
}

/** Hämta alla artiklar för given locale, sorterade nyast först */
export async function getAllPosts(locale: BlogLocale): Promise<BlogPost[]> {
  const files = await listMdxFiles(locale)
  const posts = await Promise.all(files.map((f) => parseMdxFile(locale, f)))
  return posts.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  )
}

/** Hämta artikel-summaries (utan content, för listing-pages) */
export async function getAllPostSummaries(
  locale: BlogLocale,
): Promise<BlogPostSummary[]> {
  const posts = await getAllPosts(locale)
  return posts.map(({ content, ...summary }) => {
    void content // unused — explicit discard för ESLint
    return summary
  })
}

/** Hämta single post by slug */
export async function getPostBySlug(
  locale: BlogLocale,
  slug: string,
): Promise<BlogPost | null> {
  const files = await listMdxFiles(locale)
  for (const f of files) {
    if (filenameToSlug(f) === slug) {
      return parseMdxFile(locale, f)
    }
  }
  // Fallback: kolla om någon post har slug-override i frontmatter
  const all = await getAllPosts(locale)
  return all.find((p) => p.slug === slug) ?? null
}

/** Filtrera posts efter tag */
export async function getPostsByTag(
  locale: BlogLocale,
  tag: string,
): Promise<BlogPostSummary[]> {
  const all = await getAllPostSummaries(locale)
  return all.filter((p) => p.tags.includes(tag))
}

/** Filtrera posts efter author */
export async function getPostsByAuthor(
  locale: BlogLocale,
  author: 'filip' | 'agit',
): Promise<BlogPostSummary[]> {
  const all = await getAllPostSummaries(locale)
  return all.filter((p) => p.author === author)
}

/** Hitta featured post för listing hero (en åt gången) */
export async function getFeaturedPost(
  locale: BlogLocale,
): Promise<BlogPostSummary | null> {
  const all = await getAllPostSummaries(locale)
  // Föredra explicit featured, fallback till nyast
  const explicitFeatured = all.find((p) => p.featured)
  return explicitFeatured ?? all[0] ?? null
}

/** Hitta related posts via overlapping tags (max 3, exkluderar nuvarande) */
export async function getRelatedPosts(
  locale: BlogLocale,
  currentSlug: string,
  tags: string[],
  limit = 3,
): Promise<BlogPostSummary[]> {
  const all = await getAllPostSummaries(locale)
  const candidates = all
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      post: p,
      overlap: p.tags.filter((t) => tags.includes(t)).length,
    }))
    .filter((c) => c.overlap > 0)
    .sort((a, b) => {
      // Sortera på overlap desc, sen datum desc
      if (b.overlap !== a.overlap) return b.overlap - a.overlap
      return (
        new Date(b.post.publishedDate).getTime() -
        new Date(a.post.publishedDate).getTime()
      )
    })
    .slice(0, limit)
    .map((c) => c.post)
  return candidates
}
