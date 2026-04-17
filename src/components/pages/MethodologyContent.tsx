'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ButtonStripe from '@/components/ui/ButtonStripe'
import ButtonSwap from '@/components/ui/ButtonSwap'
import FormulaCircles from './FormulaCircles'
import MethodologyHeroClient from '@/components/sections/MethodologyHeroClient'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import styles from './MethodologyContent.module.css'

gsap.registerPlugin(ScrollTrigger)

type SourceItem = { text: string; url: string | null }
type AccordionItemKey = 'limitations' | 'disclaimer'

export default function MethodologyContent() {
  const t = useTranslations('methodology')
  const tHero = useTranslations('methodologyHero')
  const tCards = useTranslations('methodology.cards')
  const tTrust = useTranslations('methodology.trustStack')
  const tCta = useTranslations('methodology.cta')
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const ctaCountRef = useRef<HTMLSpanElement>(null)
  const resultCountRef = useRef<HTMLSpanElement>(null)
  const [openItem, setOpenItem] = useState<AccordionItemKey | null>('limitations')
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ email: '', company: '', _honey: '', gdpr: false })

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
    
    // Result count animation (0 → 390,000)
    if (resultCountRef.current) {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: 390,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: resultCountRef.current, start: 'top 80%', once: true },
        onUpdate() { 
          if (resultCountRef.current) {
            resultCountRef.current.textContent = Math.round(obj.val).toLocaleString('sv-SE')
          }
        },
        onComplete() { 
          if (resultCountRef.current) {
            resultCountRef.current.textContent = '390'
          }
        },
      })
    }

    // CTA counter 0 → 12
    if (ctaCountRef.current) {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: 12,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: ctaCountRef.current, start: 'top 80%', once: true },
        onUpdate() { if (ctaCountRef.current) ctaCountRef.current.textContent = Math.round(obj.val).toString() },
        onComplete() { if (ctaCountRef.current) ctaCountRef.current.textContent = '12' },
      })
    }

    return () => ScrollTrigger.getAll().forEach((st) => st.kill())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData._honey || !formData.gdpr) return
    setFormState('loading')
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '', email: formData.email, company: formData.company }),
      })
      if (res.ok) {
        setFormState('success')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  const sourceItems = t.raw('sources.items') as SourceItem[]
  const conservativeItems = t.raw('sections.conservativeBody') as string[]

  const accordionItems = [
    {
      key: 'limitations' as const,
      title: t('sections.limitationsTitle'),
      body: t('sections.limitationsBody'),
    },
    {
      key: 'disclaimer' as const,
      title: t('sections.disclaimerTitle'),
      body: t('sections.disclaimerBody'),
    },
  ]

  return (
    <div ref={containerRef} className={styles.page}>
      {/* HERO SECTION */}
      <MethodologyHeroClient
        title={tHero('title')}
        subtitle={tHero('subtitle')}
      />

      {/* HUR VI RÄKNAR — metodikkInner layout */}
      <section className={styles.section} data-reveal>
        <div className={styles.metodikInner}>
          
          {/* Vänster: Sticky titel */}
          <div className={styles.metodikLeft}>
            <div className={styles.metodikLeftSticky}>
              <h2 className={styles.sectionTitle}>HUR VI RÄKNAR</h2>
              <p className={styles.metodikSubtext}>
                Tre oberoende källor. Konservativa siffror. Allt verifierat.
              </p>
            </div>
          </div>
          
          {/* Höger: Lista med källor */}
          <div className={styles.metodikRight}>
            <ul className={styles.metodikList}>
              <li className={styles.metodikItem}>
                <div className={styles.metodikItemContent}>
                  <h3 className={styles.metodikItemTitle}>SCB Lönestatistik</h3>
                  <p className={styles.metodikItemBody}>
                    Bruttolöner per yrkesgrupp (SSYK-koder 4222, 4119, 3322, 3313). 
                    Viktat snitt: 36 465 kr/mån → belastad kostnad 54 333 kr/mån. 
                    Kalkylatorns värde: 350 kr/h (konservativt).
                  </p>
                </div>
                <span className={styles.metodikItemNum}>01</span>
              </li>
              
              <li className={styles.metodikItem}>
                <div className={styles.metodikItemContent}>
                  <h3 className={styles.metodikItemTitle}>McKinsey Research</h3>
                  <p className={styles.metodikItemBody}>
                    "The Economic Potential of Generative AI" (2023). 
                    Kundtjänst: 30–45% kostnadsreduktion. 
                    Alla arbetsaktiviteter: 60–70% av tid (teoretiskt).
                  </p>
                </div>
                <span className={styles.metodikItemNum}>02</span>
              </li>
              
              <li className={styles.metodikItem}>
                <div className={styles.metodikItemContent}>
                  <h3 className={styles.metodikItemTitle}>Verifierad Kunddata</h3>
                  <p className={styles.metodikItemBody}>
                    56 aktiva automationer kartlagda hos Telestore Sverige AB. 
                    Transaktionsvolymer hämtade direkt från Airtable. 
                    Total verifierad besparing: ~390 000 kr/år.
                  </p>
                </div>
                <span className={styles.metodikItemNum}>03</span>
              </li>
            </ul>
          </div>
          
        </div>
      </section>

      {/* FORMEL */}
      <section className={styles.section} data-reveal>
        <div className={styles.metodikInner}>
          <div className={styles.metodikLeft}>
            <div className={styles.metodikLeftSticky}>
              <h2 className={styles.sectionTitle}>{t('sections.formulaTitle')}</h2>
            </div>
          </div>
          <div className={styles.metodikRight}>
            <FormulaCircles />
          </div>
        </div>
      </section>

      {/* TELESTORE BREAKDOWN — REN LISTA, INGA BOXAR */}
      <section className={styles.section} data-reveal>
        <div className={styles.metodikInner}>
          <div className={styles.metodikLeft}>
            <div className={styles.metodikLeftSticky}>
              <h3 className={styles.subsectionTitle}>Så här räknade vi på Telestore</h3>
            </div>
          </div>
          <div className={styles.metodikRight}>
            <div className={styles.breakdownList}>
              <div className={styles.breakdownRow}>
                <span>26 timmar/vecka (faktisk tidsbesparing)</span>
                <span className={styles.op}>×</span>
                <span>52 veckor</span>
                <span className={styles.op}>×</span>
                <span>350 kr/h</span>
              </div>
              <div className={styles.breakdownTotal}>
                = 473 200 kr/år (teoretiskt max)
              </div>
              
              <div className={styles.breakdownRow}>
                <span>× 0.65 (år 1 ramp-up)</span>
              </div>
              <div className={styles.breakdownTotal}>
                = 307 580 kr/år (tidsbesparing, år 1)
              </div>
              
              <div className={styles.breakdownRow}>
                <span>+ 26 400 kr/år (eliminerade felkostnader)</span>
              </div>
              <div className={styles.breakdownTotal}>
                = ~334 000 kr/år (totalt, år 1)
              </div>
              
              <div className={styles.breakdownNote}>
                <strong>År 2+ (full effekt):</strong> 26 × 52 × 350 × 1.0 + 26 400 = ~500 000 kr/år
                <br />
                Telestores faktiska resultat: <strong>~390 000 kr/år</strong> (konservativt räknat)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KONSERVATIVA ANTAGANDEN */}
      <section className={styles.section} data-reveal>
        <div className={styles.metodikInner}>
          <div className={styles.metodikLeft}>
            <div className={styles.metodikLeftSticky}>
              <h3 className={styles.subsectionTitle}>Varför AI-besparing alltid är högre i verkligheten</h3>
            </div>
          </div>
          <div className={styles.metodikRight}>
            <div className={styles.conservativeGrid}>
              {conservativeItems.map((item, index) => {
                const { title, text } = splitFact(item)
                return (
                  <article key={index} className={styles.sourceCard}>
                    {renderCounter(index + 1, conservativeItems.length)}
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTNOTES */}
      <section className={styles.section}>
        <div className={styles.metodikInner}>
          <div className={styles.metodikLeft}>
            <div className={styles.metodikLeftSticky}>
              <h3 className={styles.subsectionTitle}>Källor</h3>
            </div>
          </div>
          <div className={styles.metodikRight}>
            <ol className={styles.footnoteList}>
              {sourceItems.map((source, index) => (
                <li key={index}>
                  <span className={styles.footnoteNum}>[{index + 1}]</span>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="nofollow noopener noreferrer">
                      {source.text}
                    </a>
                  ) : (
                    source.text
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

    </div>
  )
}

function renderCounter(currentIndex: number, totalItems: number) {
  return (
    <div className={styles.counter}>
      <span className={styles.counterNumber}>{String(currentIndex).padStart(2, '0')}</span>
      <div className={styles.counterLines}>
        {Array.from({ length: totalItems }, (_, index) => (
          <span
            key={index}
            className={`${styles.counterLine} ${index + 1 === currentIndex ? styles.counterLineActive : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

function splitFact(item: string) {
  const clean = item.trim()
  const colon = clean.indexOf(':')

  if (colon > 0) {
    return {
      title: clean.slice(0, colon).trim(),
      text: clean.slice(colon + 1).trim(),
    }
  }

  const parts = clean.split('(')
  if (parts.length > 1) {
    return {
      title: parts[0].trim(),
      text: `(${parts.slice(1).join('(')}`,
    }
  }

  return { title: clean, text: '' }
}
