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
          <svg className="flag-svg flag-normal" viewBox="0 0 24 16" aria-hidden="true">
            <rect width="24" height="16" fill="#005A96"/>
            <rect x="0" y="6" width="24" height="4" fill="#F4C400"/>
            <rect x="7" y="0" width="4" height="16" fill="#F4C400"/>
          </svg>
          <svg className="flag-svg flag-hover" viewBox="0 0 24 16" aria-hidden="true">
            <rect width="24" height="16" fill="#005A96"/>
            <rect x="0" y="6" width="24" height="4" fill="#F4C400"/>
            <rect x="7" y="0" width="4" height="16" fill="#F4C400"/>
          </svg>
        </button>
        <button
          onClick={() => switchLocale('en')}
          className={`en-lang-mobile-btn${locale === 'en' ? ' active' : ''}`}
          aria-label="English"
        >
          <svg className="flag-svg flag-normal" viewBox="0 0 24 16" aria-hidden="true">
            <defs><clipPath id="uk-flag-normal"><rect width="24" height="16"/></clipPath></defs>
            <g clipPath="url(#uk-flag-normal)">
              <rect width="24" height="16" fill="#0A2868"/>
              <path d="M0,0 L24,16 M24,0 L0,16" stroke="#E8E8E8" strokeWidth="2.5"/>
              <path d="M0,0 L24,16 M24,0 L0,16" stroke="#BD0F28" strokeWidth="1.2"/>
              <rect x="0" y="6" width="24" height="4" fill="#E8E8E8"/>
              <rect x="10" y="0" width="4" height="16" fill="#E8E8E8"/>
              <rect x="0" y="7" width="24" height="2" fill="#BD0F28"/>
              <rect x="11" y="0" width="2" height="16" fill="#BD0F28"/>
            </g>
          </svg>
          <svg className="flag-svg flag-hover" viewBox="0 0 24 16" aria-hidden="true">
            <defs><clipPath id="uk-flag-hover"><rect width="24" height="16"/></clipPath></defs>
            <g clipPath="url(#uk-flag-hover)">
              <rect width="24" height="16" fill="#0A2868"/>
              <path d="M0,0 L24,16 M24,0 L0,16" stroke="#E8E8E8" strokeWidth="2.5"/>
              <path d="M0,0 L24,16 M24,0 L0,16" stroke="#BD0F28" strokeWidth="1.2"/>
              <rect x="0" y="6" width="24" height="4" fill="#E8E8E8"/>
              <rect x="10" y="0" width="4" height="16" fill="#E8E8E8"/>
              <rect x="0" y="7" width="24" height="2" fill="#BD0F28"/>
              <rect x="11" y="0" width="2" height="16" fill="#BD0F28"/>
            </g>
          </svg>
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
