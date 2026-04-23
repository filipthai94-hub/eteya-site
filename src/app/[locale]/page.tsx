import type { Metadata } from 'next'
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

const BASE_URL = 'https://eteya.ai'

// SEO-optimized lengths (title 50-60, description 150-160) per Google SERP
// truncation thresholds. Each line tuned to include primary keyword phrases
// used by Swedish B2B buyers searching AI consulting services.
const META: Record<'sv' | 'en', {
  title: string
  description: string
  ogDescription: string
}> = {
  sv: {
    title: 'Eteya AI — AI-automation & AI Agents för svenska företag',
    description: 'Mindre manuellt. Mer tillväxt. Vi bygger AI-agenter, process-automation och custom AI-lösningar som faktiskt levererar resultat. Se våra case studies.',
    ogDescription: 'Mindre manuellt. Mer tillväxt. Vi bygger AI-agenter och process-automation som levererar resultat.',
  },
  en: {
    title: 'Eteya AI — AI Automation & AI Agents for Modern Business',
    description: 'Less manual work. More growth. We build AI agents, process automation and custom AI solutions that actually deliver results. See our case studies.',
    ogDescription: 'Less manual work. More growth. We build AI agents and process automation that deliver results.',
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
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Eteya AI' }],
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.ogDescription,
      images: ['/images/og-image.jpg'],
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  // Organization + WebSite JSON-LD are rendered once by [locale]/layout.tsx.
  // The <main> element is provided by the locale layout ("#main-content").
  return (
    <>
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
