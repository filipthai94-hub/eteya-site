'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import ButtonStripe from '@/components/ui/ButtonStripe'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import sv from '@/i18n/messages/sv.json'
import en from '@/i18n/messages/en.json'
import s from './ROICalculatorClient.module.css'

gsap.registerPlugin(ScrollTrigger)

// ── i18n messages ─────────────────────────────────────────────────────────────
const messages: Record<string, any> = { sv, en }

// ── Konstanter (v4.0 — 2026-04-15) ───────────────────────────────────────────
const HOURLY = 350
const F1     = 0.65
const F2     = 0.85
const F3     = 1.00
const FTE_H  = 1760
const UNCERT = 0.15

const RATES: Record<string, number> = {
  kundtjanst:    0.45,
  fakturering:   0.65,
  leads:         0.60,
  rapportering:  0.70,
  epost:         0.50,
  kommunikation: 0.65,
}

// Lime-nyanser per process — matchar Telestore case study DNA
const PROC_COLORS: Record<string, string> = {
  kundtjanst:    '#C8FF00',
  fakturering:   '#9FCC00',
  leads:         '#7BA300',
  rapportering:  '#5A7A00',
  epost:         '#3D5200',
  kommunikation: '#2A3800',
}

const PROC_LABELS: Record<string, string> = {
  kundtjanst:    'Kundtjänst',
  fakturering:   'Fakturering & Admin',
  leads:         'Leads & Försäljning',
  rapportering:  'Rapportering & Ekonomi',
  epost:         'E-post & Schemaläggning',
  kommunikation: 'Intern kommunikation',
}

const PROC_RATE_LABELS: Record<string, string> = {
  kundtjanst:    '45% automation',
  fakturering:   '65% automation',
  leads:         '60% automation',
  rapportering:  '70% automation',
  epost:         '50% automation',
  kommunikation: '65% automation',
}

const DEFAULTS: Record<string, { on: boolean; hours: number }> = {
  kundtjanst:    { on: true,  hours: 8  },
  fakturering:   { on: true,  hours: 5  },
  leads:         { on: false, hours: 6  },
  rapportering:  { on: false, hours: 4  },
  epost:         { on: false, hours: 8  },
  kommunikation: { on: false, hours: 5  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return Math.round(n).toLocaleString('sv-SE')
}
function fmtK(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.', ',') + ' mkr'
  if (n >= 1_000)     return Math.round(n / 1_000) + ' tkr'
  return fmt(n) + ' kr'
}

type ProcKey = keyof typeof RATES
interface ProcState { on: boolean; hours: number }

// ── Donut Chart SVG ───────────────────────────────────────────────────────────
// Spec matchar exakt TelestoreCaseStudy.tsx: r=80, stroke-width=32, viewBox 200×200
const CIRCUMFERENCE = 2 * Math.PI * 80 // ≈ 502.65

function DonutChart({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: { color: string; pct: number; label: string; value: string }[]
  centerValue: string
  centerLabel: string
}) {
  let offset = 0
  const gapSize = 2; // px gap mellan segment
  const arcs = segments.map((seg, i) => {
    const dash    = seg.pct * CIRCUMFERENCE - gapSize
    const gap     = CIRCUMFERENCE - dash + gapSize
    const dashOff = -offset
    offset += dash + gapSize
    return (
      <circle
        key={i}
        cx="100" cy="100" r="80"
        fill="none"
        stroke={seg.color}
        strokeWidth="32"
        strokeLinecap="butt"
        strokeDasharray={`${dash.toFixed(2)} ${gap.toFixed(2)}`}
        strokeDashoffset={dashOff.toFixed(2)}
        style={{ filter: 'brightness(1.0)', transition: 'filter 0.2s ease' }}
      />
    )
  })

  return (
    <div className={s.donutWrap}>
      <svg
        viewBox="0 0 200 200"
        className={s.donutSvg}
        aria-hidden
        style={{ transform: 'rotate(-90deg)' }}
      >
        <defs>
          <radialGradient id="donutGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4FF33" />
            <stop offset="100%" stopColor="#9FCC00" />
          </radialGradient>
        </defs>
        {/* Track */}
        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="28" />
        {arcs}
      </svg>
      <div className={s.donutCenter}>
        <span className={s.donutCenterValue}>{centerValue}</span>
        <span className={s.donutCenterLabel}>{centerLabel}</span>
      </div>
    </div>
  )
}

// ── Donut Draw-in Animation Hook ─────────────────────────────────────────────
function useDonutAnimation(donutRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!donutRef.current) return
    
    const ctx = gsap.context(() => {
      const segments = donutRef.current!.querySelectorAll('circle[stroke]')
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
            delay: i * 0.15, // Stagger!
            ease: 'power2.out',
            scrollTrigger: { trigger: donutRef.current!, start: 'top 80%', once: true },
          }
        )
      })
      
      // Center text scale-in
      const centerEl = donutRef.current!.querySelector('.donutCenter')
      if (centerEl) {
        gsap.fromTo(centerEl,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: donutRef.current!, start: 'top 80%', once: true },
          }
        )
      }
    }, donutRef)
    
    return () => ctx.revert()
  }, [donutRef])
}

