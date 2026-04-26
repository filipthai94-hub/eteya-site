'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ShaderHeroBackground from './ShaderHeroBackground'

gsap.registerPlugin(ScrollTrigger)

export default function HeroClient({
  role, headline, subheadline,
}: {
  role: string; headline: string; subheadline: string
  ctaPrimary: string; ctaSecondary: string; scrollLabel: string
}) {
  const heroRef = useRef<HTMLElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  // Intro animation
  useEffect(() => {
    const letters = nameRef.current?.querySelectorAll('[data-letter]')
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo(bgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.8 },
    )
    tl.fromTo(roleRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=1.3'
    )
    if (letters && letters.length > 0) {
      tl.fromTo(letters,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.05 },
        '-=0.4'
      )
    }
    tl.fromTo(bottomRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.6'
    )
  }, [])

  const letters = headline.split('')
  // Optical kerning: E(+0.04) T(+0.02) E(+0.02) Y(-0.06) A
  const kerning: Record<number, string> = { 0: '0.04em', 1: '0.02em', 2: '0.02em', 3: '-0.06em' }

  return (
    <section ref={heroRef} id="hero" style={{
      position: 'relative',
      backgroundColor: '#080808',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      // Tell the browser nothing paints outside this box. Lets the
      // compositor skip the hero when scrolling over already-rendered
      // content below it → smoother scroll.
      contain: 'paint',
    }}>
      <style>{`
        /* ── Hero height: small viewport height with safe fallback ── */
        /* 100vh on iOS Safari measures the LARGEST viewport (when URL
           bar is hidden), so hero overflows and the top gets clipped
           behind the status bar / Dynamic Island on load. 100svh is
           the "small viewport height" — always fits the visible area,
           no matter what browser chrome is showing. Older browsers
           that don't understand svh fall back to the 100vh rule. */
        #hero {
          min-height: 600px;
          height: 100vh;       /* fallback: pre-Safari 15.4, pre-Chrome 108 */
          height: 100svh;      /* modern iOS 15.4+ / Chrome 108+ / Firefox 101+ */
        }
        /* ── Shader background layer ── */
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
        }

        /* Subtle vignette for text contrast */
        .hero-vignette {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            rgba(8, 8, 8, 0) 0%,
            rgba(8, 8, 8, 0.15) 45%,
            rgba(8, 8, 8, 0.55) 100%
          );
        }

        /* Film-grain overlay for cinematic depth (Tier 1 A) */
        .hero-grain {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
        }

        /* ── Text content ── */
        .hero-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 2rem;
        }

        .hero-role {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: clamp(0.7rem, 1vw, 0.85rem);
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: #ffffff;
          margin-bottom: 0.75rem;
          opacity: 0;
          /* Light 2-layer shadow for plasma-shader background —
             just enough to ride the lime atmospheric swings. */
          text-shadow:
            0 1px 2px rgba(0, 0, 0, 0.75),
            0 0 18px rgba(0, 0, 0, 0.50);
        }

        .hero-eteya {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(5rem, 12vw, 14rem);
          color: #ffffff;
          text-transform: uppercase;
          line-height: 0.85;
          letter-spacing: -0.04em;
          white-space: nowrap;
          display: flex;
          justify-content: center;
          /* Only atmospheric halo — no tight drop-shadow. On huge text
             a 2-4px y-shadow blurs back into the glyphs and greys the
             bottom edge of each letter ("dirty text" look). Pure radial
             halo stays outside the glyph, keeps text crisp white. */
          text-shadow: 0 0 40px rgba(0, 0, 0, 0.35);
        }

        .hero-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
          padding: 2rem 2.5rem 3.5rem;
          display: flex;
          justify-content: center;
          opacity: 0;
        }

        .hero-subheadline {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(1.1rem, 1.8vw, 1.6rem);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: rgba(255, 255, 255, 0.80);
          max-width: 36rem;
          line-height: 1.2;
          text-align: center;
          /* Crispness + atmospheric halo */
          text-shadow:
            0 1px 2px rgba(0, 0, 0, 0.55),
            0 0 20px rgba(0, 0, 0, 0.40);
        }

        @media (max-width: 767px) {
          .hero-eteya { font-size: 22vw !important; }
          .hero-bottom { padding: 1.5rem 1.5rem 2.5rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-bg { opacity: 1 !important; }
        }
      `}</style>

      {/* WebGL aurora shader background */}
      <div ref={bgRef} className="hero-bg">
        <ShaderHeroBackground />
      </div>

      {/* Vignette for text readability */}
      <div className="hero-vignette" />

      {/* Film-grain overlay for cinematic depth */}
      <div className="hero-grain" aria-hidden="true" />

      {/* Centered content */}
      <div className="hero-content">
        <div ref={roleRef} className="hero-role hero-headline">
          {role}
        </div>
        <div ref={nameRef}>
          <h1 className="hero-eteya">
            {letters.map((letter, i) => (
              <span key={i} data-letter style={{ display: 'inline-block', opacity: 0, marginRight: kerning[i] || undefined }}>
                {letter}
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* Bottom subheadline */}
      <div ref={bottomRef} className="hero-bottom">
        <p className="hero-subheadline hero-summary">{subheadline}</p>
      </div>

      {/* Speakable-schema för voice search är nu en del av WebPage-schema
          som rendereras i hem-sidans @graph (src/app/[locale]/page.tsx). */}
    </section>
  )
}
