'use client'
import { useEffect } from 'react'
import ButtonStripe from '@/components/ui/ButtonStripe'
import AccordionRowHeader from '@/components/ui/AccordionRowHeader'

function SvcListLines({ activeIndex, total }: { activeIndex: number; total: number }) {
  return (
    <div className="svc-list-lines">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`svc-list-line${i === activeIndex ? ' is-active' : ''}`} />
      ))}
    </div>
  )
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
    background: #000;
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
  #services-section .service-media img {
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
  #services-section .svc-list-lines {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    flex-shrink: 0;
  }
  #services-section .svc-list-line {
    display: inline-block;
    width: 1px;
    height: 14px;
    background: rgba(255,255,255,0.25);
    flex-shrink: 0;
    transition: height 0.3s ease, background 0.3s ease;
  }
  #services-section .svc-list-line.is-active {
    height: 28px;
    background: rgba(255,255,255,0.85);
  }
  @media (max-width: 767px) {
    #services-section .svc-list-lines { display: none; }
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

export default function ServicesClient() {
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
      })
    })
    // Ingen öppen som default — användaren väljer själv
  }, [])

  return (
    <section id="services-section">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <h2 className="svc-heading">TJÄNSTER</h2>

      <div className="service-block">

        {/* 01 AI Agents */}
        <div className="service-card">
          <AccordionRowHeader
            prefix="service"
            title="AI Agents"
            indexDisplay="01"
            counterLineCount={3}
            activeLineIndex={0}
          />
          <div className="service-inner">
            <div className="service-content">
              <a className="service-media" href="#contact">
                <img src="/images/service-ai-agents.png" loading="lazy" alt="AI Agents" width={1524} height={964} />
              </a>
              <span className="svc-content-title">AI Agents</span>
              <p className="service-desc">Medan du hanterar förfrågningar manuellt har dina konkurrenter redan satt AI-agenter på jobbet. En agent som aldrig sover, aldrig missar och tar på sig allt du inte hinner med, så du kan fokusera på det bara du kan göra.</p>
              <ul className="service-list">
                {[
                  'Tillgänglig dygnet runt, svarar när du inte kan',
                  'Hanterar hundra samtal samtidigt utan att tappa kvalitet',
                  'Lär sig din affär, inte en generisk mall',
                  'Tar över repetitiva uppgifter, du delegerar och den levererar',
                  'Fungerar i alla kanaler: mail, chatt, telefon, internt',
                  'Skalar med dig från dag ett till tusentals interaktioner',
                ].map((text, i) => (
                  <li key={i} className="svc-list-item">
                    <span className="svc-list-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="svc-list-text">{text}</span>
                    <SvcListLines activeIndex={i} total={6} />
                  </li>
                ))}
              </ul>
              <div className="eteya-btn-wrap"><ButtonStripe href="#contact">Boka samtal</ButtonStripe></div>
            </div>
          </div>
        </div>

        {/* 02 Automation */}
        <div className="service-card">
          <AccordionRowHeader
            prefix="service"
            title="Automation"
            indexDisplay="02"
            counterLineCount={3}
            activeLineIndex={1}
          />
          <div className="service-inner">
            <div className="service-content">
              <a className="service-media" href="#contact">
                <img src="/images/service-automation.png" loading="lazy" alt="Automation" width={1524} height={964} />
              </a>
              <span className="svc-content-title">Automation</span>
              <p className="service-desc">Det som tar dig 3 timmar idag tar 3 minuter imorgon. AI-automationer som inte bara följer regler utan förstår din verksamhet, fattar egna beslut och hanterar det som mänskliga händer aldrig borde rört.</p>
              <ul className="service-list">
                {[
                  '3 timmar blir 3 minuter, varje dag',
                  'Fattar beslut i flödet, du sätter riktningen och AI kör',
                  'Hanterar undantag som en människa, fast snabbare',
                  'Frigör tid för det som faktiskt bygger bolaget',
                  'Skalbar från dag ett utan extra anställningar',
                  'Kopplad till hela din verksamhet, ett flöde och noll manuellt',
                ].map((text, i) => (
                  <li key={i} className="svc-list-item">
                    <span className="svc-list-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="svc-list-text">{text}</span>
                    <SvcListLines activeIndex={i} total={6} />
                  </li>
                ))}
              </ul>
              <div className="eteya-btn-wrap"><ButtonStripe href="#contact">Boka samtal</ButtonStripe></div>
            </div>
          </div>
        </div>

        {/* 03 AI Products */}
        <div className="service-card">
          <AccordionRowHeader
            prefix="service"
            title="AI Products"
            indexDisplay="03"
            counterLineCount={3}
            activeLineIndex={2}
          />
          <div className="service-inner">
            <div className="service-content">
              <a className="service-media" href="#contact">
                <img src="/images/service-ai-products.png" loading="lazy" alt="AI Products" width={1524} height={964} />
              </a>
              <span className="svc-content-title">AI Products</span>
              <p className="service-desc">Alla dina konkurrenter hyr samma AI-verktyg. Du kan äga ditt. En skräddarsydd produkt byggd exakt för din affär, som ingen annan kan köpa, kopiera eller ta ifrån dig.</p>
              <ul className="service-list">
                {[
                  'Du äger allt: kod, data, logik och framtid',
                  'Byggt för din affär, inte anpassat till ett generiskt verktyg',
                  'Lansering på veckor, inte månader',
                  'Din idé och vår expertis, vi gör det möjligt',
                  'Skalbar från dag ett utan tak',
                  'Ingen vendor lock-in, aldrig beroende av någon annans beslut',
                ].map((text, i) => (
                  <li key={i} className="svc-list-item">
                    <span className="svc-list-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="svc-list-text">{text}</span>
                    <SvcListLines activeIndex={i} total={6} />
                  </li>
                ))}
              </ul>
              <div className="eteya-btn-wrap"><ButtonStripe href="#contact">Boka samtal</ButtonStripe></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
