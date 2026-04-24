import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import SannegardenCaseStudy from '@/components/pages/SannegardenCaseStudy'
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
  const t = await getTranslations({ locale, namespace: 'sannegarden.meta' })
  
  const svPath = '/sv/kundcase/sannegarden'
  const enPath = '/en/case-studies/sannegarden'
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
      images: [{ url: `/images/og/og-sannegarden-${locale}.jpg`, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/images/og/og-sannegarden-${locale}.jpg`],
    },
  }
}

// Article structured data (Google-validated — CaseStudy is pending/unsupported)
const getArticleSchema = (locale: string) => {
  const url = `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/sannegarden' : '/en/case-studies/sannegarden'}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': locale === 'sv'
      ? 'Sannegårdens Pizzeria — aldrig ett missat samtal under rusning'
      : 'Sannegårdens Pizzeria — never a missed call during peak hours',
    'description': locale === 'sv'
      ? 'Hur Eteya hjälpte Sannegårdens Pizzeria ta emot beställningar dygnet runt, eliminera missade samtal och öka kundnöjdheten med 23 procent.'
      : 'How Eteya helped Sannegårdens Pizzeria take orders 24/7, eliminate missed calls, and increase customer satisfaction by 23 percent.',
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
      ? 'AI-telefonist, AI-agent, kundcase, Sannegården, restaurang'
      : 'AI phone agent, AI agent, case study, Sannegården, restaurant',
    'mentions': {
      '@type': 'Organization',
      'name': 'Sannegårdens Pizzeria',
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
      'name': 'Sannegårdens Pizzeria',
      'item': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/sannegarden' : '/en/case-studies/sannegarden'}`,
    },
  ],
})

// Organization schema provided globally by root layout (see src/components/JsonLd.tsx)

export default async function SannegardenPage({
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
        <SannegardenCaseStudy />
        <FooterCTAClient />
      </div>
    </>
  )
}
