'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import FooterCTAClient from '@/components/sections/FooterCTAClient'
import styles from './PrivacyPolicyContent.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function PrivacyPolicyContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('privacy')

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
  const sections = t.raw('sections') as Array<{
    marker: string
    heading: string
    type: string
    content?: string
    items?: string[]
    linkHref?: string
    linkLabel?: string
  }>
  const schema = t.raw('schema') as Record<string, string>

  const renderSection = (
    section: (typeof sections)[number],
    index: number
  ) => {
    const showMarker = section.marker && section.heading
    const showHeading = section.heading

    return (
      <section className={styles.section} data-reveal key={index}>
        <div className={styles.inner}>
          {showMarker && <p className={styles.sectionMarker}>{section.marker}</p>}
          {showHeading && <SectionTitle heading={section.heading} />}
          <div className={styles.contentBlock}>
            {section.type === 'text' && section.content && (
              <p
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
            {section.type === 'list' && section.items && (
              <ul className={styles.list}>
                {section.items.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {section.type === 'cookies' && section.content && (
              <p className={styles.text}>
                {section.content.split(/<link>.*?<\/link>/).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <a href={section.linkHref!} target="_blank" rel="noopener noreferrer" className={styles.whiteLink}>
                        {section.linkLabel}
                      </a>
                    )}
                  </span>
                ))}
              </p>
            )}
            {section.type === 'complaint' && section.content && (
              <p
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div ref={containerRef} className={styles.page}>
      {/* WebPage + BreadcrumbList schema rendereras nu i parent
          (privacy-policy/page.tsx) som @graph med @id-länkning. */}

      {/* HERO */}
      <section className={styles.section} data-reveal>
        <div className={`${styles.inner} ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{title}</h1>
          </div>
        </div>
      </section>

      {sections.map((section, index) => renderSection(section, index))}

      {/* Footer CTA */}
      <FooterCTAClient />
    </div>
  )
}