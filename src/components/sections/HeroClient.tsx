'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Intro animation
  useEffect(() => {
    const letters = nameRef.current?.querySelectorAll('[data-letter]')
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo(videoWrapRef.current,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.4 },
    )
    tl.fromTo(roleRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=1.0'
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

  // Robust autoplay/loop for mobile browsers (iOS/Android)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) {
      video.pause()
      return
    }

    const tryPlay = () => {
      video.muted = true
      video.defaultMuted = true
      video.playsInline = true
      video.setAttribute('muted', '')
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', '')

      const p = video.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }

    const onCanPlay = () => tryPlay()
    const onVisibility = () => {
      if (!document.hidden) tryPlay()
    }

    tryPlay()
    video.addEventListener('canplay', onCanPlay)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('touchstart', tryPlay, { passive: true, once: true })

    const resumeCheck = window.setInterval(() => {
      if (!document.hidden && video.paused) tryPlay()
    }, 2000)

    return () => {
      video.removeEventListener('canplay', onCanPlay)
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearInterval(resumeCheck)
    }
  }, [])

  const letters = headline.split('')
  // Optical kerning: E(+0.04) T(+0.02) E(+0.02) Y(-0.06) A
  const kerning: Record<number, string> = { 0: '0.04em', 1: '0.02em', 2: '0.02em', 3: '-0.06em' }

  return (
    <section ref={heroRef} id="hero" style={{
      position: 'relative',
      height: '100vh',
      minHeight: '600px',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <style>{`
        /* Fullscreen video background */
        .hero-video-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          opacity: 0;
        }
        .hero-video-wrap video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* No overlay needed — video is light/green, text is dark */
        .hero-overlay {
          display: none;
        }



        /* Centered text content */
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
          letter-spacing: 0.18em;
          color: rgba(0, 0, 0, 0.55);
          margin-bottom: 0.75rem;
          opacity: 0;
        }

        .hero-eteya {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(5rem, 12vw, 14rem);
          color: #000;
          text-transform: uppercase;
          line-height: 0.85;
          letter-spacing: -0.04em;
          white-space: nowrap;
          display: flex;
          justify-content: center;
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
          color: rgba(0, 0, 0, 0.75);
          max-width: 36rem;
          line-height: 1.2;
          text-align: center;
        }

        /* Desktop: slight zoom to crop Veo watermark from corners */
        @media (min-width: 768px) {
          .hero-video-wrap video {
            transform: scale(1.04);
          }
        }

        /* Mobile responsive video source swap via JS */
        @media (max-width: 767px) {
          .hero-eteya {
            font-size: 22vw !important;
          }
          .hero-bottom {
            padding: 1.5rem 1.5rem 2.5rem;
          }
        }
      `}</style>

      {/* Fullscreen video background */}
      <div ref={videoWrapRef} className="hero-video-wrap">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.webp"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="/hero-desktop.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay for text readability */}
      <div className="hero-overlay" />

      {/* Centered content */}
      <div className="hero-content">
        <div ref={roleRef} className="hero-role">
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
        <p className="hero-subheadline">{subheadline}</p>
      </div>
    </section>
  )
}
