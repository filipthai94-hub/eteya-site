import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import {
  JsonLd,
  buildGraph,
  createBreadcrumbSchema,
  createContactPageSchema,
} from '@/components/JsonLd'
import Nav from '@/components/layout/Nav'
import Contact from '@/components/sections/Contact'
import FooterCTAClient from '@/components/sections/FooterCTAClient'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  const svPath = '/sv/kontakt'
  const enPath = '/en/contact'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${BASE_URL}${locale === 'sv' ? svPath : enPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
        'x-default': `${BASE_URL}${svPath}`,
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `${BASE_URL}${locale === 'sv' ? svPath : enPath}`,
      siteName: 'Eteya',
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      images: [{ url: `/images/og/og-kontakt-${locale}.jpg`, width: 1200, height: 630, alt: t('meta.title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: [`/images/og/og-kontakt-${locale}.jpg`],
    },
  }
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  const path = locale === 'sv' ? '/sv/kontakt' : '/en/contact'
  const homePath = `/${locale}`
  const inLanguage = locale === 'sv' ? 'sv-SE' : 'en-US'

  // ContactPage refererar till Organization (med contactPoint redan fyllt) via @id.
  const contactPageSchema = createContactPageSchema({
    path,
    name: t('meta.title'),
    description: t('meta.description'),
    inLanguage,
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'Kontakt' : 'Contact', path },
  ])

  return (
    <>
      <JsonLd data={buildGraph([contactPageSchema, breadcrumbSchema])} />
      <Nav />
      <div className="page-content">
        <Contact />
        <FooterCTAClient />
      </div>
    </>
  )
}
