'use client'
import { useTranslations } from 'next-intl'
import { m, useReducedMotion } from 'motion/react'
import SplitText from '@/components/animations/SplitText'
import Button from '@/components/ui/Button'

export default function Hero() {
  const t = useTranslations('hero')
  const shouldReduce = useReducedMotion()

  return (
    <section className="min-h-screen flex flex-col justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full py-20">
        <h1 className="font-display text-6xl md:text-8xl lg:text-[120px] text-primary uppercase leading-none mb-8">
          <SplitText text={t('headline')} />
        </h1>
        <m.p
          className="text-secondary text-lg md:text-xl max-w-2xl mb-10"
          initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {t('subheadline')}
        </m.p>
        <m.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button variant="primary" href="#services">{t('cta_primary')}</Button>
          <Button variant="outline" href="#contact">{t('cta_secondary')}</Button>
        </m.div>
        <m.div
          className="mt-20 flex flex-col items-start gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <m.div
            className="w-px h-12 bg-accent"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-secondary text-xs tracking-widest uppercase">{t('scroll_label')}</span>
        </m.div>
      </div>
    </section>
  )
}
