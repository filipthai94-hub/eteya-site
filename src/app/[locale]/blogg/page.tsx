import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Nav from '@/components/layout/Nav'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import BlogPostCard from '@/components/blog/BlogPostCard'
import BlogHero from '@/components/blog/BlogHero'
import BlogFeaturedHero from '@/components/blog/BlogFeaturedHero'
import BlogFilterBar from '@/components/blog/BlogFilterBar'
import {
  getAllPostSummaries,
  getFeaturedPost,
} from '@/lib/blog/posts'
import { getAllTags } from '@/lib/blog/tags'
import {
  JsonLd,
  buildGraph,
  createCollectionPageSchema,
  createBreadcrumbSchema,
} from '@/components/JsonLd'
import type { BlogLocale } from '@/lib/blog/types'

const BASE_URL = 'https://eteya.ai'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog.meta' })

  const svPath = '/sv/blogg'
  const enPath = '/en/blog'
  const currentPath = locale === 'sv' ? svPath : enPath

  return {
    title: t('listingTitle'),
    description: t('listingDescription'),
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
        'x-default': `${BASE_URL}${svPath}`,
      },
    },
    openGraph: {
      title: t('listingTitle'),
      description: t('listingDescription'),
      url: `${BASE_URL}${currentPath}`,
      siteName: 'Eteya',
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('listingTitle'),
      description: t('listingDescription'),
    },
  }
}

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const blogLocale = locale as BlogLocale
  const t = await getTranslations({ locale, namespace: 'blog' })

  const allPosts = await getAllPostSummaries(blogLocale)
  const featuredPost = await getFeaturedPost(blogLocale)
  const tags = await getAllTags(blogLocale)

  // Filtrera bort featured från grid (visas separat)
  const otherPosts = featuredPost
    ? allPosts.filter((p) => p.slug !== featuredPost.slug)
    : allPosts

  // Schema
  const path = locale === 'sv' ? '/sv/blogg' : '/en/blog'
  const homePath = `/${locale}`
  const inLanguage = locale === 'sv' ? 'sv-SE' : 'en-US'

  const collectionSchema = createCollectionPageSchema({
    path,
    name: t('meta.listingTitle'),
    description: t('meta.listingDescription'),
    inLanguage,
    items: allPosts.map((p) => ({
      path: `${path}/${p.slug}`,
      name: p.title,
    })),
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: t('listing.breadcrumb'), path },
  ])

  return (
    <>
      <JsonLd data={buildGraph([collectionSchema, breadcrumbSchema])} />
      <Nav />
      <div className="page-content">
        <main className="blog-page">
          {allPosts.length === 0 ? (
            <div className="blog-section-with-label" style={{ textAlign: 'center', padding: '8rem 1.5rem' }}>
              <h2 className="blog-grid-section-title" style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>
                {t('listing.emptyTitle')}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '28rem', margin: '0 auto', fontSize: '1.125rem', lineHeight: 1.6 }}>
                {t('listing.emptyBody')}
              </p>
            </div>
          ) : (
            <>
              {/* HERO SECTION — magazine intro med eyebrow + title + tagline + stats */}
              <BlogHero
                locale={blogLocale}
                articleCount={allPosts.length}
                latestUpdate={allPosts[0]?.publishedDate}
              />

              {/* FEATURED HERO — ChainGPT-stil med side-label "LATEST" + corner-brackets */}
              {featuredPost && <BlogFeaturedHero post={featuredPost} />}

              {/* CATEGORIES section — side-label + rect-pills */}
              <BlogFilterBar tags={tags} />

              {/* GRID — 2-col med corner-brackets på cards */}
              {otherPosts.length > 0 && (
                <section
                  aria-label={t('listing.allLabel')}
                  className="blog-section-with-label"
                >
                  <div className="blog-section-label-col">
                    <span className="blog-side-label">
                      {locale === 'sv' ? 'ARTIKLAR' : 'ARTICLES'}
                    </span>
                  </div>
                  <div className="blog-grid-rect">
                    {otherPosts.map((post) => (
                      <BlogPostCard key={post.slug} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
        <FooterCTAClient />
      </div>
    </>
  )
}
