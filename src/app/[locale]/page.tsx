import type { Metadata } from 'next'
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/JsonLd'
import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
import MarqueeSection from '@/components/sections/Marquee'
import Services from '@/components/sections/Services'
import ProcessSection from '@/components/sections/ProcessSection'
import JoinTheBest from '@/components/sections/JoinTheBestClient'
import Cases from '@/components/sections/CasesClient'
import Stats from '@/components/sections/Stats'
import FAQSection from '@/components/sections/FAQSection'
import ROICalculatorSection from '@/components/sections/ROICalculatorSection'
import TechStack from '@/components/sections/TechStack'
import FooterCTAClient from '@/components/sections/FooterCTAClient'

const BASE_URL = 'https://eteya.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const svPath = '/sv'
  const enPath = '/en'
  const currentPath = locale === 'sv' ? svPath : enPath

  return {
    title: 'Eteya AI — AI som driver ditt företag',
    description: 'Mindre manuellt. Mer tillväxt. Vi bygger AI-automation som faktiskt levererar resultat — inte bara låter bra på möten. Se våra case studies.',
    alternates: {
      canonical: `${BASE_URL}${currentPath}`,
      languages: {
        sv: `${BASE_URL}${svPath}`,
        en: `${BASE_URL}${enPath}`,
        'x-default': `${BASE_URL}${svPath}`,
      },
    },
    openGraph: {
      title: 'Eteya AI — AI som driver ditt företag',
      description: 'Mindre manuellt. Mer tillväxt. Vi bygger AI-automation som faktiskt levererar resultat.',
      url: `${BASE_URL}${currentPath}`,
      siteName: 'Eteya',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Eteya AI' }],
      locale: locale === 'sv' ? 'sv_SE' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Eteya AI — AI som driver ditt företag',
      description: 'Mindre manuellt. Mer tillväxt. Vi bygger AI-automation som faktiskt levererar resultat.',
      images: ['/images/og-image.jpg'],
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
    <Nav />
    <main className="page-content">
      <Hero />
      <MarqueeSection />
      <Services />
      <Stats />
      <div id="roi-calculator">
        <ROICalculatorSection />
      </div>
      <JoinTheBest />
      <Cases />
      <ProcessSection />
      <TechStack />
      <FAQSection />
      <FooterCTAClient />
    </main>
    </>
  )
}
