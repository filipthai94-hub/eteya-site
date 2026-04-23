import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import NordicrankCaseStudy from '@/components/pages/NordicrankCaseStudy'
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
  const t = await getTranslations({ locale, namespace: 'nordicrank.meta' })
  
  const svPath = '/sv/kundcase/nordicrank'
  const enPath = '/en/case-studies/nordicrank'
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

const getCaseStudySchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CaseStudy',
  'name': locale === 'sv' 
    ? 'Nordicrank — 180 000 kr/år i besparing med automation' 
    : 'Nordicrank — 180,000 SEK/year savings with automation',
  'description': locale === 'sv'
    ? 'Hur Eteya hjälpte Nordicrank automatisera order- och länkhatering, eliminera manuella Excel-listor och spara 180 000 kr per år.'
    : 'How Eteya helped Nordicrank automate order and link handling, eliminate manual Excel sheets, and save 180,000 SEK per year.',
  'url': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/nordicrank' : '/en/case-studies/nordicrank'}`,
  'datePublished': '2025-01-01',
  'about': {
    '@type': 'Organization',
    'name': 'Nordicrank',
  },
  'provider': {
    '@type': 'Organization',
    'name': 'Eteya Consulting AB',
    'url': 'https://eteya.ai',
    'logo': 'https://eteya.ai/favicon-512x512.png',
  },
  'citation': [
    locale === 'sv' ? '180 000 kr årlig besparing' : '180,000 SEK annual savings',
    locale === 'sv' ? '780 timmar sparad tid per år' : '780 hours saved per year',
    locale === 'sv' ? '18 automatiserade flöden' : '18 automated flows',
  ],
})

const getBreadcrumbSchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': locale === 'sv' ? 'Hem' : 'Home',
      'item': 'https://eteya.ai',
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
      'name': 'Nordicrank',
      'item': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/nordicrank' : '/en/case-studies/nordicrank'}`,
    },
  ],
})

// Organization schema provided globally by root layout (see src/components/JsonLd.tsx)

export default async function NordicrankPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <>
      <Nav />
      <main className="page-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getCaseStudySchema(locale))
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getBreadcrumbSchema(locale))
          }}
        />
        <NordicrankCaseStudy />
        <FooterCTAClient />
      </main>
    </>
  )
}
