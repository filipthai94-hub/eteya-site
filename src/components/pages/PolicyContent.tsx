'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionTitle from '@/components/ui/SectionTitle'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import styles from './PolicyContent.module.css'

gsap.registerPlugin(ScrollTrigger)

type PolicyType = 'privacy' | 'terms'

export default function PolicyContent({ type }: { type: PolicyType }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations(type)

  useEffect(() => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll('[data-reveal]')
    sections.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      )
    })
    return () => ScrollTrigger.getAll().forEach((st) => st.kill())
  }, [])

  const title = t('title')
  const sections = t.raw('sections') as any[]
  const schema = t.raw('schema') as Record<string, string>
  const readMore = type === 'terms' ? (t as any)('readMore') : 'Läs mer'

  return (
    <div ref={containerRef} className={styles.page}>
      {/* Schema Markup - WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: schema?.name ?? title,
            description: schema?.description ?? '',
            url: schema?.url ?? '',
            inLanguage: schema?.inLanguage ?? 'sv-SE',
            publisher: {
              '@type': 'Organization',
              name: 'Eteya',
              url: 'https://eteya.ai',
            },
          }),
        }}
      />

      {/* HERO */}
      <section className={styles.section} data-reveal>
        <div className={`${styles.inner} ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{title}</h1>
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      {sections.map((section: any, i: number) => {
        // Skip rendering empty marker/heading rows (used for continuation text)
        if (!section.marker && !section.heading && section.type === 'text') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                <div className={styles.contentBlock}>
                  <p className={styles.text} dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              </div>
            </section>
          )
        }

        // Link row (ARN) - standalone
        if (section.type === 'link') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                <div className={styles.contentBlock}>
                  <p className={styles.text}>
                    <a
                      href={section.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className={styles.link}
                    >
                      {section.urlText}
                    </a>
                  </p>
                </div>
              </div>
            </section>
          )
        }

        // Multi-text (tvistlösning - flera texter i samma sektion)
        if (section.type === 'multi-text') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                {section.marker && <p className={styles.sectionMarker}>{section.marker}</p>}
                <SectionTitle heading={section.heading} />
                <div className={styles.contentBlock}>
                  {(section.texts || []).map((text: string, j: number) => (
                    <p key={j} className={styles.text}>{text}</p>
                  ))}
                  {section.link && (
                    <p className={styles.text}>
                      <a
                        href={section.link.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className={styles.link}
                      >
                        {section.link.urlText}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </section>
          )
        }

        // List (company info)
        if (section.type === 'list') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                {section.marker && <p className={styles.sectionMarker}>{section.marker}</p>}
                <SectionTitle heading={section.heading} />
                <div className={styles.contentBlock}>
                  <ul className={styles.list}>
                    {(section.items || []).map((item: any, j: number) => (
                      <li key={j}>
                        <strong>{item.label}:</strong> {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )
        }

        // Links (legal basis)
        if (section.type === 'links') {
          return (
            <section className={styles.section} key={i} data-reveal>
              <div className={styles.inner}>
                {section.marker && <p className={styles.sectionMarker}>{section.marker}</p>}
                <SectionTitle heading={section.heading} />
                <div className={styles.contentBlock}>
                  <ul className={styles.list}>
                    {(section.items || []).map((item: any, j: number) => (
                      <li key={j}>
                        <strong>{item.name}:</strong> {item.description}{' '}
                        <a
                          href={item.url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className={styles.link}
                        >
                          {readMore}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )
        }

        // Default text section
        return (
          <section className={styles.section} key={i} data-reveal>
            <div className={styles.inner}>
              {section.marker && <p className={styles.sectionMarker}>{section.marker}</p>}
              {section.heading && <SectionTitle heading={section.heading} />}
              <div className={styles.contentBlock}>
                <p className={styles.text} dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            </div>
          </section>
        )
      })}

      {/* Footer CTA */}
      <FooterCTAClient />
    </div>
  )
}