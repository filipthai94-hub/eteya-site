import { getTranslations } from 'next-intl/server'
import { C } from '@/lib/colors'

export default async function MarqueeSection() {
  const t = await getTranslations('marquee')
  const words = t.raw('words') as string[]
  const itemsFwd = [...words, ...words, ...words, ...words]

  return (
    <div style={{
      overflow: 'hidden',
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      backgroundColor: C.bg,
      padding: '1.5rem 0',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      {/* Row 1 — forward */}
      <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {itemsFwd.map((word, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 7vw, 6rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginRight: '1.5rem',
            color: 'transparent',
            WebkitTextStroke: `1px ${C.border}`,
          }}>
            {word}
            <span style={{ margin: '0 1.5rem', color: C.accent, WebkitTextStroke: '0' }}>✦</span>
          </span>
        ))}
      </div>
      {/* Row 2 — reverse */}
      <div className="animate-marquee-rev" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {itemsFwd.map((word, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 7vw, 6rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginRight: '1.5rem',
            color: C.border,
          }}>
            {word}
            <span style={{ margin: '0 1.5rem', color: 'transparent', WebkitTextStroke: `1px ${C.accent}` }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
