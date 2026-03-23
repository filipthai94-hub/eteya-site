import { getTranslations } from 'next-intl/server'
import SectionTitle from '@/components/ui/SectionTitle'

export default async function Services() {
  const t = await getTranslations('services')
  const items = t.raw('items') as Array<{ number: string; title: string; description: string }>

  return (
    <section id="services" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle label={t('section_label')} heading={t('heading')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-et-border">
          {items.map((item) => (
            <div key={item.number} className="bg-et-bg p-8 lg:p-12 hover:bg-et-surface transition-all duration-300 border border-transparent hover:border-et-accent h-full group cursor-default">
              <span className="font-display text-6xl text-et-accent/20 group-hover:text-et-accent/60 transition-colors duration-300 block mb-6">
                {item.number}
              </span>
              <h3 className="font-display text-2xl text-et-primary uppercase mb-4">{item.title}</h3>
              <p className="text-et-secondary leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
