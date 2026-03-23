import { getTranslations } from 'next-intl/server'
import Button from '@/components/ui/Button'

export default async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="min-h-screen flex flex-col justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full py-20">
        <h1 className="font-display text-6xl md:text-8xl lg:text-[120px] text-et-primary uppercase leading-none mb-8">
          {t('headline')}
        </h1>
        <p className="text-et-secondary text-lg md:text-xl max-w-2xl mb-10">
          {t('subheadline')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" href="#services">{t('cta_primary')}</Button>
          <Button variant="outline" href="#contact">{t('cta_secondary')}</Button>
        </div>
        <div className="mt-20 flex flex-col items-start gap-2">
          <div className="w-px h-12 bg-et-accent" />
          <span className="text-et-secondary text-xs tracking-widest uppercase">{t('scroll_label')}</span>
        </div>
      </div>
    </section>
  )
}
