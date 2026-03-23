import { useTranslations } from 'next-intl'
import FadeIn from '@/components/animations/FadeIn'
import Button from '@/components/ui/Button'

export default function CTASection() {
  const t = useTranslations('cta')
  return (
    <section className="py-20 lg:py-32 bg-et-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="font-display text-4xl md:text-6xl lg:text-8xl text-et-primary uppercase leading-none mb-8">
            {t('headline')}
          </h2>
          <p className="text-et-secondary text-lg max-w-xl mx-auto mb-10">{t('body')}</p>
          <Button variant="primary" href="#contact" className="px-8 py-4 text-et-bg">
            {t('button')}
          </Button>
        </FadeIn>
      </div>
    </section>
  )
}
