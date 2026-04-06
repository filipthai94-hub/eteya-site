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

export default function Home() {
  return (
    <>
    <Nav />
    <main className="page-content">
      <Hero />
      <MarqueeSection />
      <Services />
      <Stats />
      <ROICalculatorSection />
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
