import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function MarqueeSection() {
  const t = await getTranslations('marquee')
  const words = t.raw('words') as string[]
  const items = [...words, ...words, ...words, ...words]

  return (
    <div style={{
      overflow: 'hidden',
      paddingTop: '1.5rem', paddingBottom: '1.5rem',
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      backgroundColor: C.bg,
    }}>
      <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {items.map((word, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 7vw, 6rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginRight: '2rem',
            color: 'transparent',
            WebkitTextStroke: `1px ${C.border}`,
          }}>
            {word}
            <span style={{ margin: '0 2rem', color: C.accent, WebkitTextStroke: 0 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
