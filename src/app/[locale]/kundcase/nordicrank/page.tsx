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
      images: [{ url: `/images/og/og-nordicrank-${locale}.jpg`, width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/images/og/og-nordicrank-${locale}.jpg`],
    },
  }
}

// Article structured data (Google-validated — CaseStudy is pending/unsupported)
const getArticleSchema = (locale: string) => {
  const url = `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/nordicrank' : '/en/case-studies/nordicrank'}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': locale === 'sv'
      ? 'Nordicrank — 13.4 timmar tillbaka i veckan med 18 automationer'
      : 'Nordicrank — 13.4 hours back per week with 18 automations',
    'description': locale === 'sv'
      ? 'Hur Eteya ersatte Nordicranks manuella Excel-arbete med 18 automatiserade flöden — orderintag, status-tracking, QA, fakturor och rapporter. 13.4 timmar/vecka tillbaka.'
      : 'How Eteya replaced Nordicrank’s manual Excel work with 18 automated flows — order intake, status tracking, QA, invoices and reports. 13.4 hours/week back.',
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
      ? 'AI-automation, processautomation, Excel-automation, orderhantering, kundcase, Nordicrank'
      : 'AI automation, process automation, Excel automation, order management, case study, Nordicrank',
    'mentions': {
      '@type': 'Organization',
      'name': 'Nordicrank',
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
        <NordicrankCaseStudy />
        <FooterCTAClient />
      </div>
    </>
  )
}
