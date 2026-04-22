'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import BeamsBackground from '@/components/ui/BeamsBackground'
import { LayoutTextFlip } from '@/components/ui/layout-text-flip'
import { motion } from 'motion/react'
import StatsClient from '@/components/sections/StatsClient'
import styles from './TelestoreCaseStudy.module.css'

gsap.registerPlugin(ScrollTrigger)

function Counter({ current, total }: { current: number; total: number }) {
  return (
    <div className={styles.counter}>
      <span className={styles.counterNumber}>{String(current).padStart(2, '0')}</span>
      <div className={styles.counterLines}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`${styles.counterLine} ${i + 1 === current ? styles.counterLineActive : ''}`} />
        ))}
      </div>
    </div>
  )
}

export default function SannegardenCaseStudy() {
  const t = useTranslations('sannegarden')
  const containerRef = useRef<HTMLDivElement>(null)
  const snapshotRef = useRef<HTMLDivElement>(null)
  const counter1Ref = useRef<HTMLSpanElement>(null)
  const counter2Ref = useRef<HTMLSpanElement>(null)
  const counter3Ref = useRef<HTMLDivElement>(null)
  const donutRef = useRef<HTMLDivElement>(null)
  const donutCenterRef = useRef<HTMLSpanElement>(null)
  const bulletTableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll('[data-reveal]')
    sections.forEach((el) => {
      gsap.fromTo(el,
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

  useEffect(() => {
    if (!snapshotRef.current) return
    const ctx = gsap.context(() => {
      const counters = [
        { el: counter1Ref.current, target: 30, prefix: '', suffix: '+', format: false },
        { el: counter2Ref.current, target: 23, prefix: '', suffix: '%', format: false },
        { el: counter3Ref.current, target: 0, prefix: '', suffix: '', format: false },
      ]
      counters.forEach(({ el, target, prefix, suffix, format }) => {
        if (!el) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: snapshotRef.current!, start: 'top 80%', once: true },
          onUpdate: () => {
            const v = format ? Math.round(obj.val).toLocaleString('sv-SE') : Math.round(obj.val).toString()
            el.textContent = prefix + v + suffix
          },
        })
      })
    }, snapshotRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!donutRef.current) return
    const ctx = gsap.context(() => {
      const segments = donutRef.current!.querySelectorAll('[data-donut-segment]')
      segments.forEach((seg, i) => {
        const el = seg as SVGCircleElement
        const dashArray = el.getAttribute('stroke-dasharray')
        const segLength = dashArray ? parseFloat(dashArray.split(' ')[0]) : 0
        const originalOffset = parseFloat(el.getAttribute('stroke-dashoffset') || '0')
        gsap.fromTo(el,
          { strokeDashoffset: segLength + originalOffset, opacity: 1 },
          {
            strokeDashoffset: originalOffset,
            duration: 1.2,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger: { trigger: donutRef.current!, start: 'top 80%', once: true },
          }
        )
      })
      if (donutCenterRef.current) {
        gsap.fromTo(donutCenterRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, delay: 0.6, ease: 'back.out(1.7)',
            scrollTrigger: { trigger: donutRef.current!, start: 'top 80%', once: true }
          }
        )
      }
    }, donutRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!bulletTableRef.current) return
    const ctx = gsap.context(() => {
      const rows = bulletTableRef.current!.querySelectorAll('[data-bullet-row]')
      rows.forEach((row) => {
        const before = row.querySelector('[data-bullet-before]') as HTMLElement | null
        const after = row.querySelector('[data-bullet-after]') as HTMLElement | null
        if (!before || !after) return
        gsap.fromTo([before, after], { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out', transformOrigin: 'left center', stagger: 0.2,
          scrollTrigger: { trigger: row, start: 'top 85%', once: true }
        })
      })
    }, bulletTableRef)
    return () => ctx.revert()
  }, [])

  const heroWords = [t('heroWords.0'), t('heroWords.1'), t('heroWords.2')]

  const solutionItems = [
    { title: t('solution.item1Title'), body: t('solution.item1Body') },
    { title: t('solution.item2Title'), body: t('solution.item2Body') },
    { title: t('solution.item3Title'), body: t('solution.item3Body') },
    { title: t('solution.item4Title'), body: t('solution.item4Body') },
  ]

  const bulletRows = [
    { name: t('savings.row1Name'), volume: t('savings.row1Volume'), before: '100%', after: '0%', saved: t('savings.row1Saved') },
    { name: t('savings.row2Name'), volume: t('savings.row2Volume'), before: '20%', after: '85%', saved: t('savings.row2Saved') },
    { name: t('savings.row3Name'), volume: t('savings.row3Volume'), before: '62%', after: '85%', saved: '+23%' },
    { name: t('savings.row4Name'), volume: t('savings.row4Volume'), before: '30%', after: '90%', saved: t('savings.row4Saved') },
  ]

  return (
    <div ref={containerRef} className={styles.page}>

      {/* HERO */}
      <section className={styles.heroSection}>
        <BeamsBackground intensity="subtle" />
        <div className={styles.heroGrid}>
          <div className={styles.heroContentWrapper}>
            <motion.h1 layoutId="hero-title" className={styles.heroTitle}>
              {t('heroTitle')}
            </motion.h1>
            <LayoutTextFlip
              words={heroWords}
              duration={2500}
            />
          </div>
        </div>
      </section>

      {/* UTMANINGEN */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{t('challenge.title')}</h2>
          <div className={styles.sourcesGrid}>
            <article className={styles.sourceCard}>
              <Counter current={1} total={4} />
              <h3>{t('challenge.card1Title')}</h3>
              <p>{t('challenge.card1Body')}</p>
            </article>
            <article className={styles.sourceCard}>
              <Counter current={2} total={4} />
              <h3>{t('challenge.card2Title')}</h3>
              <p>{t('challenge.card2Body')}</p>
            </article>
            <article className={styles.sourceCard}>
              <Counter current={3} total={4} />
              <h3>{t('challenge.card3Title')}</h3>
              <p>{t('challenge.card3Body')}</p>
            </article>
            <article className={styles.sourceCard}>
              <Counter current={4} total={4} />
              <h3>{t('challenge.card4Title')}</h3>
              <p>{t('challenge.card4Body')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* LÖSNINGEN */}
      <section className={styles.section} data-reveal>
        <div className={styles.metodikInner}>
          <div className={styles.metodikLeft}>
            <div className={styles.metodikLeftSticky}>
              <h2 className={styles.sectionTitle}>{t('solution.title')}</h2>
              <p className={styles.metodikSubtext}>{t('solution.body')}</p>
            </div>
          </div>
          <div className={styles.metodikRight}>
            <ul className={styles.metodikList}>
              {solutionItems.map((item, i) => (
                <li key={i} className={styles.metodikItem}>
                  <div className={styles.metodikItemContent}>
                    <h3 className={styles.metodikItemTitle}>{item.title}</h3>
                    <p className={styles.metodikItemBody}>{item.body}</p>
                  </div>
                  <span className={styles.metodikItemNum}>{String(i + 1).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* RESULTAT */}
      <section className={styles.section} data-reveal>
        <div className={styles.statsTitleWrapper}>
          <h2 className={styles.sectionTitle}>{t('results.title')}</h2>
        </div>
        <StatsClient heading="" items={[
          { value: 30, suffix: t('results.stat1Suffix'), label: t('results.stat1Label') },
          { value: 23, suffix: t('results.stat2Suffix'), label: t('results.stat2Label') },
          { value: 0, suffix: '', label: t('results.stat3Label') },
        ]} />
      </section>

      {/* BESPARINGAR */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{t('savings.title')}</h2>
          <p className={styles.savingsSubtitle}>{t('savings.subtitle')}</p>

          {/* Snapshot Bar */}
          <div className={styles.savingsSnapshotBar} ref={snapshotRef} data-reveal>
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter1Ref}>{t('savings.snapshot1Value')}</span>
              <span className={styles.savingsSnapshotLabel}>{t('savings.snapshot1Label')}</span>
            </div>
            <div className={styles.savingsSnapshotDivider} />
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter2Ref}>{t('savings.snapshot2Value')}</span>
              <span className={styles.savingsSnapshotLabel}>{t('savings.snapshot2Label')}</span>
            </div>
            <div className={styles.savingsSnapshotDivider} />
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter3Ref}>{t('savings.snapshot3Value')}</span>
              <span className={styles.savingsSnapshotLabel}>{t('savings.snapshot3Label')}</span>
            </div>
          </div>

          {/* Two-column: Donut + Bullet Chart */}
          <div className={styles.savingsLayout} data-reveal>

            {/* Donut Chart */}
            <div className={styles.savingsDonutSection} ref={donutRef}>
              <div className={styles.savingsDonutTitle}>{t('savings.donutTitle')}</div>
              <div className={styles.savingsDonutWrap}>
                <svg className={styles.savingsDonutSvg} viewBox="0 0 200 200">
                  <circle className={styles.savingsDonutTrack} cx="100" cy="100" r="80" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#C8FF00" strokeDasharray="175.9 327.1" strokeDashoffset="0" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#8BCC00" strokeDasharray="125.7 377.3" strokeDashoffset="-175.9" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#5A8A00" strokeDasharray="100.5 402.5" strokeDashoffset="-301.6" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#3D5E00" strokeDasharray="50.3 452.7" strokeDashoffset="-402.1" />
                </svg>
                <div className={styles.savingsDonutCenter}>
                  <span className={styles.savingsDonutCenterValue} ref={donutCenterRef}>75%</span>
                  <span className={styles.savingsDonutCenterLabel}>{t('savings.donutCenterLabel')}</span>
                </div>
              </div>
              <div className={styles.savingsLegend}>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#C8FF00' }} /><span className={styles.savingsLegendText}>{t('savings.legend1')}</span><span className={styles.savingsLegendValue}>35%</span></div>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#8BCC00' }} /><span className={styles.savingsLegendText}>{t('savings.legend2')}</span><span className={styles.savingsLegendValue}>25%</span></div>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#5A8A00' }} /><span className={styles.savingsLegendText}>{t('savings.legend3')}</span><span className={styles.savingsLegendValue}>20%</span></div>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#3D5E00' }} /><span className={styles.savingsLegendText}>{t('savings.legend4')}</span><span className={styles.savingsLegendValue}>10%</span></div>
              </div>
            </div>

            {/* Bullet Chart Table */}
            <div className={styles.savingsBulletTable} ref={bulletTableRef}>
              <div className={styles.savingsTableHeader}>
                <span>{t('savings.tableProcess')}</span>
                <span>{t('savings.tableComparison')}</span>
                <span>{t('savings.tableSaved')}</span>
              </div>
              {bulletRows.map((row, i) => (
                <div key={i} className={styles.savingsTableRow} data-bullet-row>
                  <div className={styles.savingsProcessInfo}>
                    <span className={styles.savingsProcessName}>{row.name}</span>
                    <span className={styles.savingsProcessVolume}>{row.volume}</span>
                  </div>
                  <div className={styles.savingsBulletChart}>
                    <div className={styles.savingsBulletBar}>
                      <div className={styles.savingsBulletBefore} data-bullet-before style={{ width: row.before }} />
                      <div className={styles.savingsBulletAfter} data-bullet-after style={{ width: row.after }} />
                    </div>
                    <div className={styles.savingsBulletLabels}>
                      <span>{row.before === '100%' ? t('savings.manual') : row.before}</span>
                      <span className={styles.savingsBulletLabelAfter}>{row.after}</span>
                    </div>
                  </div>
                  <div className={styles.savingsSavedValue}>{row.saved}</div>
                </div>
              ))}
              <div className={styles.savingsTotalRow}>
                <div className={styles.savingsTotalLabel}>{t('savings.totalLabel')}</div>
                <div></div>
                <div className={styles.savingsTotalValue}>75%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CITAT */}
      <section className={styles.quoteSection} data-reveal>
        <div className={styles.quoteInner}>
          <div className={styles.quoteImageWrap}>
            <Image
              src="/images/kerem-celik.jpg"
              alt={t('quote.author')}
              width={180}
              height={180}
              className={styles.quoteImage}
            />
          </div>
          <div className={styles.quoteContent}>
            <blockquote className={styles.quoteText}>{t('quote.text')}</blockquote>
            <div className={styles.quoteAuthor}>
              <span className={styles.quoteName}>{t('quote.author')}</span>
              <span className={styles.quoteRole}>{t('quote.role')}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}