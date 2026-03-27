'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── count-up ────────────────────────────────────────── */
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
      <span className="stat-num-value">{count}</span>
      <span className="stat-num-symbol">{suffix}</span>
    </>
  )
}

/* ── component ───────────────────────────────────────── */
export default function StatsClient({
  items,
}: {
  heading: string
  items: Array<{ value: number; suffix: string; label: string }>
}) {
  const ref = useRef<HTMLElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTriggered(true), 600)
    if (!ref.current) return () => clearTimeout(t)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current, start: 'top 85%',
        onEnter: () => { clearTimeout(t); setTriggered(true) },
      })
    }, ref)
    return () => { clearTimeout(t); ctx.revert() }
  }, [])

  return (
    <>
      <style>{`
        /* ===== Brandin-style Stats — pixel-perfect clone ===== */
        #stats-section {
          --stats-bg: #FF3401;
          --stats-text: #121213;
          position: relative;
          overflow: hidden;
          padding: 2vw 4vw;
          background-color: var(--stats-bg);
        }

        /* halftone dot overlay (matches bayer-dither-bg) */
        #stats-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #000 1.2px, transparent 1.2px);
          background-size: 20px 20px;
          opacity: 0.045;
          pointer-events: none;
          z-index: 0;
        }

        #stats-section .stats-inner {
          position: relative;
          z-index: 1;
          max-width: 1700px;
          margin: 0 auto;
        }

        /* ── row ────────────────────────── */
        #stats-section .stat-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          align-items: center;
          padding: 2.2vw 0;
          border-bottom: 1px solid rgba(0,0,0,0.10);
        }
        #stats-section .stat-row:first-child {
          border-top: 1px solid rgba(0,0,0,0.10);
        }

        /* ── number ─────────────────────── */
        #stats-section .stat-num {
          font-size: 12vw;        /* ~205px at 1710vp */
          line-height: 1;
          font-weight: 600;
          color: var(--stats-text);
          position: relative;
          display: inline-flex;
          align-items: flex-start;
          letter-spacing: -0.02em;
        }
        #stats-section .stat-num .stat-num-symbol {
          font-size: 62px;
          line-height: 1;
          position: absolute;
          top: 0;
          right: -0.5em;
          font-weight: 600;
        }

        /* ── label ──────────────────────── */
        #stats-section .stat-label {
          font-size: clamp(1.4rem, 3.35vw, 3.6rem);
          font-weight: 400;
          color: var(--stats-text);
          line-height: 1.2;
          padding-left: 2vw;
        }

        /* ── mobile ─────────────────────── */
        @media (max-width: 767px) {
          #stats-section {
            padding: 10vw 6vw;
          }
          #stats-section .stat-row {
            grid-template-columns: 1fr;
            padding: 7vw 0;
          }
          #stats-section .stat-num {
            font-size: 18vw;
            margin-bottom: 0.3rem;
          }
          #stats-section .stat-num .stat-num-symbol {
            font-size: 32px;
          }
          #stats-section .stat-label {
            padding-left: 0;
            font-size: 1.1rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #stats-section .stat-num span { transition: none !important; }
        }
      `}</style>

      <section id="stats-section" ref={ref}>
        <div className="stats-inner">
          {items.map((item, i) => (
            <div className="stat-row" key={i}>
              <div className="stat-num">
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
