import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function Services() {
  const t = await getTranslations('services')
  const items = t.raw('items') as Array<{ number: string; title: string; description: string }>

  return (
    <section id="services" style={{ backgroundColor: C.bg, paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <p style={{ color: C.accent, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>{t('section_label')}</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: C.primary, textTransform: 'uppercase', lineHeight: 1, marginBottom: '3rem' }}>{t('heading')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', backgroundColor: C.border }}>
          {items.map((item) => (
            <div key={item.number} style={{ backgroundColor: C.bg, padding: '2.5rem', cursor: 'default' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', color: C.accent, opacity: 0.2, display: 'block', marginBottom: '1.5rem', lineHeight: 1 }}>{item.number}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: C.primary, textTransform: 'uppercase', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: C.secondary, lineHeight: 1.7 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
