import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import TrainWithAlbertCaseStudy from '@/components/pages/TrainWithAlbertCaseStudy'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import {
  JsonLd,
  buildGraph,
  createArticleSchema,
  createBreadcrumbSchema,
} from '@/components/JsonLd'

const BASE_URL = 'https://eteya.ai'

const PUBLISHED_DATE = '2025-05-15'
const MODIFIED_DATE = '2026-04-26'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'trainwithalbert.meta' })

  const svPath = '/sv/kundcase/trainwithalbert'
  const enPath = '/en/case-studies/trainwithalbert'
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
      images: [{ url: `/images/og/og-trainwithalbert-${locale}.jpg`, width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/images/og/og-trainwithalbert-${locale}.jpg`],
    },
  }
}

export default async function TrainWithAlbertPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'trainwithalbert.meta' })

  const path = locale === 'sv' ? '/sv/kundcase/trainwithalbert' : '/en/case-studies/trainwithalbert'
  const kundcasePath = locale === 'sv' ? '/sv/kundcase' : '/en/case-studies'
  const homePath = `/${locale}`

  const articleSchema = createArticleSchema({
    path,
    headline: t('title'),
    description: t('description'),
    image: [
      `${BASE_URL}/images/cases/trainwithalbert-home-full.webp`,
      `${BASE_URL}/images/og/og-trainwithalbert-${locale}.jpg`,
    ],
    datePublished: PUBLISHED_DATE,
    dateModified: MODIFIED_DATE,
    inLanguage: locale === 'sv' ? 'sv-SE' : 'en-US',
    about: locale === 'sv'
      ? ['AI-schemaläggning', 'Kundtjänst-automation', 'Klientresa', 'AI-agenter', 'Bokningssystem']
      : ['AI scheduling', 'Customer service automation', 'Client journey', 'AI agents', 'Booking systems'],
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'Kundcase' : 'Case Studies', path: kundcasePath },
    { name: 'TrainWithAlbert', path },
  ])

  return (
    <>
      <JsonLd data={buildGraph([articleSchema, breadcrumbSchema])} />
      <Nav />
      <div className="page-content">
        <TrainWithAlbertCaseStudy />
        <FooterCTAClient />
      </div>
    </>
  )
}
