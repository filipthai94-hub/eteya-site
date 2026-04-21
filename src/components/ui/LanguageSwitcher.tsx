'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { routing } from '@/i18n/routing'

export default function LanguageSwitcher({ inMobileMenu = false }: { inMobileMenu?: boolean }) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const switchLocale = (newLocale: string) => {
    // Bygg ny URL med rätt locale
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
    setIsOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  if (inMobileMenu) {
    return (
      <div className="en-lang-mobile">
        <button
          onClick={() => switchLocale('sv')}
          className={`en-lang-mobile-btn${locale === 'sv' ? ' active' : ''}`}
          aria-label="Svenska"
        >
          <span className="flag-normal">🇸🇪</span>
          <span className="flag-hover">🇸🇪</span>
        </button>
        <button
          onClick={() => switchLocale('en')}
          className={`en-lang-mobile-btn${locale === 'en' ? ' active' : ''}`}
          aria-label="English"
        >
          <span className="flag-normal">🇬🇧</span>
          <span className="flag-hover">🇬🇧</span>
        </button>
      </div>
    )
  }

  return (
    <div className="en-lang-desktop" ref={dropdownRef}>
      <button
        className="en-lang-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current language: ${locale === 'sv' ? 'Svenska' : 'English'}`}
        aria-expanded={isOpen}
      >
        <span className="en-lang-label">{locale === 'sv' ? 'Sweden' : 'Sweden'}</span>
        <span className="en-lang-paren">(</span>
        <span className="en-lang-code">{locale.toUpperCase()}</span>
        <span className={`en-lang-arrow${isOpen ? ' is-open' : ''}`}>▾</span>
        <span className="en-lang-paren">)</span>
      </button>
      {isOpen && (
        <div className="en-lang-dropdown">
          <button
            onClick={() => switchLocale('sv')}
            className={`en-lang-option${locale === 'sv' ? ' active' : ''}`}
          >
            <span className="en-lang-flag">🇸🇪</span>
            <span>Svenska</span>
          </button>
          <button
            onClick={() => switchLocale('en')}
            className={`en-lang-option${locale === 'en' ? ' active' : ''}`}
          >
            <span className="en-lang-flag">🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      )}
    </div>
  )
}
