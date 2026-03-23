import { useTranslations } from 'next-intl'

export default function MarqueeSection() {
  const t = useTranslations('marquee')
  const words = t.raw('words') as string[]
  const items = [...words, ...words, ...words, ...words]

  return (
    <div className="overflow-hidden py-8 border-y border-border">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((word, i) => (
          <span
            key={i}
            className="font-display text-5xl md:text-7xl uppercase tracking-widest mr-8 md:mr-16"
            style={{ color: '#2A2A2A' }}
          >
            {word}
            <span className="mx-4 md:mx-8" style={{ color: '#222222' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
