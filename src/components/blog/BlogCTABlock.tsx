'use client'

/**
 * BlogCTABlock — inline mid-article CTA enligt research-baserad mall
 * (BLOG_AUTHORING.md "CTA-mall" — 28 regler från Nielsen Norman, HubSpot,
 * CXL, Unbounce, Backlinko, NN/G, etc).
 *
 * Card-struktur:
 *   [KICKER]            — auktoritets-data (FÖR 30+ SVENSKA SMB)
 *   [HEADLINE]          — statement, 5-7 ord, possessivt pronomen
 *   [BODY]              — 1-2 meningar, max 25 ord, EN konkretisering
 *   [BUTTON →]          — imperativ + specifik leverabel (ButtonSwap)
 *   [TRUST-RAD]         — 3 element max, prick-separator
 *
 * Klick → öppnar samma kontakt-modal som footer-CTA via useContactModal.
 *
 * Differentiering från footer-CTA:
 * - Inline = topic-bunden, subtilare card-style med tonad accent
 * - Footer = bred fångare, prominent cirkulär knapp
 * - Olika knapp-text ("Boka 30-min ROI-samtal" vs "Hör av dig")
 *
 * Per-artikel-anpassning (3 variabler kan override:as via props):
 * - kicker, headline, body
 * - button + trust-rad förblir IDENTISK över alla artiklar för konsekvens
 */

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import ButtonSwap from '@/components/ui/ButtonSwap'
import ContactModal from '@/components/ui/ContactModal'
import { useContactModal } from '@/hooks/useContactModal'
import type { BlogLocale } from '@/lib/blog/types'

interface BlogCTABlockProps {
  locale: BlogLocale
  /** Override för topic-specifik kicker (default från translations) */
  kicker?: string
  /** Override för article-specifik headline (default från translations) */
  headline?: string
  /** Override för article-specifik body (default från translations) */
  body?: string
}

export default function BlogCTABlock({
  locale: _locale,
  kicker,
  headline,
  body,
}: BlogCTABlockProps) {
  const t = useTranslations('blog.article')
  const modal = useContactModal()

  // Hook auto-använder document.activeElement som restore-focus om
  // triggerElement inte passas — så ButtonSwap behöver ingen ref.
  const handleClick = useCallback(() => {
    modal.openModal()
  }, [modal])

  const finalKicker = kicker ?? t('ctaKicker')
  const finalHeadline = headline ?? t('ctaHeading')
  const finalBody = body ?? t('ctaBody')

  return (
    <>
      <aside
        className="blog-cta-card not-prose"
        aria-label={finalHeadline}
      >
        <span className="blog-cta-kicker">{finalKicker}</span>
        <h2 className="blog-cta-headline">{finalHeadline}</h2>
        <p className="blog-cta-body">{finalBody}</p>

        <div className="blog-cta-button-wrap">
          <ButtonSwap
            label={t('ctaButton')}
            variant="accent"
            size="lg"
            arrow
            onClick={handleClick}
            className="no-prose-link"
          />
        </div>

        <p className="blog-cta-trust">{t('ctaTrustLine')}</p>
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
