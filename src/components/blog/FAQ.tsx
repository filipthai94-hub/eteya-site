'use client'

/**
 * FAQ — MDX-component för blog-artiklar med vanliga frågor.
 *
 * Visuell design replikerar homepage FAQClient-stilen för konsistens
 * (numrerade items, plus-ikon med 45° rotate, hover background-slide,
 * border-bottom mellan items, dark theme).
 *
 * Auto-genererar FAQPage Schema.org strukturerad data — per
 * web-foundation v4.0 §4.4: "FAQPage = AEO/GEO-driver med 22% median
 * citation-lift".
 *
 * Användning i MDX:
 *
 *   import FAQ from '@/components/blog/FAQ'
 *
 *   ## Vanliga frågor
 *
 *   <FAQ items={[
 *     { question: "Hur lång tid tar implementation?", answer: "2-6 veckor typiskt." },
 *     { question: "Vad kostar det?", answer: "Beror på omfattning..." },
 *   ]} />
 *
 * NOTERA: FAQ-komponenten renderar INGEN egen heading. Skriv
 * `## Vanliga frågor` (eller motsvarande) i MDX:en innan komponenten
 * så följer rubriken artikelns prose-blog H2-styling.
 *
 * Renderar:
 *   - Accordion-list med Q&A (klick toggleslar öppen/stängd)
 *   - <script type="application/ld+json"> med FAQPage-schema
 */

import { useEffect, useRef, useState } from 'react'
import { JsonLd, createFaqSchema, type FaqItem } from '@/components/JsonLd'

interface FAQProps {
  items: FaqItem[]
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const contentRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    contentRefs.current.forEach((content, index) => {
      if (!content) return

      if (openIndex === index) {
        // Open: animate to actual content height (or instant if reduced-motion)
        const height = content.scrollHeight
        if (prefersReducedMotion) {
          content.style.height = 'auto'
        } else {
          content.style.height = `${height}px`
        }
      } else {
        content.style.height = '0px'
      }
    })
  }, [openIndex])

  if (!items || items.length === 0) return null

  return (
    <div className="blog-faq" role="region" aria-label="Vanliga frågor">
      {/* FAQPage Schema.org structured data */}
      <JsonLd data={createFaqSchema(items)} />

      <div className="blog-faq-list">
        {items.map((item, index) => {
          const isOpen = openIndex === index
          const number = String(index + 1).padStart(2, '0')
          const questionId = `blog-faq-q-${index}`
          const answerId = `blog-faq-a-${index}`

          return (
            <div
              key={index}
              className={`blog-faq-item${isOpen ? ' is-active' : ''}`}
            >
              <button
                id={questionId}
                className="blog-faq-button"
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              >
                <span className="blog-faq-number">{number}</span>
                <span className="blog-faq-question">{item.question}</span>
                <span className="blog-faq-icon" aria-hidden="true" />
              </button>

              <div
                id={answerId}
                className="blog-faq-answer-wrap"
                role="region"
                aria-labelledby={questionId}
                ref={(element) => {
                  contentRefs.current[index] = element
                }}
              >
                <p className="blog-faq-answer">{item.answer}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
