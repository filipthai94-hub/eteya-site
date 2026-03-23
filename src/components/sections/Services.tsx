import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80', // AI agents
  'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=900&q=80', // automation
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80', // custom builds / code
]

export default async function Services() {
  const t = await getTranslations('services')
  const items = t.raw('items') as Array<{ number: string; title: string; description: string }>

  return (
    <section id="services" style={{ backgroundColor: C.bg }}>
      {/* Section header */}
      <div style={{
        maxWidth: '80rem', margin: '0 auto', padding: '5rem 2rem 3rem',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <p style={{ color: C.accent, fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          {t('section_label')}
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          color: C.primary, textTransform: 'uppercase',
          lineHeight: 1, margin: 0,
        }}>
          {t('heading')}
        </h2>
      </div>

      {/* Service rows */}
      {items.map((item, i) => (
        <div key={item.number} style={{
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: i % 2 === 1 ? C.surface : C.bg,
        }}>
          <div style={{
            maxWidth: '80rem', margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
            minHeight: '420px',
          }}>
            {/* Text side */}
            <div style={{
              padding: '4rem 3rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              order: i % 2 === 0 ? 0 : 1,
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '7rem', color: C.accent,
                opacity: 0.15, lineHeight: 1, display: 'block',
              }}>
                {item.number}
              </span>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  color: C.primary, textTransform: 'uppercase',
                  lineHeight: 1, marginBottom: '1.5rem',
                }}>
                  {item.title}
                </h3>
                <p style={{ color: C.secondary, lineHeight: 1.7, maxWidth: '32rem', fontSize: '1rem' }}>
                  {item.description}
                </p>
              </div>
            </div>

            {/* Image side */}
            <div style={{
              position: 'relative', overflow: 'hidden',
              order: i % 2 === 0 ? 1 : 0,
              minHeight: '320px',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${SERVICE_IMAGES[i]})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'grayscale(40%) brightness(0.6)',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(${i % 2 === 0 ? 'to right' : 'to left'}, ${i % 2 === 1 ? C.surface : C.bg} 0%, transparent 40%)`,
              }} />
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
