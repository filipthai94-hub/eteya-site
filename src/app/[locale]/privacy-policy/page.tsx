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

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="page-content">
        <PrivacyPolicyContent />
      </main>
    </>
  )
}
