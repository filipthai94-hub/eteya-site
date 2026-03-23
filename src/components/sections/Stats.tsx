import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function Stats() {
  const t = await getTranslations('stats')
  const items = t.raw('items') as Array<{ value: number; suffix: string; label: string }>

  return (
    <section style={{ backgroundColor: C.bg, paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: C.primary, textTransform: 'uppercase', lineHeight: 1, marginBottom: '3rem', textAlign: 'center' }}>{t('heading')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
          {items.map((item, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 8vw, 6rem)', color: C.primary, lineHeight: 1, marginBottom: '0.5rem' }}>
                {item.value}{item.suffix}
              </div>
              <p style={{ color: C.secondary, fontSize: '0.875rem' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
