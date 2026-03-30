'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import sv from '@/i18n/messages/sv.json'
import en from '@/i18n/messages/en.json'

gsap.registerPlugin(ScrollTrigger)

type ProcessKey = 'customerService' | 'invoicing' | 'leads' | 'reporting' | 'email' | 'scheduling'

type MessageFile = {
  calculator: {
    heading: string
    subheading: string
    processLabel: string
    processHint: string
    hoursLabel: string
    teamLabel: string
    teamHint: string
    teamUnit: string
    processes: Record<ProcessKey, { name: string }>
    results: {
      title: string
      currentCostLabel: string
      withAiLabel: string
      perYear: string
      annual: string
      hoursSaved: string
      fteEquivalent: string
      perProcess: string
    }
    transparency: {
      toggle: string
      hourlyRate: string
      automationRates: string
      yearOneFactor: string
      range: string
    }
    cta: {
      primary: string
      secondary: string
    }
    empty: string
  }
}

type ProcessConfig = {
  key: ProcessKey
  rate: number
}

type Totals = {
  totalSavings: number
  lowSavings: number
  highSavings: number
  totalHoursSaved: number
  totalFte: number
  currentCost: number
  withAiCost: number
  breakdown: Array<{
    key: ProcessKey
    savings: number
    hoursSaved: number
    rate: number
  }>
}

const messages: Record<string, MessageFile> = { sv, en }

const PROCESS_CONFIG: ProcessConfig[] = [
  { key: 'customerService', rate: 0.4 },
  { key: 'invoicing', rate: 0.8 },
  { key: 'leads', rate: 0.6 },
  { key: 'reporting', rate: 0.7 },
  { key: 'email', rate: 0.5 },
  { key: 'scheduling', rate: 0.65 },
]

const HOURLY_COST = 350
const YEAR_ONE_FACTOR = 0.65
const HOURS_PER_FTE = 1760
const DEFAULT_HOURS = 5
const DEFAULT_TEAM_SIZE = 3
const MIN_HOURS = 1
const MAX_HOURS = 40
const MIN_TEAM_SIZE = 1
const MAX_TEAM_SIZE = 50

function useAnimatedNumber(target: number, duration = 700) {
  const [value, setValue] = useState(target)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setValue(target)
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setValue(target)
      return
    }

    const startValue = value
    const startTime = performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(startValue + (target - startValue) * eased)
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [duration, target])

  return value
}

function formatCurrency(value: number, locale: string) {
  return `${Math.round(value).toLocaleString(locale === 'sv' ? 'sv-SE' : 'en-US')} kr`
}

function formatHours(value: number, locale: string) {
  return Math.round(value).toLocaleString(locale === 'sv' ? 'sv-SE' : 'en-US')
}

