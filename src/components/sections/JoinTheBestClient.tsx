'use client'

import { useEffect, useRef, useCallback } from 'react'

type LogoItem = {
  id: 'telestore' | 'sannegarden' | 'trainwithalbert' | 'mbflytt' | 'nordicrank'
  src: string
  alt: string
}

const ROW1_LOGOS: LogoItem[] = [
  { id: 'telestore', src: '/images/logos/telestore.svg', alt: 'Telestore' },
  { id: 'sannegarden', src: '/images/logos/sannegarden.png', alt: 'Sannegårdens Pizzeria' },
  { id: 'trainwithalbert', src: '/images/logos/trainwithalbert.svg', alt: 'TrainWithAlbert' },
]

const ROW2_LOGOS: LogoItem[] = [
  { id: 'mbflytt', src: '/images/logos/mbflytt.png', alt: 'MB Flytt' },
  { id: 'nordicrank', src: '/images/logos/nordicrank.svg', alt: 'NordicRank' },
]

const CSS = `
  /* ═══ JOIN THE BEST SECTION ═══ */
  .join-section {
    padding-top: 200px;
    background: #000;
  }

  .join-container {
    padding: 0 12px;
    margin: 0 auto;
    max-width: calc(100% - 113px);
  }

  .join-heading {
    font-family: 'DM Sans', sans-serif;
    font-size: 64px;
    font-weight: 400;
    line-height: 64px;
    letter-spacing: normal;
    text-transform: uppercase;
    color: #fff;
    margin: 0 0 80px 0;
  }

  /* ═══ MARQUEE ═══ */
  .join-marquee-wrap {
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .join-marquee-line {
    position: relative;
    width: 100vw;
    height: 15.209vw;
    will-change: transform;
    backface-visibility: hidden;
    overflow: visible;
  }

  .join-marquee-strip {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: 0;
    width: max-content;
    height: 100%;
    cursor: grabbing;
    user-select: none;
    will-change: transform;
    backface-visibility: hidden;
  }

  .join-marquee-strip:active {
    cursor: grabbing;
  }

  /* ═══ CIRCLE ITEM ═══ */
  .join-item {
    width: 15.209vw;
    height: 15.209vw;
    border-radius: 50%;
    background: #0F0F0F;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    flex-shrink: 0;
  }

  .join-logo {
    width: auto;
    height: auto;
    max-width: 72%;
    max-height: 34%;
    object-fit: contain;
    pointer-events: none;
    -webkit-user-drag: none;
    opacity: 0.95;
    transition: opacity 0.25s ease;
  }

  .join-item--telestore .join-logo { max-width: 68%; max-height: 20%; }
  .join-item--sannegarden .join-logo { max-width: 70%; max-height: 36%; }
  .join-item--trainwithalbert .join-logo { max-width: 74%; max-height: 22%; }
  .join-item--mbflytt .join-logo { max-width: 62%; max-height: 24%; }
  .join-item--nordicrank .join-logo { max-width: 64%; max-height: 20%; }

  @media (hover: hover) and (pointer: fine) {
    .join-item:hover .join-logo { opacity: 1; }
  }

  /* ═══ RESPONSIVE ═══ */
  @media (max-width: 767px) {
    .join-section { padding-top: 100px; }
    .join-heading { font-size: 36px; line-height: 36px; margin-bottom: 32px; }
    .join-container { max-width: none; width: 100%; }
    .join-marquee-line { height: 125px; }
    .join-item { width: 125px; height: 125px; padding: 20px; }
    .join-logo { max-width: 74px; max-height: 36px; }
    .join-item--telestore .join-logo { max-width: 72px; max-height: 18px; }
    .join-item--sannegarden .join-logo { max-width: 74px; max-height: 38px; }
    .join-item--trainwithalbert .join-logo { max-width: 76px; max-height: 22px; }
    .join-item--mbflytt .join-logo { max-width: 68px; max-height: 24px; }
    .join-item--nordicrank .join-logo { max-width: 70px; max-height: 20px; }
  }

  @media (min-width: 2100px) {
    .join-logo { max-width: 60%; }
  }
`

function MarqueeContent({ logos }: { logos: LogoItem[] }) {
  return (
    <div className="join-marquee-content" style={{ display: 'flex', gap: 0, height: '100%', alignItems: 'center' }}>
      {logos.map((logo, i) => (
        <div key={`${logo.id}-${i}`} className={`join-item join-item--${logo.id}`}>
          <img className="join-logo" src={logo.src} alt={logo.alt} loading="lazy" draggable={false} />
        </div>
      ))}
    </div>
  )
}

