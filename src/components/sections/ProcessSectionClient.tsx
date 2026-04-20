'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


gsap.registerPlugin(ScrollTrigger)

const CSS = `
  .process-wrap { background: #080808; font-family: var(--font-body), 'Geist', sans-serif; --ff-section: 'DM Sans', sans-serif; }

  /* ── SECTION HEADER ── */
  .process-section-header {
    background: #080808;
    padding: 120px 60px 48px;
  }
  .process-section-header h2 {
    font-family: 'DM Sans', sans-serif;
    font-size: 98px;
    font-weight: 500;
    color: #fff;
    line-height: 98px;
    text-transform: uppercase;
    letter-spacing: -1.96px;
    margin: 0;
  }
  @media (max-width: 768px) {
    .process-section-header { padding: 48px 16px 32px; }
    .process-section-header h2 { font-size: clamp(3rem, 10vw, 5rem); line-height: 1; }
  }

  /* ── BILD-SEKTION ── */
  .process-block-section {
    position: relative;
    width: 100%;
    height: 75vh;
    overflow: hidden;
    background: #C8FF00;
  }
  @media (max-width: 768px) {
    .process-block-section { height: 60vh; }
  }

  .process-canvas {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0.18;
    pointer-events: none;
  }

  .process-bg {
    position: absolute;
    inset: -20% 0;
    width: 100%;
    height: 140%;
    background-size: 120%;
    background-repeat: no-repeat;
    background-position: center center;
    z-index: 2;
    will-change: transform;
  }
  @media (max-width: 768px) {
    .process-bg { background-size: 250%; }
  }

  .process-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.85) 100%);
    z-index: 3;
  }

  .process-text-overlay {
    position: absolute;
    bottom: 60px;
    left: 58px;
    z-index: 4;
  }

  .process-label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.6vw;
    font-weight: 400;
    color: #fff;
    margin-bottom: 20px;
    line-height: 1;
    opacity: 0;
    transform: translateY(10px);
  }
  @media (max-width: 768px) {
    .process-label { font-size: 4vw; }
    .process-text-overlay { bottom: 32px; left: 24px; }
  }

  .process-heading {
    font-family: 'DM Sans', sans-serif;
    font-size: 6.25vw;
    font-weight: 400;
    line-height: 0.9;
    color: #fff;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }
  @media (max-width: 768px) {
    .process-heading { font-size: 11vw; white-space: normal; }
  }

  /* char-wrap / char-inner — letter reveal */
  .char-wrap {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
    padding-top: 0.15em;
    margin-top: -0.15em;
  }
  .char-inner {
    display: inline-block;
    transform: translateY(110%);
    will-change: transform;
  }

  /* ── TEXT-BLOCK ── */
  .process-text-block {
    background: #080808;
    padding: 86px 0;
  }
  .process-text-block-inner {
    display: flex;
    align-items: flex-start;
    max-width: 1440px;
    margin: 0 auto;
  }
  .process-col-num {
    flex: 0 0 370px;
    width: 370px;
    position: relative;
    align-self: stretch;
  }
  .process-col-num-sticky {
    position: sticky;
    top: calc(var(--nav-height) + var(--nav-gap));
    min-height: 1px;
  }
  .process-big-num {
    font-family: var(--font-nums), 'Inter', sans-serif;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
    color: #fff;
    line-height: 0.8;
    white-space: nowrap;
    user-select: none;
    font-size: 350px;
    letter-spacing: -0.03em;
    position: absolute;
    right: 0;
    top: -21px;
    pointer-events: none;
  }
  .process-col-content {
    flex: 1;
    padding: 0 13.45px 0 50px;
  }
  .process-content-heading {
    font-family: 'DM Sans', sans-serif;
    font-size: 45px;
    font-weight: 700;
    color: #fff;
    line-height: 45px;
    letter-spacing: -1.35px;
    text-transform: uppercase;
    margin-bottom: 7px;
  }
  .process-content-body {
    font-family: var(--font-body), 'Geist', sans-serif;
    font-size: 18px;
    line-height: 28px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 0;
    margin-top: 24px;
  }
  .process-list {
    list-style: none;
    margin-top: 120px;
    padding: 0;
  }
  .process-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 0;
    border-top: 1px solid rgba(255,255,255,0.12);
    font-family: var(--font-body), 'Geist', sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .process-list-item:last-child { border-bottom: 1px solid rgba(255,255,255,0.12); }
  .process-list-item::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0;
    width: 0; height: 1px;
    background: #C8FF00;
    transition: width 0.45s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .process-list-item:hover::after { width: 100%; }
  .process-item-num {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.9);
  }
  .process-btn {
    display: inline-flex;
    align-items: center;
    height: 48px;
    padding: 0 28px;
    background: #C8FF00;
    color: #000;
    font-family: var(--font-body), 'Geist', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 0;
    margin-top: 40px;
    transition: background 0.2s;
  }
  .process-btn:hover { background: #d4ff33; }

  @media (max-width: 768px) {
    .process-text-block { padding: 48px 0; }
    .process-col-num { display: none; }
    .process-col-content { padding: 0 16px; }
    .process-content-heading { font-size: 31.2px; line-height: 31.2px; }
    .process-list { margin-top: 56px; }
  }
`

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö0123456789'

