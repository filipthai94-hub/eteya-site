import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
import MarqueeSection from '@/components/sections/Marquee'
import Services from '@/components/sections/Services'
import ProcessSection from '@/components/sections/ProcessSection'
import JoinTheBest from '@/components/sections/JoinTheBestClient'
import Cases from '@/components/sections/Cases'
import Stats from '@/components/sections/Stats'
import FAQSection from '@/components/sections/FAQSection'
import ROICalculatorSection from '@/components/sections/ROICalculatorSection'
import TechStack from '@/components/sections/TechStack'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import ScrollOnLoad from '@/components/ScrollOnLoad'
import {
  JsonLd,
  buildGraph,
  createWebPageSchema,
  createServiceSchema,
} from '@/components/JsonLd'

const BASE_URL = 'https://eteya.ai'

// SEO-optimized lengths (title 50-60, description 150-160) per Google SERP
// truncation thresholds. Each line tuned to include primary keyword phrases
// used by Swedish B2B buyers searching AI consulting services.
const META: Record<'sv' | 'en', {
  title: string
  description: string
  ogDescription: string
  ogAlt: string
}> = {
  sv: {
    title: 'Eteya — AI-automation & AI Agents för svenska företag',
    description: 'Mindre manuellt. Mer tillväxt. Vi bygger AI-agenter, process-automation och custom AI-lösningar som faktiskt levererar resultat. Se våra case studies.',
    ogDescription: 'Mindre manuellt. Mer tillväxt. Vi bygger AI-agenter och process-automation som levererar resultat.',
    ogAlt: 'Eteya — AI-byrå som bygger AI-agenter och automation för svenska företag',
  },
  en: {
    title: 'Eteya — AI Automation & AI Agents for Modern Business',
    description: 'Less manual work. More growth. We build AI agents, process automation and custom AI solutions that actually deliver results. See our case studies.',
    ogDescription: 'Less manual work. More growth. We build AI agents and process automation that deliver results.',
    ogAlt: 'Eteya — AI agency building AI agents and automation for businesses',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = META[(locale as 'sv' | 'en')] ?? META.sv

  const svPath = '/sv'
  const enPath = '/en'
  const currentPath = locale === 'sv' ? svPath : enPath

  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
        'x-default': `${BASE_URL}${svPath}`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.ogDescription,
      url: `${BASE_URL}${currentPath}`,
      siteName: 'Eteya',
      images: [{ url: `/images/og/og-home-${locale}.jpg`, width: 1200, height: 630, alt: m.ogAlt }],
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.ogDescription,
      images: [`/images/og/og-home-${locale}.jpg`],
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tServices = await getTranslations({ locale, namespace: 'services' })
  const m = META[(locale as 'sv' | 'en')] ?? META.sv

  const path = `/${locale}`
  const inLanguage = locale === 'sv' ? 'sv-SE' : 'en-US'

  // WebPage schema för hem-sidan med voice-search speakable selectors
  // (Organization + WebSite finns redan i root layout)
  const webPageSchema = createWebPageSchema({
    path,
    name: m.title,
    description: m.description,
    inLanguage,
    speakableSelectors: ['.hero-headline', '.hero-summary'],
  })

  // 3 services som schema (services.items i i18n innehåller title + description)
  const serviceItems = tServices.raw('items') as Array<{ title: string; description: string }>
  const serviceSlugs = ['ai-agents', 'automation', 'ai-products']
  const serviceTypes = locale === 'sv'
    ? ['AI agent development', 'Process automation', 'Custom AI products']
    : ['AI agent development', 'Process automation', 'Custom AI products']

  const serviceSchemas = serviceItems.map((item, i) =>
    createServiceSchema({
      slug: serviceSlugs[i] ?? 'service',
      name: item.title,
      description: item.description,
      serviceType: serviceTypes[i] ?? 'AI services',
      localePath: path,
    }),
  )

  // Organization + WebSite JSON-LD are rendered once by [locale]/layout.tsx.
  // Här lägger vi till sidspecifika scheman (WebPage + 3 Services).
  return (
    <>
      <JsonLd data={buildGraph([webPageSchema, ...serviceSchemas])} />
      <Nav />
      <div className="page-content">
        <Hero />
        <MarqueeSection />
        <Services />
        <Stats />
        <div id="roi-calculator">
          <ROICalculatorSection />
        </div>
        <JoinTheBest />
        <Cases params={params} />
        <ProcessSection />
        <TechStack />
        <FAQSection />
        <FooterCTAClient />
      </div>
      <ScrollOnLoad />
    </>
  )
}
