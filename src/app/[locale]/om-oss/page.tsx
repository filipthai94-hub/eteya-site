import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import {
  JsonLd,
  buildGraph,
  createPersonSchema,
  createBreadcrumbSchema,
  createAboutPageSchema,
} from '@/components/JsonLd'
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



// Map team member-namn → profilsökväg (för korrekt @id-länkning till ProfilePage)
function getProfilePathForMember(name: string, locale: string): string | undefined {
  const aboutPath = locale === 'sv' ? '/sv/om-oss' : '/en/about'
  if (name.includes('Filip')) return `${aboutPath}/filip`
  if (name.includes('Agit')) return `${aboutPath}/agit`
  return undefined
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tMeta = await getTranslations({ locale, namespace: 'about.meta' })
  const t = await getTranslations({ locale, namespace: 'team' })
  const members = t.raw('members') as Array<{ name: string; role: string; bio: string; image?: string; social?: { linkedin?: string } }>

  const path = locale === 'sv' ? '/sv/om-oss' : '/en/about'
  const homePath = `/${locale}`
  const inLanguage = locale === 'sv' ? 'sv-SE' : 'en-US'

  // Person-schemas med @id-länkning till team-member profilsidor (om de finns)
  const personSchemas = members.map(member =>
    createPersonSchema({
      name: member.name,
      jobTitle: member.role,
      bio: member.bio,
      image: member.image,
      linkedin: member.social?.linkedin,
      profilePath: getProfilePathForMember(member.name, locale),
    })
  )

  // AboutPage refererar till team-medlemmar via mentions (med @id där det finns)
  const personMentions = members
    .map(m => getProfilePathForMember(m.name, locale))
    .filter((p): p is string => Boolean(p))
    .map(p => ({ '@id': `https://eteya.ai${p}#person` }))

  const aboutPageSchema = createAboutPageSchema({
    path,
    name: tMeta('title'),
    description: tMeta('description'),
    inLanguage,
    mentions: personMentions.length > 0 ? personMentions : undefined,
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'Om Oss' : 'About', path },
  ])

  return (
    <>
      <JsonLd data={buildGraph([aboutPageSchema, breadcrumbSchema, ...personSchemas])} />
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
