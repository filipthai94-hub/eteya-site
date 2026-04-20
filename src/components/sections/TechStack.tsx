'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import styles from './TechStack.module.css'

/* ── Tech data ─────────────────────────────────────── */
interface TechItem {
  name: string
  icon: string
}

interface TechCategory {
  title: string
  items: TechItem[]
}

const CATEGORIES: TechCategory[] = [
  {
    title: 'Plattformar',
    items: [
      { name: 'WordPress', icon: '/images/tech/wordpress.svg' },
      { name: 'Elementor', icon: '/images/tech/elementor.svg' },
      { name: 'Shopify', icon: '/images/tech/shopify.svg' },
      { name: 'WooCommerce', icon: '/images/tech/woocommerce.svg' },
      { name: 'Next.js', icon: '/images/tech/nextjs.svg' },
    ],
  },
  {
    title: 'Automation',
    items: [
      { name: 'Make', icon: '/images/tech/make.svg' },
      { name: 'Zapier', icon: '/images/tech/zapier.svg' },
      { name: 'Airtable', icon: '/images/tech/airtable.svg' },
      { name: 'Slack', icon: '/images/tech/slack.svg' },
      { name: 'n8n', icon: '/images/tech/n8n.svg' },
      { name: 'HubSpot', icon: '/images/tech/hubspot.svg' },
      { name: 'Notion', icon: '/images/tech/notion.svg' },
    ],
  },
  {
    title: 'Utveckling',
    items: [
      { name: 'Supabase', icon: '/images/tech/supabase.svg' },
      { name: 'Python', icon: '/images/tech/python.svg' },
      { name: 'Node.js', icon: '/images/tech/nodejs.svg' },
      { name: 'REST APIs', icon: '/images/tech/restapi.svg' },
      { name: 'Stripe', icon: '/images/tech/stripe.svg' },
      { name: 'Klarna', icon: '/images/tech/klarna.svg' },
      { name: 'Fortnox', icon: '/images/tech/fortnox.svg' },
      { name: 'Twilio', icon: '/images/tech/twilio.svg' },
    ],
  },
]



/* ── Component ─────────────────────────────────────── */
export default function TechStack() {
  const t = useTranslations('techStack')
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) {
      section.classList.add(styles.animated)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add(styles.animated)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Heading — per-word animation */}
          <h2 className={`${styles.heading} ${styles.textAnimate}`}>
            {t.raw('headingLine1').map((word: string, i: number) => (
              <i key={i} className={styles.textAnimateWord} style={{ '--word-index': i } as React.CSSProperties}>
                {word}{' '}
              </i>
            ))}
            <br />
            {t.raw('headingLine2').map((word: string, i: number) => (
              <i key={i} className={styles.textAnimateWord} style={{ '--word-index': t.raw('headingLine1').length + i } as React.CSSProperties}>
                {word}{' '}
              </i>
            ))}
          </h2>

          {/* Cards — staggered slide-up */}
          <div className={styles.cardWrap}>
            {['platforms', 'automation', 'development'].map((catKey, ci) => (
              <div
                key={catKey}
                className={`${styles.card} ${styles.slideUp}`}
                style={{ '--animate-index': ci } as React.CSSProperties}
              >
                <div className={styles.capText}>{t(`categories.${catKey}.title`)}</div>
                {CATEGORIES[ci].items.map((item, ii) => (
                  <div key={item.name} className={styles.item}>
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={28}
                      height={28}
                      className={styles.icon}
                    />
                    {item.name}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Text — slide-up with delay */}
          <div className={`${styles.content} ${styles.slideUp}`} style={{ '--animate-index': 3 } as React.CSSProperties}>
            <p className={styles.text}>
              {t('text')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
