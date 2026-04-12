'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import Image from 'next/image'
import StatsClient from '@/components/sections/StatsClient'
import { LayoutTextFlip } from '@/components/ui/layout-text-flip'
import { Smartphone, Package, ClipboardList, Sparkles, Database, FileSignature, Mail, Search, LucideIcon } from 'lucide-react'
import styles from './CaseStudy.module.css'

gsap.registerPlugin(ScrollTrigger)

export interface CaseData {
  name: string
  slug: string
  tagline: string
  industry: string
  order: number
  hero: {
    title: string
    words: string[]
    backgroundImage: string
    logo?: string
    livePreview?: string
  }
  challenge: {
    title: string
    cards: Array<{
      number: number
      title: string
      description: string
    }>
  }
  solution: {
    title: string
    subtitle: string
    items: Array<{
      number: number
      title: string
      description: string
    }>
  }
  results: {
    title: string
    stats: Array<{
      value: number
      suffix: string
      label: string
    }>
  }
  savings: {
    title: string
    cards: Array<{
      number: number
      title: string
      before: string
      after: string
      volume: string
      saved: string
    }>
  }
  quote: {
    text: string
    author: string
    role: string
    image: string
  }
}

interface CaseStudyProps {
  slug: string
  data: CaseData
}

const savingsIcons: LucideIcon[] = [Smartphone, Package, ClipboardList, Sparkles, Database, FileSignature, Mail, Search]

function Counter({ current, total }: { current: number; total: number }) {
  return (
    <div className={styles['counter']}>
      <span className={styles['counter-number']}>{String(current).padStart(2, '0')}</span>
      <div className={styles['counter-lines']}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`${styles['counter-line']} ${i + 1 === current ? styles['counter-line-active'] : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function CaseStudy({ slug, data }: CaseStudyProps) {
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div ref={containerRef} className={styles['page']}>
      <section
        className={styles['hero-section']}
        data-reveal
        style={{ backgroundImage: `url('${data.hero.backgroundImage}')` }}
      >
        <div className={styles['hero-grid']}>
          <div className={styles['hero-content-wrapper']}>
            <motion.h1 layoutId={`${slug || data.slug}-hero-title`} className={styles['case-study-title']}>
              {data.hero.title}
            </motion.h1>
            <LayoutTextFlip words={data.hero.words} duration={2500} />
          </div>
        </div>
      </section>

      <section className={styles['section']} data-reveal>
        <div className={styles['inner']}>
          <h2 className={styles['section-title']}>{data.challenge.title}</h2>
          <div className={styles['challenge-grid']}>
            {data.challenge.cards.map((card) => (
              <article key={card.number} className={styles['challenge-card']}>
                <Counter current={card.number} total={data.challenge.cards.length} />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles['section']} data-reveal>
        <div className={styles['solution-inner']}>
          <div className={styles['solution-left']}>
            <div className={styles['solution-left-sticky']}>
              <h2 className={styles['section-title']}>{data.solution.title}</h2>
              <p className={styles['solution-subtext']}>{data.solution.subtitle}</p>
            </div>
          </div>
          <div className={styles['solution-right']}>
            <ul className={styles['automation-list']}>
              {data.solution.items.map((item, index) => (
                <li key={item.number ?? index} className={styles['automation-item']}>
                  <div className={styles['automation-item-content']}>
                    <h3 className={styles['automation-item-title']}>{item.title}</h3>
                    <p className={styles['automation-item-body']}>{item.description}</p>
                  </div>
                  <span className={styles['automation-item-num']}>
                    {String(item.number ?? index + 1).padStart(2, '0')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles['section']} data-reveal>
        <div className={styles['section-header-wrapper']}>
          <h2 className={styles['section-title']}>{data.results.title}</h2>
        </div>
        <StatsClient heading="" items={data.results.stats} />
      </section>

      <section className={styles['section']} data-reveal>
        <div className={styles['inner']}>
          <h2 className={styles['section-title']}>{data.savings.title}</h2>
          <div className={styles['savings-grid']}>
            {data.savings.cards.map((card, index) => {
              const IconComponent = savingsIcons[index % savingsIcons.length]
              return (
                <article key={card.number} className={styles['savings-card']}>
                  <span className={styles['savings-num']}>{String(card.number).padStart(2, '0')}</span>
                  <div className={styles['savings-header']}>
                    <IconComponent className={styles['savings-icon']} />
                    <h3 className={styles['savings-title']}>{card.title}</h3>
                  </div>
                  <div className={styles['savings-before']}>
                    <span className={styles['savings-label']}>FORE</span>
                    <span className={styles['savings-value']}>{card.before}</span>
                  </div>
                  <div className={styles['savings-after']}>
                    <span className={styles['savings-label']}>EFTER</span>
                    <span className={styles['savings-value-after']}>{card.after}</span>
                  </div>
                  <div className={styles['savings-volume']}>
                    <span className={styles['savings-label-vol']}>Volym:</span>
                    <span className={styles['savings-value-vol']}>{card.volume}</span>
                  </div>
                  <div className={styles['savings-divider']} />
                  <div className={styles['savings-result']}>
                    <span className={styles['savings-label-result']}>SPARAT</span>
                    <span className={styles['savings-value-result']}>{card.saved}</span>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className={styles['quote-section']} data-reveal>
        <div className={styles['quote-inner']}>
          <div className={styles['quote-image-wrap']}>
            <Image
              src={data.quote.image}
              alt={data.quote.author}
              width={180}
              height={180}
              className={styles['quote-image']}
            />
          </div>
          <div className={styles['quote-content']}>
            <blockquote className={styles['quote-text']}>{data.quote.text}</blockquote>
            <div className={styles['quote-author']}>
              <span className={styles['quote-name']}>{data.quote.author}</span>
              <span className={styles['quote-role']}>{data.quote.role}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
