'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'
import { usePathname } from '@/i18n/navigation'
import ButtonSwap from '@/components/ui/ButtonSwap'
import AccordionRowHeader from '@/components/ui/AccordionRowHeader'

// Static imports — Next.js content-hashar och serverar från /_next/static/media/
// med immutable cache automatiskt. Ger också blurDataURL för fade-in vid laddning.
import telestoreShot from '../../../public/images/cases/telestore-home-full.webp'
import nordicrankShot from '../../../public/images/cases/nordicrank-home-full.webp'
import sannegardenShot from '../../../public/images/cases/sannegarden-home-full.webp'
import trainwithalbertShot from '../../../public/images/cases/trainwithalbert-home-full.webp'
import skgStockholmShot from '../../../public/images/cases/skg-stockholm-home-full.webp'

interface CaseData {
  name: string
  tag: string
  metric: string
  slug: string
  problem: string
  solution: string
  results: string[]
  quote: string
  quoteAuthor: string
  quoteImage?: string
}

interface CasesClientProps {
  locale: string
  heading: string
  cta: string
  problemLabel: string
  solutionLabel: string
  resultsLabel: string
  items: CaseData[]
}

const CASE_LOGOS: Record<string, string> = {
  telestore: '/images/logos/telestore-new.png',
  sannegarden: '/images/logos/sannegarden-new.svg',
  trainwithalbert: '/images/logos/trainwithalbert-new.png',
  'skg-stockholm': '/images/logos/skg-stockholm.svg',
  nordicrank: '/images/logos/nordicrank.svg',
}

function getCaseLogo(slug: string) {
  return CASE_LOGOS[slug] ?? '/images/logos/telestore-new.png'
}

const CASE_LIVE_SHOTS: Record<string, StaticImageData> = {
  telestore: telestoreShot,
  nordicrank: nordicrankShot,
  sannegarden: sannegardenShot,
  trainwithalbert: trainwithalbertShot,
  'skg-stockholm': skgStockholmShot,
}

function hasLiveCaseMedia(slug: string) {
  return Boolean(CASE_LIVE_SHOTS[slug])
}

function getLiveCaseShot(slug: string): StaticImageData {
  return CASE_LIVE_SHOTS[slug] ?? CASE_LIVE_SHOTS.telestore
}

const CASE_FRAME_STYLE: Record<string, string> = {
  telestore: 'frame-luxury',
  nordicrank: 'frame-luxury',
  sannegarden: 'frame-luxury',
  trainwithalbert: 'frame-luxury',
  'skg-stockholm': 'frame-luxury',
}

function getCaseFrame(slug: string) {
  return CASE_FRAME_STYLE[slug] ?? 'frame-luxury'
}