// ── Bar Chart SVG ─────────────────────────────────────────────────────────────
function BarChart({ y1, y2, y3 }: { y1: number; y2: number; y3: number }) {
  const vals   = [y1, y2, y3]
  const labels = ['År 1', 'År 2', 'År 3']
  const maxV   = Math.max(...vals, 1)
  const H = 110, pad = 8, bW = 64, gap = 20
  const sx = (280 - (3 * bW + 2 * gap)) / 2

  return (
    <svg viewBox="0 0 280 130" className={s.barSvg} aria-hidden>
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4FF33" />
          <stop offset="100%" stopColor="#9FCC00" />
        </linearGradient>
      </defs>
      {/* Grid lines — nästan osynliga */}
      {[1,2,3].map(i => {
        const y = H - pad - (i / 4) * (H - pad * 2)
        return <line key={i} x1={0} y1={y} x2={280} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      })}
      {vals.map((v, i) => {
        const bH = (v / maxV) * (H - pad * 2 - 20)
        const x  = sx + i * (bW + gap)
        const y  = H - pad - bH - 16
        return (
          <g key={i} style={{ animation: `barGrow 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.15}s forwards` }}>
            <rect x={x} y={y} width={bW} height={bH} fill="url(#barGradient)" opacity="0.9" rx={2} />
            <text x={x + bW / 2} y={y - 5} fill="#FFFFFF" fontSize={13} textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontWeight="600">
              {fmtK(v)}
            </text>
            <text x={x + bW / 2} y={H + 4} fill="rgba(255,255,255,0.60)" fontSize={11} textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" letterSpacing="0.1em">
              {labels[i].toUpperCase()}
            </text>
          </g>
        )
      })}
      <style>{`
        @keyframes barGrow {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 0.9; }
        }
      `}</style>
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ROITestClient() {
  const [implCost, setImplCost] = useState(50_000)
  const [useImpl,  setUseImpl]  = useState(true)
  const [showMethodology, setShowMethodology] = useState(false)
  const [procs,    setProcs]    = useState<Record<ProcKey, ProcState>>(
    Object.fromEntries(
      Object.entries(DEFAULTS).map(([k, v]) => [k, { ...v }])
    ) as Record<ProcKey, ProcState>
  )

  // Refs för animationer
  const snapshotRef = useRef<HTMLDivElement>(null)
  const donutRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const socialProofRef = useRef<HTMLDivElement>(null)
  const methodologyRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // GSAP Scroll Reveal — samma som Telestore Case Study
  useEffect(() => {
    const sections = [
      snapshotRef, donutRef, barsRef, socialProofRef, methodologyRef, ctaRef
    ].filter(ref => ref.current)
    
    sections.forEach((ref, i) => {
      gsap.fromTo(ref.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.1, // Stagger!
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        }
      )
    })
    
    return () => ScrollTrigger.getAll().forEach(st => st.kill())
  }, [])

  // Donut draw-in animation
  useDonutAnimation(donutRef)

  // ── i18n ────────────────────────────────────────────────────────────────────
  const locale = useLocale()
  const copy = (messages[locale] ?? messages.sv).calculator

  // ── Beräkning v4.0 ─────────────────────────────────────────────────────────
  const totals = (() => {
    const perProc: Record<string, number> = {}
    let totalSav = 0, totalHrs = 0

    for (const [key, p] of Object.entries(procs)) {
      if (!p.on) continue
      const hrs = p.hours * RATES[key] * 52
      const sav = hrs * HOURLY
      perProc[key] = sav
      totalSav += sav
      totalHrs += hrs
    }

    const y1   = totalSav * F1
    const y2   = totalSav * F2
    const y3   = totalSav * F3
    const tot3 = y1 + y2 + y3
    const impl = useImpl ? implCost : 0

    // Donut segments — proportioner av total besparing
    const donutSegs = (Object.keys(RATES) as ProcKey[])
      .filter(k => procs[k].on && perProc[k] > 0)
      .map(k => ({
        color: PROC_COLORS[k],
        pct:   perProc[k] / (totalSav || 1),
        label: PROC_LABELS[k],
        value: fmtK(perProc[k] * F1),
      }))

    return {
      y1, y2, y3,
      totalHrs,
      fte:     (totalHrs * F1) / FTE_H,
      low:     y1 * (1 - UNCERT),
      high:    y1 * (1 + UNCERT),
      roi:     tot3 > 0 ? ((tot3 - impl) / Math.max(impl, 1)) * 100 : 0,
      pb:      y1 > 0 && impl > 0 ? Math.ceil(impl / (y1 / 12)) : null,
      donutSegs,
      ok:      totalSav > 0,
    }
  })()

  const toggleProc = (key: ProcKey) =>
    setProcs(prev => ({ ...prev, [key]: { ...prev[key], on: !prev[key].on } }))

  const setHours = (key: ProcKey, h: number) =>
    setProcs(prev => ({ ...prev, [key]: { ...prev[key], hours: h } }))

  // ── CTA: Öppna kontakt-modal ────────────────────────────────────────────────
  const handleOpenContact = () => {
    window.dispatchEvent(new CustomEvent('open-contact-modal'))
  }

  // Counter animation för Snapshot Bar — samma som Telestore
  useEffect(() => {
    if (!snapshotRef.current || !totals.ok) return
    
    const ctx = gsap.context(() => {
      // Counter 1: Besparing år 1
      const y1El = snapshotRef.current?.querySelector('.snapshotValue')
      if (y1El) {
        const obj = { val: 0 }
        const target = totals.y1
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: snapshotRef.current, start: 'top 80%', once: true },
          onUpdate: () => {
            y1El.textContent = fmtK(Math.round(obj.val))
          },
        })
      }
      
      // Counter 2: Timmar/år
      const hrsEl = snapshotRef.current?.querySelectorAll('.snapshotValue')[1]
      if (hrsEl) {
        const obj = { val: 0 }
        const target = Math.round(totals.totalHrs * F1)
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: snapshotRef.current, start: 'top 80%', once: true },
          delay: 0.2,
          onUpdate: () => {
            hrsEl.textContent = Math.round(obj.val).toLocaleString('sv-SE') + ' h'
          },
        })
      }
      
      // Counter 3: Payback
      const pbEl = snapshotRef.current?.querySelectorAll('.snapshotValue')[2]
      if (pbEl) {
        const obj = { val: 0 }
        const target = totals.pb || 0
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: snapshotRef.current, start: 'top 80%', once: true },
          delay: 0.4,
          onUpdate: () => {
            pbEl.textContent = totals.pb ? `${Math.round(obj.val)} mån` : '< 1 mån'
          },
        })
      }
    }, snapshotRef)
    
    return () => ctx.revert()
  }, [totals.ok, totals.y1, totals.totalHrs, totals.pb, F1])

  return (
    <main className={s.root}>
      <div className={s.wrap}>

        {/* ── Header ── */}
        <header className={s.header}>
          <h1 className={s.h1} dangerouslySetInnerHTML={{ __html: copy.heading }} />
          <p className={s.sub}>
            {copy.subheading}
          </p>
        </header>

        {/* ── Grid ── */}
        <div className={s.grid}>

          {/* ── VÄNSTER: Inputs ── */}
          <div className={s.inputs}>

            {/* Processer */}
            <div className={s.card}>
              <div className={s.cardTitle}>{copy.processLabel}</div>
              <p className={s.cardHint}>
                {copy.processHint}
              </p>
              <div className={s.procList}>
                {(Object.keys(RATES) as ProcKey[]).map(key => {
                  const p = procs[key]
                  return (
                    <div key={key} className={s.procItem}>
                      <button
                        type="button"
                        className={`${s.procHdr} ${p.on ? s.procOn : ''}`}
                        onClick={() => toggleProc(key)}
                      >
                        <span className={`${s.procChk} ${p.on ? s.procChkOn : ''}`}>
                          {p.on && (
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
                              <path d="M1.5 5l3 3L10.5 1" stroke="#080808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <span className={s.procName}>{PROC_LABELS[key]}</span>
                        <span className={s.procRate}>{PROC_RATE_LABELS[key]}</span>
                      </button>
                      {p.on && (
                        <div className={s.procSlider}>
                          <div className={s.sliderRow}>
                            <div className={s.sliderTop}>
                              <label className={s.sliderLabel}>{copy.hoursLabel} — totalt i teamet</label>
                              <span className={s.sliderVal}>{p.hours}h</span>
                            </div>
                            <input
                              type="range" min={1} max={80} value={p.hours}
                              className={s.range}
                              onChange={e => setHours(key, +e.target.value)}
                            />
                            <p className={s.sliderHint}>Räkna ihop alla som jobbar med den här processen</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Implementationskostnad */}
            <div className={s.card}>
              <div className={s.implRow}>
                <div>
                  <div className={s.cardTitle} style={{ marginBottom: 4 }}>Implementationskostnad</div>
                  <p className={s.cardHint} style={{ marginBottom: 0 }}>Påverkar ROI% och payback-period</p>
                </div>
                <label className={s.switch}>
                  <input type="checkbox" checked={useImpl} onChange={e => setUseImpl(e.target.checked)} />
                  <span className={s.switchTrack} />
                </label>
              </div>
              {useImpl && (
                <div className={s.implSliderWrap}>
                  <div className={s.sliderRow}>
                    <div className={s.sliderTop}>
                      <label className={s.sliderLabel}>Kostnad</label>
                      <span className={s.sliderVal}>{fmt(implCost)} kr</span>
                    </div>
                    <input
                      type="range" min={25_000} max={500_000} step={25_000} value={implCost}
                      className={s.range}
                      onChange={e => setImplCost(+e.target.value)}
                    />
                  </div>
                  <p className={s.hint}>Typisk SMB: 25 000 – 75 000 kr · Källa: SaaSfactor 2026</p>
                </div>
              )}
            </div>
          </div>

          {/* ── HÖGER: Results (sticky) ── */}
          <aside className={s.results}>

            {/* 1. Snapshot-bar */}
            <div className={s.snapshotBar}>
              <div className={s.snapshotItem}>
                <span className={s.snapshotValue}>
                  {totals.ok ? fmtK(totals.y1) : '– –'}
                </span>
                <span className={s.snapshotLabel}>Besparing år 1</span>
              </div>
              <div className={s.snapshotDivider} />
              <div className={s.snapshotItem}>
                <span className={s.snapshotValue}>
                  {totals.ok ? `${fmt(Math.round(totals.totalHrs * F1))} h` : '– –'}
                </span>
                <span className={s.snapshotLabel}>Timmar/år</span>
              </div>
              <div className={s.snapshotDivider} />
              <div className={s.snapshotItem}>
                <span className={s.snapshotValue}>
                  {totals.ok ? (totals.pb ? `${totals.pb} mån` : '< 1 mån') : '– –'}
                </span>
                <span className={s.snapshotLabel}>Payback</span>
              </div>
            </div>

            {/* 2. Donut + Legend */}
            <div className={s.donutSection}>
              <div className={s.sectionLabel}>Fördelning av besparing</div>
              {totals.ok ? (
                <>
                  <DonutChart
                    segments={totals.donutSegs}
                    centerValue={totals.ok ? `${fmt(Math.round(totals.roi))}%` : '– –'}
                    centerLabel="ROI"
                  />
                  <div className={s.legend}>
                    {totals.donutSegs.map((seg, i) => (
                      <div key={i} className={s.legendItem}>
                        <span className={s.legendDot} style={{ background: seg.color }} />
                        <span className={s.legendText}>{seg.label}</span>
                        <span className={s.legendValue}>{seg.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={s.chartEmpty}>Aktivera processer för att se fördelningen</div>
              )}
            </div>

            {/* 3. Staplar År 1–3 */}
            <div ref={barsRef} className={s.barsSection}>
              <div className={s.sectionLabel}>Projektion 3 år</div>
              {totals.ok ? (
                <>
                  <BarChart y1={totals.y1} y2={totals.y2} y3={totals.y3} />
                  <p className={s.barsNote}>
                    År 1 = 65% av full potential (ramp-up). År 3 = fullt realiserad besparing.
                  </p>
                </>
              ) : (
                <div className={s.chartEmpty}>Aktivera processer för att se projektionen</div>
              )}
            </div>

            {/* 4. Social proof — Kundresultat */}
            {totals.ok && (
              <div ref={socialProofRef} className={s.socialProof}>
                <div className={s.socialProofValue}>390 000 kr/år</div>
                <div className={s.socialProofText}>i snittbesparing för Telestore AB</div>
                <div className={s.socialProofHint}>(Verifierad data)</div>
              </div>
            )}

            {/* 5. Trust-rad */}
            <div className={s.trustRow}>
              SCB 2024 · McKinsey 2025 · Salesforce 2025 · Telestore (empirisk) · 350 kr/h · ±15%
            </div>

            {/* 6. CTA */}
            <div ref={ctaRef} className={`${s.ctaArea} ${showMethodology ? s.ctaAreaOpen : ''}`}>
              <ButtonStripe onClick={handleOpenContact} fullWidth>
                {copy.cta.primary}
              </ButtonStripe>
              <p className={s.ctaSub}>Gratis 30 min — inga förpliktelser</p>
              <button
                type="button"
                className={s.methodologyToggle}
                onClick={() => setShowMethodology(!showMethodology)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {showMethodology ? 'Dölj beräkningsmodell' : 'Visa beräkningsmodell'}
              </button>
            </div>

            {/* 7. Metodologi */}
            {showMethodology && (
              <div ref={methodologyRef} className={s.methodology}>
                <div className={s.methodologyLabel}>
                  <svg className={s.methodologyIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  BERÄKNINGSMODELL
                </div>
                <div className={s.methodologyFormula}>
                  Timmar × Automation% × 52 veckor × 350 kr/h
                </div>
                <div className={s.methodologyHint}>
                  År 1: 65% potential · År 2: 85% · År 3: 100%
                </div>
                <div className={s.methodologyDivider} />
                <div className={s.methodologySources}>
                  Källor: SCB 2024 · McKinsey 2025 · Salesforce 2025 · Telestore (empirisk) · 350 kr/h · ±15%
                </div>
              </div>
            )}

          </aside>
        </div>
      </div>
    </main>
  )
}
