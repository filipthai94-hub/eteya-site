'use client'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import AccordionRowHeader from '@/components/ui/AccordionRowHeader'

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
  image: string
}

const CASES: CaseData[] = [
  {
    name: 'Telestore',
    tag: 'E-handel',
    metric: '40% snabbare orderhantering',
    slug: 'telestore',
    problem: 'Telestore hanterade hundratals kundärenden manuellt varje dag — returer, orderfrågor, statusuppdateringar. Teamet drunknade i repetitiva uppgifter.',
    solution: 'Vi byggde en AI-agent som automatiskt hanterar kundtjänst, orderuppföljning och returer via mail och chatt. Integrerad med deras e-handelsplattform och ärendesystem.',
    results: [
      '40% snabbare orderhantering',
      '15h/vecka frigjord från manuellt arbete',
      '92% av ärenden lösta utan mänsklig inblandning',
      'ROI inom 6 veckor',
    ],
    quote: 'Vi kunde äntligen fokusera på tillväxt istället för att jaga ärenden.',
    quoteAuthor: 'Filip Thai, Grundare',
    image: '/images/case-telestore.jpg',
  },
  {
    name: 'NordicRank',
    tag: 'Digital Marknadsföring',
    metric: '50% mer organisk trafik',
    slug: 'nordicrank',
    problem: 'NordicRank behövde skala sin egen leverans — manuell rapportering och kampanjuppföljning tog tid från kundarbetet.',
    solution: 'Automatiserad rapportering, AI-driven innehållsanalys och smarta kampanjrekommendationer baserade på realtidsdata.',
    results: [
      '50% mer organisk trafik för deras kunder',
      'Rapporttid: från 4h till 20 minuter',
      'AI-rekommendationer → 28% bättre ROAS',
      'Skalat från 8 till 15 kunder utan ny personal',
    ],
    quote: 'Eteya automatiserade det tunga — vi kunde fokusera på strategi och kundrelationer.',
    quoteAuthor: 'Josefin Nordström, Grundare',
    image: '/images/case-nordicrank.jpg',
  },
  {
    name: 'Sannegårdens Pizzeria',
    tag: 'Restaurang',
    metric: 'Aldrig en missad bokning',
    slug: 'sannegarden',
    problem: 'Göteborgs mest populära pizzeria missade telefonbeställningar under rusningstid. Personalen hann inte svara — och varje missat samtal var förlorad omsättning.',
    solution: 'En AI-telefonist som tar emot beställningar dygnet runt, hanterar menyfrågor och bekräftar ordrar automatiskt via telefon.',
    results: [
      'Aldrig ett missat samtal under rusning',
      '30+ extra beställningar per vecka',
      'Personalen fokuserar på matlagning',
      'Kundnöjdhet ökade med 23%',
    ],
    quote: 'AI-telefonisten blev som en extra anställd som aldrig tar paus.',
    quoteAuthor: 'Omid Haddad, Ägare',
    image: '/images/case-sannegarden.jpg',
  },
  {
    name: 'TrainWithAlbert',
    tag: 'Fitness & Coaching',
    metric: '3x fler bokningar',
    slug: 'trainwithalbert',
    problem: 'Albert spenderade mer tid på admin än coaching — schemaläggning, uppföljning, och betalningspåminnelser tog timmar varje vecka.',
    solution: 'Automatiserad klientresa från bokning till uppföljning. AI-driven schemaläggning, automatiska påminnelser och personliga träningsprogram.',
    results: [
      '3x fler bokningar per månad',
      '8h/vecka sparad admin-tid',
      'Automatisk uppföljning → 45% återbokning',
      'Intäkterna ökade 60% på 3 månader',
    ],
    quote: 'Jag är coach igen, inte administratör. Det förändrade allt.',
    quoteAuthor: 'Albert Wan, Grundare',
    image: '/images/case-trainwithalbert.jpg',
  },
  {
    name: 'MB Flytt',
    tag: 'Flytt & Logistik',
    metric: '2x fler offerter per dag',
    slug: 'mbflytt',
    problem: 'Offerter skapades manuellt — varje förfrågan krävde telefonsamtal, hembesök och timmar av kalkylering. De tappade kunder till snabbare konkurrenter.',
    solution: 'AI-driven offertgenerering baserad på kundens uppgifter. Automatisk kalkylering, digital signering och bokningsbekräftelse.',
    results: [
      '2x fler offerter skickade per dag',
      'Offertid: från 24h till 15 minuter',
      '35% högre konvertering',
      'Digitala avtal → noll pappersarbete',
    ],
    quote: 'Förut förlorade vi jobb för att vi var för långsamma. Nu är vi alltid först.',
    quoteAuthor: 'Marcus Bengtsson, VD',
    image: '/images/case-mbflytt.jpg',
  },
]

