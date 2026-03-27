'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Bayer dither canvas ─────────────────────────────── */
function BayerDitherBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const draw = () => {
      const w = parent.offsetWidth
      const h = parent.offsetHeight
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Fill with the orange-red bg
      ctx.fillStyle = '#FF3401'
      ctx.fillRect(0, 0, w, h)

      // Bayer-dither dot pattern
      ctx.fillStyle = '#000000'
      const step = 20
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const offsetX = ((y / step) % 2) * (step / 2)
          const jX = Math.sin(x * 0.01 + y * 0.02) * step * 0.3
          const jY = Math.cos(x * 0.02 + y * 0.01) * step * 0.3
          ctx.globalAlpha = 0.06 + Math.random() * 0.04
          ctx.beginPath()
          ctx.arc(x + offsetX + jX, y + jY, 2.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  )
}

/* ── Count-up ────────────────────────────────────────── */
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
      <span className="bd-num-digits">{count}</span>
      <span className="bd-num-symbol">{suffix}</span>
    </>
  )
}

/* ── Single Stat Row ─────────────────────────────────── */
function StatRow({ value, suffix, label, triggered, intensity }: {
  value: number; suffix: string; label: string; triggered: boolean; intensity: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    // Only apply scroll parallax on desktop (original: data-scroll-animation-mobile="" = disabled)
    const mq = window.matchMedia('(max-width: 690px)')
    if (mq.matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { x: 0 },
        {
          x: intensity * 30,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [intensity])

  return (
    <div className="bd-stat-row" style={{ position: 'relative', overflow: 'hidden' }}>
      <BayerDitherBg />
      <div ref={containerRef} className="bd-milestone-container">
        <div className="bd-inner-row">
          <div className="bd-col bd-col-spacer" />
          <div className="bd-col bd-col-number">
            <div className="bd-number-wrap" style={{ textAlign: 'left' }}>
              <CountUp value={value} suffix={suffix} triggered={triggered} />
            </div>
          </div>
          <div className="bd-col bd-col-label">
            <p className="bd-label-text">{label}</p>
          </div>
          <div className="bd-col bd-col-spacer" />
        </div>
      </div>
    </div>
  )
}

/* ── Main Section ────────────────────────────────────── */
export default function StatsClient({
  items,
}: {
  heading: string
  items: Array<{ value: number; suffix: string; label: string }>
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTriggered(true), 600)
    if (!sectionRef.current) return () => clearTimeout(t)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        onEnter: () => { clearTimeout(t); setTriggered(true) },
      })
    }, sectionRef)
    return () => { clearTimeout(t); ctx.revert() }
  }, [])

  // Alternating intensities: -3, +3, -3, +3 (matches original exactly)
  const intensities = [-3, 3, -3, 3]

  return (
    <>
      <style>{`
        /* ===================================================
           Pixel-perfect clone: designbybrandin.com stats
           Original specs at 1440px viewport:
             Row height: 235px
             Number: Zalando Sans 172.8px / 600 / #121213
             Symbol: 62px absolute superscript, translateX(43px)
             Label: Zalando Sans 49.2px / 400 / #121213 / ls:-1.476px / lh:54.12px
             Grid: 15.3% | 30.7% | 30.7% | 15.3% (vc_col 2|4|4|2)
             Row gap: 2px (dark separator)
             Bg: #FF3401 with canvas bayer-dither
             Scroll: transform_x, alternating -3/+3, DISABLED on mobile
           =================================================== */

        .bd-stats-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: #121213; /* gap color = dark separator lines */
        }

        /* Row */
        .bd-stat-row {
          background: #FF3401;
          /* Original: 28.8px at 1440px = 2vw */
          padding: 2vw 0;
        }

        /* Milestone container — this is what the scroll parallax moves */
        .bd-milestone-container {
          position: relative;
          z-index: 1;
        }

        /* Inner row: 4-col flex grid matching vc_col-sm 2|4|4|2 */
        .bd-inner-row {
          display: flex;
          align-items: center;
          max-width: 100%;
        }

        .bd-col-spacer { flex: 0 0 15.3%; }
        .bd-col-number { flex: 0 0 30.7%; }
        .bd-col-label  { flex: 0 0 30.7%; }

        /* Number */
        .bd-number-wrap {
          position: relative;
          display: inline-block;
          font-family: var(--font-display, 'Inter', sans-serif);
          font-size: 12vw; /* 172.8px at 1440px */
          font-weight: 600;
          line-height: 1em;
          color: #121213;
          letter-spacing: -0.001em;
        }

        .bd-num-digits {
          /* inherits */
        }

        /* Superscript symbol — absolute, top-right outside the number */
        .bd-num-symbol {
          position: absolute;
          top: 0;
          right: 0;
          transform: translateX(43px);
          font-size: 62px;
          line-height: 34px; /* original: 34px */
          font-weight: 600;
        }

        /* Label */
        .bd-label-text {
          margin: 0;
          font-family: var(--font-display, 'Inter', sans-serif);
          font-size: 3.42vw; /* 49.2px at 1440px */
          font-weight: 400;
          color: #121213;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        /* ── Tablet ───────────────────────── */
        @media (max-width: 999px) {
          .bd-col-spacer { flex: 0 0 5%; }
          .bd-col-number { flex: 0 0 40%; }
          .bd-col-label  { flex: 1; }
          .bd-stat-row { padding: 3vw 25px; }
          .bd-num-symbol { font-size: 50px; line-height: 50px; transform: translateX(36px); }
        }

        /* ── Mobile — matches original: stacked content, 16px left inset ── */
        /* Original at 390px: nowrap, spacers overflow hidden, cols 359px */
        /* num=46.8px, symbol=62px/43px offset, label=31.2px */
        /* Content left-aligned with 16px offset, mb:25px on cols 1-3 */
        @media (max-width: 690px) {
          .bd-inner-row {
            flex-direction: column;
            align-items: flex-start;
            padding-left: 16px;
          }
          .bd-col-spacer { display: none; }
          .bd-col-number { flex: none; width: 100%; margin-bottom: 25px; }
          .bd-col-label  { flex: none; width: 100%; margin-bottom: 25px; }
          .bd-stat-row { padding: 20px 0 7.8px 0; } /* extra top to match original 179px rows */
          .bd-number-wrap { font-size: 12vw; } /* 46.8px at 390px */
          .bd-num-symbol { font-size: 62px; line-height: 34px; transform: translateX(43px); }
          .bd-label-text { font-size: 8vw; } /* 31.2px at 390px */
          /* NO scroll parallax on mobile — handled in JS */
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .bd-milestone-container { transform: none !important; }
        }
      `}</style>

      <div ref={sectionRef} className="bd-stats-section">
        {items.map((item, i) => (
          <StatRow
            key={i}
            value={item.value}
            suffix={item.suffix}
            label={item.label}
            triggered={triggered}
            intensity={intensities[i] || -3}
          />
        ))}
      </div>
    </>
  )
}
