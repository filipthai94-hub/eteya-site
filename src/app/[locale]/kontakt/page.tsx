import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { JsonLd, createBreadcrumbSchema } from '@/components/JsonLd'
import Nav from '@/components/layout/Nav'
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
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `${BASE_URL}${locale === 'sv' ? svPath : enPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
        'x-default': `${BASE_URL}${svPath}`,
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `${BASE_URL}${locale === 'sv' ? svPath : enPath}`,
      siteName: 'Eteya',
      type: 'website',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      images: [{ url: `/images/og/og-kontakt-${locale}.jpg`, width: 1200, height: 630, alt: t('meta.title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: [`/images/og/og-kontakt-${locale}.jpg`],
    },
  }
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Organization + WebSite JSON-LD are rendered once by [locale]/layout.tsx.
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Kontakt Eteya',
        description: locale === 'sv' ? 'Kontakta Eteya för AI-konsulting och automation. Boka ett kostnadsfritt strategisamtal idag.' : 'Contact Eteya for AI consulting and automation. Book a free strategy call today.',
        url: `https://eteya.ai/${locale}/${locale === 'sv' ? 'kontakt' : 'contact'}`,
        mainEntity: {
          '@type': 'Organization',
          name: 'Eteya',
          telephone: '+46739823962',
          email: 'kontakt@eteya.ai',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Solhagsvägen 26A',
            addressLocality: 'Karlskoga',
            postalCode: '691 52',
            addressCountry: 'SE',
          },
        },
      }} />
      <JsonLd data={createBreadcrumbSchema([
        { position: 1, name: locale === 'sv' ? 'Hem' : 'Home', item: `https://eteya.ai/${locale === 'sv' ? 'sv' : 'en'}` },
        { position: 2, name: locale === 'sv' ? 'Kontakt' : 'Contact', item: `https://eteya.ai/${locale}/${locale === 'sv' ? 'kontakt' : 'contact'}` },
      ])} />
      <Nav />
      <div className="page-content">
        <Contact />
        <FooterCTAClient />
      </div>
    </>
  )
}
