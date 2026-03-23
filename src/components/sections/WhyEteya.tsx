import { getTranslations } from 'next-intl/server'
import SectionTitle from '@/components/ui/SectionTitle'

export default async function WhyEteya() {
  const t = await getTranslations('why')
  const items = t.raw('items') as Array<{ title: string; body: string }>

  return (
    <section className="py-20 lg:py-32 bg-et-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle label={t('section_label')} heading={t('heading')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="border-t border-et-border pt-6">
              <h3 className="text-et-primary font-medium mb-3">{item.title}</h3>
              <p className="text-et-secondary text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
