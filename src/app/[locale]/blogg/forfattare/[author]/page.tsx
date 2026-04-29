import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Nav from '@/components/layout/Nav'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import BlogPostCard from '@/components/blog/BlogPostCard'
import { getPostsByAuthor } from '@/lib/blog/posts'
import {
  getAuthorName,
  getAuthorRole,
  getAuthorImage,
} from '@/lib/blog/format'
import {
  JsonLd,
  buildGraph,
  createCollectionPageSchema,
  createBreadcrumbSchema,
} from '@/components/JsonLd'
import type { BlogAuthor, BlogLocale } from '@/lib/blog/types'

const BASE_URL = 'https://eteya.ai'
const VALID_AUTHORS: BlogAuthor[] = ['filip', 'agit']

export function generateStaticParams() {
  const params: Array<{ locale: string; author: string }> = []
  for (const locale of routing.locales) {
    for (const author of VALID_AUTHORS) {
      params.push({ locale, author })
    }
  }
  return params
}

function isValidAuthor(s: string): s is BlogAuthor {
  return (VALID_AUTHORS as string[]).includes(s)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; author: string }>
}): Promise<Metadata> {
  const { locale, author } = await params
  if (!isValidAuthor(author)) return {}

  const t = await getTranslations({ locale, namespace: 'blog.author' })
  const name = getAuthorName(author)

  const path =
    locale === 'sv'
      ? `/sv/blogg/forfattare/${author}`
      : `/en/blog/author/${author}`

  return {
    title: t('metaTitle', { name }),
    description: t('metaDescription', { name }),
    alternates: { canonical: `${BASE_URL}${path}` },
  }
}

export default async function BlogAuthorPage({
  params,
}: {
  params: Promise<{ locale: string; author: string }>
}) {
  const { locale, author } = await params
  if (!isValidAuthor(author)) notFound()

  const blogLocale = locale as BlogLocale
  const t = await getTranslations({ locale, namespace: 'blog.author' })

  const posts = await getPostsByAuthor(blogLocale, author)
  const name = getAuthorName(author)

  const path =
    locale === 'sv'
      ? `/sv/blogg/forfattare/${author}`
      : `/en/blog/author/${author}`
  const homePath = `/${locale}`
  const blogPath = locale === 'sv' ? '/sv/blogg' : '/en/blog'
  const inLanguage = locale === 'sv' ? 'sv-SE' : 'en-US'

  const collectionSchema = createCollectionPageSchema({
    path,
    name: t('heading', { name }),
    description: t('metaDescription', { name }),
    inLanguage,
    items: posts.map((p) => ({
      path: locale === 'sv' ? `/sv/blogg/${p.slug}` : `/en/blog/${p.slug}`,
      name: p.title,
    })),
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'Blogg' : 'Blog', path: blogPath },
    { name, path },
  ])

  const subheadingKey = posts.length === 1 ? 'subheadingOne' : 'subheading'

  return (
    <>
      <JsonLd data={buildGraph([collectionSchema, breadcrumbSchema])} />
      <Nav />
      <div className="page-content">
        <main className="bg-et-bg text-white min-h-screen">
          <header className="border-b border-et-border">
            <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
              <Link
                href="/blogg"
                locale={blogLocale}
                className="inline-flex items-center text-sm text-white/60 hover:text-eteya-yellow transition-colors mb-8"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="mr-2"
                  aria-hidden="true"
                >
                  <path
                    d="M13 8H3M7 4L3 8l4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {locale === 'sv' ? 'Tillbaka till blogg' : 'Back to blog'}
              </Link>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <Image
                  src={getAuthorImage(author)}
                  alt={name}
                  width={140}
                  height={140}
                  className="rounded-2xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <span className="inline-block text-xs uppercase tracking-[0.2em] font-medium text-eteya-yellow mb-3">
                    {t('breadcrumb')}
                  </span>
                  <h1 className="font-[family-name:var(--font-display,DM_Sans)] text-4xl md:text-5xl font-medium tracking-tight text-white mb-2">
                    {name}
                  </h1>
                  <p className="text-lg text-white/70 mb-3">
                    {getAuthorRole(author, blogLocale)}
                  </p>
                  <p className="text-base text-white/60 mb-4">
                    {t(subheadingKey, { count: posts.length })}
                  </p>
                  <Link
                    href={author === 'filip' ? '/om-oss/filip' : '/om-oss/agit'}
                    locale={blogLocale}
                    className="text-sm text-eteya-yellow hover:underline"
                  >
                    {locale === 'sv' ? 'Läs full bio →' : 'Read full bio →'}
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
            {posts.length === 0 ? (
              <p className="text-white/70 text-center py-20">
                {t('noArticles')}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {posts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </main>
        <FooterCTAClient />
      </div>
    </>
  )
}