interface Block {
  num: string
  label: string
  scramble: string
  bgImage: string
  heading: string
  body: string
  list: { label: string; num: string }[]
  btnText: string
}

export default function ProcessSectionClient({ heading, blocks }: {
  heading: string
  blocks: Block[]
}) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const bgRefs = useRef<(HTMLDivElement | null)[]>([])
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const textBlockRefs = useRef<(HTMLDivElement | null)[]>([])
  const bigNumRefs = useRef<(HTMLSpanElement | null)[]>([])
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])

  useEffect(() => {
    // Fast font-size — alla siffror identiska, högerställda via CSS

    // ── scramble ──
    function scramble(el: HTMLElement, finalText: string, duration = 1000, delay = 200) {
      const origChars = [...finalText.toUpperCase()]
      const charEls = [...el.querySelectorAll<HTMLElement>('.char-inner')]
      setTimeout(() => {
        charEls.forEach((charEl, i) => {
          const finalChar = origChars[i]
          if (!finalChar || finalChar === ' ') return
          const start = Date.now()
          const interval = setInterval(() => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            if (progress > i / origChars.length) {
              charEl.textContent = finalChar
              clearInterval(interval)
            } else {
              charEl.textContent = CHARS[Math.floor(Math.random() * CHARS.length)]
            }
          }, 50)
        })
      }, delay)
    }

    // ── Matrix Rain ──
    function startMatrixRain(canvas: HTMLCanvasElement, section: HTMLElement): (() => void) | undefined {
      const ctx = canvas.getContext('2d')!
      if (!ctx) return undefined
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
      const fontSize = 14
      let cols: number, drops: number[]

      function resize() {
        canvas.width = section.offsetWidth
        canvas.height = section.offsetHeight
        cols = Math.floor(canvas.width / fontSize)
        drops = Array(cols).fill(1)
      }
      function draw() {
        ctx.fillStyle = 'rgba(200, 255, 0, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
        ctx.font = fontSize + 'px monospace'
        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillText(char, i * fontSize, drops[i] * fontSize)
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
          drops[i]++
        }
      }
      resize()
      window.addEventListener('resize', resize)
      const interval = setInterval(draw, 50)
      return () => { clearInterval(interval); window.removeEventListener('resize', resize) }
    }

    const cleanups: (() => void)[] = []

    // Font-size sätts via CSS — ingen JS behövs

    blocks.forEach((_, i) => {
      const block = blocks[i]
      const section = sectionRefs.current[i]
      const bg = bgRefs.current[i]
      const heading = headingRefs.current[i]
      const label = labelRefs.current[i]
      const textBlock = textBlockRefs.current[i]
      const bigNum = bigNumRefs.current[i]
      const canvas = canvasRefs.current[i]

      if (!section || !bg || !heading || !label || !textBlock || !bigNum) return

      // Matrix Rain
      if (canvas) {
        const cleanup = startMatrixRain(canvas, section)
        if (cleanup) cleanups.push(cleanup)
      }

      // Font-size hanteras av CSS

      // Bygg letter-reveal markup
      const text = heading.dataset.scramble || ''
      heading.innerHTML = [...text].map(ch =>
        ch === ' ' ? ' ' : `<span class="char-wrap"><span class="char-inner">${ch}</span></span>`
      ).join('')
      const chars = heading.querySelectorAll<HTMLElement>('.char-inner')

      // Zoom-out
      gsap.fromTo(bg, { scale: 1.15 }, { scale: 1, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 20%', scrub: 0.8 }
      })
      // Parallax
      gsap.to(bg, { y: '15%', ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
      })

      // Letter reveal + label
      const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 75%', once: true } })
      tl.to(label, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      tl.to(chars, { y: '0%', duration: 0.7, ease: 'power3.out', stagger: 0.035 }, '-=0.3')

      // Scramble
      ScrollTrigger.create({ trigger: section, start: 'top 75%', once: true,
        onEnter: () => scramble(heading, text, 1000, 200)
      })

      // Opacity scrub på siffra
      gsap.fromTo(bigNum, { opacity: 0.9 }, { opacity: 1, ease: 'none',
        scrollTrigger: { trigger: textBlock, start: 'top bottom', end: 'bottom top', scrub: true }
      })

      // Sticky hanteras av CSS position:sticky — ingen GSAP pin behövs

      // Rubrik blur-reveal
      const contentH = textBlock.querySelector<HTMLElement>('.process-content-heading')
      const contentB = textBlock.querySelector<HTMLElement>('.process-content-body')
      const listItems = textBlock.querySelectorAll<HTMLElement>('.process-list-item')
      const list = textBlock.querySelector<HTMLElement>('.process-list')

      const isMobile = window.innerWidth <= 768
      const triggerStart = isMobile ? 'top 85%' : 'top bottom'

      if (contentH) {
        gsap.fromTo(contentH,
          { opacity: 0, y: 20, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: contentH, start: triggerStart, once: true }
          }
        )
      }
      if (contentB) {
        gsap.fromTo(contentB,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: contentB, start: triggerStart, once: true }
          }
        )
      }
      if (listItems.length && list) {
        gsap.fromTo(listItems,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08,
            scrollTrigger: { trigger: list, start: triggerStart, once: true }
          }
        )
      }
    })

    // ── Sticky calibration: räkna ut exakt min-height per block ──
    // Siffrans botten ska aligna med sista listpunktens botten när sticky släpper.
    // Formel: min-height = parentHeight - stickyTop - (lastItemBottom - colNumTop) + numVisualBottom
    // numVisualBottom = stickyTop + absoluteTop(-21) + renderedHeight(~280)
    function calibrateSticky() {
      const stickyTop = 86 // calc(60 + 26)
      document.querySelectorAll('.process-text-block').forEach(block => {
        const colNum = block.querySelector<HTMLElement>('.process-col-num')
        const sticky = block.querySelector<HTMLElement>('.process-col-num-sticky')
        const num = block.querySelector<HTMLElement>('.process-big-num')
        const colContent = block.querySelector<HTMLElement>('.process-col-content')
        if (!colNum || !sticky || !num || !colContent) return

        const listItems = colContent.querySelectorAll<HTMLElement>('.process-list-item')
        const lastItem = listItems[listItems.length - 1]
        if (!lastItem) return

        const colNumRect = colNum.getBoundingClientRect()
        const lastItemRect = lastItem.getBoundingClientRect()
        const numRect = num.getBoundingClientRect()

        const colNumAbsBottom = colNumRect.bottom + window.scrollY
        const lastItemAbsBottom = lastItemRect.bottom + window.scrollY
        const numRenderedHeight = numRect.height
        const numAbsoluteTop = -21 // from CSS
        const numVisualBottom = stickyTop + numAbsoluteTop + numRenderedHeight

        const idealHeight = colNumAbsBottom - stickyTop - lastItemAbsBottom + numVisualBottom
        if (idealHeight > 0) sticky.style.minHeight = `${Math.round(idealHeight)}px`
      })
    }
    // Kör efter render + fonts loaded
    const calibrateTimer = setTimeout(calibrateSticky, 200)
    cleanups.push(() => clearTimeout(calibrateTimer))

    // Refresh ScrollTrigger efter att alla element renderats
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 300)
    cleanups.push(() => clearTimeout(refreshTimer))

    // Global layout refresh hooks (t.ex. Services accordion öppnas/stängs ovanför denna sektion)
    const refreshPinned = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    window.addEventListener('eteya:services-toggled', refreshPinned as EventListener)
    window.addEventListener('eteya:services-transition-end', refreshPinned as EventListener)
    cleanups.push(() => {
      window.removeEventListener('eteya:services-toggled', refreshPinned as EventListener)
      window.removeEventListener('eteya:services-transition-end', refreshPinned as EventListener)
    })

    return () => {
      cleanups.forEach(fn => fn())
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div className="process-wrap">
      <style>{CSS}</style>

      {/* Section Header */}
      <div className="process-section-header">
        <h2>{heading}</h2>
      </div>

      {blocks.map((block, i) => (
        <div key={block.num}>
          {/* Bildsektion */}
          <div
            className="process-block-section"
            ref={el => { sectionRefs.current[i] = el }}
          >
            <canvas
              className="process-canvas"
              ref={el => { canvasRefs.current[i] = el }}
            />
            <div
              className="process-bg"
              ref={el => { bgRefs.current[i] = el }}
              style={{ backgroundImage: `url('${block.bgImage}')` }}
            />
            <div className="process-overlay" />
            <div className="process-text-overlay">
              <span
                className="process-label"
                ref={el => { labelRefs.current[i] = el }}
              >{block.label}</span>
              <h1
                className="process-heading"
                data-scramble={block.scramble}
                ref={el => { headingRefs.current[i] = el }}
              />
            </div>
          </div>

          {/* Text-block */}
          <div
            className="process-text-block"
            ref={el => { textBlockRefs.current[i] = el }}
          >
            <div className="process-text-block-inner">
              <div className="process-col-num">
                <div className="process-col-num-sticky">
                  <span
                    className="process-big-num"
                    ref={el => { bigNumRefs.current[i] = el }}
                  >{block.num}</span>
                </div>
              </div>
              <div className="process-col-content">
                <h2 className="process-content-heading">{block.heading}</h2>
                <p className="process-content-body">{block.body}</p>
                <ul className="process-list">
                  {block.list.map(item => (
                    <li key={item.num} className="process-list-item">
                      <span>{item.label}</span>
                      <span className="process-item-num">{item.num}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
