'use client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function Nav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')
  const altHref = isEn ? pathname.replace(/^\/en/, '') || '/sv' : '/en' + pathname

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-et-bg/90 backdrop-blur-sm border-b border-et-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="font-display text-2xl tracking-[0.2em] text-et-primary hover:text-et-accent transition-colors">
          {t('logo')}
        </a>
        <div className="flex items-center gap-4">
          <Link href={altHref} className="text-et-secondary hover:text-et-primary text-sm transition-colors px-2 py-2">
            {t('lang')}
          </Link>
          <Button variant="outline" href="#contact">{t('cta')}</Button>
        </div>
      </div>
    </nav>
  )
}
