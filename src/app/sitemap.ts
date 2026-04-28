import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog/posts'
import { getAllTags } from '@/lib/blog/tags'
import type { BlogAuthor } from '@/lib/blog/types'

/**
 * Sitemap.xml för Eteya — research-grundad mot Google Search Central + Next.js 16:
 *
 *   - Bara canonical URLs (Google: "include URLs you want in search results")
 *   - INGEN priority/changefreq — Google ignorerar dem ("Google ignores
 *     <priority> and <changefreq> values" — Search Central docs)
 *   - lastModified: ISO 8601, från post.modifiedDate när det finns
 *   - hreflang via alternates.languages (Next.js 16 docs visar pattern)
 *   - Genererar dynamiskt från MDX-filer + tag/author-collections
 *
 * Routes som inkluderas:
 *   - Statiska sidor (hem, om-oss, kontakt, kundcase, policies)
 *   - Blog listing (sv/en)
 *   - Alla MDX-artiklar (med relatedSlug → alternates.languages när det finns)
 *   - Tag-pages (per locale)
 *   - Author-pages (per locale)
 */

const BASE_URL = 'https://eteya.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ─── STATISKA SIDOR ───────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      alternates: {
        languages: { en: `${BASE_URL}/en`, sv: `${BASE_URL}/sv` },
      },
    },
    {
      url: `${BASE_URL}/sv/om-oss`,
      lastModified: now,
      alternates: {
        languages: { en: `${BASE_URL}/en/about`, sv: `${BASE_URL}/sv/om-oss` },
      },
    },
    {
      url: `${BASE_URL}/sv/om-oss/filip`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/about/filip`,
          sv: `${BASE_URL}/sv/om-oss/filip`,
        },
      },
    },
    {
      url: `${BASE_URL}/sv/om-oss/agit`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/about/agit`,
          sv: `${BASE_URL}/sv/om-oss/agit`,
        },
      },
    },
    {
      url: `${BASE_URL}/sv/kontakt`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/contact`,
          sv: `${BASE_URL}/sv/kontakt`,
        },
      },
    },
    {
      url: `${BASE_URL}/sv/ai-besparing`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/ai-savings`,
          sv: `${BASE_URL}/sv/ai-besparing`,
        },
      },
    },
    {
      url: `${BASE_URL}/sv/kundcase`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/case-studies`,
          sv: `${BASE_URL}/sv/kundcase`,
        },
      },
    },
    // Individuella kundcase
    {
      url: `${BASE_URL}/sv/kundcase/telestore`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/case-studies/telestore`,
          sv: `${BASE_URL}/sv/kundcase/telestore`,
        },
      },
    },
    {
      url: `${BASE_URL}/sv/kundcase/nordicrank`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/case-studies/nordicrank`,
          sv: `${BASE_URL}/sv/kundcase/nordicrank`,
        },
      },
    },
    {
      url: `${BASE_URL}/sv/kundcase/sannegarden`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/case-studies/sannegarden`,
          sv: `${BASE_URL}/sv/kundcase/sannegarden`,
        },
      },
    },
    {
      url: `${BASE_URL}/sv/kundcase/skg-stockholm`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/case-studies/skg-stockholm`,
          sv: `${BASE_URL}/sv/kundcase/skg-stockholm`,
        },
      },
    },
    {
      url: `${BASE_URL}/sv/kundcase/trainwithalbert`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/case-studies/trainwithalbert`,
          sv: `${BASE_URL}/sv/kundcase/trainwithalbert`,
        },
      },
    },
    // Policies — korrigerade paths (var integritetspolicy/villkor → 404)
    {
      url: `${BASE_URL}/sv/privacy-policy`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/privacy-policy`,
          sv: `${BASE_URL}/sv/privacy-policy`,
        },
      },
    },
    {
      url: `${BASE_URL}/sv/terms`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/terms`,
          sv: `${BASE_URL}/sv/terms`,
        },
      },
    },
  ]

  // ─── BLOG LISTING (per locale) ────────────────────────────────────
  const blogListings: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/sv/blogg`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/blog`,
          sv: `${BASE_URL}/sv/blogg`,
        },
      },
    },
  ]

  // ─── BLOG ARTIKLAR (genererat från MDX) ───────────────────────────
  const [svPosts, enPosts] = await Promise.all([
    getAllPosts('sv'),
    getAllPosts('en'),
  ])

  const blogArticles: MetadataRoute.Sitemap = [
    ...svPosts.map((post) => {
      const svUrl = `${BASE_URL}/sv/blogg/${post.slug}`
      const languages: Record<string, string> = { sv: svUrl }
      if (post.relatedSlug) {
        languages.en = `${BASE_URL}/en/blog/${post.relatedSlug}`
      }
      return {
        url: svUrl,
        lastModified: new Date(post.modifiedDate),
        alternates: { languages },
      }
    }),
    ...enPosts.map((post) => {
      const enUrl = `${BASE_URL}/en/blog/${post.slug}`
      const languages: Record<string, string> = { en: enUrl }
      if (post.relatedSlug) {
        languages.sv = `${BASE_URL}/sv/blogg/${post.relatedSlug}`
      }
      return {
        url: enUrl,
        lastModified: new Date(post.modifiedDate),
        alternates: { languages },
      }
    }),
  ]

  // ─── TAG-PAGES (per locale) ───────────────────────────────────────
  const [svTags, enTags] = await Promise.all([
    getAllTags('sv'),
    getAllTags('en'),
  ])

  const tagPages: MetadataRoute.Sitemap = [
    ...svTags.map((tag) => ({
      url: `${BASE_URL}/sv/blogg/tag/${tag.slug}`,
      lastModified: now,
    })),
    ...enTags.map((tag) => ({
      url: `${BASE_URL}/en/blog/tag/${tag.slug}`,
      lastModified: now,
    })),
  ]

  // ─── AUTHOR-PAGES (per locale, för alla författare) ───────────────
  const authors: BlogAuthor[] = ['filip', 'agit']
  const authorPages: MetadataRoute.Sitemap = authors.flatMap((author) => [
    {
      url: `${BASE_URL}/sv/blogg/forfattare/${author}`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/blog/author/${author}`,
          sv: `${BASE_URL}/sv/blogg/forfattare/${author}`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/blog/author/${author}`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/blog/author/${author}`,
          sv: `${BASE_URL}/sv/blogg/forfattare/${author}`,
        },
      },
    },
  ])

  return [
    ...staticPages,
    ...blogListings,
    ...blogArticles,
    ...tagPages,
    ...authorPages,
  ]
}
