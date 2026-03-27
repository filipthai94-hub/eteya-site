'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── count-up helper ─────────────────────────────────── */
function CountUp({ value, suffix, triggered }: { value: number; suffix: string; triggered: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!triggered) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: value, duration: 2.4, ease: 'power2.out',
      onUpdate: () => setCount(Math.round(obj.val)),
    })
  }, [triggered, value])
  return (
    <>
      <span>{count}</span>
      <span className="stats-symbol">{suffix}</span>
    </>
  )
}

/* ── main component ──────────────────────────────────── */
export default function StatsClient({
  heading,
  items,
}: {
  heading: string
  items: Array<{ value: number; suffix: string; label: string }>
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setTriggered(true), 600)
    if (!sectionRef.current) return () => clearTimeout(timer)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        onEnter: () => { clearTimeout(timer); setTriggered(true) },
      })
    }, sectionRef)
    return () => { clearTimeout(timer); ctx.revert() }
  }, [])

  return (
    <>
      <style>{`
        /* ── Brandin-style Stats Section ─────────────────── */
        #stats-section {
          --stats-bg: #FF3401;
          --stats-ink: #000;
          position: relative;
          overflow: hidden;
          padding: 6vw 4vw;
          background-color: var(--stats-bg);
        }

        /* dot / halftone texture overlay */
        #stats-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, var(--stats-ink) 1px, transparent 1px);
          background-size: 22px 22px;
          opacity: 0.06;
          pointer-events: none;
          z-index: 0;
        }

        #stats-section .stats-inner {
          position: relative;
          z-index: 1;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* single stat row */
        #stats-section .stat-row {
          display: flex;
          align-items: center;
          padding: 2.8vw 0;
          border-bottom: 1px solid rgba(0,0,0,0.12);
        }
        #stats-section .stat-row:first-child {
          border-top: 1px solid rgba(0,0,0,0.12);
        }

        /* number column */
        #stats-section .stat-number {
          flex: 0 0 40%;
          font-size: clamp(4rem, 12vw, 10rem);
          font-weight: 900;
          line-height: 1;
          color: var(--stats-ink);
          position: relative;
          display: inline-flex;
          align-items: flex-start;
          font-family: var(--font-display, 'Inter', sans-serif);
          letter-spacing: -0.02em;
        }
        #stats-section .stat-number .stats-symbol {
          font-size: 0.38em;
          line-height: 1;
          position: relative;
          top: 0.15em;
          margin-left: 0.05em;
          font-weight: 700;
        }

        /* label column */
        #stats-section .stat-label {
          flex: 1;
          font-size: clamp(1rem, 2vw, 1.4rem);
          font-weight: 400;
          color: var(--stats-ink);
          line-height: 1.35;
          font-family: var(--font-display, 'Inter', sans-serif);
          padding-left: 2vw;
        }

        /* ── mobile ───────────────────────── */
        @media (max-width: 767px) {
          #stats-section {
            padding: 12vw 6vw;
          }
          #stats-section .stat-row {
            flex-direction: column;
            align-items: flex-start;
            padding: 6vw 0;
          }
          #stats-section .stat-number {
            font-size: clamp(3.5rem, 18vw, 6rem);
            flex: none;
            margin-bottom: 0.4rem;
          }
          #stats-section .stat-label {
            padding-left: 0;
            font-size: 1rem;
          }
        }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          #stats-section .stat-number span {
            transition: none !important;
          }
        }
      `}</style>

      <section id="stats-section" ref={sectionRef}>
        <div className="stats-inner">
          {items.map((item, i) => (
            <div className="stat-row" key={i}>
              <div className="stat-number">
                <CountUp value={item.value} suffix={item.suffix} triggered={triggered} />
              </div>
              <p className="stat-label">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
