import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import SKGStockholmCaseStudy from '@/components/pages/SKGStockholmCaseStudy'
import FooterCTAClient from '@/components/sections/FooterCTAClient'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'skgstockholm.meta' })

  const svPath = '/sv/kundcase/skg-stockholm'
  const enPath = '/en/case-studies/skg-stockholm'
  const currentPath = locale === 'sv' ? svPath : enPath

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
        'x-default': `${BASE_URL}${svPath}`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}${currentPath}`,
      siteName: 'Eteya',
      type: 'article',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  }
}

// Article structured data (Google-validated — CaseStudy is pending/unsupported)
const getArticleSchema = (locale: string) => {
  const url = `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/skg-stockholm' : '/en/case-studies/skg-stockholm'}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': locale === 'sv'
      ? 'SKG Stockholm — Personlig AI-assistent för VD'
      : 'SKG Stockholm — Personal AI assistant for CEO',
    'description': locale === 'sv'
      ? 'Hur Eteya byggde en personlig AI-assistent åt VD:n Mirza Ekici som befriar 12 timmar i veckan från admin och hanterar 85% av mail automatiskt.'
      : 'How Eteya built a personal AI assistant for CEO Mirza Ekici that frees up 12 hours a week from admin and handles 85% of emails automatically.',
    'url': url,
    'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
    'datePublished': '2025-01-01',
    'dateModified': '2026-04-23',
    'author': {
      '@type': 'Organization',
      'name': 'Eteya Consulting AB',
      'url': 'https://eteya.ai',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Eteya Consulting AB',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://eteya.ai/favicon-512x512.png',
      },
    },
    'articleSection': locale === 'sv' ? 'Kundcase' : 'Case Studies',
    'keywords': locale === 'sv'
      ? 'AI-assistent, AI-agent, kundcase, SKG Stockholm, VD-automation'
      : 'AI assistant, AI agent, case study, SKG Stockholm, CEO automation',
    'mentions': {
      '@type': 'Organization',
      'name': 'SKG Stockholm AB',
      'url': 'https://skg.se',
    },
  }
}

const getBreadcrumbSchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': locale === 'sv' ? 'Hem' : 'Home',
      'item': `https://eteya.ai/${locale === 'sv' ? 'sv' : 'en'}`,
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': locale === 'sv' ? 'Kundcase' : 'Case Studies',
      'item': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase' : '/en/case-studies'}`,
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': 'SKG Stockholm',
      'item': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/skg-stockholm' : '/en/case-studies/skg-stockholm'}`,
    },
  ],
})

// Organization schema provided globally by root layout (see src/components/JsonLd.tsx)

export default async function SKGStockholmPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <>
      <Nav />
      <div className="page-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getArticleSchema(locale))
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getBreadcrumbSchema(locale))
          }}
        />
        <SKGStockholmCaseStudy />
        <FooterCTAClient />
      </div>
    </>
  )
}
