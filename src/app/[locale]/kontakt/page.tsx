import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
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
    title: t('section_label') + ' | Eteya',
    description: t('subheading'),
    alternates: {
      canonical: `${BASE_URL}${locale === 'sv' ? svPath : enPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
        'x-default': `${BASE_URL}${svPath}`,
      },
    },
    openGraph: {
      title: t('section_label') + ' | Eteya',
      description: t('subheading'),
      url: `${BASE_URL}${locale === 'sv' ? svPath : enPath}`,
      siteName: 'Eteya',
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('section_label') + ' | Eteya',
      description: t('subheading'),
    },
  }
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      <Nav />
      <main className="page-content">
        <Hero variant="contact" />
        <Contact />
        <FooterCTAClient />
      </main>
    </>
  )
}
