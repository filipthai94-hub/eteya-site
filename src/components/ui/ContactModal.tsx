'use client'

/**
 * ContactModal — återanvändbar kontakt-modal med ContactCard inuti.
 *
 * Renderar via React Portal till `document.body`. State och animations
 * styrs externt via `useContactModal()`-hook — komponenten är "dumb"
 * och tar emot refs + isMounted/onClose från hook.
 *
 * Används av:
 * - FooterCTAClient (cirkulär CTA på alla sidor)
 * - BlogCTABlock (inline CTA i blog-artiklar)
 *
 * → Båda CTA-platserna ger identisk modal-UX.
 *
 * Användning:
 *
 *   const modal = useContactModal()
 *
 *   <button onClick={() => modal.openModal()}>Öppna</button>
 *   <ContactModal
 *     isMounted={modal.isMounted}
 *     onClose={modal.closeModal}
 *     overlayRef={modal.overlayRef}
 *     panelRef={modal.panelRef}
 *   />
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ContactCard from '@/components/ui/contact-card'

interface ContactModalProps {
  isMounted: boolean
  onClose: () => void
  overlayRef: React.RefObject<HTMLDivElement | null>
  panelRef: React.RefObject<HTMLDivElement | null>
  /** Visa kontakt-info-block i ContactCard (default false för CTA-modaler) */
  showContactInfo?: boolean
}

export default function ContactModal({
  isMounted,
  onClose,
  overlayRef,
  panelRef,
  showContactInfo = false,
}: ContactModalProps) {
  const [body, setBody] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setBody(document.body)
  }, [])

  if (!isMounted || !body) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="contact-modal-overlay"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="contact-modal-panel" ref={panelRef}>
        <ContactCard onClose={onClose} showContactInfo={showContactInfo} />
      </div>
    </div>,
    body,
  )
}
