'use client'

import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import ButtonSwap from '@/components/ui/ButtonSwap'
import StatsClient from '@/components/sections/StatsClient'
import BeamsBackground from '@/components/ui/BeamsBackground'
import { LayoutTextFlip } from '@/components/ui/layout-text-flip'
import { motion } from 'motion/react'
import styles from './TelestoreCaseStudy.module.css'

gsap.registerPlugin(ScrollTrigger)

/* --- Counter decoration (samma som MethodologyContent) -- */
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

/* --- Main -------------------------------------------- */
export default function TelestoreCaseStudy() {
  const t = useTranslations('telestore')
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const snapshotRef = useRef<HTMLDivElement>(null)
  const counter1Ref = useRef<HTMLSpanElement>(null)
  const counter2Ref = useRef<HTMLSpanElement>(null)
  const counter3Ref = useRef<HTMLDivElement>(null)
  const donutRef = useRef<HTMLDivElement>(null)
  const donutCenterRef = useRef<HTMLSpanElement>(null)
  const bulletTableRef = useRef<HTMLDivElement>(null)

  const methodologyPath = locale === 'sv' ? '/sv/ai-besparing' : '/en/ai-savings'

  /* GSAP scroll reveals — EXAKT samma som MethodologyContent */
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
        { el: counter1Ref.current, target: 390000, prefix: '', suffix: ' kr', format: true },
        { el: counter2Ref.current, target: 1350, prefix: '', suffix: locale === 'sv' ? ' timmar' : ' hours', format: true },
        { el: counter3Ref.current, target: 56, prefix: '', suffix: '', format: false },
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
      segments.forEach((seg, i) => {
        const el = seg as SVGCircleElement
        const dashArray = el.getAttribute('stroke-dasharray')
        const segLength = dashArray ? parseFloat(dashArray.split(' ')[0]) : 0
        const originalOffset = parseFloat(el.getAttribute('stroke-dashoffset') || '0')
        // Start: helt dold (offset = segLength + originalOffset)
        // Slut: korrekt position (offset = originalOffset)
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

      {/* -- HERO SECTION ------------------------------------------------- */}
      <section className={styles.heroSection}>
        <BeamsBackground intensity="subtle" />
        <div className={styles.heroGrid}>
          <div className={styles.heroContentWrapper}>
            <motion.h1 layoutId="hero-title" className={styles.heroTitle}>
              Telestore
            </motion.h1>
            <LayoutTextFlip
              words={[
                "56 AUTOMATIONER",
                "390 000 KR/ÅR",
                "1 350 TIMMAR"
              ]}
              duration={2500}
            />
          </div>
        </div>
      </section>

      {/* -- UTMANINGEN (01) — 4 kort ------------------------------------------- */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Utmaningen</h2>
          <div className={styles.sourcesGrid}>
            <article className={styles.sourceCard}>
              <Counter current={1} total={4} />
              <h3>Manuell listning</h3>
              <p>
                75 telefoner varje vecka listades manuellt på telestore.se, Blocket och Tradera. Varje listning tog 7.5 minuter — tid som kunde använts till försäljning och kundservice.
              </p>
            </article>

            <article className={styles.sourceCard}>
              <Counter current={2} total={4} />
              <h3>Excel-kaos</h3>
              <p>
                2.5 timmar varje vecka bortkastad på felsökning i manuella listor. När något gick fel var 2–3 personer inblandade i koordinering, felsökning och återställning.
              </p>
            </article>

            <article className={styles.sourceCard}>
              <Counter current={3} total={4} />
              <h3>Missade försäljningar</h3>
              <p>
                Felpriser, uteblivna leveranser och borttappade kundärenden skapade direkta kostnader. Varje manuellt fel riskerade att förlora kunder och skada företagets rykte.
              </p>
            </article>

            <article className={styles.sourceCard}>
              <Counter current={4} total={4} />
              <h3>Ingen skalbarhet</h3>
              <p>
                Varje ny telefon krävde manuell hantering. Affären kunde inte växa utan att anställa mer personal. Automationsbehovet var akut för att bryta botten-effekten.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* -- LÖSNINGEN (02) — sticky left + list --------------------------- */}
      <section className={styles.section} data-reveal>
        <div className={styles.metodikInner}>
          <div className={styles.metodikLeft}>
            <div className={styles.metodikLeftSticky}>
              <h2 className={styles.sectionTitle}>
                {locale === 'sv' ? 'Lösningen' : 'The Solution'}
              </h2>
              <p className={styles.metodikSubtext}>
                {locale === 'sv'
                  ? '56 automationer implementerade på 3 veckor. Make, AI-agenter och scripts — alla testade mot riktig data.'
                  : '56 automations implemented in 3 weeks. Make, AI agents and scripts — all tested against real data.'}
              </p>
            </div>
          </div>
          <div className={styles.metodikRight}>
            <ul className={styles.metodikList}>
              {[
                { title: locale === 'sv' ? 'Listning & IMEI' : 'Listing & IMEI', body: locale === 'sv' ? '75 telefoner/vecka listades automatiskt på telestore.se, Blocket och Tradera med rätt pris, bilder och spec.' : '75 phones/week listed automatically with correct price, images and spec.' },
                { title: locale === 'sv' ? 'Order & frakt' : 'Order & shipping', body: locale === 'sv' ? 'Varje order genererade automatiskt bekräftelse, fraktsedel och avtal. Inga manuella steg, inga glömda detaljer.' : 'Every order automatically generated confirmation, shipping label and agreement. No manual steps, no forgotten details.' },
                { title: locale === 'sv' ? 'Kundservice & AI' : 'Customer service & AI', body: locale === 'sv' ? 'AI-agenter klassificerade och besvarade inkommande mail dygnet runt, under en sekund per ärende.' : 'AI agents classified and responded to incoming mail around the clock, under one second per case.' },
                { title: locale === 'sv' ? 'Skalbarhet' : 'Scalability', body: locale === 'sv' ? 'Affären växer utan att teamet växer. Varje ny telefon hanteras automatiskt.' : 'The business grows without the team growing. Every new phone is handled automatically.' },
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

      {/* -- RESULTAT (04) — Stats-sektion ----------------------------- */}
      <section className={styles.section} data-reveal>
        <div className={styles.statsTitleWrapper}>
          <h2 className={styles.sectionTitle}>{locale === 'sv' ? 'Resultat' : 'Results'}</h2>
        </div>
        <StatsClient heading="" items={[
          { value: 390000, suffix: ' kr', label: locale === 'sv' ? 'Besparing/år' : 'Savings/year' },
          { value: 1350, suffix: locale === 'sv' ? ' timmar' : ' hours', label: locale === 'sv' ? 'Sparad tid/år' : 'Hours saved/year' },
          { value: 56, suffix: '', label: locale === 'sv' ? 'Automationer' : 'Automations' },
        ]} />
      </section>

      {/* -- BESPARINGAR (05) ------------------------------------------------ */}
      <section className={styles.section} data-reveal>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>{locale === 'sv' ? 'Besparingar' : 'Savings'}</h2>
          <p className={styles.savingsSubtitle}>{locale === 'sv' ? 'En detaljerad genomgång av alla automations vi implementerat för Telestore — från manuell till fullt automatiserad process.' : 'A detailed review of all automations we implemented for Telestore — from manual to fully automated processes.'}</p>

          {/* Snapshot Bar */}
          <div className={styles.savingsSnapshotBar} ref={snapshotRef} data-reveal>
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter1Ref}>390 000 kr</span>
              <span className={styles.savingsSnapshotLabel}>{locale === 'sv' ? 'Sparat per år' : 'Saved per year'}</span>
            </div>
            <div className={styles.savingsSnapshotDivider} />
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter2Ref}>1 350 {locale === 'sv' ? 'timmar' : 'hours'}</span>
              <span className={styles.savingsSnapshotLabel}>{locale === 'sv' ? 'Tid sparad' : 'Time saved'}</span>
            </div>
            <div className={styles.savingsSnapshotDivider} />
            <div className={styles.savingsSnapshotItem}>
              <span className={styles.savingsSnapshotValue} ref={counter3Ref}>56</span>
              <span className={styles.savingsSnapshotLabel}>{locale === 'sv' ? 'Automationer' : 'Automations'}</span>
            </div>
          </div>

          {/* Two-column: Donut + Bullet Chart */}
          <div className={styles.savingsLayout} data-reveal>

            {/* Donut Chart */}
            <div className={styles.savingsDonutSection} ref={donutRef}>
              <div className={styles.savingsDonutTitle}>{locale === 'sv' ? 'Fördelning av sparad tid' : 'Distribution of saved time'}</div>
              <div className={styles.savingsDonutWrap}>
                <svg className={styles.savingsDonutSvg} viewBox="0 0 200 200">
                  <circle className={styles.savingsDonutTrack} cx="100" cy="100" r="80" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#C8FF00" strokeDasharray="193.7 309.3" strokeDashoffset="0" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#8BCC00" strokeDasharray="132.5 370.5" strokeDashoffset="-193.7" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#5A8A00" strokeDasharray="90.7 412.3" strokeDashoffset="-326.2" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#3D5E00" strokeDasharray="48.7 454.3" strokeDashoffset="-416.9" />
                  <circle data-donut-segment className={styles.savingsDonutSegment} cx="100" cy="100" r="80" stroke="#2A3A00" strokeDasharray="36.2 466.8" strokeDashoffset="-465.6" />
                </svg>
                <div className={styles.savingsDonutCenter}>
                  <span className={styles.savingsDonutCenterValue} ref={donutCenterRef}>27.7</span>
                  <span className={styles.savingsDonutCenterLabel}>{locale === 'sv' ? 'timmar/vecka' : 'hrs/week'}</span>
                </div>
              </div>
              <div className={styles.savingsLegend}>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#C8FF00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Listning & publicering' : 'Listing & publishing'}</span><span className={styles.savingsLegendValue}>10.7 h</span></div>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#8BCC00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Order & frakt' : 'Order & shipping'}</span><span className={styles.savingsLegendValue}>7.3 h</span></div>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#5A8A00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Kundservice & AI' : 'Customer service & AI'}</span><span className={styles.savingsLegendValue}>5.0 h</span></div>
                <div className={styles.savingsLegendItem}><span className={styles.savingsLegendDot} style={{ background: '#3D5E00' }} /><span className={styles.savingsLegendText}>{locale === 'sv' ? 'Admin & avtal' : 'Admin & Agreements'}</span><span className={styles.savingsLegendValue}>2.7 h</span></div>
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
                { name: locale === 'sv' ? 'Telefon → sajt/Blocket' : 'Phone → site/Blocket', volume: locale === 'sv' ? '75 st/vecka' : '75/week', before: '100%', after: '2%', labelBefore: '7.5 min', labelAfter: '~0 min', saved: '9.4 h' },
                { name: locale === 'sv' ? 'PostNord fraktsedel' : 'PostNord shipping label', volume: locale === 'sv' ? '34 st/vecka' : '34/week', before: '100%', after: '2%', labelBefore: '5 min', labelAfter: '~0 min', saved: '2.8 h' },
                { name: locale === 'sv' ? 'Orderhantering' : 'Order handling', volume: locale === 'sv' ? '34 st/vecka' : '34/week', before: '100%', after: '20%', labelBefore: '10 min', labelAfter: '2 min', saved: '4.5 h' },
                { name: locale === 'sv' ? 'AI prisförslag-mail' : 'AI price quote emails', volume: locale === 'sv' ? '25 st/vecka' : '25/week', before: '100%', after: '2%', labelBefore: '7.5 min', labelAfter: '~0 min', saved: '3.1 h' },
                { name: locale === 'sv' ? 'Registrering (Excel → AT)' : 'Registration (Excel → AT)', volume: locale === 'sv' ? '75 st/vecka' : '75/week', before: '100%', after: '2%', labelBefore: '1 min', labelAfter: '~0 min', saved: '1.3 h' },
                { name: locale === 'sv' ? 'Scrive-avtal' : 'Scrive agreement', volume: locale === 'sv' ? '43 st/vecka' : '43/week', before: '100%', after: '2%', labelBefore: '2 min', labelAfter: '~0 min', saved: '1.4 h' },
                { name: locale === 'sv' ? 'Kundservice-mail' : 'Customer service emails', volume: locale === 'sv' ? '75 st/vecka' : '75/week', before: '100%', after: '25%', labelBefore: '2 min', labelAfter: '~0.5 min', saved: '1.9 h' },
                { name: locale === 'sv' ? 'Excel-felsökning' : 'Excel troubleshooting', volume: locale === 'sv' ? '0.5×/vecka' : '0.5×/week', before: '100%', after: '0%', labelBefore: '2.5 h', labelAfter: '0 h', saved: '1.3 h' },
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
                      <span>{row.labelBefore}</span>
                      <span className={styles.savingsBulletLabelAfter}>{row.labelAfter}</span>
                    </div>
                  </div>
                  <div className={styles.savingsSavedValue}>{row.saved}</div>
                </div>
              ))}
              <div className={styles.savingsTotalRow}>
                <div className={styles.savingsTotalLabel}>{locale === 'sv' ? 'Totalt' : 'Total'}</div>
                <div></div>
                <div className={styles.savingsTotalValue}>27.7 h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- CITAT (premium design med bild) --------------------------------- */}
      <section className={styles.quoteSection} data-reveal>
        <div className={styles.quoteInner}>
          <div className={styles.quoteImageWrap}>
            <Image
              src="/images/brindar-akalp.jpg"
              alt="Brindar Akalp"
              width={180}
              height={180}
              className={styles.quoteImage}
            />
          </div>
          <div className={styles.quoteContent}>
            <blockquote className={styles.quoteText}>
              {locale === 'sv'
                ? "Vi brukade lägga timmar varje vecka på manuella uppgifter som att skriva fraktsedlar och bekräfta mail. Nu sköter Eteya allt det automatiskt. Det har gjort oss snabbare och mindre stressade."
                : "We used to spend hours every week on manual tasks like creating shipping labels and confirming emails. Now Eteya handles all of that automatically. It's made us faster and less stressed."
              }
            </blockquote>
            <div className={styles.quoteAuthor}>
              <span className={styles.quoteName}>Brindar Akalp</span>
              <span className={styles.quoteRole}>{locale === 'sv' ? 'VD, Telestore' : 'CEO, Telestore'}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}