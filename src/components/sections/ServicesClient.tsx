'use client'
import { useEffect } from 'react'

const CSS = `
  #services-section {
    --ff: 'DM Sans', sans-serif;
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
    padding: 80px 62px;
    font-family: var(--ff);
    color: #fff;
  }
  @media (max-width: 991px) {
    #services-section { padding: 40px 0; }
    #services-section .svc-heading { font-size: 44px !important; margin-bottom: 32px !important; padding-left: 1rem; }
  }
  #services-section * { box-sizing: border-box; }
  #services-section a { color: inherit; text-decoration: none; }

  /* Heading */
  #services-section .svc-heading {
    font-size: 98px; font-family: var(--ff); font-weight: 300;
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
    background-color: var(--clr-light-black); border-radius: 50%;
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
  #services-section .service-card:not(.is-active) .service-title:hover i { transform: rotate(45deg); }

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
    transition: height 0.4s cubic-bezier(0.65, 0, 0.35, 1),
                background-color 0.3s ease;
    background-color: rgba(var(--rgb-white), 0.4);
  }
  #services-section .service-counter-line.is-active {
    background-color: rgba(var(--rgb-white), 1);
  }
  #services-section .service-card.is-active .service-counter-line.is-active {
    height: 3.625rem;
  }
  #services-section .service-card:not(.is-active) .service-title:hover .service-counter-line.is-active {
    height: 3.625rem;
  }

  /* Inner / content */
  #services-section .service-inner { overflow: hidden; }
  #services-section .service-content {
    gap: 1.25rem var(--sp-block);
    display: grid;
    grid-template-columns: 0.47fr 0.50fr;
    justify-content: space-between;
    padding-block: 1.25rem 2.5rem;
    padding-inline: var(--pd-inline);
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s,
                transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s;
  }
  #services-section .service-card.is-active .service-content { opacity: 1; transform: translateY(0); }

  /* Desktop grid-placering */
  #services-section .service-media    { display: block; grid-column: 2; grid-row: 1 / 4; align-self: center; }
  #services-section .svc-content-title{ display: none; /* dold på desktop */ }
  #services-section .service-list     { grid-column: 1; grid-row: 1; }
  #services-section .eteya-btn        { grid-column: 1; grid-row: 2; }
  #services-section .service-media img {
    width: 100%; height: auto; mix-blend-mode: screen; display: block;
  }

  /* List */
  #services-section .service-list {
    gap: 0.5rem 0.75rem; display: grid;
    grid-template-columns: auto auto; justify-content: space-between;
    font-size: var(--text); line-height: 1.28em; font-weight: 400;
    color: rgba(var(--rgb-white), 0.7); list-style: none; padding: 0; margin: 0;
    align-content: start;
  }
  #services-section .service-list li { padding-left: 1.1rem; position: relative; }
  #services-section .service-list li::before {
    content: "○"; position: absolute; left: 0; font-size: 0.7em; top: 0.15em; opacity: 0.6;
  }

  /* Button */
  #services-section .eteya-btn {
    display: inline-flex; width: fit-content;
    align-self: end; justify-self: start;
    align-items: center; justify-content: center;
    background: #C8FF00; color: #121213;
    border: none; border-radius: 0;
    font-family: var(--ff); font-size: 14px; font-weight: 500;
    padding: 0 24px; height: 48px; cursor: pointer;
    text-decoration: none;
    transition: background .4s cubic-bezier(.165,.84,.44,1), transform .4s cubic-bezier(.165,.84,.44,1);
    white-space: nowrap; letter-spacing: 0.02em;
    grid-column: 1;
    grid-row: 2;
  }
  #services-section .eteya-btn:hover { background: #b8ef00; transform: translateY(-3px); }

  /* Mobile */
  @media (max-width: 767px) {
    #services-section .service-content {
      grid-template-columns: 1fr !important;
      grid-template-rows: auto auto auto auto !important;
      padding-inline: 1rem;
      gap: 1rem;
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
      font-size: 1.5rem;
      font-weight: 400;
      color: #fff;
      margin: 0;
    }
    #services-section .service-list {
      grid-column: 1 !important;
      grid-row: 3 !important;
      grid-template-columns: 1fr 1fr !important;
    }
    #services-section .eteya-btn {
      grid-column: 1 !important;
      grid-row: 4 !important;
    }
  }
`

export default function ServicesClient() {
  useEffect(() => {
    const cards = document.querySelectorAll('#services-section .service-card')
    cards.forEach((card) => {
      const title = card.querySelector('.service-title') as HTMLElement | null
      if (!title) return
      title.addEventListener('click', () => {
        const isActive = card.classList.contains('is-active')
        cards.forEach((c) => c.classList.remove('is-active'))
        if (!isActive) card.classList.add('is-active')
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
          <div className="service-title">
            <i></i>
            AI Agents
            <div className="service-counter">
              <span>01</span>
              <div className="service-counter-lines">
                <span className="service-counter-line is-active"></span>
                <span className="service-counter-line"></span>
                <span className="service-counter-line"></span>
              </div>
            </div>
          </div>
          <div className="service-inner">
            <div className="service-content">
              <a className="service-media" href="#contact">
                <img src="/images/service-ai-agents.png" loading="lazy" alt="AI Agents" />
              </a>
              <span className="svc-content-title">AI Agents</span>
              <ul className="service-list">
                <li>Kundtjänst</li>
                <li>Leadsgenerering</li>
                <li>Bokningar</li>
                <li>Orderhantering</li>
                <li>Intern support</li>
                <li>Uppföljning</li>
              </ul>
              <a className="eteya-btn" href="#contact">Läs mer</a>
            </div>
          </div>
        </div>

        {/* 02 Automation */}
        <div className="service-card">
          <div className="service-title">
            <i></i>
            Automation
            <div className="service-counter">
              <span>02</span>
              <div className="service-counter-lines">
                <span className="service-counter-line"></span>
                <span className="service-counter-line is-active"></span>
                <span className="service-counter-line"></span>
              </div>
            </div>
          </div>
          <div className="service-inner">
            <div className="service-content">
              <a className="service-media" href="#contact">
                <img src="/images/service-automation.png" loading="lazy" alt="Automation" />
              </a>
              <span className="svc-content-title">Automation</span>
              <ul className="service-list">
                <li>E-postautomation</li>
                <li>Fakturahantering</li>
                <li>Lead-flöden</li>
                <li>Rapportering</li>
                <li>Systemsynk</li>
                <li>Aviseringar</li>
              </ul>
              <a className="eteya-btn" href="#contact">Läs mer</a>
            </div>
          </div>
        </div>

        {/* 03 AI Products */}
        <div className="service-card">
          <div className="service-title">
            <i></i>
            AI Products
            <div className="service-counter">
              <span>03</span>
              <div className="service-counter-lines">
                <span className="service-counter-line"></span>
                <span className="service-counter-line"></span>
                <span className="service-counter-line is-active"></span>
              </div>
            </div>
          </div>
          <div className="service-inner">
            <div className="service-content">
              <a className="service-media" href="#contact">
                <img src="/images/service-ai-products.png" loading="lazy" alt="AI Products" />
              </a>
              <span className="svc-content-title">AI Products</span>
              <ul className="service-list">
                <li>Webbapplikationer</li>
                <li>Interna verktyg</li>
                <li>API-integrationer</li>
                <li>Databaslösningar</li>
                <li>MVP på veckor</li>
                <li>Skräddarsydd AI</li>
              </ul>
              <a className="eteya-btn" href="#contact">Läs mer</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
