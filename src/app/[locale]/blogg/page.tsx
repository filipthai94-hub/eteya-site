import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Nav from '@/components/layout/Nav'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import BlogPostCard from '@/components/blog/BlogPostCard'
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
import { Link } from '@/i18n/navigation'

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

  // Filtrera bort featured från huvudgrid (visas separat)
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
        <main className="bg-et-bg text-white min-h-screen">
          {/* Hero header */}
          <header className="relative overflow-hidden border-b border-et-border">
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
              <span className="inline-block text-xs uppercase tracking-[0.2em] font-medium text-eteya-yellow mb-4">
                {t('listing.kicker')}
              </span>
              <h1 className="font-[family-name:var(--font-display,DM_Sans)] text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6 max-w-4xl">
                {t('listing.heading')}
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
                {t('listing.subheading')}
              </p>
            </div>
            {/* Subtil bottom-gradient */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-eteya-yellow/30 to-transparent" />
          </header>

          <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
            {allPosts.length === 0 ? (
              // Empty state — visas innan första artikeln publicerats
              <div className="text-center py-20">
                <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                  {t('listing.emptyTitle')}
                </h2>
                <p className="text-white/70 max-w-md mx-auto">
                  {t('listing.emptyBody')}
                </p>
              </div>
            ) : (
              <>
                {/* Featured post — full bredd */}
                {featuredPost && (
                  <section className="mb-16" aria-label={t('listing.featuredLabel')}>
                    <span className="inline-block text-xs uppercase tracking-wider font-medium text-eteya-yellow mb-4">
                      {t('listing.featuredLabel')}
                    </span>
                    <BlogPostCard post={featuredPost} variant="featured" />
                  </section>
                )}

                {/* Övriga posts — grid */}
                {otherPosts.length > 0 && (
                  <section aria-label={t('listing.allLabel')}>
                    <h2 className="text-2xl md:text-3xl font-medium text-white mb-8">
                      {featuredPost
                        ? t('listing.moreLabel')
                        : t('listing.allLabel')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {otherPosts.map((post) => (
                        <BlogPostCard key={post.slug} post={post} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Tag-cloud sidebar (mobile/tablet på botten, desktop kunde vara sticky-side senare) */}
                {tags.length > 0 && (
                  <section
                    className="mt-20 pt-12 border-t border-et-border"
                    aria-label={t('listing.tagsLabel')}
                  >
                    <h2 className="text-2xl font-medium text-white mb-6">
                      {t('listing.tagsLabel')}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {tags.map((tag) => (
                        <Link
                          key={tag.slug}
                          href={{
                            pathname: '/blogg/tag/[tag]',
                            params: { tag: tag.slug },
                          }}
                          locale={blogLocale}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-et-surface border border-et-border rounded-full text-sm text-white/80 hover:border-eteya-yellow/50 hover:text-eteya-yellow transition-colors"
                        >
                          {tag.name}
                          <span className="text-xs text-white/40">{tag.count}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </main>
        <FooterCTAClient />
      </div>
    </>
  )
}
