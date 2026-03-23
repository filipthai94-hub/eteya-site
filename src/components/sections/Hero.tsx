import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '4rem', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 10vw, 8rem)', color: C.primary, textTransform: 'uppercase', lineHeight: 1, marginBottom: '2rem' }}>
          {t('headline')}
        </h1>
        <p style={{ color: C.secondary, fontSize: '1.125rem', maxWidth: '42rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          {t('subheadline')}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="#services" style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: C.accent, color: C.bg, padding: '0.75rem 1.5rem', fontWeight: 500, textDecoration: 'none', fontSize: '0.875rem' }}>
            {t('cta_primary')}
          </a>
          <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${C.accent}`, color: C.accent, padding: '0.75rem 1.5rem', fontWeight: 500, textDecoration: 'none', fontSize: '0.875rem' }}>
            {t('cta_secondary')}
          </a>
        </div>
        <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
          <div style={{ width: '1px', height: '3rem', backgroundColor: C.accent }} />
          <span style={{ color: C.secondary, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{t('scroll_label')}</span>
        </div>
      </div>
    </section>
  )
}
