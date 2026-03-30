'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import sv from '@/i18n/messages/sv.json'
import en from '@/i18n/messages/en.json'

gsap.registerPlugin(ScrollTrigger)

type FAQMessageFile = {
  faq: {
    heading: string
    items: Array<{
      question: string
      answer: string
    }>
  }
}

const messages: Record<string, FAQMessageFile> = { sv, en }

export default function FAQClient() {
  const locale = useLocale()
  const copy = (messages[locale] ?? messages.sv).faq
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const contentRefs = useRef<Array<HTMLDivElement | null>>([])
  const iconRefs = useRef<Array<HTMLSpanElement | null>>([])

  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }), [copy.items])

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
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .faq-button {
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

        .faq-button:hover .faq-icon,
        .faq-button:focus-visible .faq-icon {
          color: rgba(255,255,255,0.7);
        }

        .faq-icon {
          position: relative;
          flex: 0 0 30px;
          width: 30px;
          height: 30px;
          margin-left: 28px;
          color: rgba(255,255,255,0.4);
          transform-origin: 50% 50%;
        }

        .faq-icon-line {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 1px;
          background: currentColor;
          transform: translate(-50%, -50%);
        }

        .faq-icon-line--vertical {
          transform: translate(-50%, -50%) rotate(90deg);
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
            margin-left: 16px;
          }

          .faq-answer {
            padding: 0 0 24px 62px;
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
            <h2 className="faq-heading" dangerouslySetInnerHTML={{ __html: copy.heading }} />
          </div>
        </div>

        <div className="faq-content-col">
          <div className="faq-list">
            {copy.items.map((item, index) => {
              const isOpen = openIndex === index
              const number = String(index + 1).padStart(2, '0')

              return (
                <div
                  className="faq-item"
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
                    >
                      <span className="faq-icon-line" />
                      <span className="faq-icon-line faq-icon-line--vertical" />
                    </span>
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
