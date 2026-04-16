import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import NordicrankCaseStudy from '@/components/pages/NordicrankCaseStudy'
import FooterCTAClient from '@/components/sections/FooterCTAClient'

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
      images: [{
        url: '/images/og-nordicrank-case.jpg',
        width: 1200,
        height: 630,
        alt: t('ogImageAlt'),
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-nordicrank-case.jpg'],
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
  'about': {
    '@type': 'Organization',
    'name': 'Nordicrank',
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
        'name': locale === 'sv' ? '180 000 kr årlig besparing' : '180,000 SEK annual savings',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': locale === 'sv' ? '780 timmar sparad tid per år' : '780 hours saved per year',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': locale === 'sv' ? '18 automatiserade flöden' : '18 automated flows',
      },
    ],
  },
})

export default function NordicrankPage() {
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
        <NordicrankCaseStudy />
        <FooterCTAClient />
      </main>
    </>
  )
}
