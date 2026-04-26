import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import PrivacyPolicyContent from '@/components/pages/PrivacyPolicyContent'
import {
  JsonLd,
  buildGraph,
  createBreadcrumbSchema,
  createWebPageSchema,
} from '@/components/JsonLd'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  
  // Locale prefix is always present (see routing.ts localePrefix: 'always').
  // The Swedish path segment is '/integritetspolicy', English is '/privacy-policy'.
  const svPath = '/sv/integritetspolicy'
  const enPath = '/en/privacy-policy'
  const currentPath = locale === 'sv' ? svPath : enPath

  return {
    title: `${t('title')} | Eteya`,
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
      title: `${t('title')} | Eteya`,
      description: t('description'),
      url: `${BASE_URL}${currentPath}`,
      siteName: 'Eteya',
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | Eteya`,
      description: t('description'),
    },
  }
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isSv = locale === 'sv'

  const path = isSv ? '/sv/integritetspolicy' : '/en/privacy-policy'
  const homePath = `/${locale}`
  const inLanguage = isSv ? 'sv-SE' : 'en-US'
  const name = isSv ? 'Integritetspolicy' : 'Privacy Policy'
  const description = isSv
    ? 'Läs hur Eteya hanterar dina personuppgifter. GDPR-kompatibel behandling av data.'
    : 'Read how Eteya handles your personal data. GDPR-compliant data processing.'

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
        <PrivacyPolicyContent />
      </div>
    </>
  )
}
