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
      images: [{
        url: '/images/og-telestore-case.jpg',
        width: 1200,
        height: 630,
        alt: t('ogImageAlt'),
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-telestore-case.jpg'],
    },
  }
}

// CaseStudy structured data for SEO
const getCaseStudySchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CaseStudy',
  'name': locale === 'sv' 
    ? 'Telestore — 390 000 kr/år i besparing med AI' 
    : 'Telestore — 390 000 SEK/year savings with AI',
  'description': locale === 'sv'
    ? 'Hur Eteya hjälpte Telestore Sverige AB automatisera 56 processer och spara 390 000 kr per år genom AI-agenter och processautomation.'
    : 'How Eteya helped Telestore Sverige AB automate 56 processes and save 390 000 SEK per year through AI agents and process automation.',
  'url': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/telestore' : '/en/case-studies/telestore'}`,
  'about': {
    '@type': 'Organization',
    'name': 'Telestore Sverige AB',
    'url': 'https://telestore.se',
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
        'name': locale === 'sv' ? '390 000 kr årlig besparing' : '390 000 SEK annual savings',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': locale === 'sv' ? '1 350 timmar sparad tid per år' : '1 350 hours saved per year',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': locale === 'sv' ? '56 implementerade automationer' : '56 implemented automations',
      },
    ],
  },
})

export default function TelestorePage() {
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
        <TelestoreCaseStudy />
        <FooterCTAClient />
      </main>
    </>
  )
}
