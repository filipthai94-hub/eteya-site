'use client'

/**
 * useContactModal — återanvändbar modal-state för kontakt-CTA:er.
 *
 * Hanterar:
 * - State (isOpen, isMounted)
 * - Open/close-actions med GSAP-animation
 * - Focus-trap (Tab + Shift+Tab cyklar inom modalen)
 * - ESC-key stänger modal
 * - Scroll-lock på body när modal är öppen
 * - Reduced-motion-respekt (hoppar animations)
 * - Restore focus till trigger-element vid stängning
 *
 * Användning:
 *
 *   const modal = useContactModal()
 *
 *   <button onClick={() => modal.openModal(triggerRef.current)}>Öppna</button>
 *   <ContactModal {...modal} />
 *
 * Hook + ContactModal-komponent används av både FooterCTAClient och
 * BlogCTABlock så båda CTA-platserna har identisk modal-UX.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useScrollLock } from './useScrollLock'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export interface UseContactModalReturn {
  isOpen: boolean
  isMounted: boolean
  openModal: (triggerElement?: HTMLElement | null) => void
  closeModal: () => void
  overlayRef: React.RefObject<HTMLDivElement | null>
  panelRef: React.RefObject<HTMLDivElement | null>
}

export function useContactModal(): UseContactModalReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const reducedMotionRef = useRef(false)

  // Lock body scroll när modalen är mounted
  useScrollLock({ lockTarget: 'body', autoLock: isMounted })

  // Track reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      reducedMotionRef.current = mediaQuery.matches
    }
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  const closeModal = useCallback(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    const shouldReduce = reducedMotionRef.current

    const completeClose = () => {
      setIsOpen(false)
      setIsMounted(false)
      restoreFocusRef.current?.focus()
    }

    if (!overlay || !panel || shouldReduce) {
      completeClose()
      return
    }

    gsap.killTweensOf([overlay, panel])
    gsap
      .timeline({ onComplete: completeClose })
      .to(panel, {
        opacity: 0,
        scale: 0.97,
        y: 10,
        duration: 0.2,
        ease: 'power2.in',
      })
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
        },
        0.1,
      )
  }, [])

  const openModal = useCallback((triggerElement?: HTMLElement | null) => {
    if (triggerElement) {
      restoreFocusRef.current = triggerElement
    } else if (typeof document !== 'undefined') {
      restoreFocusRef.current = document.activeElement as HTMLElement
    }
    setIsOpen(true)
    setIsMounted(true)
  }, [])

  // Mount-effekt: animate open + install ESC + Tab-handlers
  useEffect(() => {
    if (!isMounted) return

    const overlay = overlayRef.current
    const panel = panelRef.current
    const shouldReduce = reducedMotionRef.current

    // Auto-fokusera första input efter mount
    const focusTimer = window.setTimeout(() => {
      const firstInput = panel?.querySelector<HTMLElement>(focusableSelector)
      firstInput?.focus()
    }, shouldReduce ? 0 : 180)

    // Open-animation
    if (overlay && panel && !shouldReduce) {
      gsap.killTweensOf([overlay, panel])
      gsap.set(overlay, { opacity: 0 })
      gsap.set(panel, { opacity: 0, scale: 0.95, y: 20 })
      gsap
        .timeline()
        .to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        .to(
          panel,
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.0)' },
          0.1,
        )
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || !panelRef.current) return

      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
        return
      }

      if (event.key !== 'Tab') return

      // Focus-trap: cykla inom modalen
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter(
        (element) =>
          !element.hasAttribute('disabled') && element.tabIndex !== -1,
      )

      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeModal, isMounted, isOpen])

  return {
    isOpen,
    isMounted,
    openModal,
    closeModal,
    overlayRef,
    panelRef,
  }
}
