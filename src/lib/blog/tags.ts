/**
 * Tag-utilities — extraktion + normalisering av tags för filter-pages.
 */

import 'server-only'

import { getAllPostSummaries } from './posts'
import type { BlogLocale, BlogTag } from './types'

/** Normalisera tag → URL-säker slug */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diakritiska tecken
    .replace(/å|ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Visningsnamn för tag-slug — försöker matcha original tag-name från posts */
export async function getTagDisplayName(
  locale: BlogLocale,
  slug: string,
): Promise<string> {
  const all = await getAllPostSummaries(locale)
  for (const post of all) {
    for (const tag of post.tags) {
      if (slugifyTag(tag) === slug) return tag
    }
  }
  // Fallback: capitalize + replace dashes
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Hämta alla unika tags + count för tag-cloud */
export async function getAllTags(locale: BlogLocale): Promise<BlogTag[]> {
  const all = await getAllPostSummaries(locale)
  const tagMap = new Map<string, { name: string; count: number }>()

  for (const post of all) {
    for (const tag of post.tags) {
      const slug = slugifyTag(tag)
      const existing = tagMap.get(slug)
      if (existing) {
        existing.count += 1
      } else {
        tagMap.set(slug, { name: tag, count: 1 })
      }
    }
  }

  return Array.from(tagMap.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count) // populärast först
}
