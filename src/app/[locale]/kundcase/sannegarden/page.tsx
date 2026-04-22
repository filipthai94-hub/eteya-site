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
      images: [{
        url: '/images/og-sannegarden-case.jpg',
        width: 1200,
        height: 630,
        alt: t('ogImageAlt'),
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-sannegarden-case.jpg'],
    },
  }
}

const getCaseStudySchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CaseStudy',
  'name': locale === 'sv' 
    ? 'Sannegårdens Pizzeria — aldrig ett missat samtal under rusning' 
    : 'Sannegårdens Pizzeria — never a missed call during peak hours',
  'description': locale === 'sv'
    ? 'Hur Eteya hjälpte Sannegårdens Pizzeria ta emot beställningar dygnet runt, eliminera missade samtal och öka kundnöjdheten med 23 procent.'
    : 'How Eteya helped Sannegårdens Pizzeria take orders 24/7, eliminate missed calls, and increase customer satisfaction by 23 percent.',
  'url': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/sannegarden' : '/en/case-studies/sannegarden'}`,
  'datePublished': '2025-01-01',
  'about': {
    '@type': 'Organization',
    'name': 'Sannegårdens Pizzeria',
  },
  'provider': {
    '@type': 'Organization',
    'name': 'Eteya Consulting AB',
    'url': 'https://eteya.ai',
    'logo': 'https://eteya.ai/logo.png',
  },
  'citation': [
    locale === 'sv' ? 'Aldrig ett missat samtal under rusning' : 'Never a missed call during peak hours',
    locale === 'sv' ? '30+ extra beställningar per vecka' : '30+ extra orders per week',
    locale === 'sv' ? '23 procent högre kundnöjdhet' : '23 percent higher customer satisfaction',
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
      'name': 'Sannegårdens Pizzeria',
      'item': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/sannegarden' : '/en/case-studies/sannegarden'}`,
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

export default function SannegardenPage() {
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
        <SannegardenCaseStudy />
        <FooterCTAClient />
      </main>
    </>
  )
}
