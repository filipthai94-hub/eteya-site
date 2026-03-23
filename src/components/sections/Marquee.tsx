import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function MarqueeSection() {
  const t = await getTranslations('marquee')
  const words = t.raw('words') as string[]
  const items = [...words, ...words, ...words, ...words]

  return (
    <div style={{
      overflow: 'hidden', padding: '1rem 0',
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      backgroundColor: C.bg,
    }}>
      <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {items.map((word, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(4rem, 8vw, 7rem)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginRight: '1rem',
            color: 'transparent',
            WebkitTextStroke: `1px rgba(255,255,255,0.12)`,
          }}>
            {word}
            <span style={{ margin: '0 1.5rem', color: 'rgba(255,255,255,0.08)', WebkitTextStroke: 0 }}>/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
