import { useTranslations } from 'next-intl'
import FadeIn from '@/components/animations/FadeIn'
import SectionTitle from '@/components/ui/SectionTitle'

export default function WhyEteya() {
  const t = useTranslations('why')
  const items = t.raw('items') as Array<{ title: string; body: string }>

  return (
    <section className="py-20 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionTitle label={t('section_label')} heading={t('heading')} />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="border-t border-border pt-6">
                <h3 className="text-primary font-medium mb-3">{item.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
