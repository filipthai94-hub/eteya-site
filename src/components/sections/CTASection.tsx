import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function CTASection() {
  const t = await getTranslations('cta')
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: C.bg,
      paddingTop: '8rem',
      paddingBottom: '8rem',
    }}>
      {/* Background image with strong overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1800&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.15,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${C.bg} 50%, ${C.surface} 100%)`,
        opacity: 0.9,
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        {/* Big accent line */}
        <div style={{ width: '3rem', height: '2px', backgroundColor: C.accent, marginBottom: '2rem' }} />
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 10vw, 9rem)',
          color: C.primary,
          textTransform: 'uppercase',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          marginBottom: '3rem',
        }}>
          {t('headline')}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <p style={{ color: C.secondary, fontSize: '1.125rem', maxWidth: '36rem', lineHeight: 1.6, margin: 0 }}>
            {t('body')}
          </p>
          <a href="#contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            backgroundColor: C.accent, color: C.bg,
            padding: '1rem 2.5rem', fontWeight: 600,
            textDecoration: 'none', fontSize: '0.875rem',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            flexShrink: 0,
          }}>
            {t('button')}
            <span style={{ fontSize: '1.25rem' }}>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
