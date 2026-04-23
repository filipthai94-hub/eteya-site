import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import PolicyContent from '@/components/pages/PolicyContent'

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

function TermsJsonLd({ locale }: { locale: string }) {
  const isSv = locale === 'sv'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isSv ? 'Villkor' : 'Terms of Service',
    description: isSv
      ? 'Eteya AI:s villkor för användning av tjänsten.'
      : 'Eteya AI terms of service for using the platform.',
    url: `${BASE_URL}${isSv ? '/sv/villkor' : '/en/terms'}`,
    dateModified: '2026-04-22',
    publisher: {
      '@type': 'Organization',
      name: 'Eteya AI',
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

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <>
      <TermsJsonLd locale={locale} />
      <Nav />
      <div className="page-content">
        <PolicyContent type="terms" />
      </div>
    </>
  )
}
