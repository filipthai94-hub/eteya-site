import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import TrainWithAlbertCaseStudy from '@/components/pages/TrainWithAlbertCaseStudy'
import FooterCTAClient from '@/components/sections/FooterCTAClient'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'trainwithalbert.meta' })
  
  const svPath = '/sv/kundcase/trainwithalbert'
  const enPath = '/en/case-studies/trainwithalbert'
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
      images: [{
        url: '/images/og-trainwithalbert-case.jpg',
        width: 1200,
        height: 630,
        alt: t('ogImageAlt'),
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-trainwithalbert-case.jpg'],
    },
  }
}

const getCaseStudySchema = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CaseStudy',
  'name': locale === 'sv' 
    ? 'TrainWithAlbert — coach igen, inte administratör' 
    : 'TrainWithAlbert — coach again, not an administrator',
  'description': locale === 'sv'
    ? 'Hur Albert Wan automatiserade sin coachingverksamhet, sparat 8h/vecka och ökat intäkterna med 60% på 3 månader.'
    : 'How Albert Wan automated his coaching business, saved 8h/week and increased revenue by 60% in 3 months.',
  'url': `https://eteya.ai${locale === 'sv' ? '/sv/kundcase/trainwithalbert' : '/en/case-studies/trainwithalbert'}`,
  'about': {
    '@type': 'Organization',
    'name': 'TrainWithAlbert',
  },
  'provider': {
    '@type': 'Organization',
    'name': 'Eteya Consulting AB',
    'url': 'https://eteya.ai',
    'logo': 'https://eteya.ai/logo.png',
  },
  'mainEntity': {
    '@type': 'ItemList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': locale === 'sv' ? '8h/vecka sparad admin-tid' : '8h/week saved admin time',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': locale === 'sv' ? '3x fler bokningar/månad' : '3x more bookings/month',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': locale === 'sv' ? '60% intäktsökning på 3 månader' : '60% revenue increase in 3 months',
      },
    ],
  },
})

export default function TrainWithAlbertPage() {
  return (
    <>
      <Nav />
      <main className="page-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(getCaseStudySchema('sv')) 
          }}
        />
        <TrainWithAlbertCaseStudy />
        <FooterCTAClient />
      </main>
    </>
  )
}
