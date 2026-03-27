'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Bayer dither canvas (replicates the dot-pattern from original) ── */
function BayerDitherBg({ color = '#FF3401', ink = '#000000', pixelSize = 4 }: {
  color?: string; ink?: string; pixelSize?: number
}) {
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

      ctx.fillStyle = color
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = ink
      const step = pixelSize * 5
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const offsetX = ((y / step) % 2) * (step / 2)
          const jitterX = (Math.sin(x * 0.01 + y * 0.02) * step * 0.3)
          const jitterY = (Math.cos(x * 0.02 + y * 0.01) * step * 0.3)
          ctx.globalAlpha = 0.07 + Math.random() * 0.04
          ctx.beginPath()
          ctx.arc(x + offsetX + jitterX, y + jitterY, pixelSize * 0.6, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [color, ink, pixelSize])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

/* ── Count-up (matches nectar-milestone count effect) ──────────────── */
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
      <div className="brandin-symbol-wrap" style={{ fontSize: '62px' }}>
        <span className="brandin-symbol">{suffix}</span>
      </div>
    </>
  )
}

/* ── Stat Row (1:1 port of bayer-dither-row inner structure) ───────── */
function StatRow({ value, suffix, label, triggered, index }: {
  value: number; suffix: string; label: string; triggered: boolean; index: number
}) {
  const rowRef = useRef<HTMLDivElement>(null)

  /* scroll-driven horizontal parallax (data-scroll-animation-movement="transform_x", intensity=-3) */
  useEffect(() => {
    if (!rowRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(rowRef.current, {
        x: () => -3 * 30, /* intensity * base */
        ease: 'none',
        scrollTrigger: {
          trigger: rowRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, rowRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={rowRef}
      className="brandin-stat-row"
      style={{ position: 'relative', overflow: 'hidden', background: '#FF3401' }}
    >
      <BayerDitherBg />
      {/* inner row: spacer(2) | number(4) | label(4) | spacer(2) — matching vc_col-sm grid */}
      <div className="brandin-inner-row">
        <div className="brandin-col brandin-col-spacer" />
        <div className="brandin-col brandin-col-number">
          <div
            className={`brandin-milestone${triggered ? ' animated-in' : ''}`}
            data-symbol-alignment="superscript"
            data-ms-align="left"
          >
            <div className="brandin-number">
              <CountUp value={value} suffix={suffix} triggered={triggered} />
            </div>
          </div>
        </div>
        <div className="brandin-col brandin-col-label">
          <div className="brandin-responsive-text">
            <p>{label}</p>
          </div>
        </div>
        <div className="brandin-col brandin-col-spacer" />
      </div>
    </div>
  )
}

/* ── Main Stats Section ────────────────────────────────────────────── */
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

  return (
    <>
      <style>{`
        /* ===== Pixel-perfect clone of designbybrandin.com stats ===== */

        /* section wrapper — rows stack with 2px gap (original uses separate wpb_rows) */
        .brandin-stats-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: #000; /* gap color = black line effect */
        }

        /* single stat row */
        .brandin-stat-row {
          position: relative;
          overflow: hidden;
          padding: 2vw 4vw; /* original: calc(100vw * 0.02) top/bottom, 4vw left/right */
        }

        /* inner 12-col grid: 2 | 4 | 4 | 2 */
        .brandin-inner-row {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 10px; /* flex_gap_desktop_10px */
          max-width: 1700px;
          margin: 0 auto;
        }

        .brandin-col-spacer {
          flex: 0 0 16.666%;
        }
        .brandin-col-number {
          flex: 0 0 33.333%;
        }
        .brandin-col-label {
          flex: 0 0 33.333%;
        }

        /* milestone number */
        .brandin-milestone {
          text-align: left;
          transition: opacity 0.15s ease;
        }
        .brandin-milestone:not(.animated-in) {
          opacity: 0;
        }

        .brandin-number {
          font-family: var(--font-display, 'Inter', sans-serif);
          font-size: 12vw; /* computes to ~205px at 1710px viewport */
          line-height: 1em;
          font-weight: 600;
          color: #121213;
          position: relative;
          display: inline-block;
          letter-spacing: -0.01em;
        }

        /* superscript symbol wrap — absolute positioned */
        .brandin-symbol-wrap {
          display: inline;
          position: absolute;
          top: 0;
          right: 0;
          transform: translateX(103%);
          font-size: 62px;
          line-height: 34px;
        }
        .brandin-symbol {
          /* inherits from wrap */
        }

        /* label text */
        .brandin-responsive-text {
          font-family: var(--font-display, 'Inter', sans-serif);
          font-weight: 400;
          color: #121213;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .brandin-responsive-text p {
          margin: 0;
          font-size: clamp(1.2rem, 3.35vw, 3.6rem); /* ~57px at 1710 */
        }

        /* ── tablet ─────────────────────── */
        @media (max-width: 999px) {
          .brandin-col-spacer { display: none; }
          .brandin-col-number { flex: 0 0 40%; }
          .brandin-col-label { flex: 1; }
          .brandin-stat-row { padding: 3vw 25px; }
          .brandin-number { font-size: 14vw; }
          .brandin-symbol-wrap { font-size: 42px; line-height: 24px; }
        }

        /* ── mobile ─────────────────────── */
        @media (max-width: 690px) {
          .brandin-inner-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .brandin-col-number { flex: none; width: 100%; }
          .brandin-col-label { flex: none; width: 100%; }
          .brandin-stat-row { padding: 5vw 25px; }
          .brandin-number { font-size: 18vw; }
          .brandin-symbol-wrap { font-size: 32px; line-height: 20px; }
          .brandin-responsive-text p { font-size: 1.1rem; }
        }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .brandin-number span { transition: none !important; }
          .brandin-stat-row { transform: none !important; }
        }
      `}</style>

      <div ref={sectionRef} className="brandin-stats-wrap">
        {items.map((item, i) => (
          <StatRow
            key={i}
            index={i}
            value={item.value}
            suffix={item.suffix}
            label={item.label}
            triggered={triggered}
          />
        ))}
      </div>
    </>
  )
}
