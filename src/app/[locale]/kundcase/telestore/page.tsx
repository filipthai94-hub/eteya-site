import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import TelestoreCaseStudy from '@/components/pages/TelestoreCaseStudy'
import FooterCTAClient from '@/components/sections/FooterCTAClient'

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
  const t = await getTranslations({ locale, namespace: 'telestore.meta' })
  
  const svPath = '/sv/kundcase/telestore'
  const enPath = '/en/case-studies/telestore'
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
  const url = `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/telestore' : '/en/case-studies/telestore'}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': locale === 'sv'
      ? 'Telestore — 390 000 kr/år i besparing med AI'
      : 'Telestore — 390 000 SEK/year savings with AI',
    'description': locale === 'sv'
      ? 'Hur Eteya hjälpte Telestore Sverige AB automatisera 56 processer och spara 390 000 kr per år genom AI-agenter och processautomation.'
      : 'How Eteya helped Telestore Sverige AB automate 56 processes and save 390 000 SEK per year through AI agents and process automation.',
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
      ? 'AI-automation, AI-agenter, processautomation, kundcase, Telestore'
      : 'AI automation, AI agents, process automation, case study, Telestore',
    'mentions': {
      '@type': 'Organization',
      'name': 'Telestore Sverige AB',
      'url': 'https://telestore.se',
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
      'name': 'Telestore',
      'item': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/telestore' : '/en/case-studies/telestore'}`,
    },
  ],
})

// Organization schema provided globally by root layout (see src/components/JsonLd.tsx)

export default async function TelestorePage({
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
        <TelestoreCaseStudy />
        <FooterCTAClient />
      </div>
    </>
  )
}