const CASE_LOGOS: Record<string, string> = {
  telestore: '/images/logos/telestore-new.png',
  sannegarden: '/images/logos/sannegarden-new.svg',
  trainwithalbert: '/images/logos/trainwithalbert-new.png',
  mbflytt: '/images/logos/mbflytt.png',
  nordicrank: '/images/logos/nordicrank.svg',
}

function getCaseLogo(slug: string) {
  return CASE_LOGOS[slug] ?? '/images/logos/telestore-new.png'
}

const CASE_LIVE_SHOTS: Record<string, string> = {
  telestore: '/images/cases/telestore-home-full.png',
  nordicrank: '/images/cases/nordicrank-home-full.png',
}

const CASE_LIVE_VIDEOS: Record<string, string> = {
  nordicrank: '/images/cases/nordicrank-scroll.mp4',
}

function hasLiveCaseMedia(slug: string) {
  return Boolean(CASE_LIVE_SHOTS[slug])
}

function hasLiveCaseVideo(slug: string) {
  return Boolean(CASE_LIVE_VIDEOS[slug])
}

function getLiveCaseShot(slug: string) {
  return CASE_LIVE_SHOTS[slug] ?? CASE_LIVE_SHOTS.telestore
}

function getLiveCaseVideo(slug: string) {
  return CASE_LIVE_VIDEOS[slug]
}

const CSS = `
  #cases-section {
    --ff: 'DM Sans', sans-serif;
    --clr-white: #FFFFFF;
    --clr-light-black: #0F0F0F;
    --rgb-white: 255,255,255;
    --cubic-1: .5s cubic-bezier(0.65, 0, 0.35, 1);
    --h3: clamp(2rem, 0.74rem + 2.63vw, 3.25rem);
    --h4: clamp(1.5rem, 0.87rem + 1.32vw, 2rem);
    --text: clamp(1rem, 0.7rem + 0.6vw, 1.175rem);
    --text-sm: clamp(0.875rem, 0.65rem + 0.5vw, 1rem);
    --sp-block: clamp(3rem, 1rem + 4vw, 5rem);
    background: #000;
    padding: 80px 62px;
    font-family: var(--ff);
    color: #fff;
  }
  @media (max-width: 991px) {
    #cases-section { padding: 40px 0; }
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

  /* Right col: branded media */
  #cases-section .case-media {
    position: relative; overflow: hidden;
    border-radius: 12px; aspect-ratio: 16/10;
    border: 1px solid rgba(var(--rgb-white), 0.08);
    background:
      radial-gradient(120% 120% at 20% 10%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%),
      linear-gradient(180deg, #141414 0%, #0D0D0D 100%);
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
  }
  #cases-section .case-media > img,
  #cases-section .ts-brand > img {
    max-width: min(70%, 320px); max-height: 56%; width: auto; height: auto;
    object-fit: contain; display: block; opacity: 0.96;
    filter: brightness(1.05) contrast(1.04);
  }

  /* Telestore media v3 */
  #cases-section .case-media--telestore {
    padding: 0;
    border: 1px solid rgba(255,255,255,0.16);
    box-shadow: 0 16px 48px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08);
  }
  #cases-section .case-media--telestore::before,
  #cases-section .case-media--telestore::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 3;
  }
  #cases-section .case-media--telestore.frame-glass::before {
    background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 24%, rgba(255,255,255,0) 52%);
    mix-blend-mode: screen;
    opacity: 0.62;
  }
  #cases-section .case-media--telestore.frame-glass::after {
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 -40px 72px rgba(0,0,0,0.18);
    border-radius: 12px;
  }
  #cases-section .case-media--telestore.frame-luxury::before {
    background: radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 60%);
    opacity: 0.42;
  }
  #cases-section .case-media--telestore.frame-luxury::after {
    box-shadow:
      inset 0 0 0 1px rgba(255,255,255,0.06),
      inset 0 26px 52px rgba(255,255,255,0.03),
      inset 0 -58px 96px rgba(0,0,0,0.46);
    border-radius: 12px;
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
    background:
      radial-gradient(120% 120% at 20% 10%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%),
      linear-gradient(180deg, #101010 0%, #070707 100%);
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
    background:
      radial-gradient(120% 120% at 20% 10%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%),
      linear-gradient(180deg, #141414 0%, #0D0D0D 100%);
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
    width: 100%;
    height: auto;
    max-width: none;
    max-height: none;
    display: block;
    object-fit: cover;
    object-position: top center;
    user-select: none;
    pointer-events: none;
    filter: contrast(1.04) saturate(1.03) brightness(1.01);
  }
  #cases-section .ts-video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: top center;
    background: #090909;
    filter: contrast(1.03) saturate(1.02) brightness(1.01);
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

  /* CTA row */
  #cases-section .case-cta {
    grid-column: 1 / -1;
    display: flex; align-items: center; gap: 1rem;
    padding-top: 0.25rem;
  }
  #cases-section .case-cta .btn {
    background: transparent !important;
    border: 1px solid rgba(var(--rgb-white), 0.22) !important;
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
    #cases-section .case-media { grid-row: 1; padding: 1.5rem; }
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
  }
`

