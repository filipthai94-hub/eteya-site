'use client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { C } from '@/lib/colors'

export default function Nav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')
  const altHref = isEn ? pathname.replace(/^\/en/, '') || '/sv' : '/en' + pathname

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: C.bg + 'E6', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.2em', color: C.primary, textDecoration: 'none' }}>
          {t('logo')}
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href={altHref} style={{ color: C.secondary, fontSize: '0.875rem', textDecoration: 'none', padding: '0.5rem' }}>
            {t('lang')}
          </Link>
          <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${C.accent}`, color: C.accent, padding: '0.5rem 1.25rem', fontSize: '0.875rem', textDecoration: 'none' }}>
            {t('cta')}
          </a>
        </div>
      </div>
    </nav>
  )
}
