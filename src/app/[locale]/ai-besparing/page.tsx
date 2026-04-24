import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import MethodologyContent from '@/components/pages/MethodologyContent'
import FooterCTAClient from '@/components/sections/FooterCTAClient'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'methodology.meta' })

  const svPath = '/sv/ai-besparing'
  const enPath = '/en/ai-savings'

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
      type: 'article',
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      images: [{ url: `/images/og/og-ai-besparing-${locale}.jpg`, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/images/og/og-ai-besparing-${locale}.jpg`],
    },
  }
}

const getArticleSchema = (locale: string) => {
  const url = `${BASE_URL}${locale === 'sv' ? '/sv/ai-besparing' : '/en/ai-savings'}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: locale === 'sv'
      ? 'AI-besparing kalkylator — Hur vi räknar'
      : 'AI Savings Calculator — How we calculate',
    description: locale === 'sv'
      ? 'Transparent metodik för beräkning av AI-besparing baserad på SCB lönestatistik och verifierad kunddata.'
      : 'Transparent methodology for calculating AI savings based on SCB wage statistics and verified client data.',
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: '2025-01-01',
    dateModified: '2026-04-23',
    author: {
      '@type': 'Organization',
      name: 'Eteya Consulting AB',
      url: 'https://eteya.ai',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eteya Consulting AB',
      url: 'https://eteya.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://eteya.ai/favicon-512x512.png',
      },
    },
    articleSection: locale === 'sv' ? 'Metodik' : 'Methodology',
    keywords: locale === 'sv'
      ? 'AI-besparing, ROI-kalkylator, AI-ROI, SCB lönestatistik, automation'
      : 'AI savings, ROI calculator, AI ROI, wage statistics, automation',
    citation: [
      {
        '@type': 'CreativeWork',
        name: 'SCB (2024). Lönestrukturstatistik, hela ekonomin.',
        url: 'https://scb.se/hitta-statistik/sverige-i-siffror/lonesok/',
      },
      {
        '@type': 'CreativeWork',
        name: 'Skatteverket (2026). Arbetsgivaravgifter 2026.',
        url: 'https://www.skatteverket.se/foretag/arbetsgivare/arbetsgivaravgifterochskatteavdrag/arbetsgivaravgifter.4.233f91f71260075abe8800020817.html',
      },
      {
        '@type': 'CreativeWork',
        name: 'McKinsey Global Institute (2023). The Economic Potential of Generative AI.',
        url: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier',
      },
      {
        '@type': 'CreativeWork',
        name: 'McKinsey & Company (2023). The State of AI in 2023.',
        url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-in-2023-generative-ais-breakout-year',
      },
      {
        '@type': 'CreativeWork',
        name: 'Unionen (2025). Marknadslöner — Kundtjänstmedarbetare.',
        url: 'https://www.unionen.se/rad-och-stod/om-lon/marknadsloner',
      },
    ],
  }
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getArticleSchema(locale)) }}
      />
      <Nav />
      <div className="page-content">
        <MethodologyContent />
      </div>
      <FooterCTAClient />
    </>
  )
}
