import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import MethodologyContent from '@/components/pages/MethodologyContent'

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
    },
  }
}

const citationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'AI-besparing kalkylator — Hur vi räknar',
  description: 'Transparent metodik för beräkning av AI-besparing baserad på SCB lönestatistik och verifierad kunddata.',
  publisher: {
    '@type': 'Organization',
    name: 'Eteya',
    url: 'https://eteya.ai',
  },
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

export default function MethodologyPage() {
  return (
    <>
      <Nav />
      <main className="page-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(citationSchema) }}
        />
        <MethodologyContent />
      </main>
    </>
  )
}
