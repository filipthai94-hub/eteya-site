'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
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

export default function MBFlyttCaseStudy() {
  const locale = useLocale()
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

  /* Counter animation for Snapshot Bar */
  useEffect(() => {
    if (!snapshotRef.current) return
    const ctx = gsap.context(() => {
      const counters = [
        { el: counter1Ref.current, target: 180, prefix: '', suffix: locale === 'sv' ? ' offerter/dag' : ' quotes/day', format: false },
        { el: counter2Ref.current, target: 95, prefix: '', suffix: '%', format: false },
        { el: counter3Ref.current, target: 12, prefix: '', suffix: '', format: false },
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
  }, [locale])

  /* Donut draw-in animation */
  useEffect(() => {
    if (!donutRef.current) return
    const ctx = gsap.context(() => {
      const segments = donutRef.current!.querySelectorAll('[data-donut-segment]')
      segments.forEach((seg) => {
        gsap.fromTo(seg, { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: donutRef.current!, start: 'top 80%', once: true }
        })
      })
      if (donutCenterRef.current) {
        gsap.fromTo(donutCenterRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: donutRef.current!, start: 'top 80%', once: true }
        })
      }
    }, donutRef)
    return () => ctx.revert()
  }, [])

  /* Bullet bar animation */
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

  return (
    <div ref={containerRef} className={styles.page}>

      {/* HERO */}
      <section className={styles.heroSection} data-reveal>
        <BeamsBackground intensity="subtle" />
        <div className={styles.heroGrid}>
          <div className={styles.heroContentWrapper}>
            <motion.h1 layoutId="hero-title" className={styles.heroTitle}>
              MB Flytt
            </motion.h1>
            <LayoutTextFlip
              words={["Manuella offerter", "2x fler offerter/dag", "Noll papper"]}
              duration={2500}
            />
          </div>
        </div>
      </section>

      {/* UTMANINGEN */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Utmaningen</h2>
          <div className={styles.sourcesGrid}>
            <article className={styles.sourceCard}>
              <Counter current={1} total={4} />
              <h3>Tidskrävande offertprocess</h3>
              <p>Varje offert krävde telefonsamtal, hembesök och timmar av kalkylering. Kunden fick vänta länge på besked.</p>
            </article>
            <article className={styles.sourceCard}>
              <Counter current={2} total={4} />
              <h3>Förlorade kunder</h3>
              <p>Kunder valde snabbare konkurrenter som kunde lämna offerter direkt. MB Flytt förlorade affärer varje vecka.</p>
            </article>
            <article className={styles.sourceCard}>
              <Counter current={3} total={4} />
              <h3>Pappersarbete</h3>
              <p>Avtal och bokningsbekräftelser skickades per post eller fax. Mycket papper och risk för att dokument försvann.</p>
            </article>
            <article className={styles.sourceCard}>
              <Counter current={4} total={4} />
              <h3>Manuell kalkylering</h3>
              <p>Varje flytt behövde noggrann kalkylering baserat på volym, avstånd och tilläggstjänster. Det var svårt att vara konsekvent.</p>
            </article>
          </div>
        </div>
      </section>

      {/* LÖSNINGEN */}
      <section className={styles.section} data-reveal>
        <div className={styles.metodikInner}>
          <div className={styles.metodikLeft}>
            <div className={styles.metodikLeftSticky}>
              <h2 className={styles.sectionTitle}>Lösningen</h2>
              <p className={styles.metodikSubtext}>
                AI-driven offertgenerering baserad på kundens uppgifter. Automatisk kalkylering, digital signering och bokningsbekräftelse.
              </p>
            </div>
          </div>
          <div className={styles.metodikRight}>
            <ul className={styles.metodikList}>
              {[
                { title: 'AI-offertgenerator', body: 'Kunder fyller i uppgifter online och AI:n beräknar pris baserat på volym, avstånd och tilläggstjänster på sekunder.' },
                { title: 'Automatisk kalkylering', body: 'Prissättning baseras på historisk data och realtidsfaktorer som bränslepris och tillgänglighet.' },
                { title: 'Digital signering', body: 'Kunder kan godkänna och signera offerter direkt i webbläsaren eller på mobilen. BankID-integration finns.' },
                { title: 'Automatisk bokning', body: 'När offerten är godkänd skapas bokningen automatiskt i kalendern och kunden får bekräftelse direkt.' },
              ].map((item, i) => (
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
          <h2 className={styles.sectionTitle}>Resultat</h2>
        </div>
        <StatsClient heading="" items={[
          { value: 2, suffix: 'x', label: 'fler offerter/dag' },
          { value: 15, suffix: ' min', label: 'offertid istället för 24h' },
          { value: 35, suffix: '%', label: 'högre konvertering' },
        ]} />
      </section>

      {/* BESPARINGAR */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{locale === 'sv' ? 'Besparingar' : 'Savings'}</h2>
          <p className={styles.savingsSubtitle}>{locale === 'sv' ? 'En detaljerad genomgång av alla automations vi implementerat för MB Flytt — från manuell till fullt automatiserad process.' : 'A detailed review of all automations we implemented for MB Flytt — from manual to fully automated processes.'}</p>

          {/* Snapshot Bar */}
          <div className={styles.savingsSnapshotBar} ref={snapshotRef} data-reveal>
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter1Ref}>180 offerter/dag</span>
              <span className={styles.savingsSnapshotLabel}>{locale === 'sv' ? 'Offerter per dag' : 'Quotes per day'}</span>
            </div>
            <div className={styles.savingsSnapshotDivider} />
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter2Ref}>95% snabbare</span>
              <span className={styles.savingsSnapshotLabel}>{locale === 'sv' ? 'Snabbare' : 'Faster'}</span>
            </div>
            <div className={styles.savingsSnapshotDivider} />
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter3Ref}>12</span>
              <span className={styles.savingsSnapshotLabel}>{locale === 'sv' ? 'Automationer' : 'Automations'}</span>
            </div>
          </div>

          {/* Two-column: Donut + Bullet Chart */}
          <div className={styles.savingsLayout} data-reveal>

            {/* Donut Chart */}
            <div className={styles.savingsDonutSection} ref={donutRef}>
              <div className={styles.savingsDonutTitle}>{locale === 'sv' ? 'Fördelning av besparingar' : 'Distribution of savings'}</div>
              <div className={styles.savingsDonutWrap}>
                <svg className={styles.savingsDonutSvg} viewBox="0 0 200 200">
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#C8FF00" strokeDasharray="175.9 327.1" strokeDashoffset="0" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#8BCC00" strokeDasharray="125.7 377.3" strokeDashoffset="-175.9" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#5A8A00" strokeDasharray="100.5 402.5" strokeDashoffset="-301.6" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#3D5E00" strokeDasharray="50.3 452.7" strokeDashoffset="-402.1" />
                </svg>
                <div className={styles.savingsDonutCenter}>
                  <span className={styles.savingsDonutCenterValue} ref={donutCenterRef}>68%</span>
                  <span className={styles.savingsDonutCenterLabel}>{locale === 'sv' ? 'automatiserat' : 'automated'}</span>
                </div>
              </div>
              <div className={styles.savingsLegend}>
                <div className={styles.savingsLegendItem}>
                  <span className={styles.savingsLegendDot} style={{ background: '#C8FF00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Offertflöde' : 'Quote flow'}</span><span className={styles.savingsLegendValue}>35%</span></div>
                <div className={styles.savingsLegendItem}>
                  <span className={styles.savingsLegendDot} style={{ background: '#8BCC00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Avtalshantering' : 'Agreement handling'}</span><span className={styles.savingsLegendValue}>25%</span></div>
                <div className={styles.savingsLegendItem}>
                  <span className={styles.savingsLegendDot} style={{ background: '#5A8A00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Kalkylering' : 'Calculation'}</span><span className={styles.savingsLegendValue}>20%</span></div>
                <div className={styles.savingsLegendItem}>
                  <span className={styles.savingsLegendDot} style={{ background: '#3D5E00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Admin' : 'Admin'}</span><span className={styles.savingsLegendValue}>10%</span></div>
              </div>
            </div>

            {/* Bullet Chart Table */}
            <div className={styles.savingsBulletTable} ref={bulletTableRef}>
              <div className={styles.savingsTableHeader}>
                <span>{locale === 'sv' ? 'Process' : 'Process'}</span>
                <span>{locale === 'sv' ? 'Tidsjämförelse (per enhet)' : 'Time comparison (per unit)'}</span>
                <span>{locale === 'sv' ? 'Sparat/vecka' : 'Saved/week'}</span>
              </div>
              {[
                { name: locale === 'sv' ? 'Offertgenerering' : 'Quote generation', volume: locale === 'sv' ? 'dagligen' : 'daily', before: '100%', after: '15%', saved: locale === 'sv' ? '2x fler offerter' : '2x more quotes' },
                { name: locale === 'sv' ? 'Kalkylering' : 'Calculation', volume: locale === 'sv' ? 'varje kund' : 'every customer', before: '80%', after: '10%', saved: locale === 'sv' ? 'konsekventa priser' : 'consistent pricing' },
                { name: locale === 'sv' ? 'Avtal' : 'Agreements', volume: locale === 'sv' ? 'varje bokning' : 'every booking', before: '70%', after: '5%', saved: locale === 'sv' ? 'noll papper' : 'zero paper' },
                { name: locale === 'sv' ? 'Bokningsbekräftelse' : 'Booking confirmation', volume: locale === 'sv' ? 'varje bokning' : 'every booking', before: '60%', after: '3%', saved: locale === 'sv' ? 'automatisk' : 'automatic' },
              ].map((row, i) => (
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
                      <span>{row.before === '100%' ? (locale === 'sv' ? 'manuellt' : 'manual') : row.before}</span>
                      <span className={styles.savingsBulletLabelAfter}>{row.after}</span>
                    </div>
                  </div>
                  <div className={styles.savingsSavedValue}>{row.saved}</div>
                </div>
              ))}
              <div className={styles.savingsTotalRow}>
                <div className={styles.savingsTotalLabel}>{locale === 'sv' ? 'Totalt' : 'Total'}</div>
                <div></div>
                <div className={styles.savingsTotalValue}>68%</div>
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
              src="/images/marcus-bengtsson.jpg"
              alt="Marcus Bengtsson"
              width={180}
              height={180}
              className={styles.quoteImage}
            />
          </div>
          <div className={styles.quoteContent}>
            <blockquote className={styles.quoteText}>Förut förlorade vi jobb för att vi var för långsamma. Nu är vi alltid först med offert.</blockquote>
            <div className={styles.quoteAuthor}>
              <span className={styles.quoteName}>Marcus Bengtsson</span>
              <span className={styles.quoteRole}>Grundare MB Flytt</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}