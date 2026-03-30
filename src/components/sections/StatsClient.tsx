'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
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

      ctx.fillStyle = '#C8FF00'
      ctx.fillRect(0, 0, w, h)

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

/* ── Single Stat Row (per-row ScrollTrigger + autoAlpha fade + count-up) ── */
function StatRow({ value, suffix, label, intensity }: {
  value: number; suffix: string; label: string; intensity: number
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!rowRef.current || !numberRef.current || !labelRef.current) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 690px)').matches
    let parallaxRaf: number | null = null

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // No animation — show everything immediately
        gsap.set([numberRef.current, labelRef.current], { autoAlpha: 1 })
        if (countRef.current) countRef.current.textContent = String(value)
        return
      }

      // --- Initial state: hidden ---
      gsap.set(numberRef.current, { autoAlpha: 0 })
      gsap.set(labelRef.current, { autoAlpha: 0 })

      // --- Per-row reveal timeline ---
      const tl = gsap.timeline({ paused: true })

      // Number fades in (400ms)
      tl.to(numberRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, 0)

      // Count-up starts at the same time as fade (2.4s)
      const counter = { val: 0 }
      tl.to(counter, {
        val: value,
        duration: 2.4,
        ease: 'power2.out',
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(counter.val))
        },
      }, 0)

      // Label fades in 200ms after number starts
      tl.to(labelRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, 0.2)

      // --- ScrollTrigger: fires once when row enters viewport ---
      ScrollTrigger.create({
        trigger: rowRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => tl.play(),
      })

      // --- Desktop parallax (lerp-based rAF loop, matching Salient/Nectar exactly) ---
      // Original: intensity = data-intensity / 10, lerp = 0.28
      // Formula: translateX( -(lerpedScrollY - offsetTop + vertCenter) * intensity )
      if (!isMobile && containerRef.current) {
        const intensityNorm = intensity / 10 // e.g. -3 → -0.3
        let lastY = window.scrollY || 0
        const lerpFactor = 0.28

        const animate = () => {
          const scrollY = window.scrollY || window.pageYOffset
          lastY = lastY + (scrollY - lastY) * lerpFactor

          const el = rowRef.current
          const inner = containerRef.current
          if (el && inner) {
            const rect = el.getBoundingClientRect()
            const offsetTop = rect.top + scrollY
            const height = rect.height
            const vertCenter = window.innerHeight / 2 - height / 2
            const tx = -(lastY - offsetTop + vertCenter) * intensityNorm

            inner.style.transform = `translateX(${tx}px) translateZ(0)`
          }

          parallaxRaf = requestAnimationFrame(animate)
        }

        parallaxRaf = requestAnimationFrame(animate)
      }
    }, rowRef)

    return () => {
      if (parallaxRaf) cancelAnimationFrame(parallaxRaf)
      ctx.revert()
    }
  }, [value, suffix, intensity])

  return (
    <div ref={rowRef} className="bd-stat-row" style={{ position: 'relative', overflow: 'hidden' }}>
      <BayerDitherBg />
      <div ref={containerRef} className="bd-milestone-container">
        <div className="bd-inner-row">
          <div className="bd-col bd-col-spacer" />
          <div className="bd-col bd-col-number">
            <div ref={numberRef} className="bd-number-wrap" style={{ textAlign: 'left' }}>
              <span ref={countRef} className="bd-num-digits">0</span>
              <span className="bd-num-symbol">{suffix}</span>
            </div>
          </div>
          <div className="bd-col bd-col-label">
            <p ref={labelRef} className="bd-label-text">{label}</p>
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
  const intensities = [-3, 3, -3, 3]

  return (
    <>
      <style>{`
        /* ===================================================
           Pixel-perfect clone: designbybrandin.com stats
           Per-row ScrollTrigger + autoAlpha fade + count-up
           =================================================== */

        .bd-stats-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: #121213;
        }

        .bd-stat-row {
          background: #C8FF00;
          padding: 2vw 0;
          position: relative;
          overflow: hidden;
        }

        /* Bayer dither canvas handles the background */

        .bd-milestone-container {
          position: relative;
          z-index: 1;
        }

        .bd-inner-row {
          display: flex;
          align-items: center;
          max-width: 100%;
        }

        .bd-col-spacer { flex: 0 0 15.3%; }
        .bd-col-number { flex: 0 0 30.7%; }
        .bd-col-label  { flex: 0 0 30.7%; }

        .bd-number-wrap {
          position: relative;
          display: inline-block;
          font-family: var(--font-display, 'Inter', sans-serif);
          font-size: 12vw;
          font-weight: 600;
          line-height: 1em;
          color: #121213;
          letter-spacing: -0.001em;
          /* autoAlpha handles visibility */
        }

        .bd-num-symbol {
          position: absolute;
          top: 0;
          right: 0;
          transform: translateX(43px);
          font-size: 62px;
          line-height: 34px;
          font-weight: 600;
        }

        .bd-label-text {
          margin: 0;
          font-family: var(--font-display, 'Inter', sans-serif);
          font-size: 3.42vw;
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

        /* ── Mobile (exact match: designbybrandin @390px) ──
             Row: 179px, padding 7.8px 0
             Number: 46.8px (12vw), top offset 29px from row edge
             Label: 31.2px (8vw), top offset 111px from row edge
             Left offset: 16px (from row_col_wrap padding 15.6px → rounds to 16)
             Symbol: 62px, line-height 34px, translateX(43px) ── */
        @media (max-width: 690px) {
          .bd-inner-row {
            flex-direction: column;
            align-items: flex-start;
            padding-left: 16px;
          }
          .bd-col-spacer { display: none; }
          .bd-col-number { flex: none; width: 100%; margin-bottom: 0; }
          .bd-col-label  { flex: none; width: 100%; }
          .bd-stat-row { padding: 24px 0 16px; }
          .bd-milestone-container { padding-top: 0; }
          .bd-number-wrap { font-size: 18vw; min-height: auto; margin-bottom: 12px; line-height: 1; }
          .bd-num-symbol {
            position: relative;
            top: auto;
            right: auto;
            transform: none;
            font-size: 12vw;
            line-height: 1;
            display: inline;
            vertical-align: super;
          }
          .bd-label-text { font-size: 7vw; margin-bottom: 16px; }
        }

        /* Reduced motion — no fade, no parallax, instant display */
        @media (prefers-reduced-motion: reduce) {
          .bd-milestone-container { transform: none !important; }
          .bd-number-wrap,
          .bd-label-text { opacity: 1 !important; visibility: visible !important; }
        }
      `}</style>

      <div className="bd-stats-section">
        {items.map((item, i) => (
          <StatRow
            key={i}
            value={item.value}
            suffix={item.suffix}
            label={item.label}
            intensity={intensities[i] || -3}
          />
        ))}
      </div>
    </>
  )
}
