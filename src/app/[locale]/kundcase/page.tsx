import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import CaseStudiesHub from '@/components/pages/CaseStudiesHub'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'caseStudies.meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}/${locale === 'sv' ? 'sv/kundcase' : 'en/case-studies'}`,
      languages: {
        sv: `${BASE_URL}/sv/kundcase`,
        en: `${BASE_URL}/en/case-studies`,
      },
    },
  }
}

export default function CaseStudiesPage() {
  return (
    <main>
      <Nav />
      <CaseStudiesHub />
    </main>
  )
}
