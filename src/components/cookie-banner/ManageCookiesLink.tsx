'use client'

/**
 * Footer "Manage cookies" link — re-shows cookie banner on click.
 *
 * GDPR requires users to be able to withdraw consent as easily as they gave it.
 * Triggers a custom event that the CookieBanner listens for.
 */

import { useTranslations } from 'next-intl'

export function ManageCookiesLink() {
  const t = useTranslations('cookieBanner')

  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('eteya:show-cookie-banner'))
      }}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        color: 'inherit',
        font: 'inherit',
        cursor: 'pointer',
        textDecoration: 'underline',
        textDecorationThickness: '1px',
        textUnderlineOffset: '3px',
        opacity: 0.8,
        transition: 'opacity 180ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
    >
      {t('manageCookies')}
    </button>
  )
}
