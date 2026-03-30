'use client'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type FormState = 'idle' | 'submitting' | 'success' | 'error'
type FormField = 'name' | 'email' | 'company' | 'service' | 'message' | 'website'
type FormValues = Record<FormField, string>
type TouchedState = Partial<Record<Exclude<FormField, 'website'>, boolean>>
type ErrorState = Partial<Record<'name' | 'email' | 'company' | 'service', string>>

const initialValues: FormValues = {
  name: '',
  email: '',
  company: '',
  service: '',
  message: '',
  website: '',
}

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
  const hasPlayed = useRef(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const modalPanelRef = useRef<HTMLDivElement>(null)
  const modalFieldsRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const openTimestampRef = useRef<number>(0)
  const restoreFocusRef = useRef<HTMLButtonElement | null>(null)
  const reducedMotionRef = useRef(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalMounted, setIsModalMounted] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>(initialValues)
  const [touched, setTouched] = useState<TouchedState>({})
  const [errors, setErrors] = useState<ErrorState>({})
  const [formState, setFormState] = useState<FormState>('idle')
  const [serverError, setServerError] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const validateField = useCallback((field: keyof ErrorState, value: string) => {
    if (!value.trim()) {
      return 'Det här fältet är obligatoriskt.'
    }

    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Ange en giltig e-postadress.'
    }

    return ''
  }, [])

  const validateForm = useCallback(
    (values: FormValues) => {
      const nextErrors: ErrorState = {
        name: validateField('name', values.name),
        email: validateField('email', values.email),
        company: validateField('company', values.company),
        service: validateField('service', values.service),
      }

      return Object.fromEntries(Object.entries(nextErrors).filter(([, value]) => value)) as ErrorState
    },
    [validateField],
  )

  const closeModal = useCallback(() => {
    const overlay = overlayRef.current
    const panel = modalPanelRef.current
    const shouldReduce = reducedMotionRef.current

    const completeClose = () => {
      setIsModalOpen(false)
      setIsModalMounted(false)
      setFormState('idle')
      setServerError('')
      setTouched({})
      setErrors({})
      setFormValues(initialValues)
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
    setFormState('idle')
    setServerError('')
    setTouched({})
    setErrors({})
    setFormValues(initialValues)
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
    const fields = modalFieldsRef.current?.querySelectorAll('.fcta-modal-anim-item')
    const shouldReduce = reducedMotionRef.current

    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      firstInputRef.current?.focus()
    }, shouldReduce ? 0 : 180)

    if (overlay && panel && !shouldReduce) {
      gsap.killTweensOf([overlay, panel])
      gsap.set(overlay, { opacity: 0 })
      gsap.set(panel, { opacity: 0, scale: 0.95, y: 20 })
      if (fields?.length) {
        gsap.set(fields, { opacity: 0, y: 15 })
      }

      gsap.timeline()
        .to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        .to(panel, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.0)' }, 0.1)
        .to(fields || [], { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out', stagger: 0.05 }, 0.25)
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

  const handleFieldChange = (field: FormField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.value
    setFormValues((prev) => ({ ...prev, [field]: value }))

    if (field !== 'message' && field !== 'website' && touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }

    if (formState === 'error') {
      setFormState('idle')
      setServerError('')
    }
  }

  const handleFieldBlur = (field: keyof ErrorState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validateField(field, formValues[field]) }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextTouched = { name: true, email: true, company: true, service: true }
    const nextErrors = validateForm(formValues)
    setTouched(nextTouched)
    setErrors(nextErrors)
    setServerError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setFormState('submitting')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formValues,
          _ts: openTimestampRef.current,
        }),
      })

      const data = (await response.json()) as { ok?: boolean; error?: string }

      if (!response.ok) {
        setFormState('error')
        setServerError(data.error || 'Något gick fel. Försök igen.')
        return
      }

      setFormState('success')
      setServerError('')
    } catch {
      setFormState('error')
      setServerError('Något gick fel. Försök igen.')
    }
  }

  const headingLines = ['Redo att sätta AI i arbete?']

  return (
    <>
      <style>{`
        .fcta-section {
          background: #080808;
          width: 100%;
          position: relative;
          padding-top: 80px;
        }
        .fcta-container {
          width: 93%;
          max-width: none;
          margin: 0 auto;
          border-radius: 48px;
          min-height: 694px;
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
          background: #141414;
          opacity: 0;
          z-index: 2;
          pointer-events: none;
        }
        .fcta-bg-fill::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: url('/images/grain.png') repeat;
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
        }
        .fcta-footer-left-text {
          font-family: var(--font-body, 'Geist', sans-serif);
          font-size: 16px;
          font-weight: 400;
          letter-spacing: -0.67px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          display: inline-block;
        }
        .fcta-footer-links {
          display: flex;
          gap: 0;
        }
        .fcta-footer-link-item {
          padding: 7px 19px 6px;
          overflow: hidden;
          border-radius: 48px;
        }
        .fcta-footer-link-item:not(:last-child) {
          margin-right: 24px;
        }
        .fcta-footer-link {
          position: relative;
          overflow: hidden;
          display: inline-block;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.5);
          font-family: var(--font-body, 'Geist', sans-serif);
          font-size: 16px;
          font-weight: 400;
          letter-spacing: -0.67px;
          text-transform: uppercase;
          height: 22px;
        }
        .fcta-link-outer,
        .fcta-link-inner {
          display: inline-block;
          transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
        }
        .fcta-link-inner {
          position: absolute;
          left: 0;
          top: 0;
          transform: translateY(100%);
          color: #fff;
        }
        .fcta-footer-link:hover .fcta-link-outer {
          transform: translateY(-100%);
        }
        .fcta-footer-link:hover .fcta-link-inner {
          transform: translateY(0);
        }

        .fcta-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
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
          background: #141414;
          color: #fff;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
        }
        .fcta-modal-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: url('/images/grain.png') repeat;
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
          -webkit-box-shadow: 0 0 0 1000px #141414 inset !important;
          box-shadow: 0 0 0 1000px #141414 inset !important;
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
            min-height: 500px;
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
          .fcta-footer-link-item:not(:last-child) { margin-right: 0; }
        }
        @media (max-width: 690px) {
          .fcta-section { padding-top: 48px; }
          .fcta-container {
            width: calc(100% - 32px);
            border-radius: 42px;
            min-height: 468px;
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
            padding: 21px 16px;
          }
          .fcta-footer-left-text,
          .fcta-footer-link {
            font-size: 15px;
          }
          .fcta-footer-link { height: 20px; }
          .fcta-footer-link-item:not(:last-child) { margin-right: 0; }
          .fcta-footer-links { gap: 4px; }
          .fcta-border-glow::before { width: 60px; }
          .fcta-modal-overlay {
            padding: 24px 16px;
          }
          .fcta-modal-panel {
            width: calc(100% - 32px);
            padding: 48px 28px 36px;
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
              <div className="fcta-footer-link-item">
                <a className="fcta-footer-link" href="https://www.instagram.com/eteyaconsulting/" target="_blank" rel="noopener noreferrer">
                  <span className="fcta-link-outer">Instagram</span>
                  <span className="fcta-link-inner">Instagram</span>
                </a>
              </div>
              <div className="fcta-footer-link-item">
                <a className="fcta-footer-link" href="https://www.linkedin.com/company/eteya/" target="_blank" rel="noopener noreferrer">
                  <span className="fcta-link-outer">LinkedIn</span>
                  <span className="fcta-link-inner">LinkedIn</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </section>

      {isModalMounted && (
        <div ref={overlayRef} className="fcta-modal-overlay" onClick={(event) => event.target === event.currentTarget && closeModal()}>
          <div ref={modalPanelRef} className="fcta-modal-panel" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
            <button ref={closeButtonRef} type="button" className="fcta-modal-close fcta-modal-anim-item" onClick={closeModal} aria-label="Stäng formulär" />
            <div className="fcta-modal-content">
              <h2 id="contact-modal-title" className="fcta-modal-title fcta-modal-anim-item">
                Berätta om ditt projekt
              </h2>

              {formState === 'success' ? (
                <div className="fcta-modal-success">
                  <div className="fcta-modal-success-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12.5L9.5 17L19 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="fcta-modal-success-text">Tack! Vi återkommer inom 24 timmar.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div ref={modalFieldsRef} className="fcta-modal-fields">
                    <div className="fcta-modal-field fcta-modal-anim-item">
                      <input
                        ref={firstInputRef}
                        className="fcta-modal-input"
                        type="text"
                        name="name"
                        placeholder="Ditt namn"
                        value={formValues.name}
                        onChange={handleFieldChange('name')}
                        onBlur={handleFieldBlur('name')}
                        aria-invalid={Boolean(touched.name && errors.name)}
                        aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                        required
                      />
                      {touched.name && errors.name && <span id="contact-name-error" className="fcta-modal-error">{errors.name}</span>}
                    </div>

                    <div className="fcta-modal-field fcta-modal-anim-item">
                      <input
                        className="fcta-modal-input"
                        type="email"
                        name="email"
                        placeholder="din@email.com"
                        value={formValues.email}
                        onChange={handleFieldChange('email')}
                        onBlur={handleFieldBlur('email')}
                        aria-invalid={Boolean(touched.email && errors.email)}
                        aria-describedby={touched.email && errors.email ? 'contact-email-error' : undefined}
                        required
                      />
                      {touched.email && errors.email && <span id="contact-email-error" className="fcta-modal-error">{errors.email}</span>}
                    </div>

                    <div className="fcta-modal-field fcta-modal-anim-item">
                      <input
                        className="fcta-modal-input"
                        type="text"
                        name="company"
                        placeholder="Företag eller webbadress"
                        value={formValues.company}
                        onChange={handleFieldChange('company')}
                        onBlur={handleFieldBlur('company')}
                        aria-invalid={Boolean(touched.company && errors.company)}
                        aria-describedby={touched.company && errors.company ? 'contact-company-error' : undefined}
                        required
                      />
                      {touched.company && errors.company && <span id="contact-company-error" className="fcta-modal-error">{errors.company}</span>}
                    </div>

                    <div className="fcta-modal-field fcta-modal-field--dropdown fcta-modal-anim-item">
                      <div className="fcta-modal-dropdown" ref={dropdownRef}>
                        <button
                          type="button"
                          className={`fcta-modal-dropdown-trigger${formValues.service ? ' has-value' : ''}`}
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          onBlur={(e) => { if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) { setDropdownOpen(false); handleFieldBlur('service')(); } }}
                          aria-expanded={dropdownOpen}
                          aria-haspopup="listbox"
                          aria-invalid={Boolean(touched.service && errors.service)}
                          aria-describedby={touched.service && errors.service ? 'contact-service-error' : undefined}
                        >
                          {formValues.service || 'Vad behöver ni hjälp med?'}
                          <svg className="fcta-modal-dropdown-chevron" width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M1 1L7 7L13 1" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <div className={`fcta-modal-dropdown-menu${dropdownOpen ? ' open' : ''}`} role="listbox">
                          {['AI-agent / Assistent', 'AI-automatisering', 'Strategi & Rådgivning', 'Annat'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              role="option"
                              aria-selected={formValues.service === opt}
                              className={`fcta-modal-dropdown-option${formValues.service === opt ? ' selected' : ''}`}
                              onClick={() => { handleFieldChange('service')({ target: { value: opt } } as any); setDropdownOpen(false); }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      {touched.service && errors.service && <span id="contact-service-error" className="fcta-modal-error">{errors.service}</span>}
                    </div>

                    <div className="fcta-modal-field fcta-modal-anim-item">
                      <textarea
                        className="fcta-modal-textarea"
                        name="message"
                        placeholder="Beskriv kort vad ni vill uppnå..."
                        rows={3}
                        value={formValues.message}
                        onChange={handleFieldChange('message')}
                      />
                    </div>

                    <input
                      className="fcta-modal-anim-item"
                      name="website"
                      type="text"
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                      value={formValues.website}
                      onChange={handleFieldChange('website')}
                    />
                  </div>

                  <button className="fcta-modal-submit fcta-modal-anim-item" type="submit" disabled={formState === 'submitting'}>
                    {formState === 'submitting' ? 'Skickar...' : 'Skicka förfrågan'}
                  </button>
                  {serverError && <p className="fcta-modal-server-error">{serverError}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
