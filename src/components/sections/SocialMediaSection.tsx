'use client'

import { useTranslations } from 'next-intl'

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/eteya-consulting-ab/',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/eteyaconsultingab/',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61573471850082',
    icon: 'M12 0C5.373 0 0 5.373 0 12c0 6.102 4.544 11.164 10.438 11.936V15.5H7.03v-3.5h3.408V9.65c0-3.368 2.002-5.224 5.062-5.224 1.468 0 3.002.262 3.002.262v3.308h-1.69c-1.666 0-2.188 1.034-2.188 2.096v2.414h3.718l-.595 3.5h-3.123V24c5.894-.772 10.438-5.834 10.438-11.936C24 5.373 18.627 0 12 0z',
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/EteyaAI',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
]

export default function SocialMediaSection() {
  const t = useTranslations('contact')

  return (
    <section style={{
      padding: '64px 24px',
      textAlign: 'center',
      background: '#080808',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: '32px',
        fontWeight: 600,
        color: '#fff',
        marginBottom: '40px',
        letterSpacing: '-0.02em',
      }}>
        {t('socialMediaHeading')}
      </h2>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={social.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              transition: 'border-color 0.2s ease, background 0.2s ease, color 0.2s ease',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d={social.icon} />
            </svg>
          </a>
        ))}
      </div>
    </section>
  )
}