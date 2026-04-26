import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import PrivacyPolicyContent from '@/components/pages/PrivacyPolicyContent'

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

function PrivacyPolicyJsonLd({ locale }: { locale: string }) {
  const isSv = locale === 'sv'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isSv ? 'Integritetspolicy' : 'Privacy Policy',
    description: isSv
      ? 'Läs hur Eteya hanterar dina personuppgifter. GDPR-kompatibel behandling av data.'
      : 'Read how Eteya handles your personal data. GDPR-compliant data processing.',
    url: `${BASE_URL}${isSv ? '/sv/integritetspolicy' : '/en/privacy-policy'}`,
    dateModified: '2026-04-22',
    publisher: {
      '@type': 'Organization',
      name: 'Eteya',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon-512x512.png`,
      },
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <>
      <PrivacyPolicyJsonLd locale={locale} />
      <Nav />
      <div className="page-content">
        <PrivacyPolicyContent />
      </div>
    </>
  )
}
