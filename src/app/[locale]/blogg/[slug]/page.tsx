import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Nav from '@/components/layout/Nav'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import BlogArticleHero from '@/components/blog/BlogArticleHero'
import BlogShareButtons from '@/components/blog/BlogShareButtons'
import BlogAuthorBio from '@/components/blog/BlogAuthorBio'
import BlogCTABlock from '@/components/blog/BlogCTABlock'
import BlogRelatedArticles from '@/components/blog/BlogRelatedArticles'
import NewsletterSignup from '@/components/blog/NewsletterSignup'
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

/** SSG: pre-renderera alla locale × slug-kombinationer vid build */
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

  // Hreflang-länkar — bara om related-version finns
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

  const t = await getTranslations({ locale, namespace: 'blog.article' })

  // Relaterade artiklar via tag-overlap
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
      <Nav />
      <div className="page-content">
        <main className="bg-et-bg text-white min-h-screen">
          <article>
            <BlogArticleHero post={post} />

            {/* Article body */}
            <div className="max-w-3xl mx-auto px-6 md:px-12 pb-12">
              <div className="prose prose-invert prose-lg max-w-none">
                <MDXContent />
              </div>

              {/* Inline CTA mitt-i-artikel */}
              <BlogCTABlock locale={blogLocale} variant="closing" />

              {/* Share buttons */}
              <div className="my-12 pt-8 border-t border-et-border">
                <BlogShareButtons url={articleUrl} title={post.title} />
              </div>

              {/* Author bio */}
              <BlogAuthorBio author={post.author} locale={blogLocale} />

              {/* Newsletter signup */}
              <NewsletterSignup />

              {/* Related articles */}
              <BlogRelatedArticles posts={relatedPosts} locale={blogLocale} />
            </div>
          </article>
        </main>
        <FooterCTAClient />
      </div>
    </>
  )
}
