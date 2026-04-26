import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import MethodologyContent from '@/components/pages/MethodologyContent'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import {
  JsonLd,
  buildGraph,
  createBreadcrumbSchema,
  ORG_ID,
} from '@/components/JsonLd'

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

// HowTo schema — step-by-step methodology for AI Overview / Perplexity citation
const getHowToSchema = (locale: string) => {
  const isSv = locale === 'sv'
  const path = isSv ? '/sv/ai-besparing' : '/en/ai-savings'
  return {
    '@type': 'HowTo',
    '@id': `${BASE_URL}${path}#howto`,
    name: isSv
      ? 'Så här räknar Eteya AI-besparing'
      : 'How Eteya calculates AI savings',
    description: isSv
      ? 'Transparent 5-stegs metodik för att beräkna verklig AI-besparing baserad på SCB-lönestatistik, McKinsey automationsdata och Forrester ramp-up-benchmark.'
      : 'Transparent 5-step methodology to calculate real AI savings, based on SCB wage statistics, McKinsey automation data and Forrester ramp-up benchmarks.',
    totalTime: 'PT10M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'SEK',
      value: '0',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: isSv ? 'Identifiera processer' : 'Identify processes',
        text: isSv
          ? 'Lista vilka manuella processer ni har idag — kundtjänst, fakturering, leads, rapportering, e-post, intern koordinering. Markera de som är repetitiva och regelbaserade.'
          : 'List your current manual processes — customer service, invoicing, leads, reporting, email, internal coordination. Mark the ones that are repetitive and rule-based.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: isSv ? 'Mät tidsåtgång per vecka' : 'Measure hours per week',
        text: isSv
          ? 'Räkna hur många timmar per vecka teamet spenderar på varje process. Inkludera alla anställda som rör processen, inte bara en person.'
          : 'Count how many hours per week your team spends on each process. Include everyone touching the process, not just one person.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: isSv ? 'Tillämpa automationsgrad' : 'Apply automation rate',
        text: isSv
          ? 'Multiplicera med branschmässig automationsgrad: kundtjänst 45%, fakturering 65%, rapportering 70%, e-post 50%. Källa: McKinsey Economic Potential of Generative AI (2023).'
          : 'Multiply by industry-standard automation rate: customer service 45%, invoicing 65%, reporting 70%, email 50%. Source: McKinsey Economic Potential of Generative AI (2023).',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: isSv ? 'Beräkna årlig besparing' : 'Calculate annual savings',
        text: isSv
          ? 'Timmar/vecka × automationsgrad × 52 veckor × 400 kr/h = teoretisk maxbesparing per år. Timkostnaden 400 kr/h baseras på SCB Lönestrukturstatistik 2024 + Skatteverket arbetsgivaravgift 31,42%.'
          : 'Hours/week × automation rate × 52 weeks × 400 SEK/h = theoretical max savings per year. The 400 SEK/h hourly cost is based on SCB Wage Statistics 2024 + Skatteverket employer fee 31.42%.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: isSv ? 'Applicera ramp-up-faktor' : 'Apply ramp-up factor',
        text: isSv
          ? 'År 1: 40% av maxbesparing (implementation + inkörning). År 2: 75%. År 3: 100% (full effekt). Konservativ Forrester TEI / Deloitte RPA Survey-benchmark — vi rundar nedåt, aldrig uppåt.'
          : 'Year 1: 40% of max savings (implementation + ramp-up). Year 2: 75%. Year 3: 100% (full effect). Conservative Forrester TEI / Deloitte RPA Survey benchmark — we round down, never up.',
      },
    ],
  }
}

const getArticleSchema = (locale: string) => {
  const path = locale === 'sv' ? '/sv/ai-besparing' : '/en/ai-savings'
  const url = `${BASE_URL}${path}`
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: locale === 'sv'
      ? 'AI-besparing kalkylator — Hur vi räknar'
      : 'AI Savings Calculator — How we calculate',
    description: locale === 'sv'
      ? 'Transparent metodik för beräkning av AI-besparing baserad på SCB lönestatistik och verifierad kunddata.'
      : 'Transparent methodology for calculating AI savings based on SCB wage statistics and verified client data.',
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    datePublished: '2025-01-01',
    dateModified: '2026-04-26',
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
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
  const path = locale === 'sv' ? '/sv/ai-besparing' : '/en/ai-savings'
  const homePath = `/${locale}`

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: locale === 'sv' ? 'Hem' : 'Home', path: homePath },
    { name: locale === 'sv' ? 'AI-besparing' : 'AI Savings', path },
  ])

  return (
    <>
      <JsonLd data={buildGraph([
        getArticleSchema(locale),
        getHowToSchema(locale),
        breadcrumbSchema,
      ])} />
      <Nav />
      <div className="page-content">
        <MethodologyContent />
      </div>
      <FooterCTAClient />
    </>
  )
}
