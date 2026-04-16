import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { JsonLd, organizationSchema, createPersonSchema } from '@/components/JsonLd'
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

  return (
    <>
      <JsonLd data={organizationSchema} />
      {personSchemas.map((schema, i) => <JsonLd key={i} data={schema} />)}
      <BreadcrumbSchema locale={locale} />
      <Nav />
      <main className="page-content">
        <AboutHeroClient />
        <WhyEteyaOmOssWrapper />
        <SocialProof />
        <Team />
        <FAQSection />
        <FooterCTAClient />
      </main>
    </>
  )
}
