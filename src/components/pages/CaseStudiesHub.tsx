'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { usePathname } from '@/i18n/navigation'

export default function CaseStudiesHub() {
  const t = useTranslations('caseStudies')
  const pathname = usePathname()
  const locale = pathname?.startsWith('/sv') ? 'sv' : 'en'

  const telestorePath = `/kundcase/telestore`

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
              {t('telestore.industry')}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, marginTop: 8 }}>
              Telestore Sverige AB
            </h2>
            <p style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: 700, margin: '12px 0' }}>
              390 000 kr/{t('telestore.perYear')}
            </p>
            <p style={{ color: 'var(--secondary)' }}>
              {t('telestore.summary')}
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
