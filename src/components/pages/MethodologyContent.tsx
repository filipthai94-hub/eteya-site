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
        locale={locale}
      />

      {/* HUR VI RÄKNAR — metodikkInner layout */}
      <section className={styles.section} data-reveal>
        <div className={styles.metodikInner}>
          
          {/* Vänster: Sticky titel */}
          <div className={styles.metodikLeft}>
            <div className={styles.metodikLeftSticky}>
              <h2 className={styles.sectionTitle}>{t('sections.howWeCalculateHeading')}</h2>
              <p className={styles.metodikSubtext}>
                {t('sections.howWeCalculateSubtext')}
              </p>
            </div>
          </div>
          
          {/* Höger: Lista med källor */}
          <div className={styles.metodikRight}>
            <ul className={styles.metodikList}>
              <li className={styles.metodikItem}>
                <div className={styles.metodikItemContent}>
                  <h3 className={styles.metodikItemTitle}>{t('sections.scbTitle')}</h3>
                  <p className={styles.metodikItemBody}>
                    {t('sections.scbBody')}
                  </p>
                </div>
                <span className={styles.metodikItemNum}>01</span>
              </li>
              
              <li className={styles.metodikItem}>
                <div className={styles.metodikItemContent}>
                  <h3 className={styles.metodikItemTitle}>{t('sections.mckinseyTitle')}</h3>
                  <p className={styles.metodikItemBody}>
                    {t('sections.mckinseyBody')}
                  </p>
                </div>
                <span className={styles.metodikItemNum}>02</span>
              </li>
              
              <li className={styles.metodikItem}>
                <div className={styles.metodikItemContent}>
                  <h3 className={styles.metodikItemTitle}>{t('sections.verifiedTitle')}</h3>
                  <p className={styles.metodikItemBody}>
                    {t('sections.verifiedBody')}
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
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{t('sections.formulaTitle')}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
            <FormulaCircles />
          </div>
        </div>
      </section>

      {/* TELESTORE BREAKDOWN — REN LISTA, INGA BOXAR */}
      <section className={styles.section} data-reveal>
        <div className={`${styles.inner} ${styles.innerTight}`}>
          <h3 className={styles.subsectionTitle}>{t('telestoreBreakdown.heading')}</h3>
          <div className={styles.breakdownList}>
            <div className={styles.breakdownRow}>
              <span>{t('telestoreBreakdown.row1')}</span>
              <span className={styles.op}>×</span>
              <span>{t('telestoreBreakdown.row2')}</span>
              <span className={styles.op}>×</span>
              <span>{t('telestoreBreakdown.row3')}</span>
            </div>
            <div className={styles.breakdownTotal}>
              {t('telestoreBreakdown.totalMax')}
            </div>
            
            <div className={styles.breakdownRow}>
              <span>{t('telestoreBreakdown.rampUp')}</span>
            </div>
            <div className={styles.breakdownTotal}>
              {t('telestoreBreakdown.totalYear1')}
            </div>
            
            <div className={styles.breakdownRow}>
              <span>{t('telestoreBreakdown.errorCosts')}</span>
            </div>
            <div className={styles.breakdownTotal}>
              {t('telestoreBreakdown.totalWithErrors')}
            </div>
            
            <div className={styles.breakdownNote}>
              <strong>{t('telestoreBreakdown.year2PlusNote')}</strong> {t('telestoreBreakdown.year2PlusCalc')}
              <br />
              {t('telestoreBreakdown.actualResult')} <strong>{t('telestoreBreakdown.actualValue')}</strong> {t('telestoreBreakdown.actualNote')}
            </div>
          </div>
        </div>
      </section>

      {/* KONSERVATIVA ANTAGANDEN */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{t('sections.conservativeHeading')}</h2>
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
      </section>

      {/* FOOTNOTES */}
      <section className={styles.section}>
        <div className={styles.inner}>
          <h3 className={styles.subsectionTitle}>{t('sections.sourcesHeading')}</h3>
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
