import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import PolicyContent from '@/components/pages/PolicyContent'
import {
  JsonLd,
  buildGraph,
  createBreadcrumbSchema,
  createWebPageSchema,
} from '@/components/JsonLd'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'terms.meta' })
  
  // Locale prefix is always present (see routing.ts localePrefix: 'always').
  // The Swedish path segment is '/villkor', English is '/terms'.
  const svPath = '/sv/villkor'
  const enPath = '/en/terms'
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
    },
  }
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isSv = locale === 'sv'

  const path = isSv ? '/sv/villkor' : '/en/terms'
  const homePath = `/${locale}`
  const inLanguage = isSv ? 'sv-SE' : 'en-US'
  const name = isSv ? 'Villkor' : 'Terms of Service'
  const description = isSv
    ? 'Eteya:s villkor för användning av tjänsten.'
    : 'Eteya terms of service for using the platform.'

  const webPageSchema = createWebPageSchema({ path, name, description, inLanguage })
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: isSv ? 'Hem' : 'Home', path: homePath },
    { name, path },
  ])

  return (
    <>
      <JsonLd data={buildGraph([webPageSchema, breadcrumbSchema])} />
      <Nav />
      <div className="page-content">
        <PolicyContent type="terms" />
      </div>
    </>
  )
}
