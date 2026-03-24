'use client'
import { useEffect } from 'react'

export default function ServicesClient() {
  useEffect(() => {
    // Accordion JS — exakt samma som i HTML-klonen
    const cards = document.querySelectorAll('#services .service-card')
    cards.forEach((card) => {
      const title = card.querySelector('.service-title') as HTMLElement | null
      if (!title) return
      title.style.cursor = 'pointer'
      title.addEventListener('click', () => {
        const isActive = card.classList.contains('is-active')
        cards.forEach((c) => c.classList.remove('is-active'))
        if (!isActive) card.classList.add('is-active')
      })
    })
    // Öppna första kortet default
    const first = document.querySelector('#services .service-card')
    if (first) first.classList.add('is-active')
  }, [])

  return (
    <>
      {/* Redstone CSS */}
      <link rel="stylesheet" href="/redstone-services.css" />

      <section id="services" style={{ background: '#000', padding: '80px 62px', fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          #services *, #services *::before, #services *::after { box-sizing: border-box; }
          #services { color: #fff; }
          #services a { color: inherit; text-decoration: none; }
          #services :root, #services { --ff-1: 'DM Sans', sans-serif; --ff-2: 'DM Sans', sans-serif; }

          /* Force correct desktop vars */
          @media (min-width: 992px) {
            #services {
              --h1: 7rem; --h2: 4rem; --h3: 3.25rem; --h4: 2rem; --h5: 1.5rem;
              --pd-block: 35px; --pd-inline: 10.5px; --icon-size: 45.5px;
              --sp-xl: 10rem; --sp-lg: 6.25rem; --sp-md: 5rem;
            }
          }

          /* Heading */
          #services h2.h1.title {
            font-size: 98px; font-family: 'DM Sans', sans-serif; font-weight: 300;
            color: #fff; margin-bottom: 68px; letter-spacing: -0.02em;
          }
          @media (max-width: 991px) {
            #services { padding: 40px 0; }
            #services h2.h1.title { font-size: 44px; margin-bottom: 32px; padding-left: 1rem; }
          }

          /* Override animations */
          #services .service-title { display: flex !important; font-family: 'DM Sans', sans-serif !important; }
          #services .service-content { display: grid !important; }
          #services .service-block { display: block !important; }
          #services .slideAnim { opacity: 1 !important; transform: none !important; }
          #services .text-animate { opacity: 1 !important; transform: none !important; }
          #services .animate { opacity: 1 !important; }

          /* Hide duplicate title in expanded */
          #services .service-content .service-title { display: none !important; }

          /* Accordion */
          #services .service-card.is-active { grid-template-rows: auto 1fr !important; }
          #services .service-card.is-active .service-content { display: grid !important; opacity: 1 !important; }
          #services .service-card .service-content { opacity: 0; transition: opacity 0.4s ease; }
          #services .service-card.is-active .service-content { opacity: 1; }

          /* Arrow */
          #services .service-title i { transform: rotate(-45deg) !important; }
          #services .service-card.is-active .service-title i { transform: rotate(45deg) !important; }
          #services .service-card:not(.is-active) .service-title:hover i { transform: rotate(45deg) !important; }

          /* Counter line */
          #services .service-counter-line.is-active { background-color: #FFFFFF !important; }

          /* Nollställ Redstones .btn */
          #services .btn { all: unset; }

          /* Eteya-knapp */
          #services .eteya-btn {
            display: inline-flex; width: fit-content !important;
            align-self: start; justify-self: start;
            align-items: center; justify-content: center;
            background: #C8FF00; color: #121213 !important;
            border: none; border-radius: 0;
            font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
            padding: 0 24px; height: 48px; cursor: pointer;
            text-decoration: none !important;
            transition: background .4s cubic-bezier(.165,.84,.44,1), transform .4s cubic-bezier(.165,.84,.44,1);
            white-space: nowrap; letter-spacing: 0.02em;
          }
          #services .eteya-btn:hover { background: #b8ef00; transform: translateY(-3px); }

          /* List bullets */
          #services .service-list li { list-style: none; padding-left: 1.25rem; position: relative; font-family: 'DM Sans', sans-serif; }
          #services .service-list li::before { content: "○"; position: absolute; left: 0; font-size: 0.7em; top: 0.15em; opacity: 0.6; }

          /* Images */
          #services .service-media img { mix-blend-mode: screen; }
        `}</style>

        <h2 className="h1 title col-xl-10 mb-md text-animate">TJÄNSTER</h2>
        <div className="service-block mob-ver2 animate">

          {/* 01: AI Agents */}
          <div className="service-card slideAnim">
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
                <a className="service-media" href="#">
                  <picture>
                    <img src="/images/service-ai-agents.png" loading="lazy" alt="AI Agents" />
                  </picture>
                </a>
                <a className="service-title" href="#">AI Agents</a>
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

          {/* 02: Automation */}
          <div className="service-card slideAnim">
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
                <a className="service-media" href="#">
                  <picture>
                    <img src="/images/service-automation.png" loading="lazy" alt="Automation" />
                  </picture>
                </a>
                <a className="service-title" href="#">Automation</a>
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

          {/* 03: AI Products */}
          <div className="service-card slideAnim">
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
                <a className="service-media" href="#">
                  <picture>
                    <img src="/images/service-ai-products.png" loading="lazy" alt="AI Products" />
                  </picture>
                </a>
                <a className="service-title" href="#">AI Products</a>
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
    </>
  )
}
