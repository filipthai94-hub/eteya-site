import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Cases from '@/components/sections/Cases'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import CaseStudiesHubHero from '@/components/pages/CaseStudiesHubHero'
import {
  JsonLd,
  buildGraph,
  createCollectionPageSchema,
  createBreadcrumbSchema,
} from '@/components/JsonLd'

const BASE_URL = 'https://eteya.ai'

// All 5 case studies listed here so Google sees this hub as a
// structured listing (enables sitelinks + AI Overview coverage).
const CASE_STUDIES: ReadonlyArray<{ slug: string; sv: string; en: string }> = [
  { slug: 'telestore', sv: 'Telestore', en: 'Telestore' },
  { slug: 'nordicrank', sv: 'Nordicrank', en: 'Nordicrank' },
  { slug: 'sannegarden', sv: 'Sannegårdens Pizzeria', en: 'Sannegården Pizzeria' },
  { slug: 'skg-stockholm', sv: 'SKG Stockholm', en: 'SKG Stockholm' },
  { slug: 'trainwithalbert', sv: 'TrainWithAlbert', en: 'TrainWithAlbert' },
]

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

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'caseStudies.meta' })

  const path = locale === 'sv' ? '/sv/kundcase' : '/en/case-studies'
  const homePath = `/${locale}`

  // CollectionPage med inbäddad ItemList — pekar på alla 5 case-Article via @id
  const collectionSchema = createCollectionPageSchema({
    path,
    name: t('title'),
    description: t('description'),
    inLanguage: locale === 'sv' ? 'sv-SE' : 'en-US',
    items: CASE_STUDIES.map((cs) => ({
      path: `${path}/${cs.slug}`,
      name: locale === 'sv' ? cs.sv : cs.en,
    })),
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'Kundcase' : 'Case Studies', path },
  ])

  return (
    <>
      <JsonLd data={buildGraph([collectionSchema, breadcrumbSchema])} />
      <Nav />
      <div className="page-content">
        <CaseStudiesHubHero />
        <Cases params={params} />
        <FooterCTAClient />
      </div>
    </>
  )
}
