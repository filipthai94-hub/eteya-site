import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Nav from '@/components/layout/Nav'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import BlogArticleHero from '@/components/blog/BlogArticleHero'
import BlogAuthorBio from '@/components/blog/BlogAuthorBio'
import BlogCTABlock from '@/components/blog/BlogCTABlock'
import BlogRelatedArticles from '@/components/blog/BlogRelatedArticles'
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
  createPersonSchema,
  createWebPageSchema,
} from '@/components/JsonLd'
import {
  getAuthorName,
  getAuthorRole,
  getAuthorImage,
  getAuthorPath,
} from '@/lib/blog/format'
import type { BlogAuthor, BlogLocale } from '@/lib/blog/types'

const BASE_URL = 'https://eteya.ai'

/** LinkedIn-URLs per författare (matchar BlogAuthorBio) */
const AUTHOR_LINKEDIN: Record<BlogAuthor, string> = {
  filip: 'https://www.linkedin.com/in/filip-thai-10449a3b6/',
  agit: 'https://www.linkedin.com/in/agit-akalp-15701b325/',
}

/** Korta författar-bios per locale (matchar BlogAuthorBio) */
const AUTHOR_BIO_SHORT: Record<BlogAuthor, Record<BlogLocale, string>> = {
  filip: {
    sv: 'AI-konsult med fokus på automation och AI-agenter för svenska SMB.',
    en: 'AI consultant focused on automation and AI agents for SMBs.',
  },
  agit: {
    sv: 'AI-konsult med expertis inom process-automation och affärsutveckling.',
    en: 'AI consultant with expertise in process automation and business development.',
  },
}

// toIsoWithTz är centraliserad i @/components/JsonLd.tsx — auto-konverterar
// datePublished/dateModified i createArticleSchema().

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
          // Hero-bilderna genereras via scripts/generate-hero.py som
          // 1600×900 WebP med text-overlay (titel + brand). De fungerar
          // som perfekta OG-images — överstiger Google's 1200×630-minimum
          // och har redan branded text-overlay för social sharing.
          url: `${BASE_URL}${post.heroImage}`,
          width: 1600,
          height: 900,
          alt: post.heroImageAlt,
          type: 'image/webp',
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

  // Person-schema för artikelns författare (Filip eller Agit) — per Google
  // Article structured data ska author vara Person/Organization med name + url,
  // inte bara Org-id. Bygger ett komplett Person-objekt här.
  const authorSchema = createPersonSchema({
    name: getAuthorName(post.author),
    jobTitle: getAuthorRole(post.author, blogLocale),
    bio: AUTHOR_BIO_SHORT[post.author][blogLocale],
    image: `${BASE_URL}${getAuthorImage(post.author)}`,
    linkedin: AUTHOR_LINKEDIN[post.author],
    profilePath: getAuthorPath(post.author, blogLocale),
  })

  // Word count för wordCount-property (web-foundation §4.11)
  const wordCount = post.content.trim().split(/\s+/).length

  const articleSchema = createArticleSchema({
    path,
    type: 'BlogPosting',  // web-foundation §4.11: traditional blog format
    headline: post.title,
    description: post.description,
    image: [`${BASE_URL}${post.heroImage}`],
    datePublished: post.publishedDate,  // auto-konverteras via toIsoWithTz
    dateModified: post.modifiedDate,
    inLanguage,
    about: post.tags,
    author: authorSchema,
    articleSection: locale === 'sv' ? 'Blog' : 'Blog',
    keywords: post.tags,
    wordCount,
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'Blogg' : 'Blog', path: blogPath },
    { name: post.title, path },
  ])

  // WebPage med Speakable för voice search (per web-foundation §4.6).
  // Pekar på .blog-article-lead + första prose-blog-paragrafen så
  // Google Assistant kan läsa upp artikelns kärnpunkter.
  const webPageSchema = createWebPageSchema({
    path,
    name: post.title,
    description: post.description,
    inLanguage,
    speakableSelectors: ['.blog-article-lead', '.prose-blog > p:first-of-type'],
  })

  const articleUrl = `${BASE_URL}${path}`

  return (
    <>
      <JsonLd data={buildGraph([webPageSchema, articleSchema, breadcrumbSchema])} />
      <ReadingProgressBar />
      <FloatingShareSidebar url={articleUrl} title={post.title} />
      <Nav />
      <div className="page-content">
        <main className="blog-page">
          <article>
            <BlogArticleHero post={post} url={articleUrl} />

            {/* Body — centrerad reading-column 720px, samma center-axis
                som title-block. Standard editorial pattern (Linear,
                Stripe, Anthropic). Side-labels återanvänds bara på
                footer-sektioner nedanför.

                BlogCTABlock ligger INNE i body-section för att card:en
                ska hålla sig till 720px-läs-kolumnen (per CTA-mall i
                BLOG_AUTHORING.md — research-baserad design). */}
            <section className="blog-article-body-section">
              <div className="prose-blog">
                <MDXContent />
              </div>

              {post.showCta && (
                <BlogCTABlock locale={blogLocale} />
              )}
            </section>

            {/* Editorial sections — full-bredd 1400px med side-labels,
                bryter ut ur reading-kolumnen för stark visuell rytm. */}
            <BlogAuthorBio author={post.author} locale={blogLocale} />

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
