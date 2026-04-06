'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ButtonStripe from '@/components/ui/ButtonStripe'
import ButtonSwap from '@/components/ui/ButtonSwap'
import FormulaCircles from './FormulaCircles'
import styles from './MethodologyContent.module.css'

gsap.registerPlugin(ScrollTrigger)

type SourceItem = { text: string; url: string | null }
type AccordionItemKey = 'limitations' | 'disclaimer'

export default function MethodologyContent() {
  const t = useTranslations('methodology')
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const ctaCountRef = useRef<HTMLSpanElement>(null)
  const [openItem, setOpenItem] = useState<AccordionItemKey | null>('limitations')
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', company: '', _honey: '' })

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
    // CTA counter 0 → 247
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
    if (formData._honey) return // honeypot
    setFormState('loading')
    try {
      const res = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, company: formData.company }),
      })
      if (res.ok) {
        setFormState('success')
        // Auto-download PDF
        const link = document.createElement('a')
        link.href = '/eteya-roi-methodology.pdf'
        link.download = 'Eteya-ROI-Methodology.pdf'
        link.click()
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
      <section className={styles.section} data-reveal>
        <div className={`${styles.inner} ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
            <p className={styles.heroSubtitle}>{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className={styles.section} data-reveal>
        <div className={styles.metodikInner}>
            <div className={styles.metodikLeft}>
              <div className={styles.metodikLeftSticky}>
                <h2 className={styles.sectionTitle}>VÅR METODIK</h2>
                <p className={styles.metodikSubtext}>Siffran du såg är inte gissad. Så här räknar vi.</p>
              </div>
            </div>
            <div className={styles.metodikRight}>
              <ul className={styles.metodikList}>
                <li className={styles.metodikItem}>
                  <div className={styles.metodikItemContent}>
                    <h3 className={styles.metodikItemTitle}>Inte gissningar</h3>
                    <p className={styles.metodikItemBody}>SCB, McKinsey och 56 verifierade automationer</p>
                  </div>
                  <span className={styles.metodikItemNum}>01</span>
                </li>
                <li className={styles.metodikItem}>
                  <div className={styles.metodikItemContent}>
                    <h3 className={styles.metodikItemTitle}>Alltid konservativt</h3>
                    <p className={styles.metodikItemBody}>Vi rundar nedåt — siffran du ser är en nedre gräns</p>
                  </div>
                  <span className={styles.metodikItemNum}>02</span>
                </li>
                <li className={styles.metodikItem}>
                  <div className={styles.metodikItemContent}>
                    <h3 className={styles.metodikItemTitle}>Helt transparent</h3>
                    <p className={styles.metodikItemBody}>Alla källor redovisas öppet längre ner på sidan</p>
                  </div>
                  <span className={styles.metodikItemNum}>03</span>
                </li>
                <li className={styles.metodikItem}>
                  <div className={styles.metodikItemContent}>
                    <h3 className={styles.metodikItemTitle}>Bevisat i praktiken</h3>
                    <p className={styles.metodikItemBody}>Telestore sparar 390 000 kr/år — verifierat, inte estimerat</p>
                  </div>
                  <span className={styles.metodikItemNum}>04</span>
                </li>
              </ul>
            </div>
          </div>
      </section>

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

      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{t('sections.formulaTitle')}</h2>
          <FormulaCircles />
        </div>
      </section>

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



      <section className={styles.section} data-reveal>
        <div className={`${styles.inner} ${styles.ctaSplit}`}>
          {/* VÄNSTER */}
          <div className={styles.ctaLeft}>
            <h2 className={styles.ctaTitle}>{t('cta.downloadTitle')}</h2>
            <ul className={styles.ctaBullets}>
              <li><span className={styles.ctaCheck}>✓</span>Komplett beräkningsmodell (Excel + PDF)</li>
              <li><span className={styles.ctaCheck}>✓</span>SCB-data och McKinsey-källor</li>
              <li><span className={styles.ctaCheck}>✓</span>Telestore case study — 390 000 kr verifierat</li>
              <li><span className={styles.ctaCheck}>✓</span>Kalkylatorns fullständiga formelblad</li>
            </ul>
            <div className={styles.ctaCounter}>
              <span className={styles.ctaCounterNum} ref={ctaCountRef}>0</span>
              <span className={styles.ctaCounterLabel}>&nbsp;företag har laddat ner rapporten</span>
            </div>
          </div>

          {/* HÖGER */}
          <div className={styles.ctaRight}>
            {formState === 'success' ? (
              <p className={styles.successText}>{t('cta.successMessage')}</p>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" name="name" required placeholder={t('cta.namePlaceholder')} value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} className={styles.input} />
                <input type="email" name="email" required placeholder={t('cta.emailPlaceholder')} value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className={styles.input} />
                <input type="text" name="company" placeholder={t('cta.companyPlaceholder')} value={formData.company} onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))} className={styles.input} />
                <input type="text" name="_honey" value={formData._honey} onChange={(e) => setFormData((prev) => ({ ...prev, _honey: e.target.value }))} className={styles.honeypot} tabIndex={-1} autoComplete="off" />
                <ButtonStripe type="submit" disabled={formState === 'loading'} fullWidth>
                  {formState === 'loading' ? '...' : t('cta.submitButton')}
                </ButtonStripe>
                {formState === 'error' ? <p className={styles.errorText}>{t('cta.errorMessage')}</p> : null}
                <p className={styles.gdpr}>{t('cta.gdpr')}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section} data-reveal>
        <div className={styles.backWrap}>
          <ButtonSwap label={`← ${t('backToCalculator')}`} href="/#roi-calculator" variant="accent" />
        </div>
      </section>

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
            className={`${styles.counterLine} ${index + 1 === currentIndex ? styles.counterLineActive : ''}`.trim()}
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
