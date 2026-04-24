import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { JsonLd, createPersonSchema, createBreadcrumbSchema } from '@/components/JsonLd'
import Nav from '@/components/layout/Nav'
import AboutHeroClient from '@/components/sections/AboutHeroClient'
import WhyEteyaOmOssWrapper from '@/components/sections/WhyEteyaOmOssWrapper'
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
      images: [{ url: `/images/og/og-om-oss-${locale}.jpg`, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/images/og/og-om-oss-${locale}.jpg`],
    },
  }
}



export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'team' })
  const members = t.raw('members') as Array<{ name: string; role: string; bio: string; image?: string; social?: { linkedin?: string } }>

  // Create Person schemas for team members
  const personSchemas = members.map(member =>
    createPersonSchema({
      name: member.name,
      jobTitle: member.role,
      bio: member.bio,
      image: member.image,
      linkedin: member.social?.linkedin,
    })
  )

  // Organization + WebSite JSON-LD are rendered once by [locale]/layout.tsx.
  // The <main> element is provided by the locale layout (#main-content).
  return (
    <>
      {personSchemas.map((schema, i) => <JsonLd key={i} data={schema} />)}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: locale === 'sv' ? 'Om Oss | Eteya AI' : 'About | Eteya AI',
        description: locale === 'sv' ? 'Lär känna teamet bakom Eteya AI — AI-konsulter som bygger automationer som levererar resultat.' : 'Meet the team behind Eteya AI — AI consultants building automations that deliver results.',
        url: `https://eteya.ai/${locale === 'sv' ? 'sv/om-oss' : 'en/about'}`,
      }} />
      <JsonLd data={createBreadcrumbSchema([
        { position: 1, name: locale === 'sv' ? 'Hem' : 'Home', item: `https://eteya.ai/${locale === 'sv' ? 'sv' : 'en'}` },
        { position: 2, name: locale === 'sv' ? 'Om Oss' : 'About', item: `https://eteya.ai/${locale === 'sv' ? 'sv/om-oss' : 'en/about'}` },
      ])} />
      <Nav />
      <div className="page-content">
        <AboutHeroClient />
        <WhyEteyaOmOssWrapper />
        <SocialProof />
        <Team />
        <FAQSection />
        <FooterCTAClient />
      </div>
    </>
  )
}
