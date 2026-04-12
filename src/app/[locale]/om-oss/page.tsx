import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
import OurStory from '@/components/sections/OurStory'
import WhyEteya from '@/components/sections/WhyEteya'
import SocialProof from '@/components/sections/SocialProof'
import Team from '@/components/sections/Team'
import FAQSection from '@/components/sections/FAQSection'
import FooterCTAClient from '@/components/sections/FooterCTAClient'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about.meta' })

  const svPath = '/sv/om-oss'
  const enPath = '/en/about'

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE_URL}${locale === 'sv' ? svPath : enPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
        'x-default': `${BASE_URL}${svPath}`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}${locale === 'sv' ? svPath : enPath}`,
      siteName: 'Eteya',
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
  }
}

function BreadcrumbSchema({ locale }: { locale: string }) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Hem',
        item: `${BASE_URL}${locale === 'sv' ? '/sv' : '/en'}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'sv' ? 'Om Oss' : 'About',
        item: `${BASE_URL}${locale === 'sv' ? '/sv/om-oss' : '/en/about'}`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  )
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      <BreadcrumbSchema locale={locale} />
      <Nav />
      <main className="page-content">
        <Hero variant="about" />
        <OurStory />
        <WhyEteya />
        <SocialProof />
        <Team />
        <FAQSection variant="about" />
        <FooterCTAClient />
      </main>
    </>
  )
}
