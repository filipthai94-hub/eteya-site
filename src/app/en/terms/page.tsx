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

  const svPath = '/sv/villkor'
  const enPath = '/en/terms'

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}${enPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
        'x-default': `${BASE_URL}${svPath}`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}${enPath}`,
      siteName: 'Eteya',
      type: 'article',
      locale: 'en_US',
    },
  }
}

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="page-content">
        <PolicyContent type="terms" locale="en" />
      </main>
    </>
  )
}
