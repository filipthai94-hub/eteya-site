import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      backgroundColor: C.bg,
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1800&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25,
      }} />
      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to top, ${C.bg} 30%, transparent 70%)`,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 2rem 6rem', maxWidth: '100%' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4rem, 16vw, 14rem)',
          color: C.primary,
          textTransform: 'uppercase',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: '2.5rem',
        }}>
          AI SOM<br />
          <span style={{ color: C.accent }}>DRIVER</span> DIG.
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <p style={{
            color: C.secondary,
            fontSize: '1.125rem',
            maxWidth: '38rem',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {t('subheadline')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
            <a href="#services" style={{
              display: 'inline-flex', alignItems: 'center',
              backgroundColor: C.accent, color: C.bg,
              padding: '0.875rem 2rem', fontWeight: 600,
              textDecoration: 'none', fontSize: '0.875rem',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {t('cta_primary')}
            </a>
            <a href="#contact" style={{
              display: 'inline-flex', alignItems: 'center',
              border: `1px solid ${C.accent}`, color: C.accent,
              padding: '0.875rem 2rem', fontWeight: 500,
              textDecoration: 'none', fontSize: '0.875rem',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {t('cta_secondary')}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '2rem', right: '2rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        zIndex: 10,
      }}>
        <div style={{ width: '1px', height: '4rem', backgroundColor: C.accent, opacity: 0.6 }} />
        <span style={{ color: C.secondary, fontSize: '0.625rem', letterSpacing: '0.2em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>
          {t('scroll_label')}
        </span>
      </div>
    </section>
  )
}
