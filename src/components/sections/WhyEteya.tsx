import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function WhyEteya() {
  const t = await getTranslations('why')
  const items = t.raw('items') as Array<{ title: string; body: string }>

  return (
    <section style={{ backgroundColor: C.surface, paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <p style={{ color: C.accent, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>{t('section_label')}</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: C.primary, textTransform: 'uppercase', lineHeight: 1, marginBottom: '3rem' }}>{t('heading')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.5rem' }}>
              <h3 style={{ color: C.primary, fontWeight: 500, marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ color: C.secondary, fontSize: '0.875rem', lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
