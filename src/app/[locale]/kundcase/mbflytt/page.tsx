import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import MBFlyttCaseStudy from '@/components/pages/MBFlyttCaseStudy'
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
  const t = await getTranslations({ locale, namespace: 'mbflytt.meta' })
  
  const svPath = '/sv/kundcase/mbflytt'
  const enPath = '/en/case-studies/mbflytt'
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
      images: [{
        url: '/images/og-mbflytt-case.jpg',
        width: 1200,
        height: 630,
        alt: t('ogImageAlt'),
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-mbflytt-case.jpg'],
    },
  }
}

const getCaseStudySchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CaseStudy',
  'name': locale === 'sv' 
    ? 'MB Flytt - AI-driven offertgenerering' 
    : 'MB Flytt - AI-driven quote generation',
  'description': locale === 'sv'
    ? 'MB Flytt ökade antalet offerter med 2x och minskade offertiden från 24h till 15 minuter med AI-driven automation.'
    : 'MB Flytt increased quotes by 2x and reduced quote time from 24h to 15 minutes with AI-driven automation.',
  'url': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/mbflytt' : '/en/case-studies/mbflytt'}`,
  'datePublished': '2025-01-01',
  'about': {
    '@type': 'Organization',
    'name': 'MB Flytt',
  },
  'provider': {
    '@type': 'Organization',
    'name': 'Eteya Consulting AB',
    'url': 'https://eteya.ai',
    'logo': 'https://eteya.ai/logo.png',
  },
  'citation': [
    locale === 'sv' ? '2x fler offerter per dag' : '2x more quotes per day',
    locale === 'sv' ? '15 min istället för 24h offertid' : '15 minutes instead of 24h quote time',
    locale === 'sv' ? '35% högre konvertering' : '35% higher conversion',
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
      'name': 'MB Flytt',
      'item': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/mbflytt' : '/en/case-studies/mbflytt'}`,
    },
  ],
})

const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Eteya Consulting AB',
  'url': 'https://eteya.ai',
  'logo': 'https://eteya.ai/logo.png',
})

export default function MBFlyttPage() {
  return (
    <>
      <Nav />
      <main className="page-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(getCaseStudySchema('sv')) 
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(getBreadcrumbSchema('sv')) 
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(getOrganizationSchema()) 
          }}
        />
        <MBFlyttCaseStudy />
        <FooterCTAClient />
      </main>
    </>
  )
}
