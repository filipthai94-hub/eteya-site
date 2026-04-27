/**
 * RSS feed för Eteya Blogg.
 *
 * Innehåller senaste 20 artiklar från BÅDA språk (sv + en) med
 * dc:language-tag per item så feed-readers kan filtrera.
 *
 * URL: https://eteya.ai/rss.xml
 *
 * Best practice: <link rel="alternate" type="application/rss+xml"> i layout
 * head så browsers + feed-readers auto-discoverar.
 */

import { getAllPostSummaries } from '@/lib/blog/posts'
import { getAuthorName } from '@/lib/blog/format'
import type { BlogPostSummary } from '@/lib/blog/types'

const BASE_URL = 'https://eteya.ai'
const SITE_NAME = 'Eteya Blogg'
const SITE_DESCRIPTION =
  'Insights om AI-agenter, automation och case-studies från Eteya — svensk AI-byrå.'

/** XML-escape för text-content */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildItemXml(post: BlogPostSummary): string {
  const localePath = post.language === 'sv' ? '/sv/blogg' : '/en/blog'
  const url = `${BASE_URL}${localePath}/${post.slug}`
  const pubDate = new Date(post.publishedDate).toUTCString()
  const langTag = post.language === 'sv' ? 'sv-SE' : 'en-US'
  const author = getAuthorName(post.author)

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(author)}</dc:creator>
      <dc:language>${langTag}</dc:language>
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('\n      ')}
      <enclosure url="${BASE_URL}${post.heroImage}" type="image/webp" length="0" />
    </item>`
}

export async function GET() {
  const sv = await getAllPostSummaries('sv')
  const en = await getAllPostSummaries('en')

  // Slå ihop, sortera datum desc, ta senaste 20
  const all = [...sv, ...en]
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime(),
    )
    .slice(0, 20)

  const lastBuild = new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${BASE_URL}/sv/blogg</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>sv-SE</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${all.map(buildItemXml).join('\n')}
  </channel>
</rss>
`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Cache 1 timme på CDN, revalidera i bakgrund
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
