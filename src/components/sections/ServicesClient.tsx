'use client'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import ButtonStripe from '@/components/ui/ButtonStripe'
import AccordionRowHeader from '@/components/ui/AccordionRowHeader'

// Map service slug → imageAlt.service key (camelCase)
const SERVICE_SLUG_TO_ALT_KEY: Record<string, string> = {
  'ai-agents': 'aiAgents',
  'automation': 'automation',
  'ai-products': 'aiProducts',
}

const CSS = `
  #services-section {
    --ff: 'DM Sans', sans-serif;
    --ff-body: var(--font-body), 'Geist', sans-serif;
    --clr-white: #FFFFFF;
    --clr-light-black: #0F0F0F;
    --rgb-white: 255,255,255;
    --cubic-1: .5s cubic-bezier(0.65, 0, 0.35, 1);
    --transition-1: 0.3s ease;
    --blur: 10px;
    --pd-block: 2.5rem;
    --pd-inline: 0.65rem;
    --icon-size: 45.5px;
    --h3: clamp(2rem, 0.74rem + 2.63vw, 3.25rem);
    --h4: clamp(1.5rem, 0.87rem + 1.32vw, 2rem);
    --text: clamp(1.125rem, 0.7rem + 0.88vw, 1.375rem);
    --sp-block: clamp(3rem, 1rem + 4vw, 5rem);
    background: #080808;
    padding: 120px 62px;
    font-family: var(--ff-body);
    color: #fff;
  }
  @media (max-width: 991px) {
    #services-section { padding: 64px 0; }
    #services-section .svc-heading { font-size: 44px !important; margin-bottom: 32px !important; padding-left: 1rem; }
  }
  #services-section * { box-sizing: border-box; }
  #services-section a { color: inherit; text-decoration: none; }

  /* Heading */
  #services-section .svc-heading {
    font-size: 98px; font-family: var(--ff); font-weight: 500;
    color: #fff; margin-bottom: 68px; letter-spacing: -0.02em; line-height: 1;
  }

  /* Service block */
  #services-section .service-block { position: relative; z-index: 1; }

  /* Service card */
  #services-section .service-card {
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
  #services-section .service-card:first-child {
    border-top: 0.0625rem solid rgba(var(--rgb-white), 0.1);
  }
  #services-section .service-card.is-active {
    grid-template-rows: auto 1fr;
  }

  /* Title row */
  #services-section .service-title {
    position: relative; overflow: hidden; cursor: pointer;
    gap: 2.5rem; display: flex; align-items: center;
    padding-block: var(--pd-block); padding-inline: var(--pd-inline);
    font-family: var(--ff); font-size: var(--h3);
    line-height: 1em; font-weight: 400; color: var(--clr-white);
  }
  #services-section .service-title::before {
    content: ""; position: absolute; z-index: -1; top: 0; left: 0;
    transform: translateY(100%); width: 100%; height: 100%;
    transition: transform 0.45s cubic-bezier(0.1, 0, 0.2, 1),
                border-radius 0.45s cubic-bezier(0.1, 0, 0.2, 1);
    background-color: var(--clr-light-black); border-radius: 100%;
  }
  #services-section .service-card:not(.is-active) .service-title:hover::before {
    border-radius: 0; transform: translateY(0%);
  }
  #services-section .service-card.is-active .service-title::before {
    border-radius: 0; transform: translateY(0%);
  }

  /* Arrow icon */
  #services-section .service-title i {
    display: inline-block; width: var(--icon-size); height: var(--icon-size);
    flex-shrink: 0;
    transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
    background-repeat: no-repeat; background-size: 100% 100%;
    transform: rotate(0deg);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56' fill='none'%3E%3Cpath d='M42.9727 41.7372L11.6671 10.4316' stroke='white' stroke-width='2' stroke-linecap='square'/%3E%3Cpath d='M44.334 15.8765L44.334 43.0987L17.1118 43.0987' stroke='white' stroke-width='2' stroke-linecap='square'/%3E%3C/svg%3E");
  }
  #services-section .service-card.is-active .service-title i { transform: rotate(45deg); }
  @media (hover: hover) and (pointer: fine) {
    #services-section .service-card:not(.is-active) .service-title:hover i { transform: rotate(45deg); }
  }

  /* Counter */
  #services-section .service-counter {
    position: relative; gap: 1.25rem; display: inline-flex;
    align-items: center; flex-shrink: 0; min-height: 3.625rem;
    font-family: var(--ff); font-size: var(--h4);
    line-height: 1.1em; font-weight: 400; color: var(--clr-white);
    margin-left: auto;
  }
  #services-section .service-counter-lines {
    gap: 0.875rem; display: inline-flex; align-items: center;
  }
  #services-section .service-counter-line {
    position: relative; display: inline-block;
    width: 0.0625rem; height: 0.75rem; flex-shrink: 0;
    transition: 0.3s ease;
    background-color: rgba(var(--rgb-white), 0.4);
  }
  #services-section .service-counter-line.is-active {
    background-color: rgba(var(--rgb-white), 1);
  }
  #services-section .service-card.is-active .service-counter-line.is-active {
    height: 3.625rem;
  }
  @media (min-width: 1200px) {
    #services-section .service-card:not(.is-active) .service-title:hover .service-counter-line.is-active {
      height: 3.625rem;
    }
  }

  /* Inner / content */
  #services-section .service-inner { overflow: hidden; }
  #services-section .service-content {
    gap: 2rem var(--sp-block);
    display: grid;
    grid-template-columns: 0.47fr 0.50fr;
    grid-template-rows: auto auto auto;
    justify-content: space-between;
    padding-block: 1.25rem 2.5rem;
    padding-inline: var(--pd-inline);
  }

  /* Desktop grid-placering */
  #services-section .service-media    {
    display: block;
    grid-column: 2;
    grid-row: 1 / 4;
    align-self: start;
    position: sticky;
    top: 2rem;
    position: -webkit-sticky;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 76 / 48;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  }
  #services-section .svc-content-title{ display: none; /* dold på desktop */ }
  #services-section .service-desc     { grid-column: 1; grid-row: 1; }
  #services-section .service-list     { grid-column: 1; grid-row: 2; }
  #services-section .eteya-btn        { grid-column: 1; grid-row: 3; }
  #services-section .service-media img,
  #services-section .service-media video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    content-visibility: auto;
    mix-blend-mode: normal;
  }

  /* List */
  #services-section .service-list {
    display: flex;
    flex-direction: column;
    list-style: none; padding: 0; margin: 0;
  }
  #services-section .svc-list-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  #services-section .svc-list-item:first-child { border-top: 1px solid rgba(255,255,255,0.06); }
  #services-section .svc-list-num {
    font-family: var(--ff);
    font-size: 13px;
    font-weight: 400;
    color: rgba(255,255,255,0.3);
    min-width: 28px;
    flex-shrink: 0;
    line-height: 1;
    letter-spacing: 0.06em;
  }
  #services-section .svc-list-text {
    font-family: var(--ff-body);
    font-size: 15px;
    font-weight: 400;
    color: rgba(255,255,255,0.85);
    line-height: 1.45;
    flex: 1;
  }


  /* Slug-text / service description */
  #services-section .service-desc {
    font-size: 18px;
    line-height: 1.7;
    color: rgba(255,255,255,0.7);
    max-width: none;
    margin: 0;
    font-family: var(--ff-body);
    font-weight: 400;
  }

  /* Button wrapper — grid placement only */
  #services-section .eteya-btn-wrap {
    display: inline-flex; width: fit-content;
    align-self: start; justify-self: start;
    grid-column: 1;
    grid-row: 3;
    margin-top: 24px;
  }

  /* Mobile — pixel-match Redstone */
  @media (max-width: 767px) {
    #services-section .service-title {
      padding: 20px 12px !important;
      font-size: 24px !important;
      gap: 16px !important;
    }
    #services-section .service-title i {
      width: 24px !important;
      height: 24px !important;
    }
    #services-section .service-title::before,
    #services-section .service-card.is-active .service-title::before,
    #services-section .service-card:not(.is-active) .service-title:hover::before {
      transform: translateY(100%) !important;
      border-radius: 100% !important;
    }
    #services-section .service-inner {
      padding: 0 32px;
    }
    #services-section .service-content {
      grid-template-columns: 1fr !important;
      grid-template-rows: auto auto auto auto auto auto !important;
      padding: 20px 16px 24px !important;
      gap: 20px;
    }
    #services-section .service-media {
      grid-column: 1 !important;
      grid-row: 1 !important;
      /* Override desktop's width: 100% so negative margins can expand
         the element's rendered width (not just shift it horizontally).
         Without width: auto, width stays locked and the video just
         slides to the left instead of getting wider. */
      width: auto !important;
      /* Break out of .service-content (16px) and eat most of .service-inner
         padding (32px), leaving 16px of breathing room to the screen edge.
         -32px on each side gets us from a 294px container to 358px (out of
         390px iPhone viewport) = 16px from each screen edge. Text blocks
         keep their padding for readable line-length. */
      margin-left: -32px !important;
      margin-right: -32px !important;
    }
    #services-section .svc-content-title {
      display: block !important;
      grid-column: 1 !important;
      grid-row: 2 !important;
      font-family: var(--ff);
      font-size: 24px;
      font-weight: 400;
      color: #fff;
      margin: 0;
    }
    #services-section .service-desc {
      grid-column: 1 !important;
      grid-row: 3 !important;
      font-size: 15px;
      max-width: 100%;
    }
    #services-section .service-desc::after {
      margin-top: 16px;
    }
    #services-section .service-list {
      grid-column: 1 !important;
      grid-row: 4 !important;
    }
    #services-section .eteya-btn-wrap {
      grid-column: 1 !important;
      grid-row: 5 !important;
      margin-top: 4px;
    }
  }
`

