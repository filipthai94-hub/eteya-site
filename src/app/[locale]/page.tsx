import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
import MarqueeSection from '@/components/sections/Marquee'
import Work from '@/components/sections/Work'
import Services from '@/components/sections/Services'
import Stats from '@/components/sections/Stats'
import CTASection from '@/components/sections/CTASection'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <MarqueeSection />
      <Work />
      <Services />
      <Stats />
      <CTASection />
      <Contact />
      <Footer />
    </main>
  )
}