const CSS = `
  #cases-section {
    scroll-margin-top: 80px;
    --ff: 'DM Sans', sans-serif;
    --ff-body: var(--font-body), 'Geist', sans-serif;
    --clr-white: #FFFFFF;
    --clr-light-black: #0F0F0F;
    --rgb-white: 255,255,255;
    --cubic-1: .5s cubic-bezier(0.65, 0, 0.35, 1);
    --h3: clamp(2rem, 0.74rem + 2.63vw, 3.25rem);
    --h4: clamp(1.5rem, 0.87rem + 1.32vw, 2rem);
    --text: clamp(1rem, 0.7rem + 0.6vw, 1.175rem);
    --text-sm: clamp(0.875rem, 0.65rem + 0.5vw, 1rem);
    --sp-block: clamp(3rem, 1rem + 4vw, 5rem);
    background: #080808;
    padding: 120px 62px;
    font-family: var(--ff-body);
    color: #fff;
  }
  @media (max-width: 991px) {
    #cases-section { padding: 64px 0; }
    #cases-section .cases-heading { font-size: 44px !important; margin-bottom: 32px !important; padding-left: 1rem; }
  }
  #cases-section * { box-sizing: border-box; }

  /* Heading */
  #cases-section .cases-heading {
    font-size: 98px; font-family: var(--ff); font-weight: 500;
    color: #fff; margin-bottom: 68px; letter-spacing: -0.02em; line-height: 1;
  }

  /* Case block */
  #cases-section .cases-block { position: relative; z-index: 1; }

  /* Case card */
  #cases-section .case-card {
    position: relative;
    display: grid;
    grid-template-rows: auto 0fr;
    align-content: start;
    transition: grid-template-rows var(--cubic-1);
    border-bottom: 0.0625rem solid rgba(var(--rgb-white), 0.1);
    /* Scroll-target: matchar globals.css-mönstret för #services-section/#cases-section.
       Lenis scrollTo() läser scroll-margin-top (rad 748 i lenis.mjs) och backar
       scroll-positionen med detta värde. Tillsammans med html { scroll-padding-top: 80px }
       och offset: navH + 15 i click-handlern landar kortets topp strax under nav-headern. */
    scroll-margin-top: 80px;
  }
  #cases-section .case-card:first-child {
    border-top: 0.0625rem solid rgba(var(--rgb-white), 0.1);
  }
  #cases-section .case-card.is-active {
    grid-template-rows: auto 1fr;
  }

  /* Title row */
  #cases-section .case-title {
    position: relative; overflow: hidden; cursor: pointer;
    gap: 2.5rem; display: flex; align-items: center;
    padding: 2.5rem 0.65rem;
    font-family: var(--ff); font-size: var(--h3);
    line-height: 1em; font-weight: 400; color: var(--clr-white);
  }
  #cases-section .case-title::before {
    content: ""; position: absolute; z-index: -1; top: 0; left: 0;
    transform: translateY(100%); width: 100%; height: 100%;
    transition: transform 0.45s cubic-bezier(0.1, 0, 0.2, 1),
                border-radius 0.45s cubic-bezier(0.1, 0, 0.2, 1);
    background-color: var(--clr-light-black); border-radius: 100%;
  }
  #cases-section .case-card:not(.is-active) .case-title:hover::before {
    border-radius: 0; transform: translateY(0%);
  }
  #cases-section .case-card.is-active .case-title::before {
    border-radius: 0; transform: translateY(0%);
  }

  /* Arrow */
  #cases-section .case-arrow {
    display: inline-block; width: 45.5px; height: 45.5px; flex-shrink: 0;
    transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
    background-repeat: no-repeat; background-size: 100% 100%;
    transform: rotate(0deg);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56' fill='none'%3E%3Cpath d='M42.9727 41.7372L11.6671 10.4316' stroke='white' stroke-width='2' stroke-linecap='square'/%3E%3Cpath d='M44.334 15.8765L44.334 43.0987L17.1118 43.0987' stroke='white' stroke-width='2' stroke-linecap='square'/%3E%3C/svg%3E");
  }
  #cases-section .case-card.is-active .case-arrow { transform: rotate(45deg); }
  @media (hover: hover) and (pointer: fine) {
    #cases-section .case-card:not(.is-active) .case-title:hover .case-arrow { transform: rotate(45deg); }
  }

  /* Counter (same behavior/style as Services) */
  #cases-section .case-counter {
    position: relative; gap: 1.25rem; display: inline-flex;
    align-items: center; flex-shrink: 0; min-height: 3.625rem;
    font-family: var(--ff); font-size: var(--h4);
    line-height: 1.1em; font-weight: 400; color: var(--clr-white);
    margin-left: auto;
  }
  #cases-section .case-counter-lines {
    gap: 0.875rem; display: inline-flex; align-items: center;
  }
  #cases-section .case-counter-line {
    position: relative; display: inline-block;
    width: 0.0625rem; height: 0.75rem; flex-shrink: 0;
    transition: 0.3s ease;
    background-color: rgba(var(--rgb-white), 0.4);
  }
  #cases-section .case-counter-line.is-active {
    background-color: rgba(var(--rgb-white), 1);
  }
  #cases-section .case-card.is-active .case-counter-line.is-active {
    height: 3.625rem;
  }
  @media (min-width: 1200px) {
    #cases-section .case-card:not(.is-active) .case-title:hover .case-counter-line.is-active {
      height: 3.625rem;
    }
  }

  /* Inner / content */
  #cases-section .case-inner { overflow: hidden; }
  #cases-section .case-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem var(--sp-block);
    padding: 1.25rem 0.65rem 2.5rem;
  }

  /* Left col: editorial content */
  #cases-section .case-text { display: flex; flex-direction: column; gap: 1.25rem; }
  #cases-section .case-meta {
    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
    font-size: 0.75rem; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.08em; color: rgba(var(--rgb-white), 0.5);
  }
  #cases-section .case-meta-dot {
    width: 0.1875rem; height: 0.1875rem; border-radius: 50%;
    background: rgba(var(--rgb-white), 0.3);
  }
  #cases-section .case-metric {
    font-size: clamp(1.375rem, 1.1rem + 0.8vw, 1.875rem);
    line-height: 1.2; color: var(--clr-white); letter-spacing: -0.01em;
    margin: 0;
  }
  #cases-section .case-block {
    display: grid; gap: 0.4rem;
  }
  #cases-section .case-label {
    font-size: 0.6875rem; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.08em; color: rgba(var(--rgb-white), 0.45);
  }
  #cases-section .case-description {
    font-size: var(--text); line-height: 1.55; color: rgba(var(--rgb-white), 0.75);
    margin: 0;
  }

  /* Results list */
  #cases-section .case-results {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 0.5rem;
  }
  #cases-section .case-results li {
    font-size: var(--text); color: rgba(var(--rgb-white), 0.9);
    line-height: 1.45; padding-top: 0.5rem;
    border-top: 1px solid rgba(var(--rgb-white), 0.08);
  }

  /* Quote */
  #cases-section .case-quote-inner {
    display: flex;
    align-items: center;
  }
  #cases-section .quoteImageWrap {
    flex-shrink: 0;
    margin-right: 16px;
  }
  #cases-section .quoteImage {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.1);
  }
  #cases-section .case-quote {
    border-left: 1px solid rgba(var(--rgb-white), 0.2);
    padding-left: 1rem; margin: 0.25rem 0 0;
  }
  #cases-section .case-quote p {
    font-size: var(--text); font-style: italic; line-height: 1.55;
    color: rgba(var(--rgb-white), 0.82); margin: 0 0 0.45rem;
  }
  #cases-section .case-quote cite {
    font-size: var(--text-sm); font-style: normal;
    color: rgba(var(--rgb-white), 0.5);
  }
  #cases-section .quote-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }

  /* Right col: branded media
     SIMPLIFIED: Single gradient with wider tonal spread (18 RGB steps)
     to avoid 8-bit color banding. No stacked overlays. */
  #cases-section .case-media {
    position: relative; overflow: hidden;
    border-radius: 12px; aspect-ratio: 16/10;
    border: 1px solid rgba(var(--rgb-white), 0.08);
    background: #080808;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
  }
  #cases-section .case-media > img,
  #cases-section .ts-brand > img {
    max-width: min(70%, 320px); max-height: 56%; width: auto; height: auto;
    object-fit: contain; display: block; opacity: 0.96;
    filter: brightness(1.05) contrast(1.04);
  }

  /* Case media: clean single-layer design — no stacked pseudo gradients
     One subtle inset shadow for depth, no banding-prone overlays */
  #cases-section .case-media--telestore {
    padding: 0;
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 16px 48px rgba(0,0,0,0.34), inset 0 -48px 80px rgba(0,0,0,0.35);
  }
  #cases-section .ts-brand,
  #cases-section .ts-live {
    position: absolute;
    inset: 0;
  }
  #cases-section .ts-brand { z-index: 2; }
  #cases-section .ts-live { z-index: 1; }
  #cases-section .ts-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    opacity: 1;
    transform: scale(1);
    /* Single clean gradient — wider tonal spread, no stacking */
    background: linear-gradient(180deg, #181818 0%, #080808 100%);
    transition: opacity 420ms ease, transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: 0ms;
    will-change: opacity, transform;
  }
  #cases-section .ts-brand::after {
    content: 'TELESTORE';
    position: absolute;
    inset: auto;
    font-size: clamp(1.2rem, 1rem + 0.6vw, 1.8rem);
    font-weight: 600;
    letter-spacing: 0.16em;
    color: rgba(255,255,255,0.72);
    pointer-events: none;
  }
  #cases-section .ts-brand.has-logo::after {
    opacity: 0;
  }
  #cases-section .ts-live {
    inset: 0;
    overflow: hidden;
    opacity: 0;
    transform: translate3d(0, 0.65rem, 0) scale(1.03);
    transition: opacity 320ms ease;
    background: #080808;
    --ts-pan-end: -260px;
    --ts-scale: 1.22;
    --ts-duration: 7.4s;
    will-change: opacity, transform;
  }
  #cases-section .ts-track {
    position: absolute;
    inset: 0;
    transform: translate3d(0, 0, 0) scale(var(--ts-scale));
    transform-origin: top center;
    will-change: transform;
  }
  #cases-section .ts-shot {
    display: block;
    width: 100%;
    height: auto;
    max-width: none;
    max-height: none;
    user-select: none;
    pointer-events: none;
    filter: contrast(1.04) saturate(1.03) brightness(1.01);
  }
  #cases-section .case-media--telestore.is-ready.is-playing .ts-brand {
    opacity: 0;
    transform: scale(1.05);
    transition-delay: 900ms;
  }
  #cases-section .case-media--telestore.is-ready.is-playing .ts-live {
    animation: ts-live-in 460ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: 900ms;
  }
  #cases-section .case-media--telestore.is-ready.is-playing .ts-track {
    animation: ts-pan var(--ts-duration) cubic-bezier(0.4, 0, 0.2, 1) 1350ms forwards;
  }
  #cases-section .case-media--telestore.is-returning .ts-brand {
    opacity: 1;
    transform: scale(1);
    transition-delay: 0ms;
  }
  #cases-section .case-media--telestore.is-returning .ts-live {
    opacity: 0;
    transform: translate3d(0, 0.45rem, 0) scale(1.015);
    transition: opacity 620ms cubic-bezier(0.22, 1, 0.36, 1),
                transform 620ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  #cases-section .case-media--telestore.is-returning .ts-track {
    animation: none;
    transform: translate3d(0, 0, 0) scale(var(--ts-scale));
  }
  @keyframes ts-live-in {
    from { opacity: 0; transform: translate3d(0, 0.75rem, 0) scale(1.035); }
    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }
  @keyframes ts-pan {
    from { transform: translate3d(0, 0, 0) scale(var(--ts-scale)); }
    to { transform: translate3d(0, var(--ts-pan-end), 0) scale(var(--ts-scale)); }
  }
  @media (prefers-reduced-motion: reduce) {
    #cases-section .case-media--telestore.is-ready.is-playing .ts-live {
      animation: ts-live-in 260ms ease forwards;
    }
    #cases-section .case-media--telestore.is-ready.is-playing .ts-track {
      animation: none;
    }
  }

  /* Right column wrapper — flex column, CTA sticks to bottom */
  #cases-section .case-right {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  #cases-section .case-right .case-media {
    flex: 1;
  }
  #cases-section .case-cta {
    display: flex; align-items: center; justify-content: center;
    padding-top: 1.5rem;
  }

  /* Mobile — pixel-match Redstone */
  @media (max-width: 767px) {
    #cases-section .case-title {
      padding: 20px 12px !important;
      font-size: 24px !important;
      gap: 16px !important;
    }
    #cases-section .case-arrow { width: 24px !important; height: 24px !important; }
    #cases-section .case-title::before,
    #cases-section .case-card.is-active .case-title::before,
    #cases-section .case-card:not(.is-active) .case-title:hover::before {
      transform: translateY(100%) !important;
      border-radius: 100% !important;
    }
    #cases-section .case-inner { padding: 0 32px; }
    #cases-section .case-content {
      grid-template-columns: 1fr !important;
      padding: 20px 16px 24px !important;
      gap: 20px;
    }
    #cases-section .case-media {
      grid-row: 1;
      padding: 1.5rem;
      width: auto !important;
      margin-left: -32px !important;
      margin-right: -32px !important;
    }
    #cases-section .case-media > img,
    #cases-section .ts-brand > img { max-width: 64%; max-height: 52%; }
    #cases-section .case-media--telestore { padding: 0; }
    #cases-section .case-media--telestore .ts-brand { padding: 1.2rem; }
    #cases-section .case-media--telestore .ts-live {
      --ts-scale: 1.16;
      --ts-duration: 8.1s;
    }
    #cases-section .case-metric { font-size: 1.375rem; }
    #cases-section .case-results li { font-size: 1rem; }
    #cases-section .case-right { display: contents; }
    #cases-section .case-cta { justify-content: flex-start; }
    #cases-section .case-quote-inner { flex-direction: column; align-items: flex-start; }
    #cases-section .quoteImageWrap { margin-right: 0; margin-bottom: 0; }
    #cases-section .quoteImage { width: 50px; height: 50px; }
    #cases-section .quote-footer { margin-top: 12px; }
  }
`

