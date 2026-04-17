'use client'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import ContactCard from '../ui/contact-card'
import type { ChangeEvent, FormEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)









const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/* ═══════════════════════════════════════════════════════════
   Footer CTA — Pixel-perfect facitloop from chriskalafatis.com
   ═══════════════════════════════════════════════════════════ */

function CircleBorder({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef({ start: -0.5, end: -0.5 })
  const rafRef = useRef<number>(0)
  const playedRef = useRef(false)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    const cssSize = canvas.parentElement?.getBoundingClientRect().width || 145
    const s = Math.round(cssSize * dpr)
    canvas.width = s
    canvas.height = s
    ctx.clearRect(0, 0, s, s)

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 1.5 * dpr
    ctx.beginPath()
    ctx.arc(s / 2, s / 2, (s - 2 * dpr) / 2, animRef.current.start, animRef.current.end)
    ctx.stroke()

    if (!playedRef.current) {
      rafRef.current = requestAnimationFrame(draw)
    }
  }, [])

  useEffect(() => {
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  const play = useCallback(() => {
    playedRef.current = false
    gsap.to(animRef.current, {
      end: Math.PI * 2 + 0.5,
      start: -0.5,
      duration: 1.4,
      delay: 0.75,
      ease: 'power2.out',
      onUpdate: draw,
      onComplete: () => {
        playedRef.current = true
      },
    })
  }, [draw])

  useEffect(() => {
    if (canvasRef.current) {
      ;(canvasRef.current as HTMLCanvasElement & { _play?: () => void })._play = play
    }
  }, [play])

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
}

export default function FooterCTAClient() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const headingRef = useRef<HTMLDivElement>(null)
  const bgFillRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLButtonElement>(null)
  const circleCanvasRef = useRef<HTMLDivElement>(null)
  const btnTextRef = useRef<HTMLDivElement>(null)
  const btnArrowRef = useRef<HTMLDivElement>(null)
  const footerBarRef = useRef<HTMLDivElement>(null)
  const footerSenRef = useRef<HTMLSpanElement>(null)
  const borderGlowRef = useRef<HTMLDivElement>(null)
  const reducedMotionRef = useRef(false)
const overlayRef = useRef<HTMLDivElement>(null)
const modalPanelRef = useRef<HTMLDivElement>(null)
const firstInputRef = useRef<HTMLInputElement>(null)
const closeButtonRef = useRef<HTMLButtonElement>(null)
const openTimestampRef = useRef<number>(0)
const restoreFocusRef = useRef<HTMLButtonElement | null>(null)
const hasPlayed = useRef(false)

  
  
  const modalFieldsRef = useRef<HTMLDivElement>(null)
  
  
  
  
  

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalMounted, setIsModalMounted] = useState(false)
  
  
  
  
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  

  

    const closeModal = useCallback(() => {
    const overlay = overlayRef.current
    const panel = modalPanelRef.current
    const shouldReduce = reducedMotionRef.current

    const completeClose = () => {
      setIsModalOpen(false)
      setIsModalMounted(false)
      document.body.style.overflow = ''
      restoreFocusRef.current?.focus()
    }

    if (!overlay || !panel || shouldReduce) {
      completeClose()
      return
    }

    gsap.killTweensOf([overlay, panel])
    gsap.timeline({ onComplete: completeClose })
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

    const openModal = useCallback(() => {
    restoreFocusRef.current = circleRef.current
    openTimestampRef.current = Date.now()
    setIsModalOpen(true)
    setIsModalMounted(true)
  }, [])

  /* Listen for open-contact-modal custom event (from ROI calculator CTA etc.) */
  useEffect(() => {
    const handler = () => openModal()
    window.addEventListener('open-contact-modal', handler)
    return () => window.removeEventListener('open-contact-modal', handler)
  }, [openModal])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(containerRef.current, { opacity: 0, y: 40 })

      if (borderGlowRef.current) {
        gsap.set(borderGlowRef.current, { opacity: 0 })
      }

      if (bgFillRef.current) gsap.set(bgFillRef.current, { opacity: 0 })


      const chars = headingRef.current?.querySelectorAll('.fcta-char-inner')
      if (chars) gsap.set(chars, { yPercent: 100 })
      if (circleRef.current) gsap.set(circleRef.current, { scale: 0.9, opacity: 0 })
      if (btnTextRef.current) gsap.set(btnTextRef.current, { opacity: 0 })
      if (footerBarRef.current) gsap.set(footerBarRef.current, { yPercent: 100 })

      const footerTexts = footerBarRef.current?.querySelectorAll('.fcta-footer-reveal')
      if (footerTexts) gsap.set(footerTexts, { yPercent: 100 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          if (hasPlayed.current) return
          hasPlayed.current = true

          gsap.to(containerRef.current, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })

          if (borderGlowRef.current) {
            gsap.to(borderGlowRef.current, { opacity: 1, duration: 1.8, ease: 'power2.out', delay: 0.3 })
          }

          if (bgFillRef.current) {
            gsap.to(bgFillRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 })
          }



          if (chars) {
            gsap.to(chars, { yPercent: 0, duration: 1, ease: 'power3.out', stagger: 0.05, delay: 0.6 })
          }

          if (circleRef.current) {
            gsap.to(circleRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.0)', delay: 1.1 })
          }

          const canvas = circleCanvasRef.current?.querySelector('canvas') as (HTMLCanvasElement & { _play?: () => void }) | null
          if (canvas?._play) {
            setTimeout(() => canvas._play?.(), 1100)
          }

          if (btnTextRef.current) {
            gsap.to(btnTextRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out', delay: 1.5 })
          }

          if (footerBarRef.current) {
            gsap.to(footerBarRef.current, { yPercent: 0, duration: 1, ease: 'power3.out', delay: 1.3 })
          }

          if (footerTexts) {
            gsap.to(footerTexts, { yPercent: 0, duration: 1, ease: 'power3.out', stagger: 0.05, delay: 1.4 })
          }
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

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

  useEffect(() => {
    if (!isModalMounted) return

    const overlay = overlayRef.current
    const panel = modalPanelRef.current
    const shouldReduce = reducedMotionRef.current

    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      firstInputRef.current?.focus()
    }, shouldReduce ? 0 : 180)

    if (overlay && panel && !shouldReduce) {
      gsap.killTweensOf([overlay, panel])
      gsap.set(overlay, { opacity: 0 })
      gsap.set(panel, { opacity: 0, scale: 0.95, y: 20 })

      gsap.timeline()
        .to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        .to(panel, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.0)' }, 0.1)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen || !modalPanelRef.current) return

      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(modalPanelRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
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
      if (!isModalOpen) {
        document.body.style.overflow = ''
      }
    }
  }, [closeModal, isModalMounted, isModalOpen])

  // Close dropdown on click outside
  useEffect(() => {
    if (!dropdownOpen) return
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  const handleCircleEnter = () => {
    gsap.to(btnTextRef.current, { opacity: 0, duration: 0.25 })
    gsap.to(btnArrowRef.current, { opacity: 1, duration: 0.25 })
  }

  const handleCircleLeave = () => {
    gsap.to(btnTextRef.current, { opacity: 1, duration: 0.25 })
    gsap.to(btnArrowRef.current, { opacity: 0, duration: 0.25 })
  }

  

  

  

  const headingLines = ['Redo att sätta AI i arbete?']

  return (
    <>
      <style>{`
        .fcta-section {
          background: #080808;
          width: 100%;
          position: relative;
          padding-top: 120px;
        }
        .fcta-container {
          width: 93%;
          max-width: none;
          margin: 0 auto;
          border-radius: 48px;
          height: 80svh;
          position: relative;
          overflow: visible;
          background: transparent;
        }
        .fcta-border-glow {
          position: absolute;
          inset: -1px;
          border-radius: 48px;
          pointer-events: none;
          z-index: 1;
          will-change: opacity, transform;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fcta-bg-fill {
          position: absolute;
          inset: 2px;
          border-radius: 46px;
          background: #0d0d0d;
          opacity: 0;
          z-index: 2;
          pointer-events: none;
        }
        .fcta-bg-fill::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fcta-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fcta-grain)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.35;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }
        .fcta-border-glow::before {
          content: '';
          display: block;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 70%, rgba(255, 255, 255, 0) 100%);
          height: 300%;
          width: 120px;
          position: absolute;
          animation: fcta-sweep-rotate 8s linear infinite;
          z-index: 0;
          top: 50%;
          transform-origin: top center;
        }
        .fcta-border-glow::after {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: 46px;
          background: #0f0f0f;
          z-index: 1;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
        }
        @keyframes fcta-sweep-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fcta-text-block {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 3;
        }

        .fcta-heading {
          margin-top: 30px;
          text-align: center;
        }
        .fcta-mobile-break { display: none; }
        .fcta-heading-line {
          display: block;
          font-family: var(--font-display, 'Barlow Condensed', sans-serif);
          font-size: 8.8vw;
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.85;
          text-transform: uppercase;
          color: #fff;
          white-space: nowrap;
        }
        .fcta-char-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          height: 1.15em;
          padding-top: 0.18em;
        }
        .fcta-char-inner {
          display: inline-block;
          will-change: transform;
        }
        .fcta-circle-wrap {
          width: 145px;
          height: 145px;
          margin: 71px auto 0;
          position: relative;
          cursor: pointer;
          will-change: transform;
          appearance: none;
          border: 0;
          background: transparent;
          padding: 0;
        }
        .fcta-circle-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .fcta-btn-text {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-body, 'Geist', sans-serif);
          font-size: 15px;
          font-weight: 400;
          letter-spacing: -0.5px;
          line-height: 18px;
          text-transform: uppercase;
          color: #fff;
          text-align: center;
          pointer-events: none;
          width: 95px;
        }
        .fcta-btn-arrow {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
        }
        .fcta-btn-arrow svg {
          width: 30px;
          height: 31px;
          transform: rotate(-135deg);
        }
        .fcta-footer-outer {
          width: 100%;
          overflow: hidden;
          margin-top: 0;
        }
        .fcta-footer-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 60px;
          will-change: transform;
        }
        .fcta-footer-left {
          overflow: hidden;
          flex: 1;
        }
        .fcta-footer-left-text {
          font-family: var(--font-body, 'Geist', sans-serif);
          font-size: 16px;
          font-weight: 400;
          letter-spacing: -0.67px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          display: inline-block;
          white-space: normal;
          line-height: 1.4;
        }
        .fcta-footer-links {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }
        .fcta-footer-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.6);
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
          flex-shrink: 0;
        }
        .fcta-footer-button:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }
        .fcta-footer-icon {
          display: block;
          color: inherit;
        }
        .fcta-footer-button:hover .fcta-footer-icon {
          animation: slide-in-top 0.3s both;
        }
        @keyframes slide-in-top {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .fcta-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .fcta-modal-panel {
          position: relative;
          width: calc(100% - 32px);
          max-width: 520px;
          max-height: calc(100vh - 48px);
          overflow-y: auto;
          padding: 56px 48px 48px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #0d0d0d;
          color: #fff;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
        }
        .fcta-modal-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fcta-grain2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fcta-grain2)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.35;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }
        .fcta-modal-content {
          position: relative;
          z-index: 1;
        }
        .fcta-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border: 0;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          padding: 0;
          cursor: pointer;
          transition: background 0.25s ease;
          z-index: 2;
        }
        .fcta-modal-close:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .fcta-modal-close::before,
        .fcta-modal-close::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 14px;
          height: 1.5px;
          background: rgba(255, 255, 255, 0.5);
          transition: background 0.25s ease;
        }
        .fcta-modal-close::before { transform: translate(-50%, -50%) rotate(45deg); }
        .fcta-modal-close::after { transform: translate(-50%, -50%) rotate(-45deg); }
        .fcta-modal-close:hover::before,
        .fcta-modal-close:hover::after { background: rgba(255, 255, 255, 0.9); }
        .fcta-modal-title {
          margin: 0 0 40px;
          padding-right: 40px; /* space for close button */
          font-family: var(--font-display, 'Barlow Condensed', sans-serif);
          font-size: 26px;
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #fff;
        }
        .fcta-modal-fields {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .fcta-modal-field {
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }
        /* Dropdown field needs higher z-index than sibling fields so menu overlaps them */
        .fcta-modal-field--dropdown {
          z-index: 50;
        }
        .fcta-modal-input,
        .fcta-modal-textarea,
        .fcta-modal-select {
          width: 100%;
          border: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          border-radius: 0;
          padding: 14px 0;
          font-family: var(--font-body, 'Geist', sans-serif);
          font-size: 16px;
          line-height: 1.5;
          color: #fff;
          transition: border-color 0.3s ease, opacity 0.3s ease;
          resize: vertical;
          outline: none;
        }
        .fcta-modal-input::placeholder,
        .fcta-modal-textarea::placeholder { color: rgba(255, 255, 255, 0.35); }
        .fcta-modal-input:focus,
        .fcta-modal-textarea:focus,
        .fcta-modal-select:focus { border-bottom-color: rgba(255, 255, 255, 0.6); }
        /* Override Chrome/Safari autofill blue background on dark theme */
        .fcta-modal-input:-webkit-autofill,
        .fcta-modal-input:-webkit-autofill:hover,
        .fcta-modal-input:-webkit-autofill:focus,
        .fcta-modal-textarea:-webkit-autofill,
        .fcta-modal-textarea:-webkit-autofill:hover,
        .fcta-modal-textarea:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #0d0d0d inset !important;
          box-shadow: 0 0 0 1000px #0d0d0d inset !important;
          -webkit-text-fill-color: #fff !important;
          transition: background-color 5000s ease-in-out 0s;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .fcta-modal-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8' viewBox='0 0 14 8' fill='none'%3E%3Cpath d='M1 1L7 7L13 1' stroke='rgba(255,255,255,0.55)' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right center;
          padding-right: 28px;
        }
        .fcta-modal-select option {
          color: #111;
        }
        /* Custom dropdown replacement — z-index 50 to sit above sibling fields */
        .fcta-modal-dropdown {
          position: relative;
          z-index: 50;
        }
        .fcta-modal-dropdown-trigger {
          width: 100%;
          border: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          border-radius: 0;
          padding: 14px 28px 14px 0;
          font-family: var(--font-body, 'Geist', sans-serif);
          font-size: 16px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.35);
          text-align: left;
          cursor: pointer;
          transition: border-color 0.3s ease;
          outline: none;
          position: relative;
        }
        .fcta-modal-dropdown-trigger.has-value {
          color: #fff;
        }
        .fcta-modal-dropdown-trigger:focus,
        .fcta-modal-dropdown-trigger[aria-expanded='true'] {
          border-bottom-color: rgba(255, 255, 255, 0.6);
        }
        .fcta-modal-dropdown-trigger[aria-invalid='true'] {
          border-bottom-color: rgba(255, 100, 100, 0.8);
        }
        /* Chevron */
        .fcta-modal-dropdown-chevron {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%) rotate(0deg);
          transition: transform 0.25s ease;
          pointer-events: none;
        }
        .fcta-modal-dropdown-trigger[aria-expanded='true'] .fcta-modal-dropdown-chevron {
          transform: translateY(-50%) rotate(180deg);
        }
        /* Dropdown menu */
        .fcta-modal-dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #1c1c1c;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 6px;
          z-index: 100;
          opacity: 0;
          transform: translateY(-4px);
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
          isolation: isolate;
        }
        .fcta-modal-dropdown-menu.open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .fcta-modal-dropdown-option {
          display: block;
          width: 100%;
          padding: 12px 14px;
          border: 0;
          background: transparent;
          border-radius: 8px;
          font-family: var(--font-body, 'Geist', sans-serif);
          font-size: 15px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.85);
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .fcta-modal-dropdown-option:hover,
        .fcta-modal-dropdown-option:focus {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          outline: none;
        }
        .fcta-modal-dropdown-option.selected {
          color: #fff;
        }
        .fcta-modal-input[aria-invalid='true'],
        .fcta-modal-textarea[aria-invalid='true'],
        .fcta-modal-select[aria-invalid='true'] {
          border-bottom-color: rgba(255, 100, 100, 0.8);
        }
        .fcta-modal-error {
          margin-top: 4px;
          color: rgba(255, 100, 100, 0.8);
          font-size: 13px;
          line-height: 1.4;
        }
        .fcta-modal-submit {
          width: 100%;
          height: 48px;
          margin-top: 32px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-family: var(--font-body, 'Geist', sans-serif);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s ease, opacity 0.3s ease;
        }
        .fcta-modal-submit:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
        }
        .fcta-modal-submit:disabled {
          cursor: wait;
          opacity: 0.7;
        }
        .fcta-modal-server-error {
          margin-top: 12px;
          color: rgba(255, 100, 100, 0.8);
          font-size: 13px;
          line-height: 1.4;
        }
        .fcta-modal-success {
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 16px;
          padding: 20px 0 8px;
        }
        .fcta-modal-success-check {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.08);
          display: grid;
          place-items: center;
          animation: fcta-modal-check-in 0.35s ease-out both;
        }
        .fcta-modal-success-check svg {
          width: 20px;
          height: 20px;
        }
        .fcta-modal-success-text {
          margin: 0;
          font-family: var(--font-body, 'Geist', sans-serif);
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.88);
        }
        @keyframes fcta-modal-check-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 999px) {
          .fcta-container {
            width: calc(100% - 60px);
            border-radius: 32px;
            height: 80vh;
          }
          .fcta-border-glow { inset: -1px; border-radius: 32px; }
          .fcta-bg-fill { border-radius: 30px; }
          .fcta-border-glow::after { border-radius: 31px; }
          .fcta-heading-line {
            display: block;
            font-size: 7vw;
            white-space: nowrap;
          }
          .fcta-char-wrap { height: 1.15em; padding-top: 0.18em; }
          .fcta-circle-wrap { margin-top: 48px; }
          .fcta-footer-bar { padding: 20px 30px; }
          .fcta-footer-links { gap: 6px; }
          .fcta-footer-button { width: 40px; height: 40px; }
        }
        @media (max-width: 690px) {
          .fcta-section { padding-top: 48px; }
          .fcta-container {
            width: calc(100% - 32px);
            border-radius: 42px;
            height: 80dvh;
          }
          .fcta-border-glow { inset: -1px; border-radius: 42px; }
          .fcta-bg-fill { border-radius: 40px; }
          .fcta-border-glow::after { border-radius: 41px; }
          .fcta-text-block { top: 45%; }
          .fcta-mobile-break { display: inline; }
          .fcta-heading { margin-top: 0; }
          .fcta-heading-line {
            display: block;
            font-size: 11.5vw;
            white-space: nowrap;
            line-height: 1.05;
          }
          .fcta-char-wrap { height: 1.15em; padding-top: 0.18em; }
          .fcta-heading { margin-top: 20px; }
          .fcta-circle-wrap {
            width: 90px;
            height: 90px;
            margin-top: 28px;
          }
          .fcta-btn-text {
            font-size: 11px;
            letter-spacing: -0.4px;
            width: 65px;
            line-height: 14px;
          }
          .fcta-footer-bar {
            flex-direction: row;
            align-items: center;
            padding: 18px 16px;
          }
          .fcta-footer-left-text {
            font-size: 13px;
            white-space: normal;
          }
          .fcta-footer-links { gap: 6px; }
          .fcta-footer-button { width: 44px; height: 44px; }
          .fcta-footer-icon { width: 16px; height: 16px; }
          .fcta-border-glow::before { width: 60px; }
          .fcta-modal-overlay {
            padding: 0;
            align-items: flex-end;
          }
          .fcta-modal-panel {
            width: 100%;
            max-width: 100%;
            padding: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .fcta-container {
            opacity: 1 !important;
            transform: none !important;
          }
          .fcta-char-inner,
          .fcta-footer-bar,
          .fcta-footer-reveal,
          .fcta-modal-success-check {
            transform: none !important;
            opacity: 1 !important;
            animation: none !important;
          }
          .fcta-btn-text { opacity: 1 !important; }
          .fcta-bg-fill { opacity: 1 !important; }
          .fcta-circle-wrap { transform: none !important; opacity: 1 !important; }
          .fcta-link-outer, .fcta-link-inner { transition: none; }
          .fcta-border-glow::before { animation: none; display: none; }
        }
      `}</style>

      <section ref={sectionRef} className="fcta-section">
        <div ref={containerRef} className="fcta-container">
          <div ref={borderGlowRef} className="fcta-border-glow" />
          <div ref={bgFillRef} className="fcta-bg-fill" />
          <div className="fcta-text-block">
            <div ref={headingRef} className="fcta-heading">
              {headingLines.map((line, li) => (
                <span key={li} className="fcta-heading-line">
                  {[...line].map((char, ci) => {
                    const breakAfter = ci === 14 // After "Redo att sätta " (index 14 = space after "a" in "sätta")
                    return (
                      <React.Fragment key={ci}>
                        <span className="fcta-char-wrap">
                          <span className="fcta-char-inner">{char === ' ' ? '\u00A0' : char}</span>
                        </span>
                        {breakAfter && <br className="fcta-mobile-break" />}
                      </React.Fragment>
                    )
                  })}
                </span>
              ))}
            </div>

            <button
              ref={circleRef}
              type="button"
              className="fcta-circle-wrap"
              onMouseEnter={handleCircleEnter}
              onMouseLeave={handleCircleLeave}
              onClick={openModal}
              aria-haspopup="dialog"
              aria-expanded={isModalOpen}
              aria-controls="contact-modal-title"
            >
              <div ref={circleCanvasRef} className="fcta-circle-canvas">
                <CircleBorder />
              </div>
              <div ref={btnTextRef} className="fcta-btn-text">
                Skriv till<br />oss
              </div>
              <div ref={btnArrowRef} className="fcta-btn-arrow" aria-hidden="true">
                <svg viewBox="0 0 26 27" fill="white">
                  <path d="M23.2338 12.28L14.7538 20.8V0.239998H11.3538V20.76L2.87375 12.28L0.59375 14.56L13.0738 27L25.5138 14.56L23.2338 12.28Z" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <div className="fcta-footer-outer">
          <div ref={footerBarRef} className="fcta-footer-bar">
            <div className="fcta-footer-left">
              <span ref={footerSenRef} className="fcta-footer-left-text fcta-footer-reveal">
                © 2026 Eteya Consulting AB
              </span>
            </div>
            <nav className="fcta-footer-links">
              <a className="fcta-footer-button" href="https://www.instagram.com/eteyaconsulting/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="fcta-footer-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a className="fcta-footer-button" href="https://www.linkedin.com/company/eteya/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg className="fcta-footer-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <path d="M2 9h4v12H2z"/>
                  <path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                </svg>
              </a>
              <a className="fcta-footer-button" href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg className="fcta-footer-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </section>

      {isModalMounted && createPortal(
        <div ref={overlayRef} className="fcta-modal-overlay" onClick={(event) => event.target === event.currentTarget && closeModal()}>
          <div ref={modalPanelRef} style={{ position: 'relative', width: '100%', maxWidth: '1100px', maxHeight: 'calc(100dvh - 48px)' }}>
            <ContactCard onClose={closeModal} />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
