import { useTranslations } from 'next-intl'
import FadeIn from '@/components/animations/FadeIn'
import SectionTitle from '@/components/ui/SectionTitle'

export default function Services() {
  const t = useTranslations('services')
  const items = t.raw('items') as Array<{ number: string; title: string; description: string }>

  return (
    <section id="services" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionTitle label={t('section_label')} heading={t('heading')} />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {items.map((item, i) => (
            <FadeIn key={item.number} delay={i * 0.15}>
              <div className="bg-base p-8 lg:p-12 group hover:bg-surface transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-accent h-full cursor-default">
                <span className="font-display text-6xl text-accent/20 group-hover:text-accent/60 transition-colors duration-300 block mb-6">
                  {item.number}
                </span>
                <h3 className="font-display text-2xl text-primary uppercase mb-4">{item.title}</h3>
                <p className="text-secondary leading-relaxed">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
