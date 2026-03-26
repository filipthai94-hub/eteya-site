'use client'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'

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
]

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
    gap: 1.5rem; display: flex; align-items: center;
    padding: 2.5rem 0.65rem;
    font-family: var(--ff); font-size: var(--h3);
    line-height: 1em; font-weight: 400; color: var(--clr-white);
  }
  #cases-section .case-title::before {
    content: ""; position: absolute; z-index: -1; top: 0; left: 0;
    transform: translateY(100%); width: 100%; height: 100%;
    transition: transform 0.45s cubic-bezier(0.1, 0, 0.2, 1),
                border-radius 0.45s cubic-bezier(0.1, 0, 0.2, 1);
    background-color: var(--clr-light-black); border-radius: 50%;
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
  #cases-section .case-card:not(.is-active) .case-title:hover .case-arrow { transform: rotate(45deg); }

  /* Tag + metric in title */
  #cases-section .case-meta {
    display: flex; align-items: center; gap: 1rem;
    margin-left: auto; flex-shrink: 0;
  }
  #cases-section .case-tag {
    font-size: var(--text-sm); font-weight: 400;
    color: rgba(var(--rgb-white), 0.5);
    border: 1px solid rgba(var(--rgb-white), 0.15);
    border-radius: 100px; padding: 0.4rem 1rem;
    white-space: nowrap;
  }
  #cases-section .case-metric {
    font-size: var(--text-sm); font-weight: 500;
    color: #C8FF00; white-space: nowrap;
  }

  /* Inner / content */
  #cases-section .case-inner { overflow: hidden; }
  #cases-section .case-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem var(--sp-block);
    padding: 1.25rem 0.65rem 2.5rem;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s,
                transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s;
  }
  #cases-section .case-card.is-active .case-content { opacity: 1; transform: translateY(0); }

  /* Left col: text content */
  #cases-section .case-text { display: flex; flex-direction: column; gap: 1.5rem; }
  #cases-section .case-label {
    font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.1em; color: #C8FF00;
  }
  #cases-section .case-description {
    font-size: var(--text); line-height: 1.6; color: rgba(var(--rgb-white), 0.75);
    margin: 0;
  }

  /* Results list */
  #cases-section .case-results {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 0.5rem;
  }
  #cases-section .case-results li {
    font-size: var(--text); color: rgba(var(--rgb-white), 0.85);
    padding-left: 1.5rem; position: relative; line-height: 1.5;
  }
  #cases-section .case-results li::before {
    content: "→"; position: absolute; left: 0; color: #C8FF00;
  }

  /* Quote */
  #cases-section .case-quote {
    border-left: 2px solid #C8FF00; padding-left: 1.25rem;
    margin: 0;
  }
  #cases-section .case-quote p {
    font-size: var(--text); font-style: italic; line-height: 1.6;
    color: rgba(var(--rgb-white), 0.85); margin: 0 0 0.5rem;
  }
  #cases-section .case-quote cite {
    font-size: var(--text-sm); font-style: normal;
    color: rgba(var(--rgb-white), 0.5);
  }

  /* Right col: image placeholder */
  #cases-section .case-media {
    background: var(--clr-light-black); border-radius: 12px;
    aspect-ratio: 16/10; display: flex; align-items: center;
    justify-content: center; overflow: hidden;
  }
  #cases-section .case-media img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    border-radius: 12px;
  }
  #cases-section .case-media-placeholder {
    font-size: var(--text-sm); color: rgba(var(--rgb-white), 0.3);
  }

  /* CTA row */
  #cases-section .case-cta {
    grid-column: 1 / -1;
    display: flex; align-items: center; gap: 1rem;
    padding-top: 0.5rem;
  }

  /* Mobile */
  @media (max-width: 767px) {
    #cases-section .case-title { gap: 1rem; font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem); }
    #cases-section .case-tag { display: none; }
    #cases-section .case-metric { font-size: 0.75rem; }
    #cases-section .case-arrow { width: 32px; height: 32px; }
    #cases-section .case-content {
      grid-template-columns: 1fr !important;
      padding-inline: 1rem;
    }
    #cases-section .case-media { grid-row: 1; }
  }
`

export default function CasesClient() {
  useEffect(() => {
    const cards = document.querySelectorAll('#cases-section .case-card')

    cards.forEach((card) => {
      const title = card.querySelector('.case-title') as HTMLElement | null
      if (!title) return
      title.addEventListener('click', () => {
        const isActive = card.classList.contains('is-active')
        cards.forEach((c) => c.classList.remove('is-active'))
        if (!isActive) card.classList.add('is-active')

        window.dispatchEvent(new CustomEvent('eteya:cases-toggled'))
        const onEnd = (e: Event) => {
          const te = e as TransitionEvent
          if (te.propertyName !== 'grid-template-rows') return
          window.dispatchEvent(new CustomEvent('eteya:cases-transition-end'))
        }
        card.addEventListener('transitionend', onEnd, { once: true })
        window.setTimeout(() => window.dispatchEvent(new CustomEvent('eteya:cases-transition-end')), 650)
      })
    })
  }, [])

  return (
    <section id="cases-section">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <h2 className="cases-heading">VÅRA CASE</h2>

      <div className="cases-block">
        {CASES.map((c, i) => (
          <div key={c.slug} className="case-card">
            <div className="case-title">
              <span className="case-arrow" />
              {c.name}
              <div className="case-meta">
                <span className="case-tag">{c.tag}</span>
                <span className="case-metric">{c.metric}</span>
              </div>
            </div>
            <div className="case-inner">
              <div className="case-content">
                <div className="case-text">
                  <div>
                    <span className="case-label">Problemet</span>
                    <p className="case-description">{c.problem}</p>
                  </div>
                  <div>
                    <span className="case-label">Lösningen</span>
                    <p className="case-description">{c.solution}</p>
                  </div>
                  <div>
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
                <div className="case-media">
                  <span className="case-media-placeholder">Bild / Video</span>
                </div>
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