export default function CasesClient({ locale, heading, cta, problemLabel, solutionLabel, resultsLabel, items }: CasesClientProps) {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll('#cases-section .case-card')) as HTMLElement[]
    const bindings: Array<{ title: HTMLElement; handler: () => void }> = []

    const clearTelestoreSequence = (media: HTMLElement) => {
      const timers = (media as HTMLElement & { __tsTimers?: number[] }).__tsTimers ?? []
      timers.forEach((t) => window.clearTimeout(t))
      ;(media as HTMLElement & { __tsTimers?: number[] }).__tsTimers = []
      media.classList.remove('is-playing', 'is-returning')
    }

    const startTelestoreSequence = (media: HTMLElement) => {
      clearTelestoreSequence(media)
      media.classList.remove('is-returning')
      void media.offsetWidth
      media.classList.add('is-playing')

      const live = media.querySelector('.ts-live') as HTMLElement | null
      const durationRaw = live ? getComputedStyle(live).getPropertyValue('--ts-duration').trim() : '10s'
      const panSec = Number.parseFloat(durationRaw) || 10

      const totalMs = 1350 + panSec * 1000
      const returnMs = 620

      const t1 = window.setTimeout(() => {
        media.classList.remove('is-playing')
        media.classList.add('is-returning')
      }, totalMs)

      const t2 = window.setTimeout(() => {
        media.classList.remove('is-returning')
      }, totalMs + returnMs)

      ;(media as HTMLElement & { __tsTimers?: number[] }).__tsTimers = [t1, t2]
    }

    const updateTelestoreMetrics = () => {
      const medias = document.querySelectorAll('#cases-section .case-media--telestore') as NodeListOf<HTMLElement>
      medias.forEach((media) => {
        const live = media.querySelector('.ts-live') as HTMLElement | null
        const shot = media.querySelector('.ts-shot') as HTMLImageElement | null
        if (!live || !shot || !shot.naturalWidth || !shot.naturalHeight) return

        const slug = media.dataset.caseSlug ?? 'telestore'
        const isMobile = window.matchMedia('(max-width: 767px)').matches

        let scale: number
        let travelRatio: number
        let speed: number
        let maxDuration = 15.2

        // Universal: scale 1.0, full vertical pan, no horizontal clipping
        scale = 1.0
        travelRatio = 1
        speed = isMobile ? 30 : 38
        maxDuration = 22

        live.style.setProperty('--ts-scale', String(scale))

        const renderedHeight = (live.clientWidth / shot.naturalWidth) * shot.naturalHeight * scale
        const maxPan = Math.max(0, renderedHeight - live.clientHeight)
        const safetyPx = travelRatio === 1 ? 8 : 0
        const panPx = travelRatio === 1
          ? Math.max(0, maxPan - safetyPx)
          : Math.max(0, maxPan * travelRatio)

        const durationSec = Math.min(maxDuration, Math.max(8.4, panPx / speed))

        live.style.setProperty('--ts-pan-end', `${-Math.round(panPx)}px`)
        live.style.setProperty('--ts-duration', `${durationSec.toFixed(2)}s`)
      })
    }

    const initTelestoreMedia = () => {
      const medias = document.querySelectorAll('#cases-section .case-media--telestore') as NodeListOf<HTMLElement>
      medias.forEach((media) => {
        const shot = media.querySelector('.ts-shot') as HTMLImageElement | null
        const brand = media.querySelector('.ts-brand img') as HTMLImageElement | null
        const brandWrap = media.querySelector('.ts-brand') as HTMLElement | null
        if (!shot || !brand || !brandWrap) return

        const isLoaded = (img: HTMLImageElement) => img.complete && img.naturalWidth > 0

        const syncState = () => {
          if (isLoaded(brand)) {
            brandWrap.classList.add('has-logo')
          }
          if (isLoaded(brand) && isLoaded(shot)) {
            media.classList.add('is-ready')
            updateTelestoreMetrics()
            if (media.closest('.case-card')?.classList.contains('is-active')) {
              startTelestoreSequence(media)
            }
          }
        }

        syncState()
        if (!isLoaded(brand)) {
          brand.addEventListener('load', syncState, { once: true })
        }
        if (!isLoaded(shot)) {
          shot.addEventListener('load', syncState, { once: true })
        }
      })
    }

    initTelestoreMedia()
    updateTelestoreMetrics()
    window.addEventListener('resize', updateTelestoreMetrics)

    cards.forEach((card) => {
      const title = card.querySelector('.case-title') as HTMLElement | null
      if (!title) return

      const handler = () => {
        const isActive = card.classList.contains('is-active')

        // MÄT INNAN class-toggle: hur mycket höjd försvinner ovanför nya kortet?
        // Endast relevant om ett annat kort är öppet OCH ligger ovanför det vi öppnar.
        // Lenis låser target vid t=0 (verifierat i node_modules/lenis/dist/lenis.mjs
        // rad 110-120 + 787), så om vi inte kompenserar för kollapsande grannkort
        // scrollar Lenis mot en stale position → overshoot/undershoot.
        let lostHeight = 0
        let previouslyOpen: Element | null = null
        if (!isActive) {
          previouslyOpen = Array.from(cards).find((c) => c !== card && c.classList.contains('is-active')) ?? null
          if (previouslyOpen) {
            const inner = previouslyOpen.querySelector('.case-inner') as HTMLElement | null
            const openRect = previouslyOpen.getBoundingClientRect()
            const newRect = card.getBoundingClientRect()
            // Bara kompensera om kollapsande kortet är OVANFÖR det nya (annars påverkar det inte nya kortets position)
            if (inner && openRect.top < newRect.top) lostHeight = inner.offsetHeight
          }
        }

        cards.forEach((c) => c.classList.remove('is-active'))
        const medias = document.querySelectorAll('#cases-section .case-media--telestore') as NodeListOf<HTMLElement>
        medias.forEach(clearTelestoreSequence)

        if (!isActive) {
          card.classList.add('is-active')
          const media = card.querySelector('.case-media--telestore') as HTMLElement | null
          if (media?.classList.contains('is-ready')) {
            startTelestoreSequence(media)
          }

          // Scrolla kortets topp strax under nav-headern — endast när kortet ÖPPNAS.
          // Hybrid A+B: pass 1 pre-kompenserar med lostHeight (instant feedback),
          // pass 2 re-targetas på transitionend för att absorbera residual drift.
          // Samma Lenis-mönster som ServicesClient / Nav.tsx / ScrollOnLoad / ScrollReset.
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          const navH = (document.querySelector('.en-topbar') as HTMLElement | null)?.offsetHeight ?? 80
          const lenis = window.__lenis
          if (lenis) {
            // Pass 1: scrolla NU, pre-kompenserat. offset är linjär del av Lenis target,
            // så att subtrahera lostHeight från offset == subtrahera från target.
            lenis.scrollTo(card, {
              offset: navH - 15 - lostHeight,
              duration: reduce ? 0 : 1.2,
              immediate: reduce,
            })

            // Pass 2: efter kollaps-transitionens slut, re-targeta till exakt position.
            // Kort duration (0.25s) håller rörelsen kontinuerlig.
            // Lenis scrollTo mid-animation = cancel-and-replace från nuvarande animatedScroll
            // (verifierat i lenis.mjs rad 110-120), så detta är säkert.
            if (!reduce && lostHeight > 0) {
              let corrected = false
              const correct = () => {
                if (corrected) return
                corrected = true
                lenis.scrollTo(card, { offset: navH - 15, duration: 0.25 })
              }
              const watchTarget = previouslyOpen ?? card
              const onCollapseEnd = (e: Event) => {
                const te = e as TransitionEvent
                if (te.propertyName !== 'grid-template-rows') return
                watchTarget.removeEventListener('transitionend', onCollapseEnd)
                correct()
              }
              watchTarget.addEventListener('transitionend', onCollapseEnd)
              // Fallback om transitionend missas (Safari/Firefox edge-cases)
              window.setTimeout(correct, 650)
            }
          }
        }

        updateTelestoreMetrics()
        window.dispatchEvent(new CustomEvent('eteya:cases-toggled'))
        const onEnd = (e: Event) => {
          const te = e as TransitionEvent
          if (te.propertyName !== 'grid-template-rows') return
          updateTelestoreMetrics()
          window.dispatchEvent(new CustomEvent('eteya:cases-transition-end'))
        }
        card.addEventListener('transitionend', onEnd, { once: true })
        window.setTimeout(() => {
          updateTelestoreMetrics()
          window.dispatchEvent(new CustomEvent('eteya:cases-transition-end'))
        }, 650)
      }

      title.addEventListener('click', handler)
      bindings.push({ title, handler })
    })

    return () => {
      window.removeEventListener('resize', updateTelestoreMetrics)
      bindings.forEach(({ title, handler }) => title.removeEventListener('click', handler))
      const medias = document.querySelectorAll('#cases-section .case-media--telestore') as NodeListOf<HTMLElement>
      medias.forEach(clearTelestoreSequence)
    }
  }, [])

  return (
    <section id="cases-section">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <h2 className="cases-heading">{heading}</h2>

      <div className="cases-block">
        {items.map((c, i) => (
          <div key={c.slug} className="case-card">
            <AccordionRowHeader
              prefix="case"
              title={c.name}
              indexDisplay={String(i + 1).padStart(2, '0')}
              counterLineCount={items.length}
              activeLineIndex={i}
            />
            <div className="case-inner">
              <div className="case-content">
                <div className="case-text">
                  <div className="case-meta">
                    <span>{c.tag}</span>
                    <span className="case-meta-dot"></span>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <p className="case-metric">{c.metric}</p>

                  <div className="case-block">
                    <span className="case-label">{problemLabel}</span>
                    <p className="case-description">{c.problem}</p>
                  </div>

                  <div className="case-block">
                    <span className="case-label">{solutionLabel}</span>
                    <p className="case-description">{c.solution}</p>
                  </div>

                  <div className="case-block">
                    <span className="case-label">{resultsLabel}</span>
                    <ul className="case-results">
                      {c.results.map((r, j) => (
                        <li key={j}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <blockquote className="case-quote">
                    <div className="case-quote-inner">
                      <div className="quote-content">
                        <p>&ldquo;{c.quote}&rdquo;</p>
                        <div className="quote-footer">
                          {c.quoteImage && (
                            <div className="quoteImageWrap">
                              <img
                                src={c.quoteImage}
                                alt={c.quoteAuthor}
                                className="quoteImage"
                                width={80}
                                height={80}
                              />
                            </div>
                          )}
                          <cite>— {c.quoteAuthor}</cite>
                        </div>
                      </div>
                    </div>
                  </blockquote>
                </div>
                <div className="case-right">
                  {hasLiveCaseMedia(c.slug) ? (
                    <div className={`case-media case-media--telestore ${getCaseFrame(c.slug)}`} data-case-slug={c.slug} aria-label={`${c.name} live preview`}>
                      <div className="ts-brand">
                        <Image src={getCaseLogo(c.slug)} alt={`${c.name} logo`} loading="eager" width={200} height={60} />
                      </div>
                      <div className="ts-live">
                        <div className="ts-track">
                          <Image
                            className="ts-shot"
                            src={getLiveCaseShot(c.slug)}
                            alt={`${c.name} startsida`}
                            loading="eager"
                            width={1200}
                            height={800}
                            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                            placeholder="blur"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="case-media">
                      <Image src={getCaseLogo(c.slug)} alt={`${c.name} logo`} loading="lazy" width={200} height={60} />
                    </div>
                  )}
                  <div className="case-cta">
                    <ButtonSwap label={cta} arrow href={`/${locale}/kundcase/${c.slug}`} size="lg" variant="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
