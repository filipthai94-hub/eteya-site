import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Nav from '@/components/layout/Nav'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import BlogPostCard from '@/components/blog/BlogPostCard'
import { getAllPostSummaries, getPostsByTag } from '@/lib/blog/posts'
import { getAllTags, getTagDisplayName, slugifyTag } from '@/lib/blog/tags'
import {
  JsonLd,
  buildGraph,
  createCollectionPageSchema,
  createBreadcrumbSchema,
} from '@/components/JsonLd'
import type { BlogLocale } from '@/lib/blog/types'

const BASE_URL = 'https://eteya.ai'

export async function generateStaticParams() {
  const params: Array<{ locale: string; tag: string }> = []
  for (const locale of routing.locales) {
    const tags = await getAllTags(locale as BlogLocale)
    for (const tag of tags) {
      params.push({ locale, tag: tag.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>
}): Promise<Metadata> {
  const { locale, tag } = await params
  const blogLocale = locale as BlogLocale
  const tagName = await getTagDisplayName(blogLocale, tag)
  const t = await getTranslations({ locale, namespace: 'blog.tag' })

  const path = locale === 'sv' ? `/sv/blogg/tag/${tag}` : `/en/blog/tag/${tag}`

  return {
    title: t('metaTitle', { tag: tagName }),
    description: t('metaDescription', { tag: tagName }),
    alternates: { canonical: `${BASE_URL}${path}` },
    openGraph: {
      title: t('metaTitle', { tag: tagName }),
      description: t('metaDescription', { tag: tagName }),
      url: `${BASE_URL}${path}`,
      siteName: 'Eteya',
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
  }
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>
}) {
  const { locale, tag } = await params
  const blogLocale = locale as BlogLocale
  const t = await getTranslations({ locale, namespace: 'blog.tag' })

  const tagName = await getTagDisplayName(blogLocale, tag)

  // Filtrera posts via tag — använder slug-jämförelse för att matcha både
  // exakt tag-string och slug-form
  const all = await getAllPostSummaries(blogLocale)
  const posts = all.filter((p) =>
    p.tags.some((t) => slugifyTag(t) === tag),
  )

  if (posts.length === 0) {
    // Inga posts med denna tag — 404 (slugs som finns har posts via generateStaticParams)
    notFound()
  }

  // Schema
  const path = locale === 'sv' ? `/sv/blogg/tag/${tag}` : `/en/blog/tag/${tag}`
  const homePath = `/${locale}`
  const blogPath = locale === 'sv' ? '/sv/blogg' : '/en/blog'
  const inLanguage = locale === 'sv' ? 'sv-SE' : 'en-US'

  const collectionSchema = createCollectionPageSchema({
    path,
    name: t('heading', { tag: tagName }),
    description: t('metaDescription', { tag: tagName }),
    inLanguage,
    items: posts.map((p) => ({
      path: locale === 'sv' ? `/sv/blogg/${p.slug}` : `/en/blog/${p.slug}`,
      name: p.title,
    })),
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'Blogg' : 'Blog', path: blogPath },
    { name: tagName, path },
  ])

  const subheadingKey = posts.length === 1 ? 'subheadingOne' : 'subheading'

  return (
    <>
      <JsonLd data={buildGraph([collectionSchema, breadcrumbSchema])} />
      <Nav />
      <div className="page-content">
        <main className="bg-et-bg text-white min-h-screen">
          <header className="border-b border-et-border">
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
              <span className="inline-block text-xs uppercase tracking-[0.2em] font-medium text-eteya-yellow mb-4">
                {t('breadcrumb')}
              </span>
              <h1 className="font-[family-name:var(--font-display,DM_Sans)] text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-4">
                {t('heading', { tag: tagName })}
              </h1>
              <p className="text-lg text-white/70">
                {t(subheadingKey, { count: posts.length })}
              </p>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </main>
        <FooterCTAClient />
      </div>
    </>
  )
}
