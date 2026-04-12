'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import styles from './PrivacyPolicyContent.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function PrivacyPolicyContent() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll('[data-reveal]')
    sections.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      )
    })
    return () => ScrollTrigger.getAll().forEach((st) => st.kill())
  }, [])

  return (
    <div ref={containerRef} className={styles.page}>
      {/* Schema Markup - WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Integritetspolicy — GDPR & Personuppgifter | Eteya',
            description: 'Eteya Consulting ABs integritetspolicy. Vi följer GDPR och behandlar dina personuppgifter säkert och transparent.',
            url: 'https://eteya.ai/sv/integritetspolicy',
            inLanguage: 'sv-SE',
            publisher: {
              '@type': 'Organization',
              name: 'Eteya',
              url: 'https://eteya.ai',
            },
          }),
        }}
      />

      {/* HERO */}
      <section className={styles.section} data-reveal>
        <div className={`${styles.inner} ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Integritetspolicy</h1>
          </div>
        </div>
      </section>

      {/* Vem är personuppgiftsansvarig? */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>Personuppgiftsansvarig</p>
          <SectionTitle heading="Vem är personuppgiftsansvarig?" />
          <div className={styles.contentBlock}>
            <p className={styles.text}>
              <strong>Eteya Consulting AB</strong> är personuppgiftsansvarig för behandlingen av dina personuppgifter.
            </p>
            <p className={styles.text}>
              Vid frågor om integritet och personuppgifter, kontakta oss på:{' '}
              <a href="mailto:contact@eteya.ai" className={styles.link}>
                contact@eteya.ai
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Vilka personuppgifter samlar vi in? */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>Personuppgifter</p>
          <SectionTitle heading="Vilka personuppgifter samlar vi in?" />
          <div className={styles.contentBlock}>
            <ul className={styles.list}>
              <li>
                <strong>Grundläggande information:</strong> namn, e-postadress
              </li>
              <li>
                <strong>Teknisk information:</strong> IP-adress, webbläsartyp, operativsystem
              </li>
              <li>
                <strong>Kommunikation:</strong> e-postkorrespondens, mötesanteckningar
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Varför behandlar vi dina personuppgifter? */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>Rättslig grund</p>
          <SectionTitle heading="Varför behandlar vi dina personuppgifter?" />
          <div className={styles.contentBlock}>
            <ul className={styles.list}>
              <li>
                <strong>För att tillhandahålla våra tjänster (GDPR Art. 6(1)(b)):</strong> Avtalsuppfyllelse: Vi behandlar uppgifter som krävs för att leverera våra tjänster till dig som kund eller leverantör.
              </li>
              <li>
                <strong>För kundsupport (GDPR Art. 6(1)(b)):</strong> Avtalsuppfyllelse: Vi behandlar uppgifter för att ge dig support och svara på dina frågor.
              </li>
              <li>
                <strong>För marknadsföring (GDPR Art. 6(1)(a)):</strong> Samtycke: Vi skickar nyhetsbrev och marknadsföring endast om du har gett oss ditt samtycke. Du kan när som helst återkalla ditt samtycke.
              </li>
              <li>
                <strong>För affärsutveckling (GDPR Art. 6(1)(f)):</strong> Legitima intressen: Vi behandlar företagskontaktuppgifter för att marknadsföra våra tjänster till relevanta beslutsfattare. Vårt legitima intresse är att utveckla vår verksamhet. Vi gör en intresseavvägning där dina rättigheter väger tyngre om du invändar.
              </li>
            </ul>
            <p className={styles.text} style={{ marginTop: '1.5rem' }}>
              <strong>Rätt att återkalla samtycke:</strong> Om behandlingen baseras på ditt samtycke har du alltid rätt att återkalla det när som helst. Återkallelsen påverkar inte behandling som har skett innan återkallelsen.
            </p>
          </div>
        </div>
      </section>

      {/* Hur länge sparar vi dina uppgifter? */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>Lagringstid</p>
          <SectionTitle heading="Hur länge sparar vi dina uppgifter?" />
          <div className={styles.contentBlock}>
            <ul className={styles.list}>
              <li>
                <strong>Kunddata:</strong> Avtalet löper + 3 år
              </li>
              <li>
                <strong>Marknadsföring:</strong> Tills avregistrering eller 2 år
              </li>
              <li>
                <strong>Teknisk data:</strong> 12 månader
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Dina rättigheter enligt GDPR */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>GDPR</p>
          <SectionTitle heading="Dina rättigheter enligt GDPR" />
          <div className={styles.contentBlock}>
            <ul className={styles.list}>
              <li>Rätt till registerutdrag</li>
              <li>Rätt till rättelse</li>
              <li>Rätt till radering</li>
              <li>Rätt till begränsning av behandling</li>
              <li>Rätt till dataportabilitet</li>
              <li>Rätt att invända mot behandling</li>
              <li>Rätt att återkalla samtycke</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Delar vi dina uppgifter med tredje part? */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>Tredje part</p>
          <SectionTitle heading="Delar vi dina uppgifter med tredje part?" />
          <div className={styles.contentBlock}>
            <ul className={styles.list}>
              <li>
                <strong>Underleverantörer:</strong> Hosting, e-posttjänster, CRM-system
              </li>
              <li>
                <strong>Myndigheter:</strong> Endast vid lagkrav
              </li>
              <li>
                <strong>Internationella överföringar:</strong> Vissa av våra underleverantörer (t.ex. Google, Microsoft) kan behandla data utanför EU/EES, främst i USA. Vi skyddar dina uppgifter genom EU-kommissionens standardavtalsklausuler och ytterligare tekniska åtgärder. Kontakta oss för mer information.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Säkerhet */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>Skydd</p>
          <SectionTitle heading="Säkerhet" />
          <div className={styles.contentBlock}>
            <ul className={styles.list}>
              <li>Kryptering av data i transit och vid lagring</li>
              <li>Tillgångskontroll och behörighetsstyrning</li>
              <li>Regelbundna säkerhetsgranskningar</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cookies */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>Cookies</p>
          <SectionTitle heading="Cookies" />
          <div className={styles.contentBlock}>
            <p className={styles.text}>
              För information om hur vi använder cookies, se vår{' '}
              <Link href="/sv/cookie-policy" className={styles.link}>
                cookie-policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Klagomål */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>Klagomål</p>
          <SectionTitle heading="Klagomål" />
          <div className={styles.contentBlock}>
            <p className={styles.text}>
              Om du har klagomål på vår behandling av personuppgifter kan du kontakta Integritetsskyddsmyndigheten (IMY):{' '}
              <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className={styles.link}>
                www.imy.se
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Ändringar */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <p className={styles.sectionMarker}>Uppdaterad</p>
          <SectionTitle heading="Ändringar" />
          <div className={styles.contentBlock}>
            <p className={styles.text}>
              Senast uppdaterad: <strong>2026-04-11</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <FooterCTAClient />
    </div>
  )
}
