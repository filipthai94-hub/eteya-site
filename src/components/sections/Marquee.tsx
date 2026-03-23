import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function MarqueeSection() {
  const t = await getTranslations('marquee')
  const words = t.raw('words') as string[]
  const items = [...words, ...words, ...words, ...words]

  return (
    <div style={{ overflow: 'hidden', paddingTop: '2rem', paddingBottom: '2rem', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {items.map((word, i) => (
          <span
            key={i}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 5rem)', textTransform: 'uppercase', letterSpacing: '0.2em', marginRight: '3rem', color: '#2A2A2A' }}
          >
            {word}
            <span style={{ margin: '0 1.5rem', color: C.border }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