interface MarqueeLineProps {
  logos: LogoItem[]
  direction: 'left' | 'right'
  speed?: number // % per second
  repeats?: number
}

function MarqueeLine({ logos, direction, speed = 0.5, repeats = 4 }: MarqueeLineProps) {
  const strip1Ref = useRef<HTMLDivElement>(null)
  const strip2Ref = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    x: 0,           // current % position
    velocity: 0,    // drag velocity
    isDragging: false,
    dragStartX: 0,
    dragStartPos: 0,
    lastDragX: 0,
    lastDragTime: 0,
    animFrame: 0,
  })

  const speedRef = useRef(speed)

  const updatePosition = useCallback(() => {
    const s = stateRef.current
    const strip1 = strip1Ref.current
    const strip2 = strip2Ref.current
    if (!strip1 || !strip2) return

    const stripW = strip1.scrollWidth

    // Apply position with translate3d for GPU compositing
    strip1.style.transform = `translate3d(${(s.x / 100) * stripW}px, 0, 0)`
    strip2.style.transform = `translate3d(${((s.x + 100) / 100) * stripW}px, 0, 0)`
  }, [])

  useEffect(() => {
    const updateSpeed = () => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches
      const mobileFactor = 1.6 // Redstone ratio: data-mobile(0.008) / data-speed(0.005)
      speedRef.current = isMobile ? speed * mobileFactor : speed
    }

    updateSpeed()
    window.addEventListener('resize', updateSpeed)
    return () => window.removeEventListener('resize', updateSpeed)
  }, [speed])

  useEffect(() => {
    const s = stateRef.current
    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      if (!s.isDragging) {
        // Apply inertia from drag release
        if (Math.abs(s.velocity) > 0.01) {
          s.x += s.velocity * dt
          s.velocity *= 0.95 // friction
        } else {
          s.velocity = 0
        }

        // Auto-scroll
        const autoSpeed = direction === 'left' ? -speedRef.current : speedRef.current
        s.x += autoSpeed * dt
      }

      // Wrap around for infinite loop
      // Strip width = 100% of one set. When x goes below -100%, add 100%.
      if (s.x < -100) s.x += 100
      if (s.x > 0) s.x -= 100

      updatePosition()
      s.animFrame = requestAnimationFrame(tick)
    }

    s.animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(s.animFrame)
  }, [direction, updatePosition])

  // Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const s = stateRef.current
    s.isDragging = true
    s.dragStartX = e.clientX
    s.dragStartPos = s.x
    s.lastDragX = e.clientX
    s.lastDragTime = performance.now()
    s.velocity = 0
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const s = stateRef.current
    if (!s.isDragging) return

    const strip = strip1Ref.current
    if (!strip) return

    const stripW = strip.scrollWidth
    const dx = e.clientX - s.dragStartX
    const dxPercent = (dx / stripW) * 100

    s.x = s.dragStartPos + dxPercent

    // Track velocity
    const now = performance.now()
    const vdt = (now - s.lastDragTime) / 1000
    if (vdt > 0) {
      const vdx = ((e.clientX - s.lastDragX) / stripW) * 100
      s.velocity = vdx / vdt * 0.3 // dampen
    }
    s.lastDragX = e.clientX
    s.lastDragTime = now
  }, [])

  const handlePointerUp = useCallback(() => {
    stateRef.current.isDragging = false
  }, [])

  // Build logo array with repeats for seamless wrapping
  const allLogos = Array.from({ length: repeats }, () => logos).flat()

  return (
    <div className="join-marquee-line">
      <div
        ref={strip1Ref}
        className="join-marquee-strip"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <MarqueeContent logos={allLogos} />
      </div>
      <div
        ref={strip2Ref}
        className="join-marquee-strip"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <MarqueeContent logos={allLogos} />
      </div>
    </div>
  )
}

export default function JoinTheBestClient() {
  return (
    <section className="join-section">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="join-container">
        <h2 className="join-heading">Trusted By</h2>
      </div>

      <div className="join-marquee-wrap">
        <MarqueeLine logos={ROW1_LOGOS} direction="left" speed={0.5} repeats={6} />
        <MarqueeLine logos={ROW2_LOGOS} direction="right" speed={0.5} repeats={8} />
      </div>
    </section>
  )
}
