import { getTranslations } from 'next-intl/server'
import SectionTitle from '@/components/ui/SectionTitle'

export default async function Stats() {
  const t = await getTranslations('stats')
  const items = t.raw('items') as Array<{ value: number; suffix: string; label: string }>

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle heading={t('heading')} className="text-center" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-7xl md:text-8xl text-et-primary mb-2">
                {item.value}{item.suffix}
              </div>
              <p className="text-et-secondary text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
