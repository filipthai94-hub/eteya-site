import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import SannegardenCaseStudy from '@/components/pages/SannegardenCaseStudy'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import {
  JsonLd,
  buildGraph,
  createArticleSchema,
  createBreadcrumbSchema,
} from '@/components/JsonLd'

const BASE_URL = 'https://eteya.ai'

const PUBLISHED_DATE = '2025-03-10'
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
      images: [{ url: `/images/og/og-sannegarden-${locale}.jpg`, width: 1200, height: 630, alt: t('ogImageAlt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/images/og/og-sannegarden-${locale}.jpg`],
    },
  }
}

export default async function SannegardenPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sannegarden.meta' })

  const path = locale === 'sv' ? '/sv/kundcase/sannegarden' : '/en/case-studies/sannegarden'
  const kundcasePath = locale === 'sv' ? '/sv/kundcase' : '/en/case-studies'
  const homePath = `/${locale}`

  const articleSchema = createArticleSchema({
    path,
    headline: t('title'),
    description: t('description'),
    image: [
      `${BASE_URL}/images/cases/sannegarden-home-full.webp`,
      `${BASE_URL}/images/og/og-sannegarden-${locale}.jpg`,
    ],
    datePublished: PUBLISHED_DATE,
    dateModified: MODIFIED_DATE,
    inLanguage: locale === 'sv' ? 'sv-SE' : 'en-US',
    about: locale === 'sv'
      ? ['AI-telefonist', 'Restaurang-automation', 'Kundtjänst-automation', 'AI-agenter']
      : ['AI receptionist', 'Restaurant automation', 'Customer service automation', 'AI agents'],
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'Kundcase' : 'Case Studies', path: kundcasePath },
    { name: 'Sannegårdens Pizzeria', path },
  ])

  return (
    <>
      <JsonLd data={buildGraph([articleSchema, breadcrumbSchema])} />
      <Nav />
      <div className="page-content">
        <SannegardenCaseStudy />
        <FooterCTAClient />
      </div>
    </>
  )
}
