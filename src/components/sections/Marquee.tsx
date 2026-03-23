import { getTranslations } from 'next-intl/server'

export default async function MarqueeSection() {
  const t = await getTranslations('marquee')
  const words = t.raw('words') as string[]
  const items = [...words, ...words, ...words, ...words]

  return (
    <div className="overflow-hidden py-8 border-y border-et-border">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((word, i) => (
          <span
            key={i}
            className="font-display text-5xl md:text-7xl uppercase tracking-widest mr-8 md:mr-16 text-et-muted"
          >
            {word}
            <span className="mx-4 md:mx-8 text-et-border">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
