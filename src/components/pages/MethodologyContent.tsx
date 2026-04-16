'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ButtonStripe from '@/components/ui/ButtonStripe'
import ButtonSwap from '@/components/ui/ButtonSwap'
import FormulaCircles from './FormulaCircles'
import MethodologyHeroClient from '@/components/sections/MethodologyHeroClient'
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

      {/* QUICK RESULT CARD */}
      <section className={styles.section} data-reveal>
        <div className={styles.quickResultCard}>
          <p className={styles.quickResultLabel}>{t('quickResult.label')}</p>
          <div className={styles.quickResultValue}>
            <span ref={resultCountRef}>0</span>&nbsp;000 kr/år
          </div>
          <p className={styles.quickResultSource}>
            {t('quickResult.source', { count: 56, industry: 'e-handel', employees: '<10' })}
          </p>
          <ButtonSwap
            label={t('quickResult.cta')}
            arrow
            href="/#roi-calculator"
            variant="accent"
            size="lg"
          />
        </div>
      </section>

      {/* 3 CARDS - METHODOLOGY */}
      <section className={styles.section} data-reveal>
        <div className={styles.cardsGrid}>
          <article className={styles.methodCard}>
            <div className={styles.cardValue}>{tCards('scb.value')}</div>
            <h3 className={styles.cardTitle}>{tCards('scb.title')}</h3>
            <div className={styles.cardSubvalue}>{tCards('scb.subvalue')}</div>
            <p className={styles.cardFootnote}>{tCards('scb.footnote')}</p>
          </article>

          <article className={styles.methodCard}>
            <div className={styles.cardValue}>{tCards('mckinsey.value')}</div>
            <h3 className={styles.cardTitle}>{tCards('mckinsey.title')}</h3>
            <div className={styles.cardSubvalue}>{tCards('mckinsey.subvalue')}</div>
            <p className={styles.cardFootnote}>{tCards('mckinsey.footnote')}</p>
          </article>

          <article className={styles.methodCard}>
            <div className={styles.cardValue}>{tCards('verified.value')}</div>
            <h3 className={styles.cardTitle}>{tCards('verified.title')}</h3>
            <div className={styles.cardSubvalue}>{tCards('verified.subvalue')}</div>
            <p className={styles.cardFootnote}>{tCards('verified.footnote')}</p>
          </article>
        </div>
      </section>

      {/* DATAKÄLLOR */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{t('sections.sourcesTitle')}</h2>
          <div className={styles.sourcesGrid}>
            <article className={styles.sourceCard}>
              {renderCounter(1, 3)}
              <h3>{t('sections.scbTitle')}</h3>
              <p>{t('sections.scbBody')}</p>
            </article>
            <article className={styles.sourceCard}>
              {renderCounter(2, 3)}
              <h3>{t('sections.mckinseyTitle')}</h3>
              <p>{t('sections.mckinseyBody')}</p>
            </article>
            <article className={styles.sourceCard}>
              {renderCounter(3, 3)}
              <h3>{t('sections.verifiedTitle')}</h3>
              <p>{t('sections.verifiedBody')}</p>
              <div className={styles.sourceLinkWrap}>
                <ButtonSwap
                  label={t('sections.verifiedLink')}
                  arrow
                  href={locale === 'sv' ? '/sv/kundcase/telestore' : '/en/case-studies/telestore'}
                  size="sm"
                  variant="white"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* FORMEL */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{t('sections.formulaTitle')}</h2>
          <FormulaCircles />
        </div>
      </section>

      {/* KONSERVATIVA ANTAGANDEN */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h3 className={styles.subsectionTitle}>Varför AI-besparing alltid är högre i verkligheten</h3>
          <div className={styles.sourcesGrid}>
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

      {/* CTA - FÖRENKLAT FORMULÄR */}
      <section className={styles.section} data-reveal>
        <div className={`${styles.inner} ${styles.ctaSplit}`}>
          <div className={styles.ctaLeft}>
            <h2 className={styles.ctaTitle}>{tCta('title')}</h2>
            <p className={styles.ctaSubtitle}>{tCta('subtitle')}</p>
            <ul className={styles.ctaBullets}>
              <li><span className={styles.ctaCheck}>✓</span>Anpassad analys av ert case</li>
              <li><span className={styles.ctaCheck}>✓</span>Konkret besparingsberäkning</li>
              <li><span className={styles.ctaCheck}>✓</span>Återkoppling inom 24h</li>
              <li><span className={styles.ctaCheck}>✓</span>Helt kostnadsfritt</li>
            </ul>
            <div className={styles.ctaCounter}>
              <span className={styles.ctaCounterNum} ref={ctaCountRef}>0</span>
              <span className={styles.ctaCounterLabel}>&nbsp;{tCta('socialProof', { count: 12 }).replace('12 företag har redan fått sin analys', 'företag har redan fått sin analys')}</span>
            </div>
          </div>

          <div className={styles.ctaRight}>
            {formState === 'success' ? (
              <p className={styles.successText}>{tCta('successMessage')}</p>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={tCta('fields.email.placeholder')}
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={styles.input}
                />
                <input
                  type="text"
                  name="company"
                  required
                  placeholder={tCta('fields.company.placeholder')}
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  className={styles.input}
                />
                <label className={styles.gdprLabel}>
                  <input
                    type="checkbox"
                    name="gdpr"
                    required
                    checked={formData.gdpr}
                    onChange={(e) => setFormData((prev) => ({ ...prev, gdpr: e.target.checked }))}
                  />
                  {tCta('gdprCheckbox')}
                </label>
                <input type="text" name="_honey" value={formData._honey} onChange={(e) => setFormData((prev) => ({ ...prev, _honey: e.target.value }))} className={styles.honeypot} tabIndex={-1} autoComplete="off" />
                <ButtonStripe type="submit" disabled={formState === 'loading'} fullWidth>
                  {formState === 'loading' ? '...' : tCta('submit')}
                </ButtonStripe>
                {formState === 'error' ? <p className={styles.errorText}>{tCta('errorMessage')}</p> : null}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* BACK TO CALCULATOR */}
      <section className={styles.section} data-reveal>
        <div className={styles.backWrap}>
          <ButtonSwap label={`← ${t('backToCalculator')}`} href="/#roi-calculator" variant="accent" />
        </div>
      </section>

      {/* FOOTNOTES */}
      <section className={styles.section}>
        <div className={styles.inner}>
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
