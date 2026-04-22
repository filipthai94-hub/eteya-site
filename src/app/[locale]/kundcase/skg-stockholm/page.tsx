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
      images: [{
        url: '/images/og-skg-stockholm-case.jpg',
        width: 1200,
        height: 630,
        alt: t('ogImageAlt'),
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-skg-stockholm-case.jpg'],
    },
  }
}

const getCaseStudySchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CaseStudy',
  'name': locale === 'sv'
    ? 'SKG Stockholm - Personlig AI-assistent för VD'
    : 'SKG Stockholm - Personal AI assistant for CEO',
  'description': locale === 'sv'
    ? 'Hur Eteya byggde en personlig AI-assistent åt VD:n Mirza Ekici som befriar 12 timmar i veckan från admin och hanterar 85% av mail automatiskt.'
    : 'How Eteya built a personal AI assistant for CEO Mirza Ekici that frees up 12 hours a week from admin and handles 85% of emails automatically.',
  'url': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/skg-stockholm' : '/en/case-studies/skg-stockholm'}`,
  'datePublished': '2025-01-01',
  'about': {
    '@type': 'Organization',
    'name': 'SKG Stockholm AB',
    'url': 'https://skg.se',
  },
  'provider': {
    '@type': 'Organization',
    'name': 'Eteya Consulting AB',
    'url': 'https://eteya.ai',
    'logo': 'https://eteya.ai/logo.png',
  },
  'citation': [
    locale === 'sv' ? '12 timmar/vecka befriade från admin' : '12 hours/week freed from admin',
    locale === 'sv' ? '85% av mail hanterade automatiskt' : '85% of emails handled automatically',
    locale === 'sv' ? '3x mer fokustid för strategi' : '3x more focus time for strategy',
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
      'name': 'SKG Stockholm',
      'item': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/skg-stockholm' : '/en/case-studies/skg-stockholm'}`,
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

export default function SKGStockholmPage() {
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
        <SKGStockholmCaseStudy />
        <FooterCTAClient />
      </main>
    </>
  )
}