export default function ServicesClient({ heading, cta, items }: {
  heading: string
  cta: string
  items: Array<{ number: string; title: string; description: string; detail: string; features: string[] }>
}) {
  const tAlt = useTranslations('imageAlt.service')
  useEffect(() => {
    const cards = document.querySelectorAll('#services-section .service-card')

    const notifyLayoutChange = (eventName: string) => {
      window.dispatchEvent(new CustomEvent(eventName))
    }

    cards.forEach((card) => {
      const title = card.querySelector('.service-title') as HTMLElement | null
      if (!title) return
      title.addEventListener('click', () => {
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
            const inner = previouslyOpen.querySelector('.service-inner') as HTMLElement | null
            const openRect = previouslyOpen.getBoundingClientRect()
            const newRect = (card as HTMLElement).getBoundingClientRect()
            // Bara kompensera om kollapsande kortet är OVANFÖR det nya
            if (inner && openRect.top < newRect.top) lostHeight = inner.offsetHeight
          }
        }

        cards.forEach((c) => c.classList.remove('is-active'))
        if (!isActive) card.classList.add('is-active')

        // ProcessSection har GSAP pin/sticky som måste refreshas när services-höjden ändras
        notifyLayoutChange('eteya:services-toggled')

        const onEnd = (e: Event) => {
          const te = e as TransitionEvent
          if (te.propertyName !== 'grid-template-rows') return
          notifyLayoutChange('eteya:services-transition-end')
        }

        card.addEventListener('transitionend', onEnd, { once: true })
        // Fallback om transitionend missas (browser edge-case)
        window.setTimeout(() => notifyLayoutChange('eteya:services-transition-end'), 650)

        // Scrolla kortets topp strax under nav-headern — endast när kortet ÖPPNAS.
        // Hybrid A+B: pass 1 pre-kompenserar med lostHeight (instant feedback),
        // pass 2 re-targetas på transitionend för att absorbera residual drift.
        // Samma Lenis-mönster som CasesClient / Nav.tsx / ScrollOnLoad / ScrollReset.
        if (!isActive) {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          const navH = (document.querySelector('.en-topbar') as HTMLElement | null)?.offsetHeight ?? 80
          const lenis = window.__lenis
          if (lenis) {
            // Pass 1: scrolla NU, pre-kompenserat. offset är linjär del av Lenis target,
            // så att subtrahera lostHeight från offset == subtrahera från target.
            lenis.scrollTo(card as HTMLElement, {
              offset: navH - 15 - lostHeight,
              duration: reduce ? 0 : 1.2,
              immediate: reduce,
            })

            // Pass 2: efter kollaps-transitionens slut, re-targeta till exakt position.
            // Lenis scrollTo mid-animation = cancel-and-replace från nuvarande animatedScroll
            // (verifierat i lenis.mjs rad 110-120), så detta är säkert.
            if (!reduce && lostHeight > 0) {
              let corrected = false
              const correct = () => {
                if (corrected) return
                corrected = true
                lenis.scrollTo(card as HTMLElement, { offset: navH - 15, duration: 0.25 })
              }
              const watchTarget = previouslyOpen ?? card
              const onCollapseEnd = (e: Event) => {
                const te = e as TransitionEvent
                if (te.propertyName !== 'grid-template-rows') return
                watchTarget.removeEventListener('transitionend', onCollapseEnd)
                correct()
              }
              watchTarget.addEventListener('transitionend', onCollapseEnd)
              window.setTimeout(correct, 650)
            }
          }
        }
      })
    })
    // Ingen öppen som default — användaren väljer själv
  }, [])

  return (
    <section id="services-section">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <h2 className="svc-heading">{heading}</h2>

      <div className="service-block">

        {items.map((item, idx) => {
        const isActive = false // Alla kort stängda som default — användaren öppnar själv
        return (
        <div className={`service-card${isActive ? ' is-active' : ''}`} key={item.number}>
          <AccordionRowHeader
            prefix="service"
            title={item.title}
            indexDisplay={item.number}
            counterLineCount={3}
            activeLineIndex={idx}
          />
          <div className="service-inner">
            <div className="service-content">
              <a className="service-media" href="#contact">
                {(() => {
                  const slug = item.number === '01' ? 'ai-agents' : item.number === '02' ? 'automation' : 'ai-products'
                  return (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={`/images/service-${slug}-poster.webp`}
                      aria-label={tAlt(SERVICE_SLUG_TO_ALT_KEY[slug] ?? 'aiAgents')}
                      width={1920}
                      height={1200}
                    >
                      <source
                        media="(max-width: 768px)"
                        src={`/videos/service-${slug}-mobile.mp4`}
                        type="video/mp4"
                      />
                      <source
                        src={`/videos/service-${slug}.mp4`}
                        type="video/mp4"
                      />
                    </video>
                  )
                })()}
              </a>
              <span className="svc-content-title">{item.title}</span>
              <p className="service-desc">{item.description}</p>
              <ul className="service-list">
                {item.features.map((text, i) => (
                  <li key={i} className="svc-list-item">
                    <span className="svc-list-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="svc-list-text">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )})}
      </div>
    </section>
  )
}
