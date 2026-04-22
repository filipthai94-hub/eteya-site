import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import PrivacyPolicyContent from '@/components/pages/PrivacyPolicyContent'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  
  const svPath = '/integritetspolicy'
  const enPath = '/privacy-policy'
  const currentPath = locale === 'sv' ? svPath : enPath
  
  return {
    title: `${t('title')} | Eteya`,
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
      },
    },
    robots: { index: true, follow: true },
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
      ? 'Läs hur Eteya AI hanterar dina personuppgifter. GDPR-kompatibel behandling av data.'
      : 'Read how Eteya AI handles your personal data. GDPR-compliant data processing.',
    url: `${BASE_URL}${isSv ? '/integritetspolicy' : '/privacy-policy'}`,
    dateModified: '2026-04-22',
    publisher: {
      '@type': 'Organization',
      name: 'Eteya AI',
      logo: `${BASE_URL}/logo.png`,
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
      <main className="page-content">
        <PrivacyPolicyContent />
      </main>
    </>
  )
}
