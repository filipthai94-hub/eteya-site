'use client'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function Nav() {
  const t = useTranslations('nav')
  const router = useRouter()
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')

  function toggleLocale() {
    if (isEn) {
      router.push(pathname.replace(/^\/en/, '') || '/')
    } else {
      router.push('/en' + pathname)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-base/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="/"
          className="font-display text-2xl tracking-[0.2em] text-primary hover:text-accent transition-colors"
        >
          {t('logo')}
        </a>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLocale}
            className="text-secondary hover:text-primary text-sm transition-colors min-h-[44px] px-2"
          >
            {t('lang')}
          </button>
          <Button variant="outline" href="#contact">
            {t('cta')}
          </Button>
        </div>
      </div>
    </nav>
  )
}
