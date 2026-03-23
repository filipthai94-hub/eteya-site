import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function CTASection() {
  const t = await getTranslations('cta')
  return (
    <section style={{ backgroundColor: C.surface, paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 7rem)', color: C.primary, textTransform: 'uppercase', lineHeight: 1, marginBottom: '2rem' }}>
          {t('headline')}
        </h2>
        <p style={{ color: C.secondary, fontSize: '1.125rem', maxWidth: '36rem', margin: '0 auto 2.5rem' }}>{t('body')}</p>
        <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: C.accent, color: C.bg, padding: '1rem 2rem', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {t('button')}
        </a>
      </div>
    </section>
  )
}