function formatFteLabel(template: string, value: number, locale: string) {
  const formatted = value.toLocaleString(locale === 'sv' ? 'sv-SE' : 'en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return template.replace('{{count}}', formatted)
}

function getSliderBackground(value: number, min: number, max: number) {
  const percentage = ((value - min) / (max - min)) * 100
  return `linear-gradient(90deg, rgba(200,255,0,0.7) 0%, rgba(200,255,0,0.7) ${percentage}%, #222222 ${percentage}%, #222222 100%)`
}

export default function ROICalculatorClient() {
  const locale = useLocale()
  const copy = (messages[locale] ?? messages.sv).calculator
  const sectionRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const [selectedProcesses, setSelectedProcesses] = useState<Record<ProcessKey, boolean>>({
    customerService: true,
    invoicing: true,
    leads: false,
    reporting: false,
    email: false,
    scheduling: false,
  })
  const [hoursPerProcess, setHoursPerProcess] = useState<Record<ProcessKey, number>>({
    customerService: DEFAULT_HOURS,
    invoicing: DEFAULT_HOURS,
    leads: DEFAULT_HOURS,
    reporting: DEFAULT_HOURS,
    email: DEFAULT_HOURS,
    scheduling: DEFAULT_HOURS,
  })
  const [teamSize, setTeamSize] = useState(DEFAULT_TEAM_SIZE)
  const [showTransparency, setShowTransparency] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(section, { autoAlpha: 1, y: 0 })
        gsap.set(itemRefs.current.filter(Boolean), { autoAlpha: 1, y: 0 })
        return
      }

      gsap.set(section, { autoAlpha: 0, y: 30 })
      gsap.set(itemRefs.current.filter(Boolean), { autoAlpha: 0, y: 24 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      })

      tl.to(section, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      })
      tl.to(
        itemRefs.current.filter(Boolean),
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
        },
        0.1,
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const totals = useMemo<Totals>(() => {
    const breakdown = PROCESS_CONFIG.filter(({ key }) => selectedProcesses[key]).map(({ key, rate }) => {
      const hours = hoursPerProcess[key]
      const savings = hours * rate * HOURLY_COST * 52 * teamSize * YEAR_ONE_FACTOR
      const hoursSaved = hours * rate * 52 * teamSize * YEAR_ONE_FACTOR

      return { key, savings, hoursSaved, rate }
    })

    const totalSavings = breakdown.reduce((sum, item) => sum + item.savings, 0)
    const totalHoursSaved = breakdown.reduce((sum, item) => sum + item.hoursSaved, 0)

    const currentCost = PROCESS_CONFIG
      .filter(({ key }) => selectedProcesses[key])
      .reduce((sum, { key }) => sum + hoursPerProcess[key] * HOURLY_COST * 52 * teamSize, 0)

    return {
      totalSavings,
      lowSavings: totalSavings * 0.85,
      highSavings: totalSavings * 1.15,
      totalHoursSaved,
      totalFte: totalHoursSaved / HOURS_PER_FTE,
      currentCost,
      withAiCost: currentCost - totalSavings,
      breakdown,
    }
  }, [hoursPerProcess, selectedProcesses, teamSize])

  const animatedLow = useAnimatedNumber(totals.lowSavings)
  const animatedHigh = useAnimatedNumber(totals.highSavings)
  const animatedHours = useAnimatedNumber(totals.totalHoursSaved)
  const animatedFte = useAnimatedNumber(totals.totalFte, 800)
  const animatedCurrentCost = useAnimatedNumber(totals.currentCost)
  const animatedWithAiCost = useAnimatedNumber(totals.withAiCost)
  const maxBreakdownValue = Math.max(...totals.breakdown.map((item) => item.savings), 1)

  const toggleProcess = (key: ProcessKey) => {
    setSelectedProcesses((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const handleOpenContact = () => {
    window.dispatchEvent(new CustomEvent('open-contact-modal'))
  }

  return (
    <section className="roi-section" id="roi-calculator" ref={sectionRef}>
      <style>{`
        .roi-section {
          padding: 120px 62px;
          background: #080808;
          color: #f5f5f5;
        }

        .roi-container {
          display: grid;
          grid-template-columns: 660px 1fr;
          gap: 40px;
          width: 100%;
        }

        .roi-heading-wrap {
          position: relative;
        }

        .roi-heading-sticky {
          position: sticky;
          top: 120px;
        }

        .roi-heading {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 98px;
          font-weight: 500;
          line-height: 98px;
          letter-spacing: -1.96px;
          text-transform: uppercase;
          color: #fff;
        }

        .roi-subheading {
          max-width: 480px;
          margin: 24px 0 0;
          font-family: var(--font-body), sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255,255,255,0.6);
        }

        .roi-calculator {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .roi-card {
          border: 1px solid rgba(128,128,128,0.4);
          background: rgba(17,17,17,0.5);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 10px;
          padding: 32px;
        }

        .roi-card-title {
          margin: 0 0 20px;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }

        .roi-card-hint {
          margin: -12px 0 16px;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255,255,255,0.45);
        }

        .roi-process-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .roi-process-item {
          border: 1px solid rgba(128,128,128,0.25);
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
          padding: 18px 18px 16px;
          cursor: pointer;
          user-select: none;
          transition: border-color 200ms ease, background 200ms ease;
        }

        .roi-process-item:hover {
          border-color: rgba(128,128,128,0.4);
          background: rgba(255,255,255,0.04);
        }

        .roi-process-item:focus-visible {
          outline: 2px solid rgba(128,128,128,0.4);
          outline-offset: 2px;
        }

        .roi-process-item.is-active {
          border-color: rgba(128,128,128,0.35);
          background: rgba(255,255,255,0.04);
        }

        .roi-process-item.is-active:hover {
          background: rgba(255,255,255,0.06);
        }

        .roi-process-label {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .roi-toggle {
          position: relative;
          width: 36px;
          height: 20px;
          border-radius: 999px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
          transition: background 200ms ease, border-color 200ms ease;
        }

        .roi-toggle::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          transition: transform 200ms ease, background 200ms ease;
        }

        .roi-process-item.is-active .roi-toggle {
          background: rgba(200,255,0,0.7);
          border-color: rgba(200,255,0,0.5);
        }

        .roi-process-item.is-active .roi-toggle::after {
          transform: translateX(16px);
          background: #fff;
        }

        .roi-process-texts {
          flex: 1 1 auto;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .roi-process-name {
          font-family: var(--font-body), sans-serif;
          font-size: 18px;
          line-height: 1.4;
          color: #f5f5f5;
        }

        .roi-process-rate {
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          line-height: 1.4;
          color: rgba(255,255,255,0.6);
          white-space: nowrap;
        }

        .roi-slider-wrap {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(128,128,128,0.15);
          display: grid;
          gap: 10px;
        }

        .roi-slider-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-family: var(--font-body), sans-serif;
          font-size: 16px;
          line-height: 1.4;
        }

        .roi-slider-value {
          color: #fff;
          font-weight: 500;
        }

        .roi-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 999px;
          outline: none;
          background: #222222;
          cursor: pointer;
          transition: background 200ms ease;
        }

        .roi-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          border: 2px solid #080808;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }

        .roi-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          border: 2px solid #080808;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }

        .roi-range::-moz-range-track {
          height: 4px;
          border-radius: 999px;
          background: transparent;
        }

        .roi-range:hover::-webkit-slider-thumb,
        .roi-range:focus-visible::-webkit-slider-thumb,
        .roi-range:hover::-moz-range-thumb,
        .roi-range:focus-visible::-moz-range-thumb {
          transform: scale(1.06);
          box-shadow: 0 0 0 5px rgba(255,255,255,0.12);
        }

        /* Results card — full width + glow */
        .roi-results-glow-wrap {
          position: relative;
          margin-top: 40px;
          border-radius: 12px;
        }

        .roi-results-glow {
          position: absolute;
          inset: -1px;
          border-radius: 12px;
          pointer-events: none;
          z-index: 0;
          will-change: opacity, transform;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .roi-results-glow::before {
          content: '';
          display: block;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 70%, rgba(255,255,255,0) 100%);
          height: 300%;
          width: 120px;
          position: absolute;
          animation: roi-sweep-rotate 8s linear infinite;
          z-index: 0;
          top: 50%;
          transform-origin: top center;
        }

        .roi-results-glow::after {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: 10px;
          background: #0f0f0f;
          z-index: 1;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.15);
        }

        @keyframes roi-sweep-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .roi-results-card {
          position: relative;
          z-index: 2;
          border: 1px solid rgba(128,128,128,0.4);
          background: rgba(17,17,17,0.5);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .roi-results-title {
          margin: 0 0 8px;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          line-height: 1.4;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          text-align: center;
        }

        .roi-results-empty {
          margin: 0;
          font-family: var(--font-body), sans-serif;
          font-size: 18px;
          line-height: 1.6;
          color: rgba(255,255,255,0.65);
        }

        .roi-results-grid {
          display: grid;
          gap: 0;
        }

        /* === ZON 1: Hero panel === */
        .roi-hero-zone {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(128,128,128,0.25);
          border-radius: 10px;
          padding: 32px 48px 28px;
          text-align: center;
          margin-bottom: 16px;
        }

        .roi-annual-caption {
          display: block;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .roi-annual-value {
          margin: 0 0 16px;
          font-family: var(--font-display, 'Barlow Condensed', sans-serif);
          font-size: clamp(40px, 5vw, 60px);
          line-height: 1;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: #fff;
          font-weight: 600;
        }

        .roi-before-after {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 24px;
          font-family: var(--font-display, 'Barlow Condensed', sans-serif);
          font-size: clamp(22px, 2.8vw, 32px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .roi-old-cost {
          text-decoration: line-through;
          color: rgba(255,255,255,0.35);
        }

        .roi-before-after-arrow {
          color: rgba(255,255,255,0.25);
          font-size: 0.8em;
        }

        .roi-new-cost {
          color: #fff;
        }

        .roi-before-after-unit {
          font-size: 0.6em;
          color: rgba(255,255,255,0.4);
          margin-left: 2px;
        }

        /* === ZON 2: Metrics bar === */
        .roi-metrics-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 16px 0 8px;
        }

        .roi-metric {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 0 32px;
        }

        .roi-metric-value {
          font-family: var(--font-display, 'Barlow Condensed', sans-serif);
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1;
          color: #fff;
        }

        .roi-metric-label {
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          line-height: 1.4;
          color: rgba(255,255,255,0.6);
        }

        .roi-metric-divider {
          width: 1px;
          height: 28px;
          background: rgba(128,128,128,0.25);
          flex-shrink: 0;
        }

        .roi-breakdown {
          display: grid;
          gap: 12px;
        }

        .roi-breakdown-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px 16px;
          align-items: center;
        }

        .roi-breakdown-label {
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          line-height: 1.4;
          color: rgba(255,255,255,0.84);
        }

        .roi-breakdown-value {
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          line-height: 1.4;
          color: #fff;
          text-align: right;
        }

        .roi-breakdown-bar {
          grid-column: 1 / -1;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: rgba(128,128,128,0.15);
          overflow: hidden;
        }

        .roi-breakdown-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.7) 100%);
          transition: width 300ms ease;
        }

        .roi-transparency {
          margin-top: 4px;
          padding-top: 8px;
        }

        .roi-transparency-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          border: 0;
          padding: 0;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          text-align: center;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          line-height: 1.4;
          transition: color 200ms ease;
        }

        .roi-transparency-button:hover {
          color: rgba(255,255,255,0.7);
        }

        .roi-transparency-button:focus-visible,
        .roi-cta-primary:focus-visible,
        .roi-cta-ghost:focus-visible {
          outline: 2px solid rgba(255,255,255,0.4);
          outline-offset: 4px;
        }

        .roi-transparency-icon {
          font-size: 18px;
          color: rgba(255,255,255,0.6);
          transition: transform 200ms ease;
        }

        .roi-transparency-button[aria-expanded='true'] .roi-transparency-icon {
          transform: rotate(45deg);
        }

        .roi-transparency-content {
          display: grid;
          gap: 10px;
          padding-top: 14px;
        }

        .roi-transparency-text {
          margin: 0;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255,255,255,0.6);
        }

        .roi-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px 18px;
          justify-content: center;
          padding-top: 24px;
          padding-bottom: 8px;
        }

        .roi-cta-primary,
        .roi-cta-ghost {
          font-family: var(--font-body), sans-serif;
          font-size: 16px;
          line-height: 1.2;
          min-height: 48px;
        }

        .roi-cta-primary {
          border: 1px solid #c8ff00;
          background: #c8ff00;
          color: #080808;
          border-radius: 999px;
          padding: 0 22px;
          cursor: pointer;
          transition: transform 200ms ease, opacity 200ms ease;
        }

        .roi-cta-primary:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .roi-cta-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: rgba(255,255,255,0.8);
          border-radius: 999px;
          padding: 0 22px;
          min-height: 48px;
          font-family: var(--font-body), sans-serif;
          font-size: 16px;
          line-height: 1.2;
          cursor: pointer;
          transition: border-color 200ms ease, color 200ms ease, transform 200ms ease;
        }

        .roi-cta-ghost:hover {
          border-color: #fff;
          color: #fff;
          transform: translateY(-1px);
        }

        .roi-cta-ghost:focus-visible {
          outline: 2px solid rgba(255,255,255,0.4);
          outline-offset: 4px;
        }

        @media (max-width: 999px) {
          .roi-section {
            padding: 80px 40px;
          }

          .roi-container {
            grid-template-columns: 1fr;
            gap: 36px;
          }

          .roi-heading-sticky {
            position: static;
          }

          .roi-heading {
            font-size: 7vw;
            line-height: 1;
          }
        }

        @media (max-width: 690px) {
          .roi-section {
            padding: 60px 20px;
          }

          .roi-container {
            gap: 24px;
          }

          .roi-heading {
            font-size: 40px;
            line-height: 42px;
            letter-spacing: -0.8px;
          }

          .roi-subheading {
            margin-top: 18px;
            font-size: 16px;
          }

          .roi-card {
            padding: 20px;
            border-radius: 10px;
          }

          .roi-process-texts,
          .roi-breakdown-item,
          .roi-slider-topline,
          .roi-cta-row {
            gap: 10px;
          }

          .roi-process-texts {
            flex-direction: column;
            align-items: flex-start;
          }

          .roi-process-name,
          .roi-slider-topline,
          .roi-cta-primary,
          .roi-cta-ghost {
            font-size: 14px;
          }

          .roi-range {
            height: 8px;
          }

          .roi-hero-zone {
            padding: 20px 16px 18px;
          }

          .roi-annual-value {
            font-size: 32px;
          }

          .roi-before-after {
            font-size: 18px;
            gap: 8px;
          }

          .roi-metrics-bar {
            flex-direction: column;
            gap: 12px;
            padding: 14px 0 16px;
          }

          .roi-metric {
            padding: 0;
          }

          .roi-metric-divider {
            width: 40px;
            height: 1px;
          }

          .roi-metric-value {
            font-size: 26px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .roi-section,
          .roi-process-item,
          .roi-breakdown-fill,
          .roi-transparency-icon,
          .roi-range,
          .roi-range::-webkit-slider-thumb,
          .roi-range::-moz-range-thumb,
          .roi-cta-primary,
          .roi-cta-ghost {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <div className="roi-container">
        <div className="roi-heading-wrap">
          <div className="roi-heading-sticky">
            <h2 className="roi-heading" dangerouslySetInnerHTML={{ __html: copy.heading }} />
            <p className="roi-subheading">{copy.subheading}</p>
          </div>
        </div>

        <div className="roi-calculator">
          <div
            className="roi-card"
            ref={(element) => {
              itemRefs.current[0] = element
            }}
          >
            <h3 className="roi-card-title">{copy.processLabel}</h3>
            <p className="roi-card-hint">{copy.processHint}</p>
            <div className="roi-process-list">
              {PROCESS_CONFIG.map(({ key, rate }) => {
                const checked = selectedProcesses[key]
                const sliderId = `roi-process-hours-${key}`
                return (
                  <div
                    className={`roi-process-item${checked ? ' is-active' : ''}`}
                    key={key}
                    role="button"
                    tabIndex={0}
                    aria-pressed={checked}
                    onClick={() => toggleProcess(key)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleProcess(key) } }}
                  >
                    <div className="roi-process-label">
                      <span className="roi-toggle" aria-hidden="true" />
                      <span className="roi-process-texts">
                        <span className="roi-process-name">{copy.processes[key].name}</span>
                        <span className="roi-process-rate">{Math.round(rate * 100)}% {locale === 'sv' ? 'kan automatiseras' : 'automatable'}</span>
                      </span>
                    </div>

                    {checked && (
                      <div className="roi-slider-wrap" onClick={(e) => e.stopPropagation()}>
                        <div className="roi-slider-topline">
                          <span>{copy.hoursLabel}</span>
                          <span className="roi-slider-value">{hoursPerProcess[key]}h</span>
                        </div>
                        <input
                          id={sliderId}
                          className="roi-range"
                          type="range"
                          min={MIN_HOURS}
                          max={MAX_HOURS}
                          value={hoursPerProcess[key]}
                          role="slider"
                          aria-label={`${copy.processes[key].name}. ${copy.hoursLabel}`}
                          aria-valuemin={MIN_HOURS}
                          aria-valuemax={MAX_HOURS}
                          aria-valuenow={hoursPerProcess[key]}
                          onChange={(event) =>
                            setHoursPerProcess((current) => ({
                              ...current,
                              [key]: Number(event.target.value),
                            }))
                          }
                          style={{ background: getSliderBackground(hoursPerProcess[key], MIN_HOURS, MAX_HOURS) }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div
            className="roi-card"
            ref={(element) => {
              itemRefs.current[1] = element
            }}
          >
            <h3 className="roi-card-title">{copy.teamLabel}</h3>
            <p className="roi-card-hint">{copy.teamHint}</p>
            <div className="roi-slider-wrap" style={{ marginTop: 0, paddingTop: 0, borderTop: '0' }}>
              <div className="roi-slider-topline">
                <span>{copy.teamLabel}</span>
                <span className="roi-slider-value">{teamSize} {copy.teamUnit}</span>
              </div>
              <input
                className="roi-range"
                type="range"
                min={MIN_TEAM_SIZE}
                max={MAX_TEAM_SIZE}
                value={teamSize}
                role="slider"
                aria-label={copy.teamLabel}
                aria-valuemin={MIN_TEAM_SIZE}
                aria-valuemax={MAX_TEAM_SIZE}
                aria-valuenow={teamSize}
                onChange={(event) => setTeamSize(Number(event.target.value))}
                style={{ background: getSliderBackground(teamSize, MIN_TEAM_SIZE, MAX_TEAM_SIZE) }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Results card — full width below grid, with glow border */}
      <div className="roi-results-glow-wrap">
        <div className="roi-results-glow" />
        <div
          className="roi-card roi-results-card"
          aria-live="polite"
          ref={(element) => {
            itemRefs.current[2] = element
          }}
        >
          {totals.breakdown.length === 0 ? (
            <p className="roi-results-empty">{copy.empty}</p>
          ) : (
            <div className="roi-results-grid">
              {/* ZON 1: Hero panel */}
              <div className="roi-hero-zone">
                <h3 className="roi-results-title">{copy.results.title}</h3>
                <span className="roi-annual-caption">{copy.results.annual}</span>
                <p className="roi-annual-value">
                  {formatCurrency(animatedLow, locale)} – {formatCurrency(animatedHigh, locale)}
                </p>
                <span className="roi-before-after">
                  <span className="roi-old-cost">{formatCurrency(animatedCurrentCost, locale)}</span>
                  <span className="roi-before-after-arrow" aria-hidden="true">→</span>
                  <span className="roi-new-cost">{formatCurrency(animatedWithAiCost, locale)}<span className="roi-before-after-unit">{copy.results.perYear}</span></span>
                </span>
              </div>

              {/* ZON 2: Metrics bar */}
              <div className="roi-metrics-bar">
                <div className="roi-metric">
                  <span className="roi-metric-value">{formatHours(animatedHours, locale)}</span>
                  <span className="roi-metric-label">{copy.results.hoursSaved}</span>
                </div>
                <div className="roi-metric-divider" />
                <div className="roi-metric">
                  <span className="roi-metric-value">{totals.currentCost > 0 ? `${Math.round((1 - totals.withAiCost / totals.currentCost) * 100)}%` : '0%'}</span>
                  <span className="roi-metric-label">{locale === 'sv' ? 'lägre kostnad' : 'lower cost'}</span>
                </div>
              </div>

              {/* 4. CTA — the ONE next step */}
              <div className="roi-cta-row">
                <button type="button" className="roi-cta-primary" onClick={handleOpenContact}>
                  {copy.cta.primary}
                </button>
                <button type="button" className="roi-cta-ghost" onClick={handleOpenContact}>
                  {copy.cta.secondary}
                </button>
              </div>

              {/* 5. Transparency + breakdown (tucked under CTA) */}
              <div className="roi-transparency">
                <button
                  type="button"
                  className="roi-transparency-button"
                  onClick={() => setShowTransparency((current) => !current)}
                  aria-expanded={showTransparency}
                  aria-controls="roi-transparency-content"
                >
                  <span>{copy.transparency.toggle}</span>
                  <span className="roi-transparency-icon" aria-hidden="true">+</span>
                </button>
                {showTransparency && (
                  <div id="roi-transparency-content" className="roi-transparency-content">
                    <div className="roi-breakdown">
                      <h4 className="roi-card-title" style={{ marginBottom: 0 }}>{copy.results.perProcess}</h4>
                      {totals.breakdown.map((item) => (
                        <div className="roi-breakdown-item" key={item.key}>
                          <span className="roi-breakdown-label">{copy.processes[item.key].name}</span>
                          <span className="roi-breakdown-value">{formatCurrency(item.savings, locale)}</span>
                          <div className="roi-breakdown-bar" aria-hidden="true">
                            <div
                              className="roi-breakdown-fill"
                              style={{ width: `${(item.savings / maxBreakdownValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="roi-transparency-text">{copy.transparency.hourlyRate}</p>
                    <p className="roi-transparency-text">{copy.transparency.automationRates}</p>
                    <p className="roi-transparency-text">{copy.transparency.yearOneFactor}</p>
                    <p className="roi-transparency-text">{copy.transparency.range}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
