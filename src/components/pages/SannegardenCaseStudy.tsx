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

export default function SannegardenCaseStudy() {
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
              Sannegården
            </motion.h1>
            <LayoutTextFlip
              words={["Missade samtal", "30+ beställningar/v", "0 missade samtal"]}
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
              <h3>Missade samtal</h3>
              <p>Under rusningstid ringde kunder samtidigt som personalen stod mitt i service och matlagning. När ingen hann svara blev varje missat samtal en förlorad beställning.</p>
            </article>
            <article className={styles.sourceCard}>
              <Counter current={2} total={4} />
              <h3>Begränsad kapacitet</h3>
              <p>Fler inkommande samtal betydde mer stress, inte mer kapacitet. Telefonen blev en flaskhals som hindrade teamet från att fokusera på det viktigaste.</p>
            </article>
            <article className={styles.sourceCard}>
              <Counter current={3} total={4} />
              <h3>Stressig kvällsservice</h3>
              <p>Beställningar och frågor kom även utanför de mest bemannade timmarna. Utan någon som kunde svara konsekvent gick restaurangen miste om både service och intäkter.</p>
            </article>
            <article className={styles.sourceCard}>
              <Counter current={4} total={4} />
              <h3>Borttappade beställningar</h3>
              <p>Kunder ringde för att fråga om menyer, öppettider och alternativ. Det avbröt arbetet i köket och tog fokus från gästerna på plats.</p>
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
                En AI-telefonist som tar emot beställningar dygnet runt, svarar på menyfrågor och bekräftar ordrar automatiskt via telefon.
              </p>
            </div>
          </div>
          <div className={styles.metodikRight}>
            <ul className={styles.metodikList}>
              {[
                { title: 'AI-telefonist', body: 'AI-telefonisten svarar direkt när kunder ringer och guidar dem genom beställningen utan att personalen behöver lämna köket eller kassan.' },
                { title: 'Smart orderhantering', body: 'Varje beställning registreras och bekräftas automatiskt. Inga missade samtal eller borttappade ordrar.' },
                { title: 'Kundbekräftelser', body: 'Varje beställning bekräftas tydligt via telefon så att kunden vet att allt blivit rätt. Det minskar missförstånd och skapar trygghet i köpet.' },
                { title: 'Köksfokus', body: 'Sannegårdens kan ta emot fler samtal utan att anställa extra bara för telefonen. Lösningen skalar med trycket och ser till att inga samtal faller mellan stolarna.' },
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
          { value: 30, suffix: '+', label: 'extra beställningar/v' },
          { value: 23, suffix: '%', label: 'ökad nöjdhet' },
          { value: 0, suffix: '', label: 'missade samtal' },
        ]} />
      </section>

      {/* BESPARINGAR */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{locale === 'sv' ? 'Besparingar' : 'Savings'}</h2>
          <p className={styles.savingsSubtitle}>{locale === 'sv' ? 'En detaljerad genomgång av alla automations vi implementerat för Sannegården — från manuell till fullt automatiserad process.' : 'A detailed review of all automations we implemented for Sannegården — from manual to fully automated processes.'}</p>

          {/* Snapshot Bar */}
          <div className={styles.savingsSnapshotBar} ref={snapshotRef} data-reveal>
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter1Ref}>30+ beställningar/v</span>
              <span className={styles.savingsSnapshotLabel}>{locale === 'sv' ? 'Beställningar/vecka' : 'Orders/week'}</span>
            </div>
            <div className={styles.savingsSnapshotDivider} />
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter2Ref}>23% ökad nöjdhet</span>
              <span className={styles.savingsSnapshotLabel}>{locale === 'sv' ? 'Ökad nöjdhet' : 'Increased satisfaction'}</span>
            </div>
            <div className={styles.savingsSnapshotDivider} />
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter3Ref}>0 missade samtal</span>
              <span className={styles.savingsSnapshotLabel}>{locale === 'sv' ? 'Missade samtal' : 'Missed calls'}</span>
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
                  <span className={styles.savingsDonutCenterValue} ref={donutCenterRef}>75%</span>
                  <span className={styles.savingsDonutCenterLabel}>{locale === 'sv' ? 'automatiserat' : 'automated'}</span>
                </div>
              </div>
              <div className={styles.savingsLegend}>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#C8FF00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Beställningar' : 'Orders'}</span><span className={styles.savingsLegendValue}>35%</span></div>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#8BCC00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Samtalshantering' : 'Call handling'}</span><span className={styles.savingsLegendValue}>25%</span></div>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#5A8A00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Kundnöjdhet' : 'Customer satisfaction'}</span><span className={styles.savingsLegendValue}>20%</span></div>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#3D5E00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Kökfokus' : 'Kitchen focus'}</span><span className={styles.savingsLegendValue}>10%</span></div>
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
                { name: locale === 'sv' ? 'Missade samtal' : 'Missed calls', volume: locale === 'sv' ? 'varje kväll' : 'every evening', before: '100%', after: '0%', saved: locale === 'sv' ? 'aldrig missat' : 'never missed' },
                { name: locale === 'sv' ? 'Extra beställningar' : 'Extra orders', volume: locale === 'sv' ? 'varje vecka' : 'every week', before: '20%', after: '85%', saved: locale === 'sv' ? '30+ order' : '30+ orders' },
                { name: locale === 'sv' ? 'Kundnöjdhet' : 'Customer satisfaction', volume: locale === 'sv' ? 'hela passet' : 'entire shift', before: '62%', after: '85%', saved: '+23%' },
                { name: locale === 'sv' ? 'Kökfokus' : 'Kitchen focus', volume: locale === 'sv' ? 'hela passet' : 'entire shift', before: '30%', after: '90%', saved: locale === 'sv' ? 'mer arbetsro' : 'more focus' },
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
              src="/images/brindar-akalp.jpg"
              alt="Ahmed Hassan"
              width={180}
              height={180}
              className={styles.quoteImage}
            />
          </div>
          <div className={styles.quoteContent}>
            <blockquote className={styles.quoteText}>Kunderna märker inte att det är en AI. De får bara snabbare och bättre service.</blockquote>
            <div className={styles.quoteAuthor}>
              <span className={styles.quoteName}>Ahmed Hassan</span>
              <span className={styles.quoteRole}>Ägare Sannegården</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}