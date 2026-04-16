import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import SannegardenCaseStudy from '@/components/pages/SannegardenCaseStudy'
import FooterCTAClient from '@/components/sections/FooterCTAClient'

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
  'mainEntity': {
    '@type': 'ItemList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': locale === 'sv' ? 'Aldrig ett missat samtal under rusning' : 'Never a missed call during peak hours',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': locale === 'sv' ? '30+ extra beställningar per vecka' : '30+ extra orders per week',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': locale === 'sv' ? '23 procent högre kundnöjdhet' : '23 percent higher customer satisfaction',
      },
    ],
  },
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
        <SannegardenCaseStudy />
        <FooterCTAClient />
      </main>
    </>
  )
}