export default function CasesClient() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll('#cases-section .case-card')) as HTMLElement[]
    const bindings: Array<{ title: HTMLElement; handler: () => void }> = []

    const clearTelestoreSequence = (media: HTMLElement) => {
      const timers = (media as HTMLElement & { __tsTimers?: number[] }).__tsTimers ?? []
      timers.forEach((t) => window.clearTimeout(t))
      ;(media as HTMLElement & { __tsTimers?: number[] }).__tsTimers = []
      media.classList.remove('is-playing', 'is-returning')

      const video = media.querySelector('.ts-video') as HTMLVideoElement | null
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    }

    const startTelestoreSequence = (media: HTMLElement) => {
      clearTelestoreSequence(media)
      media.classList.remove('is-returning')
      void media.offsetWidth
      media.classList.add('is-playing')

      const live = media.querySelector('.ts-live') as HTMLElement | null
      const video = media.querySelector('.ts-video') as HTMLVideoElement | null
      const durationRaw = live ? getComputedStyle(live).getPropertyValue('--ts-duration').trim() : '10s'
      let playSec = Number.parseFloat(durationRaw) || 10

      const timers: number[] = []
      if (video) {
        const kickVideo = window.setTimeout(() => {
          video.currentTime = 0
          video.play().catch(() => {})
        }, 920)
        timers.push(kickVideo)
        if (Number.isFinite(video.duration) && video.duration > 0.5) {
          playSec = video.duration
        }
      }

      const totalMs = 1350 + playSec * 1000
      const returnMs = 620

      const t1 = window.setTimeout(() => {
        media.classList.remove('is-playing')
        media.classList.add('is-returning')
        if (video) video.pause()
      }, totalMs)

      const t2 = window.setTimeout(() => {
        media.classList.remove('is-returning')
      }, totalMs + returnMs)

      timers.push(t1, t2)
      ;(media as HTMLElement & { __tsTimers?: number[] }).__tsTimers = timers
    }

    const updateTelestoreMetrics = () => {
      const medias = document.querySelectorAll('#cases-section .case-media--telestore') as NodeListOf<HTMLElement>
      medias.forEach((media) => {
        const live = media.querySelector('.ts-live') as HTMLElement | null
        if (!live) return

        const slug = media.dataset.caseSlug ?? 'telestore'
        const isMobile = window.matchMedia('(max-width: 767px)').matches
        const video = media.querySelector('.ts-video') as HTMLVideoElement | null

        if (video) {
          live.style.setProperty('--ts-scale', '1')
          live.style.setProperty('--ts-pan-end', '0px')
          const vDur = Number.isFinite(video.duration) && video.duration > 0.5 ? video.duration : (isMobile ? 13.5 : 12.5)
          live.style.setProperty('--ts-duration', `${vDur.toFixed(2)}s`)
          return
        }

        const shot = media.querySelector('.ts-shot') as HTMLImageElement | null
        if (!shot || !shot.naturalWidth || !shot.naturalHeight) return

        let scale = isMobile ? 1.16 : 1.22
        let travelRatio = isMobile ? 0.42 : 0.5
        let durationSec = 10.5

        if (slug === 'nordicrank') {
          scale = isMobile ? 1.08 : 1.12
          travelRatio = isMobile ? 0.28 : 0.34
          durationSec = isMobile ? 13.5 : 12.5
        }

        live.style.setProperty('--ts-scale', String(scale))

        const renderedHeight = (live.clientWidth / shot.naturalWidth) * shot.naturalHeight * scale
        const maxPan = Math.max(0, renderedHeight - live.clientHeight)
        const panPx = Math.max(0, maxPan * travelRatio)

        if (slug !== 'nordicrank') {
          const speed = isMobile ? 58 : 72
          durationSec = Math.min(15.2, Math.max(8.4, panPx / speed))
        }

        live.style.setProperty('--ts-pan-end', `${-Math.round(panPx)}px`)
        live.style.setProperty('--ts-duration', `${durationSec.toFixed(2)}s`)
      })
    }

    const initTelestoreMedia = () => {
      const medias = document.querySelectorAll('#cases-section .case-media--telestore') as NodeListOf<HTMLElement>
      medias.forEach((media) => {
        const shot = media.querySelector('.ts-shot') as HTMLImageElement | null
        const video = media.querySelector('.ts-video') as HTMLVideoElement | null
        const brand = media.querySelector('.ts-brand img') as HTMLImageElement | null
        const brandWrap = media.querySelector('.ts-brand') as HTMLElement | null
        if (!brand || !brandWrap) return

        const isLoaded = (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
        const isMediaReady = () => {
          if (video) return video.readyState >= 2
          if (shot) return isLoaded(shot)
          return false
        }

        const syncState = () => {
          if (isLoaded(brand)) {
            brandWrap.classList.add('has-logo')
          }
          if (isLoaded(brand) && isMediaReady()) {
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
        if (shot && !isLoaded(shot)) {
          shot.addEventListener('load', syncState, { once: true })
        }
        if (video && video.readyState < 2) {
          video.addEventListener('loadeddata', syncState, { once: true })
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
        cards.forEach((c) => c.classList.remove('is-active'))
        const medias = document.querySelectorAll('#cases-section .case-media--telestore') as NodeListOf<HTMLElement>
        medias.forEach(clearTelestoreSequence)

        if (!isActive) {
          card.classList.add('is-active')
          const media = card.querySelector('.case-media--telestore') as HTMLElement | null
          if (media?.classList.contains('is-ready')) {
            startTelestoreSequence(media)
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

      <h2 className="cases-heading">VÅRA CASE</h2>

      <div className="cases-block">
        {CASES.map((c, i) => (
          <div key={c.slug} className="case-card">
            <AccordionRowHeader
              prefix="case"
              title={c.name}
              indexDisplay={String(i + 1).padStart(2, '0')}
              counterLineCount={CASES.length}
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
                    <span className="case-label">Problemet</span>
                    <p className="case-description">{c.problem}</p>
                  </div>

                  <div className="case-block">
                    <span className="case-label">Lösningen</span>
                    <p className="case-description">{c.solution}</p>
                  </div>

                  <div className="case-block">
                    <span className="case-label">Resultat</span>
                    <ul className="case-results">
                      {c.results.map((r, j) => (
                        <li key={j}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <blockquote className="case-quote">
                    <p>&ldquo;{c.quote}&rdquo;</p>
                    <cite>— {c.quoteAuthor}</cite>
                  </blockquote>
                </div>
                {hasLiveCaseMedia(c.slug) ? (
                  <div className="case-media case-media--telestore frame-luxury" data-case-slug={c.slug} aria-label={`${c.name} live preview`}>
                    <div className="ts-brand">
                      <img src={getCaseLogo(c.slug)} alt={`${c.name} logo`} loading="eager" decoding="async" fetchPriority="high" />
                    </div>
                    <div className="ts-live">
                      {hasLiveCaseVideo(c.slug) ? (
                        <video
                          className="ts-video"
                          src={getLiveCaseVideo(c.slug)}
                          muted
                          playsInline
                          preload="auto"
                        />
                      ) : (
                        <div className="ts-track">
                          <img
                            className="ts-shot"
                            src={getLiveCaseShot(c.slug)}
                            alt={`${c.name} startsida`}
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="case-media">
                    <img src={getCaseLogo(c.slug)} alt={`${c.name} logo`} loading="lazy" />
                  </div>
                )}
                <div className="case-cta">
                  <Button variant="small" href={`/cases/${c.slug}`}>Läs hela caset</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
