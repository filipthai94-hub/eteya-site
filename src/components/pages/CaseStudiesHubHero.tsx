'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'

export default function CaseStudiesHubHero() {
  const t = useTranslations('caseStudies')

  const CSS = `
    .kundcase-hub-hero {
      padding: 160px 62px 80px;
      background: #080808;
      color: #fff;
      text-align: center;
      max-width: 900px;
      margin: 0 auto;
    }
    .kundcase-hub-hero__eyebrow {
      display: inline-block;
      font-family: var(--font-body), 'Geist', sans-serif;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(255, 255, 255, 0.55);
      margin-bottom: 20px;
    }
    .kundcase-hub-hero__title {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(2.5rem, 1rem + 5vw, 4.5rem);
      font-weight: 500;
      letter-spacing: -0.02em;
      line-height: 1;
      margin: 0 0 24px 0;
    }
    .kundcase-hub-hero__subtitle {
      font-family: var(--font-body), 'Geist', sans-serif;
      font-size: clamp(1.05rem, 0.9rem + 0.4vw, 1.25rem);
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.7);
      max-width: 620px;
      margin: 0 auto;
    }
    @media (max-width: 767px) {
      .kundcase-hub-hero {
        padding: 120px 20px 56px;
      }
    }
  `

  return (
    <section className="kundcase-hub-hero">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <motion.span
        className="kundcase-hub-hero__eyebrow"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('hero.eyebrow')}
      </motion.span>
      <motion.h1
        className="kundcase-hub-hero__title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        {t('hero.title')}
      </motion.h1>
      <motion.p
        className="kundcase-hub-hero__subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {t('hero.subtitle')}
      </motion.p>
    </section>
  )
}
