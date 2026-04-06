'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './FormulaCircles.module.css'

gsap.registerPlugin(ScrollTrigger)

const RADIUS = 100
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const circles = [
  { value: '350 kr/h', label: 'SCB lönestatistik', fill: 0.75 },
  { value: '52 v', label: 'Helårsbasis', fill: 0.85 },
  { value: '0.65', label: 'Ramp-up år 1', fill: 0.65 },
]

export default function FormulaCircles() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const ringRefs = useRef<(SVGCircleElement | null)[]>([])
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    const trigger = {
      trigger: wrapperRef.current,
      start: 'top 80%',
      once: true,
    }

    // Animate rings with stagger
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return
      const targetOffset = CIRCUMFERENCE * (1 - circles[i].fill)
      gsap.set(ring, { strokeDashoffset: CIRCUMFERENCE })
      gsap.to(ring, {
        strokeDashoffset: targetOffset,
        duration: 1.4,
        ease: 'power2.out',
        delay: i * 0.15,
        scrollTrigger: trigger,
      })
    })

    // CountUp 0 → 390000
    if (countRef.current) {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: 390000,
        duration: 1.8,
        ease: 'power2.out',
        delay: 0.6,
        scrollTrigger: trigger,
        onUpdate() {
          if (countRef.current) {
            const formatted = Math.round(obj.val)
              .toLocaleString('sv-SE')
              .replace(/\u00a0/g, '\u00a0')
            countRef.current.textContent = formatted + '\u00a0kr'
          }
        },
        onComplete() {
          if (countRef.current) {
            countRef.current.textContent = '390\u00a0000\u00a0kr'
          }
        },
      })
    }

    return () => ScrollTrigger.getAll().forEach((st) => st.kill())
  }, [])

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      {/* LAGER 1 — Cirklar */}
      <div className={styles.circles}>
        {circles.map((c, i) => (
          <div key={i} className={styles.circleItem}>
            <div className={styles.svgWrap}>
              <svg viewBox="0 0 220 220" width="100%" height="100%" className={styles.svg}>
                <circle
                  cx="110"
                  cy="110"
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                />
                <circle
                  ref={(el) => {
                    ringRefs.current[i] = el
                  }}
                  cx="110"
                  cy="110"
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE}
                />
              </svg>
              <div className={styles.circleValue}>{c.value}</div>
            </div>
            <p className={styles.circleLabel}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* LAGER 2 — Formel-rad */}
      <div className={styles.formulaBar}>
        <span className={styles.formulaVar}>Dina anställda</span>
        <span className={styles.formulaOp}>×</span>
        <span className={styles.formulaVar}>Timmar/vecka</span>
        <span className={styles.formulaOp}>×</span>
        <span className={styles.formulaConst}>350 kr/h</span>
        <span className={styles.formulaOp}>×</span>
        <span className={styles.formulaConst}>0.65</span>
        <span className={styles.formulaOp}>=</span>
        <span className={styles.formulaResult}>Din besparing</span>
      </div>

      {/* LAGER 3 — Telestore-kort */}
      <div className={styles.card}>
        <div className={styles.cardLeft}>
          <span className={styles.cardValue} ref={countRef}>
            0&nbsp;kr
          </span>
          <span className={styles.cardYear}>/år</span>
        </div>
        <div className={styles.cardRight}>
          <span className={styles.cardCompany}>Telestore Sverige AB</span>
          <span className={styles.cardMeta}>3 anställda · verifierat resultat ✓</span>
          <span className={styles.cardNote}>
            Grundformeln ger 284 000 kr/år — Telestore kör fler automationer
          </span>
        </div>
      </div>

      {/* FOTNOT */}
      <p className={styles.footnote}>
        Baserat på ett verifierat kundcase inom e-handel. Estimeringsverktyg — inte en garanti om faktisk besparing.
      </p>
    </div>
  )
}
