'use client'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useCountUp } from '@/hooks/useCountUp'
import FadeIn from '@/components/animations/FadeIn'
import SectionTitle from '@/components/ui/SectionTitle'

function StatItem({ value, suffix, label, trigger }: { value: number; suffix: string; label: string; trigger: boolean }) {
  const count = useCountUp(value, 2000, trigger)
  return (
    <div className="text-center">
      <div className="font-display text-7xl md:text-8xl text-et-primary mb-2">
        {count}{suffix}
      </div>
      <p className="text-et-secondary text-sm">{label}</p>
    </div>
  )
}

export default function Stats() {
  const t = useTranslations('stats')
  const items = t.raw('items') as Array<{ value: number; suffix: string; label: string }>
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 lg:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionTitle heading={t('heading')} className="text-center" />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <StatItem key={i} {...item} trigger={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
