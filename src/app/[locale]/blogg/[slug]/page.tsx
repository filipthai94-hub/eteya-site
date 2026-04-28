import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Nav from '@/components/layout/Nav'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import BlogArticleHero from '@/components/blog/BlogArticleHero'
import BlogAuthorBio from '@/components/blog/BlogAuthorBio'
import BlogCTABlock from '@/components/blog/BlogCTABlock'
import BlogRelatedArticles from '@/components/blog/BlogRelatedArticles'
import NewsletterSignup from '@/components/blog/NewsletterSignup'
import ReadingProgressBar from '@/components/blog/ReadingProgressBar'
import FloatingShareSidebar from '@/components/blog/FloatingShareSidebar'
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from '@/lib/blog/posts'
import {
  JsonLd,
  buildGraph,
  createArticleSchema,
  createBreadcrumbSchema,
} from '@/components/JsonLd'
import type { BlogLocale } from '@/lib/blog/types'

const BASE_URL = 'https://eteya.ai'

/** SSG: pre-renderera alla locale × slug-kombinationer */
export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = []
  for (const locale of routing.locales) {
    const posts = await getAllPosts(locale as BlogLocale)
    for (const post of posts) {
      params.push({ locale, slug: post.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPostBySlug(locale as BlogLocale, slug)
  if (!post) return {}

  const localePath = locale === 'sv' ? '/sv/blogg' : '/en/blog'
  const currentPath = `${localePath}/${slug}`

  const languages: Record<string, string> = {
    [locale]: `${BASE_URL}${currentPath}`,
  }
  if (post.relatedSlug) {
    const otherLocale = locale === 'sv' ? 'en' : 'sv'
    const otherPath = otherLocale === 'sv' ? '/sv/blogg' : '/en/blog'
    languages[otherLocale] = `${BASE_URL}${otherPath}/${post.relatedSlug}`
  }
  languages['x-default'] = languages.sv || languages[locale]

  return {
    title: `${post.title} | Eteya Blogg`,
    description: post.description,
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}${currentPath}`,
      siteName: 'Eteya',
      type: 'article',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: [post.author === 'filip' ? 'Filip Thai' : 'Agit Akalp'],
      tags: post.tags,
      images: [
        {
          url: post.heroImage,
          width: 1200,
          height: 675,
          alt: post.heroImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.heroImage],
    },
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const blogLocale = locale as BlogLocale

  const post = await getPostBySlug(blogLocale, slug)
  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(
    blogLocale,
    post.slug,
    post.tags,
    3,
  )

  // Dynamisk MDX-import — Next.js bundlar in vid build via generateStaticParams
  const { default: MDXContent } = await import(
    `../../../../../content/blog/${blogLocale}/${slug}.mdx`
  )

  // Schema
  const path = locale === 'sv' ? `/sv/blogg/${slug}` : `/en/blog/${slug}`
  const homePath = `/${locale}`
  const blogPath = locale === 'sv' ? '/sv/blogg' : '/en/blog'
  const inLanguage = locale === 'sv' ? 'sv-SE' : 'en-US'

  const articleSchema = createArticleSchema({
    path,
    headline: post.title,
    description: post.description,
    image: [`${BASE_URL}${post.heroImage}`],
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    inLanguage,
    about: post.tags,
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'Blogg' : 'Blog', path: blogPath },
    { name: post.title, path },
  ])

  const articleUrl = `${BASE_URL}${path}`

  return (
    <>
      <JsonLd data={buildGraph([articleSchema, breadcrumbSchema])} />
      <ReadingProgressBar />
      <FloatingShareSidebar url={articleUrl} title={post.title} />
      <Nav />
      <div className="page-content">
        <main className="blog-page">
          <article>
            <BlogArticleHero post={post} url={articleUrl} />

            {/* Reading column — 720px för optimal läsbarhet */}
            <div className="blog-article-body-wrap">
              <div className="prose-blog">
                <MDXContent />
              </div>
            </div>

            {/* Editorial sections — full-bredd 1400px med side-labels,
                bryter ut ur reading-kolumnen för stark visuell rytm */}
            <BlogCTABlock locale={blogLocale} variant="closing" />
            <BlogAuthorBio author={post.author} locale={blogLocale} />
            <NewsletterSignup />

            {relatedPosts.length > 0 && (
              <BlogRelatedArticles posts={relatedPosts} locale={blogLocale} />
            )}
          </article>
        </main>
        <FooterCTAClient />
      </div>
    </>
  )
}
