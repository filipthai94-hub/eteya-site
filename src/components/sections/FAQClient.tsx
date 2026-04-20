'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type FAQItem = {
  question: string
  answer: string
}

export default function FAQClient() {
  const t = useTranslations('faq')
  const heading = t.raw('heading') as string
  const items = t.raw('items') as FAQItem[]
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const contentRefs = useRef<Array<HTMLDivElement | null>>([])
  const iconRefs = useRef<Array<HTMLSpanElement | null>>([])

  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }), [items])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(section, { autoAlpha: 1, y: 0 })
        gsap.set(itemRefs.current.filter(Boolean), { autoAlpha: 1, y: 0 })
        gsap.set(contentRefs.current.filter(Boolean), { clearProps: 'all' })
        gsap.set(iconRefs.current.filter(Boolean), { rotate: 0 })
        return
      }

      gsap.set(section, { autoAlpha: 0, y: 30 })
      gsap.set(itemRefs.current.filter(Boolean), { autoAlpha: 0, y: 24 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      })

      tl.to(section, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      })
      tl.to(itemRefs.current.filter(Boolean), {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.08,
      }, 0.1)
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    contentRefs.current.forEach((content, index) => {
      const icon = iconRefs.current[index]
      if (!content || !icon) return

      gsap.killTweensOf(content)
      gsap.killTweensOf(icon)

      if (prefersReducedMotion) {
        if (openIndex === index) {
          gsap.set(content, { clearProps: 'height' })
          gsap.set(icon, { rotate: 45 })
        } else {
          gsap.set(content, { height: 0 })
          gsap.set(icon, { rotate: 0 })
        }
        return
      }

      if (openIndex === index) {
        gsap.to(content, { height: 'auto', duration: 0.4, ease: 'power2.out' })
        gsap.to(icon, { rotate: 45, duration: 0.4, ease: 'power2.out' })
      } else {
        gsap.to(content, { height: 0, duration: 0.3, ease: 'power2.inOut' })
        gsap.to(icon, { rotate: 0, duration: 0.3, ease: 'power2.inOut' })
      }
    })
  }, [openIndex])

  return (
    <section className="faq-section" ref={sectionRef}>
      <style>{`
        .faq-section {
          padding: 120px 62px;
          background: #080808;
          color: #fff;
        }

        .faq-container {
          width: 100%;
          display: grid;
          grid-template-columns: 820px 1fr;
          gap: 60px;
        }

        .faq-heading-col {
          position: relative;
        }

        .faq-heading-sticky {
          position: sticky;
          top: 30vh;
        }

        .faq-heading {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 98px;
          font-weight: 500;
          line-height: 98px;
          letter-spacing: -1.96px;
          text-transform: uppercase;
          color: #fff;
        }

        .faq-list {
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .faq-item {
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .faq-button {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0;
          padding: 28px 0;
          background: transparent;
          border: 0;
          color: #fff;
          text-align: left;
          cursor: pointer;
        }

        .faq-button::before {
          content: "";
          position: absolute;
          z-index: -1;
          top: 0;
          left: 0;
          transform: translateY(100%);
          width: 100%;
          height: 100%;
          transition: transform 0.45s cubic-bezier(0.1, 0, 0.2, 1),
                      border-radius 0.45s cubic-bezier(0.1, 0, 0.2, 1);
          background-color: #0F0F0F;
          border-radius: 100%;
        }

        .faq-item:not(.is-active) .faq-button:hover::before {
          border-radius: 0;
          transform: translateY(0%);
        }

        .faq-item.is-active .faq-button::before {
          border-radius: 0;
          transform: translateY(0%);
        }

        .faq-button:focus-visible {
          outline: 2px solid rgba(255,255,255,0.45);
          outline-offset: 6px;
        }

        .faq-number {
          flex: 0 0 auto;
          min-width: 48px;
          margin-right: 28px;
          font-family: var(--font-nums), sans-serif;
          font-size: 18px;
          color: rgba(255,255,255,0.3);
          font-variant-numeric: tabular-nums;
        }

        .faq-question {
          flex: 1 1 auto;
          margin: 0;
          font-family: var(--font-body), sans-serif;
          font-size: 25px;
          font-weight: 500;
          line-height: 1.3;
          color: #fff;
          opacity: 1;
        }

        .faq-icon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          margin-left: 28px;
          transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56' fill='none'%3E%3Cpath d='M42.9727 41.7372L11.6671 10.4316' stroke='white' stroke-width='2' stroke-linecap='square'/%3E%3Cpath d='M44.334 15.8765L44.334 43.0987L17.1118 43.0987' stroke='white' stroke-width='2' stroke-linecap='square'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

        .faq-button:hover .faq-icon,
        .faq-item.is-active .faq-icon {
          transform: rotate(45deg) !important;
        }

        .faq-answer-wrap {
          overflow: hidden;
          height: 0;
        }

        .faq-answer {
          margin: 0;
          padding: 0 0 28px 76px;
          font-family: var(--font-body), sans-serif;
          font-size: 20px;
          line-height: 1.6;
          color: rgba(255,255,255,0.6);
        }

        @media (max-width: 999px) {
          .faq-section {
            padding: 80px 40px;
          }

          .faq-container {
            grid-template-columns: 1fr;
            gap: 36px;
          }

          .faq-heading {
            font-size: 7vw;
            line-height: 1;
          }
        }

        @media (max-width: 690px) {
          .faq-section {
            padding: 48px 16px;
          }

          .faq-container {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .faq-heading-sticky {
            position: static;
          }

          .faq-heading {
            font-size: 40px;
            line-height: 42px;
            letter-spacing: -0.8px;
          }

          .faq-button {
            align-items: flex-start;
          }

          .faq-question {
            font-size: 18px;
          }

          .faq-icon {
            width: 24px;
            height: 24px;
            margin-left: 16px;
          }

          .faq-button::before,
          .faq-item:not(.is-active) .faq-button:hover::before,
          .faq-item.is-active .faq-button::before {
            transform: translateY(100%) !important;
            border-radius: 100% !important;
          }

          .faq-answer {
            padding: 0 0 24px 0;
            font-size: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .faq-section,
          .faq-item,
          .faq-icon {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <div className="faq-container">
        <div className="faq-heading-col">
          <div className="faq-heading-sticky">
            <h2 className="faq-heading" dangerouslySetInnerHTML={{ __html: heading }} />
          </div>
        </div>

        <div className="faq-content-col">
          <div className="faq-list">
            {items.map((item, index) => {
              const isOpen = openIndex === index
              const number = String(index + 1).padStart(2, '0')

              return (
                <div
                  className={`faq-item ${openIndex === index ? 'is-active' : ''}`}
                  key={item.question}
                  ref={(element) => {
                    itemRefs.current[index] = element
                  }}
                >
                  <button
                    id={`faq-question-${index}`}
                    className="faq-button"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                  >
                    <span className="faq-number">{number}</span>
                    <span className="faq-question">{item.question}</span>
                    <span
                      className="faq-icon"
                      aria-hidden="true"
                      ref={(element) => {
                        iconRefs.current[index] = element
                      }}
                    />
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    className="faq-answer-wrap"
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    ref={(element) => {
                      contentRefs.current[index] = element
                    }}
                  >
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
    </section>
  )
}
