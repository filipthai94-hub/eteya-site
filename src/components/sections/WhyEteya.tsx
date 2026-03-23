import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function WhyEteya() {
  const t = await getTranslations('why')
  const items = t.raw('items') as Array<{ title: string; body: string }>

  return (
    <section style={{ backgroundColor: C.surface, paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '6rem', alignItems: 'start' }}>
          {/* Left: sticky header */}
          <div>
            <p style={{ color: C.accent, fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {t('section_label')}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: C.primary, textTransform: 'uppercase',
              lineHeight: 1, margin: 0,
            }}>
              {t('heading')}
            </h2>
          </div>

          {/* Right: items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {items.map((item, i) => (
              <div key={i} style={{
                borderTop: `1px solid ${C.border}`,
                paddingTop: '2rem', paddingBottom: '2rem',
                display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem',
              }}>
                <h3 style={{ color: C.primary, fontWeight: 500, fontSize: '1rem', margin: 0 }}>
                  {item.title}
                </h3>
                <p style={{ color: C.secondary, fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                  {item.body}
                </p>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
