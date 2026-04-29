'use client'

/**
 * BlogCTABlock — closing CTA i editorial section-with-label layout
 * matchande listingens DNA. Side-label "NÄSTA STEG" + content
 * (Barlow Condensed heading + body + mono arrow-link).
 *
 * Klick öppnar SAMMA kontakt-modal som footer-CTA via useContactModal-hook.
 * Tidigare redirectade detta till /kontakt — nu konsekvent med footer.
 */

import { useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import ContactModal from '@/components/ui/ContactModal'
import { useContactModal } from '@/hooks/useContactModal'
import type { BlogLocale } from '@/lib/blog/types'

interface BlogCTABlockProps {
  locale: BlogLocale
  variant?: 'inline' | 'closing'
}

export default function BlogCTABlock({
  locale: _locale, // Locale används implicit via NextIntlClientProvider
  variant = 'closing',
}: BlogCTABlockProps) {
  const t = useTranslations('blog.article')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const modal = useContactModal()
  const sectionLabel = _locale === 'sv' ? 'NÄSTA STEG' : 'NEXT STEP'

  const handleClick = useCallback(() => {
    modal.openModal(triggerRef.current)
  }, [modal])

  if (variant === 'inline') {
    return (
      <>
        <aside className="blog-cta-inline not-prose">
          <p className="blog-cta-inline-text">{t('ctaBody')}</p>
          <button
            ref={triggerRef}
            type="button"
            className="blog-cta-inline-button"
            onClick={handleClick}
            aria-haspopup="dialog"
            aria-expanded={modal.isOpen}
          >
            {t('ctaButton')}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </aside>
        <ContactModal
          isMounted={modal.isMounted}
          onClose={modal.closeModal}
          overlayRef={modal.overlayRef}
          panelRef={modal.panelRef}
        />
      </>
    )
  }

  return (
    <>
      <section
        className="blog-section-with-label blog-cta-section"
        aria-label={t('ctaHeading')}
      >
        <div className="blog-section-label-col">
          <span className="blog-side-label">{sectionLabel}</span>
        </div>

        <div className="blog-cta-content">
          <h2 className="blog-cta-heading">{t('ctaHeading')}</h2>
          <p className="blog-cta-body">{t('ctaBody')}</p>
          <button
            ref={triggerRef}
            type="button"
            className="blog-cta-arrow"
            onClick={handleClick}
            aria-haspopup="dialog"
            aria-expanded={modal.isOpen}
          >
            {t('ctaButton')}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
      <ContactModal
        isMounted={modal.isMounted}
        onClose={modal.closeModal}
        overlayRef={modal.overlayRef}
        panelRef={modal.panelRef}
      />
    </>
  )
}
