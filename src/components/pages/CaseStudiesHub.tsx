'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function CaseStudiesHub() {
  const t = useTranslations('caseStudies')
  const locale = useLocale()

  const telestorePath = locale === 'sv' ? '/sv/kundcase/telestore' : '/en/case-studies/telestore'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center' }}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.02em' }}
      >
        {t('hero.title')}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ color: 'var(--secondary)', fontSize: '1.125rem', marginTop: 16, marginBottom: 48 }}
      >
        {t('hero.subtitle')}
      </motion.p>

      {/* Telestore card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Link href={telestorePath} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 40,
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {locale === 'sv' ? 'E-handel' : 'E-commerce'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, marginTop: 8 }}>
              Telestore Sverige AB
            </h2>
            <p style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: 700, margin: '12px 0' }}>
              390 000 kr/{locale === 'sv' ? 'år' : 'year'}
            </p>
            <p style={{ color: 'var(--secondary)' }}>
              {locale === 'sv'
                ? '56 automationer → 26 timmar sparade per vecka'
                : '56 automations → 26 hours saved per week'}
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
