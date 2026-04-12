'use client'

import { useLocale } from 'next-intl'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitle from '@/components/ui/SectionTitle'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import styles from './PolicyContent.module.css'

gsap.registerPlugin(ScrollTrigger)

type PolicyType = 'privacy' | 'terms'

export default function PolicyContent({ type, locale = 'sv' }: { type: PolicyType; locale?: 'sv' | 'en' }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isSV = locale === 'sv'
  const isPrivacy = type === 'privacy'

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

  // Hardcoded content based on type and locale
  const content = isPrivacy
    ? {
        title: isSV ? 'Integritetspolicy' : 'Privacy Policy',
        sections: isSV
          ? [
              { marker: 'Personuppgiftsansvarig', heading: 'Vem är personuppgiftsansvarig?', type: 'text', content: '<strong>Eteya Consulting AB</strong> är personuppgiftsansvarig för behandlingen av dina personuppgifter.' },
              { marker: '', heading: '', type: 'text', content: 'Vid frågor om integritet och personuppgifter, kontakta oss på: <a href="mailto:contact@eteya.ai" class="link">contact@eteya.ai</a>' },
            ]
          : [
              { marker: 'Data Controller', heading: 'Who is the data controller?', type: 'text', content: '<strong>Eteya Consulting AB</strong> is the data controller for the processing of your personal data.' },
              { marker: '', heading: '', type: 'text', content: 'For questions about privacy and personal data, contact us at: <a href="mailto:contact@eteya.ai" class="link">contact@eteya.ai</a>' },
            ],
      }
    : {
        // VILLKOR — NY STRUKTUR ENLIGT INTEGritetspolicy
        title: isSV ? 'Allmänna Villkor' : 'Terms of Service',
        sections: isSV
          ? [
              // Företagsinformation
              { marker: 'Företagsinformation', heading: 'Kontaktuppgifter', type: 'list', items: [
                { label: 'Företag', value: 'Eteya Consulting AB' },
                { label: 'Organisationsnummer', value: '559552-7390' },
                { label: 'Adress', value: 'Solhagsvägen 26 a, 691 52 Karlskoga' },
                { label: 'Telefon', value: '+46 8 123 456 78' },
                { label: 'E-post', value: 'Kontakt@eteya.ai' },
              ]},
              // Tjänster
              { marker: 'Tjänster', heading: 'Våra tjänster', type: 'text', content: 'Vi tillhandahåller AI-automationstjänster enligt överenskommelse. Tjänsterna levereras enligt specifikation och överenskommen tidplan.' },
              // Betalning
              { marker: 'Betalning', heading: 'Betalningsvillkor', type: 'text', content: 'Betalning sker enligt faktura med 14 dagars betalvillkor. Vid försenad betalning tillkommer ränta enligt räntelagen.' },
              // Ångerrätt
              { marker: 'Ångerrätt', heading: '14 dagars ångerrätt', type: 'text', content: 'Som konsument har du 14 dagars ångerrätt enligt distansavtalslagen. Ångerfristen räknas från avtalsingången. För att utöva ångerrätten, kontakta oss på contact@eteya.ai.' },
              // Reklamation
              { marker: 'Reklamation', heading: '3 års reklamation', type: 'text', content: 'Du har 3 års reklamationstid enligt konsumentköplagen. Reklamation görs genom att kontakta oss. De första 2 åren ligger bevisbördan hos oss.' },
              // Ansvar
              { marker: 'Ansvar', heading: 'Ansvarsbegränsning', type: 'text', content: 'Vi ansvarar för tjänstens funktion enligt specifikation. Vårt totala ansvar är begränsat till vad du betalat för tjänsten. Vi ansvarar inte för indirekta skador eller följdskador.' },
              // Immateriella rättigheter
              { marker: 'Immateriella rättigheter', heading: 'IP-rättigheter', type: 'text', content: 'Alla rättigheter till leveranser och material tillhör Eteya Consulting AB om inte annat avtalats. Kunden får en icke-exklusiv licens att använda leveranser för sitt interna bruk.' },
              // Force majeure
              { marker: 'Force majeure', heading: 'Hinder utanför vår kontroll', type: 'text', content: 'Vi ansvarar inte för dröjsmål eller underlåtenhet som beror på hinder utanför vår kontroll (t.ex. naturkatastrof, krig, strejk, myndighetsbeslut).' },
              // Uppsägning
              { marker: 'Uppsägning', heading: 'Uppsägning', type: 'text', content: 'Avtal kan sägas upp med 30 dagars varsel. Vid uppsägning avslutas tjänsten och data raderas enligt gällande lagstiftning.' },
              // Tvist
              { marker: 'Tvist', heading: 'Tvistlösning', type: 'multi-text', texts: [
                'Vid tvist försöker vi först lösa den genom direkt förhandling.',
                'Om förhandling inte leder till lösning kan du som konsument vända dig till Allmänna Reklamationsnämnden (ARN).',
                'ARN prövar tvister mellan konsumenter och näringsidkare utan kostnad för konsumenten.',
              ], link: { url: 'https://www.arn.se', urlText: 'www.arn.se' }},
              // Lagstöd
              { marker: 'Lagstöd', heading: 'Tillämplig lagstiftning', type: 'links', items: [
                { name: 'Konsumentköplagen (2022:266)', url: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/konsumentkoplag-2022266_sfs-2022-266/', description: 'Reglerar köp av tjänster mellan företag och konsumenter.' },
                { name: 'Distansavtalslagen (2005:59)', url: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/lag-200559-om-distansavtal_sfs-2005-59/', description: 'Reglerar distansavtal och avtal utanför affärslokaler.' },
                { name: 'Avtalslagen (1915:218)', url: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/avtalslag-1915218-om-avtal_sfs-1915-218/', description: 'Grundläggande lag om avtal och fullmakter.' },
                { name: 'E-handelslagen (2002:562)', url: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/lag-2002562-om-elektronisk-handel_sfs-2002-562/', description: 'Reglerar elektronisk handel och informationssamhällets tjänster.' },
              ]},
            ]
          : [
              // Company Information
              { marker: 'Company Information', heading: 'Contact Details', type: 'list', items: [
                { label: 'Company', value: 'Eteya Consulting AB' },
                { label: 'Organization Number', value: '559552-7390' },
                { label: 'Address', value: 'Solhagsvägen 26 a, 691 52 Karlskoga, Sweden' },
                { label: 'Phone', value: '+46 8 123 456 78' },
                { label: 'Email', value: 'Kontakt@eteya.ai' },
              ]},
              // Services
              { marker: 'Services', heading: 'Our Services', type: 'text', content: 'We provide AI automation services according to agreement. Services are delivered according to specification and agreed timeline.' },
              // Payment
              { marker: 'Payment', heading: 'Payment Terms', type: 'text', content: 'Payment is made according to invoice with 14 days payment terms. In case of delayed payment, interest is added according to the Interest Act.' },
              // Right of Withdrawal
              { marker: 'Right of Withdrawal', heading: '14-Day Right of Withdrawal', type: 'text', content: 'As a consumer, you have a 14-day right of withdrawal according to the Distance Contracts Act. The withdrawal period is calculated from the conclusion of the agreement. To exercise your right of withdrawal, contact us at contact@eteya.ai.' },
              // Complaints
              { marker: 'Complaints', heading: '3-Year Complaint Period', type: 'text', content: 'You have a 3-year complaint period according to the Consumer Sales Act. Complaints are made by contacting us. For the first 2 years, the burden of proof lies with us.' },
              // Liability
              { marker: 'Liability', heading: 'Limitation of Liability', type: 'text', content: 'We are responsible for the service\'s function according to specification. Our total liability is limited to what you have paid for the service. We are not liable for indirect damages or consequential damages.' },
              // IP Rights
              { marker: 'Intellectual Property', heading: 'IP Rights', type: 'text', content: 'All rights to deliverables and materials belong to Eteya Consulting AB unless otherwise agreed. The customer receives a non-exclusive license to use deliverables for internal use.' },
              // Force Majeure
              { marker: 'Force Majeure', heading: 'Circumstances Beyond Our Control', type: 'text', content: 'We are not liable for delays or omissions due to circumstances beyond our control (e.g., natural disaster, war, strike, government decision).' },
              // Termination
              { marker: 'Termination', heading: 'Termination', type: 'text', content: 'Agreements can be terminated with 30 days notice. Upon termination, the service ends and data is deleted according to applicable legislation.' },
              // Disputes
              { marker: 'Disputes', heading: 'Dispute Resolution', type: 'multi-text', texts: [
                'In case of disputes, we first attempt to resolve them through direct negotiation.',
                'If negotiation does not lead to a solution, you as a consumer can turn to the National Board for Consumer Disputes (ARN).',
                'ARN handles disputes between consumers and traders at no cost to the consumer.',
              ], link: { url: 'https://www.arn.se', urlText: 'www.arn.se' }},
              // Legal Basis
              { marker: 'Legal Basis', heading: 'Applicable Legislation', type: 'links', items: [
                { name: 'Consumer Sales Act (2022:266)', url: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/konsumentkoplag-2022266_sfs-2022-266/', description: 'Governs purchases of services between businesses and consumers.' },
                { name: 'Distance Contracts Act (2005:59)', url: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/lag-200559-om-distansavtal_sfs-2005-59/', description: 'Governs distance contracts and contracts outside business premises.' },
                { name: 'Contracts Act (1915:218)', url: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/avtalslag-1915218-om-avtal_sfs-1915-218/', description: 'Basic law on contracts and powers of attorney.' },
                { name: 'E-Commerce Act (2002:562)', url: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/lag-2002562-om-elektronisk-handel_sfs-2002-562/', description: 'Governs electronic commerce and information society services.' },
              ]},
            ],
      }

  return (
    <div ref={containerRef} className={styles.page}>
      {/* Schema Markup - WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: isPrivacy
              ? (isSV ? 'Integritetspolicy — GDPR & Personuppgifter | Eteya' : 'Privacy Policy — GDPR & Personal Data | Eteya')
              : (isSV ? 'Allmänna Villkor — Eteya Consulting AB' : 'Terms of Service — Eteya Consulting AB'),
            description: isPrivacy
              ? (isSV ? 'Eteya Consulting ABs integritetspolicy. Vi följer GDPR och behandlar dina personuppgifter säkert och transparent.' : 'Eteya Consulting AB privacy policy. We comply with GDPR and handle your personal data securely and transparently.')
              : (isSV ? 'Allmänna villkor för Eteya Consulting ABs AI-automationstjänster. Läs om ångerrätt, reklamation, betalning och mer.' : 'Terms of service for Eteya Consulting AB AI automation services. Read about withdrawal rights, complaints, payment and more.'),
            url: isSV ? 'https://eteya.ai/sv/villkor' : 'https://eteya.ai/en/terms',
            inLanguage: isSV ? 'sv-SE' : 'en-US',
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
            <h1 className={styles.heroTitle}>{content.title}</h1>
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      {content.sections.map((section: any, i: number) => {
        // Skip rendering empty marker/heading rows (used for continuation text)
        if (!section.marker && !section.heading && section.type === 'text') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                <div className={styles.contentBlock}>
                  <p className={styles.text} dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              </div>
            </section>
          )
        }

        // Link row (ARN) - standalone
        if (section.type === 'link') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                <div className={styles.contentBlock}>
                  <p className={styles.text}>
                    <a
                      href={section.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className={styles.link}
                    >
                      {section.urlText}
                    </a>
                  </p>
                </div>
              </div>
            </section>
          )
        }

        // Multi-text (tvistlösning - flera texter i samma sektion)
        if (section.type === 'multi-text') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                {section.marker && <p className={styles.sectionMarker}>{section.marker}</p>}
                <SectionTitle heading={section.heading} />
                <div className={styles.contentBlock}>
                  {(section.texts || []).map((text: string, j: number) => (
                    <p key={j} className={styles.text}>{text}</p>
                  ))}
                  {section.link && (
                    <p className={styles.text}>
                      <a
                        href={section.link.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className={styles.link}
                      >
                        {section.link.urlText}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </section>
          )
        }

        // List (company info)
        if (section.type === 'list') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                {section.marker && <p className={styles.sectionMarker}>{section.marker}</p>}
                <SectionTitle heading={section.heading} />
                <div className={styles.contentBlock}>
                  <ul className={styles.list}>
                    {(section.items || []).map((item: any, j: number) => (
                      <li key={j}>
                        <strong>{item.label}:</strong> {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )
        }

        // Links (legal basis)
        if (section.type === 'links') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                {section.marker && <p className={styles.sectionMarker}>{section.marker}</p>}
                <SectionTitle heading={section.heading} />
                <div className={styles.contentBlock}>
                  <ul className={styles.list}>
                    {(section.items || []).map((item: any, j: number) => (
                      <li key={j}>
                        <strong>{item.name}:</strong> {item.description}{' '}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className={styles.link}
                        >
                          Läs mer
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )
        }

        // Default text section
        return (
          <section className={styles.section} key={i} data-reveal>
            <div className={styles.inner}>
              {section.marker && <p className={styles.sectionMarker}>{section.marker}</p>}
              {section.heading && <SectionTitle heading={section.heading} />}
              <div className={styles.contentBlock}>
                <p className={styles.text} dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            </div>
          </section>
        )
      })}

      {/* Footer CTA */}
      <FooterCTAClient />
    </div>
  )
}
