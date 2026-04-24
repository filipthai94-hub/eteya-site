import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Cases from '@/components/sections/Cases'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import CaseStudiesHubHero from '@/components/pages/CaseStudiesHubHero'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'caseStudies.meta' })

  const svPath = '/sv/kundcase'
  const enPath = '/en/case-studies'
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
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      images: [{ url: `/images/og/og-kundcase-${locale}.jpg`, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/images/og/og-kundcase-${locale}.jpg`],
    },
  }
}

const getCollectionSchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': locale === 'sv' ? 'Kundcase — Eteya AI' : 'Case Studies — Eteya AI',
  'description': locale === 'sv'
    ? 'Verifierade kundcase från svenska företag som sparat tid och pengar med AI-automation.'
    : 'Verified case studies from Swedish companies that saved time and money with AI automation.',
  'url': `${BASE_URL}${locale === 'sv' ? '/sv/kundcase' : '/en/case-studies'}`,
  'inLanguage': locale === 'sv' ? 'sv-SE' : 'en-US',
})

const getBreadcrumbSchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': locale === 'sv' ? 'Hem' : 'Home',
      'item': `${BASE_URL}/${locale === 'sv' ? 'sv' : 'en'}`,
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': locale === 'sv' ? 'Kundcase' : 'Case Studies',
      'item': `${BASE_URL}${locale === 'sv' ? '/sv/kundcase' : '/en/case-studies'}`,
    },
  ],
})

// All 5 case studies listed here so Google sees this hub as a
// structured listing (enables sitelinks + AI Overview coverage).
const CASE_STUDIES: ReadonlyArray<{ slug: string; sv: string; en: string }> = [
  { slug: 'telestore', sv: 'Telestore', en: 'Telestore' },
  { slug: 'nordicrank', sv: 'Nordicrank', en: 'Nordicrank' },
  { slug: 'sannegarden', sv: 'Sannegårdens Pizzeria', en: 'Sannegården Pizzeria' },
  { slug: 'skg-stockholm', sv: 'SKG Stockholm', en: 'SKG Stockholm' },
  { slug: 'trainwithalbert', sv: 'TrainWithAlbert', en: 'TrainWithAlbert' },
]

const getItemListSchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': locale === 'sv' ? 'Eteya Kundcase' : 'Eteya Case Studies',
  'description': locale === 'sv'
    ? 'Verifierade kundcase från svenska företag som implementerat AI-automation med Eteya.'
    : 'Verified case studies from Swedish companies that implemented AI automation with Eteya.',
  'numberOfItems': CASE_STUDIES.length,
  'itemListElement': CASE_STUDIES.map((cs, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'name': locale === 'sv' ? cs.sv : cs.en,
    'url': `${BASE_URL}/${locale === 'sv' ? 'sv/kundcase' : 'en/case-studies'}/${cs.slug}`,
  })),
})

export default async function CaseStudiesPage({
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
            __html: JSON.stringify(getCollectionSchema(locale))
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getBreadcrumbSchema(locale))
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getItemListSchema(locale))
          }}
        />
        <CaseStudiesHubHero />
        <Cases params={params} />
        <FooterCTAClient />
      </div>
    </>
  )
}
