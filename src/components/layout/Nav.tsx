'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import HashLink from '@/components/ui/HashLink'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useEffect, useRef, useState, useCallback } from 'react'
import { animate } from 'motion'

/* ═══════════════════════════════════════════════════════════
   ETEYA NAV — Converted from verified MUGEN clone mockup
   Spring params: VERIFIED from Framer source (script_main.DUEvC23B.mjs)
   Font: Uses app's Geist (--font-body) + Barlow Condensed (--font-display)
   ═══════════════════════════════════════════════════════════ */

// Spring configs — extracted from Framer's bundled JS
const PANEL_SPRING = { type: 'spring' as const, stiffness: 500, damping: 60, mass: 1 }
const ITEM_SPRING = { type: 'spring' as const, bounce: 0.3, duration: 0.4 }
const ICON_SPRING = { type: 'spring' as const, bounce: 0.2, duration: 0.4 }
const LOGO_SPRING = { type: 'spring' as const, bounce: 0.2, duration: 0.4 }

// Premium smooth scroll — easeOutExpo for buttery deceleration
function smoothScrollTo(targetY: number, duration = 900) {
  const startY = window.scrollY
  const diff = targetY - startY
  if (Math.abs(diff) < 2) return
  const start = performance.now()
  const easeOutExpo = (t: number) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
  const step = () => {
    const elapsed = performance.now() - start
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + diff * easeOutExpo(progress))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

interface StaggerItem {
  el: HTMLElement
  delay: number
  type: 'translateX' | 'scale'
  distance?: number
  from?: number
}

export default function Nav() {
  const pathname = usePathname()
  const locale = useLocale() // Hämtar 'sv' eller 'en'
  const t = useTranslations('nav')
  const homeHref = '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState('')
  const [popupOpen, setPopupOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [navDark, setNavDark] = useState(true) // true = dark text (over light bg)

  const overlayRef = useRef<HTMLDivElement>(null)
  const blurRef = useRef<HTMLDivElement>(null)
  const activeAnims = useRef<(() => void)[]>([])
  const staggerCache = useRef<StaggerItem[] | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const topbarRef = useRef<HTMLElement>(null)

  // Stagger target refs
  const menuLabelRef = useRef<HTMLParagraphElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const talkRef = useRef<HTMLDivElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const socialIconRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const logoRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)

  // Clock — 24h for Swedish, 12h AM/PM for English
  useEffect(() => {
    const update = () => {
      const now = new Date()
      
      if (locale === 'sv') {
        // Svenska — 24-timmarsformat: 09:57
        setTime(
          now.toLocaleString('sv-SE', {
            timeZone: 'Europe/Stockholm',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        )
      } else {
        // Engelska — 12-timmarsformat: 9:57 AM
        setTime(
          now.toLocaleString('en-US', {
            timeZone: 'Europe/Stockholm',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        )
      }
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [locale])

  // Deterministic nav contrast: dark text only while nav overlaps hero
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) {
      setNavDark(false)
      return
    }

    let raf = 0
    const updateNavContrast = () => {
      const topbarEl = topbarRef.current
      if (!topbarEl) return
      const heroRect = hero.getBoundingClientRect()
      const navRect = topbarEl.getBoundingClientRect()
      const navProbeY = navRect.top + navRect.height / 2
      const isOverHero = heroRect.top <= navProbeY && heroRect.bottom > navProbeY
      // Hero has light/green video → dark text over hero, light text elsewhere
      setNavDark(isOverHero)
    }

    const onChange = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateNavContrast)
    }

    updateNavContrast()
    window.addEventListener('scroll', onChange, { passive: true })
    window.addEventListener('resize', onChange)
    window.addEventListener('orientationchange', onChange)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onChange)
      window.removeEventListener('resize', onChange)
      window.removeEventListener('orientationchange', onChange)
    }
  }, [])

  // Bulletproof scroll lock: position:fixed on body preserves scroll pos
  const scrollPosRef = useRef(0)
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    if (menuOpen) {
      // Save scroll position, then lock body
      scrollPosRef.current = window.scrollY
      body.style.position = 'fixed'
      body.style.top = `-${scrollPosRef.current}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.overflow = 'hidden'
      html.style.overflow = 'hidden'
      // Pause all videos
      const videos = document.querySelectorAll('video')
      videos.forEach(v => { if (!v.paused) { v.dataset.enWasPlaying = '1'; v.pause() } })
    } else {
      // Restore scroll position
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      html.style.overflow = ''
      window.scrollTo(0, scrollPosRef.current)
      // Resume videos
      const videos = document.querySelectorAll('video')
      videos.forEach(v => { if (v.dataset.enWasPlaying) { v.play(); delete v.dataset.enWasPlaying } })
    }
    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      html.style.overflow = ''
    }
  }, [menuOpen])

  // Build stagger targets
  const getStagger = useCallback((): StaggerItem[] => {
    if (staggerCache.current) return staggerCache.current
    const items: StaggerItem[] = []
    const GAP = 100

    if (menuLabelRef.current) items.push({ el: menuLabelRef.current, delay: 0, type: 'translateX', distance: 20 })
    linkRefs.current.forEach((el, i) => {
      if (el) items.push({ el, delay: i * GAP, type: 'translateX', distance: 20 })
    })
    const cont = linkRefs.current.filter(Boolean).length * GAP
    if (talkRef.current) items.push({ el: talkRef.current, delay: cont, type: 'translateX', distance: 20 })
    if (socialsRef.current) items.push({ el: socialsRef.current, delay: cont + GAP, type: 'translateX', distance: 20 })
    if (footerRef.current) items.push({ el: footerRef.current, delay: cont + GAP * 2, type: 'translateX', distance: 20 })
    socialIconRefs.current.forEach((el, i) => {
      if (el) items.push({ el, delay: cont + GAP + i * GAP, type: 'translateX', distance: 10 })
    })
    if (logoRef.current) items.push({ el: logoRef.current, delay: 0, type: 'scale', from: 1.8 })
    if (taglineRef.current) items.push({ el: taglineRef.current, delay: 200, type: 'translateX', distance: 20 })

    staggerCache.current = items
    return items
  }, [])

  const stopAll = useCallback(() => {
    activeAnims.current.forEach(fn => fn())
    activeAnims.current = []
  }, [])

  const openMenu = useCallback(() => {
    stopAll()
    const ov = overlayRef.current
    const bg = blurRef.current
    if (!ov || !bg) return

    ov.classList.add('is-open')
    bg.classList.add('is-open')

    const c1 = animate(ov, { transform: ['translateX(600px)', 'translateX(0px)'] }, PANEL_SPRING)
    activeAnims.current.push(() => c1.stop())
    const c2 = animate(bg, { opacity: [0, 1] }, PANEL_SPRING)
    activeAnims.current.push(() => c2.stop())

    const items = getStagger()
    items.forEach(item => {
      if (item.type === 'translateX') {
        item.el.style.opacity = '0'
        item.el.style.transform = `translateX(${item.distance}px)`
      } else {
        item.el.style.opacity = '0'
        item.el.style.transform = `scale(${item.from})`
      }
      setTimeout(() => {
        const cfg = item.type === 'scale' ? LOGO_SPRING : item.distance === 10 ? ICON_SPRING : ITEM_SPRING
        const target =
          item.type === 'translateX'
            ? { transform: [`translateX(${item.distance}px)`, 'translateX(0px)'], opacity: [0, 1] }
            : { transform: [`scale(${item.from})`, 'scale(1)'], opacity: [0, 1] }
        const c = animate(item.el, target, cfg)
        activeAnims.current.push(() => c.stop())
      }, item.delay)
    })
  }, [getStagger, stopAll])

  const closeMenu = useCallback(() => {
    stopAll()
    const ov = overlayRef.current
    const bg = blurRef.current
    if (!ov || !bg) return

    const items = getStagger()
    items.forEach(item => {
      const target =
        item.type === 'translateX'
          ? { transform: `translateX(${item.distance}px)`, opacity: 0 }
          : { transform: `scale(${item.from})`, opacity: 0 }
      const c = animate(item.el, target, { type: 'spring' as const, bounce: 0, duration: 0.3 })
      activeAnims.current.push(() => c.stop())
    })

    setTimeout(() => {
      const c1 = animate(ov, { transform: 'translateX(600px)' }, PANEL_SPRING)
      activeAnims.current.push(() => c1.stop())
      const c2 = animate(bg, { opacity: 0 }, PANEL_SPRING)
      activeAnims.current.push(() => c2.stop())
      c1.then(() => {
        ov.classList.remove('is-open')
        bg.classList.remove('is-open')
        ov.style.transform = 'translateX(100%)'
        bg.style.opacity = '0'
        items.forEach(item => {
          item.el.style.opacity = ''
          item.el.style.transform = ''
        })
      })
    }, 100)
  }, [getStagger, stopAll])

  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu()
      setMenuOpen(false)
    } else {
      setMenuOpen(true)
      // Small delay to let React render before animating
      requestAnimationFrame(() => {
        staggerCache.current = null // rebuild refs
        openMenu()
      })
    }
  }, [menuOpen, openMenu, closeMenu])

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hashIndex = href.indexOf('#')
    const pathPart = hashIndex !== -1 ? href.slice(0, hashIndex) : href
    const hashPart = hashIndex !== -1 ? href.slice(hashIndex + 1) : null
    const isCurrentPage = pathname === pathPart

    if (hashPart && isCurrentPage) {
      // Scenario A: redan på rätt sida — scrolla efter att menyn stängts (body-lock borttaget)
      e.preventDefault()
      setTimeout(() => {
        const el = document.getElementById(hashPart)
        const navH = ( document.querySelector('.en-topbar') as HTMLElement | null)?.offsetHeight ?? 80
        if (el && window.__lenis) {
          window.__lenis.scrollTo(el, { offset: navH + 15, duration: 1.2 })
        }
      }, 50)
    } else if (!hashPart) {
      // Vanlig sida utan hash — scrolla till toppen
      scrollPosRef.current = 0
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true, force: true })
      }
    } else {
      // Scenario B: annan sida med hash — spara target i sessionStorage
      scrollPosRef.current = 0
      if (hashPart) {
        sessionStorage.setItem('scrollTarget', hashPart)
      }
    }
    setMenuOpen(false)
    closeMenu()
  }, [closeMenu, pathname])

  const handleBlurClick = useCallback(() => {
    setMenuOpen(false)
    closeMenu()
  }, [closeMenu])

  // Email popup hover
  const openPopup = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setPopupOpen(true)
  }, [])

  const closePopup = useCallback(() => {
    hoverTimer.current = setTimeout(() => setPopupOpen(false), 200)
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(t('email')).then(() => {
      setCopied(true)
      setPopupOpen(false)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  const handleMail = useCallback(() => {
    window.location.href = `mailto:${t('email')}`
    setPopupOpen(false)
  }, [])

  const handleBook = useCallback(() => {
    window.open('https://cal.com', '_blank')
    setPopupOpen(false)
  }, [])

  const NAV_LINKS: { label: string; href: string; badge: string | null }[] = (t.raw('links') as { label: string; href: string; badge: string | null }[]).map((link) => ({
    label: link.label,
    href: link.href,
    badge: link.badge ?? null,
  }))

  const SOCIALS = [
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61573471850082', icon: 'M12 0C5.373 0 0 5.373 0 12c0 6.102 4.544 11.164 10.438 11.936V15.5H7.03v-3.5h3.408V9.65c0-3.368 2.002-5.224 5.062-5.224 1.468 0 3.002.262 3.002.262v3.308h-1.69c-1.666 0-2.188 1.034-2.188 2.096v2.414h3.718l-.595 3.5h-3.123V24c5.894-.772 10.438-5.834 10.438-11.936C24 5.373 18.627 0 12 0z' },
    { label: 'Instagram', href: 'https://www.instagram.com/eteyaconsultingab/', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
    { label: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { label: 'X', href: '#', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  ]

  return (
    <>
      <style>{`
        /* ═══ TOP BAR ═══ */
        .en-topbar{position:fixed;top:0;left:0;right:0;z-index:997;height:60px;padding:18px 72px;display:flex;align-items:center;justify-content:center;gap:16px;background:transparent;pointer-events:none}
        .en-topbar>*{pointer-events:auto}
        .en-col{flex:1 0 0;display:flex;align-items:center;min-width:0}
        .en-logo{display:flex;align-items:flex-start;gap:1px;cursor:pointer;text-decoration:none}
        .en-logo-text{font-family:var(--font-display),sans-serif;font-size:20px;font-weight:800;letter-spacing:-.6px;line-height:16px;color:#fff}
        .en-logo-c{font-family:var(--font-display),sans-serif;font-size:5px;font-weight:800;letter-spacing:0;line-height:1;color:#fff;vertical-align:super;margin-left:1px}
        .en-location{display:flex;align-items:center;gap:8px}
        .en-location-city{font-family:var(--font-body),sans-serif;font-size:14.5px;font-weight:600;letter-spacing:-.435px;line-height:21.75px;color:#fff;white-space:nowrap}
        .en-location-time{font-family:var(--font-body),sans-serif;font-size:14.5px;font-weight:600;letter-spacing:-.435px;line-height:21.75px;color:rgb(184,184,184);white-space:nowrap}
        .en-work{display:flex;align-items:center;gap:6px;cursor:pointer;text-decoration:none}
        .en-work-text{display:flex;flex-direction:column;overflow:hidden;height:21.75px;position:relative}
        .en-work-text span{font-family:var(--font-body),sans-serif;font-size:14.5px;font-weight:600;letter-spacing:-.29px;line-height:21.75px;color:#fff;display:block;transition:transform .4s cubic-bezier(.25,1,.5,1),opacity .1s cubic-bezier(.25,1,.5,1);white-space:nowrap;transform:perspective(1200px) translateY(0)}
        .en-work-text .en-hover{position:absolute;top:0;left:0;opacity:0;transform:perspective(1200px) translateY(100%)}
        .en-work:hover .en-work-text span:first-child{opacity:0;transform:perspective(1200px) translateY(-100%)}
        .en-work:hover .en-work-text .en-hover{opacity:1;transform:perspective(1200px) translateY(0)}
        .en-work-count{font-family:var(--font-body),sans-serif;font-size:14.5px;font-weight:500;letter-spacing:-.435px;line-height:21.75px;color:rgb(184,184,184);user-select:none;white-space:nowrap}

        /* ═══ HAMBURGER ═══ */
        .en-hamburger{position:fixed;top:0;left:0;right:0;z-index:1000;height:60px;padding:18px 72px;display:flex;align-items:center;justify-content:flex-end;pointer-events:none}
        .en-ham-btn{pointer-events:auto;cursor:pointer;background:none;border:none;width:36px;height:12px;position:relative;padding:0}
        .en-ham-btn .en-line{position:absolute;height:2px;background:#fff;border-radius:0;transition:width .4s cubic-bezier(.25,1,.5,1),left .4s cubic-bezier(.25,1,.5,1)}
        .en-line-top{width:18px;top:0;left:0}
        .en-line-mid{width:36px;top:5px;left:0}
        .en-line-bot{width:18px;top:10px;left:18px}
        .en-ham-btn:not(.is-open):hover .en-line-top{width:36px}
        .en-ham-btn:not(.is-open):hover .en-line-bot{width:36px;left:0}
        .en-ham-btn.is-open{width:24px;height:24px}
        .en-ham-btn.is-open .en-line{transition:none}
        .en-ham-btn.is-open .en-line-top{width:24px;top:11px;left:0;transform:rotate(45deg)}
        .en-ham-btn.is-open .en-line-mid{width:24px;top:11px;left:0;transform:rotate(-45deg)}
        .en-ham-btn.is-open .en-line-bot{opacity:0;width:0}

        /* ═══ BLUR BG ═══ */
        .en-blur-bg{position:fixed;top:0;left:0;right:0;bottom:0;z-index:998;background:rgba(0,0,0,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);opacity:0;pointer-events:none}
        .en-blur-bg.is-open{pointer-events:auto}

        /* ═══ OVERLAY ═══ */
        .en-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;display:flex;pointer-events:none;transform:translateX(100%);visibility:hidden}
        .en-overlay.is-open{pointer-events:auto;visibility:visible}
        .en-overlay-left{flex:0 0 calc(100% - 600px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:transparent}
        .en-overlay-logo-text{font-family:var(--font-display),sans-serif;font-size:64px;font-weight:800;letter-spacing:-1.92px;line-height:51.2px;color:#fff;text-transform:uppercase}
        .en-overlay-logo-c{font-family:var(--font-display),sans-serif;font-size:14px;font-weight:800;letter-spacing:0;line-height:1;color:#fff;margin-top:4px}
        .en-overlay-tagline{font-family:var(--font-body),sans-serif;font-size:17.5px;font-weight:600;letter-spacing:-.35px;line-height:26.25px;color:rgb(184,184,184)}

        /* ═══ RIGHT PANEL ═══ */
        .en-overlay-right{flex:0 0 600px;display:flex;flex-direction:column;justify-content:space-between;background:rgb(5,5,5);overflow-x:hidden;overflow-y:auto;scrollbar-width:none;border-left:1px solid rgb(54,54,54)}
        .en-overlay-right::-webkit-scrollbar{display:none}

        /* Section 1: Menu */
        .en-menu-top{padding:48px;display:flex;flex-direction:column;gap:12px;justify-content:center;flex:0 0 375px}
        .en-menu-label{font-family:var(--font-body),sans-serif;font-size:12px;font-weight:600;letter-spacing:-.24px;line-height:13.44px;color:rgb(184,184,184);margin:0}
        .en-menu-links{display:flex;flex-direction:column;gap:4px}
        .en-menu-link{display:flex;align-items:center;gap:6px;cursor:pointer;height:39px;overflow:hidden;text-decoration:none;color:inherit}
        .en-menu-link-wrap{display:flex;flex-direction:column;overflow:hidden;height:39px;position:relative}
        .en-menu-link-text{font-family:var(--font-body),sans-serif;font-size:30px;font-weight:600;letter-spacing:-1.2px;line-height:39px;color:#fff;white-space:nowrap;display:block;transition:transform .4s cubic-bezier(.25,1,.5,1),opacity .1s cubic-bezier(.25,1,.5,1);transform:perspective(1200px) translateY(0)}
        .en-menu-link-text.en-hover{position:absolute;top:0;left:0;opacity:0;transform:perspective(1200px) translateY(100%)}
        .en-menu-link:hover .en-menu-link-text:first-child{transform:perspective(1200px) translateY(-100%);opacity:0}
        .en-menu-link:hover .en-menu-link-text.en-hover{transform:perspective(1200px) translateY(0);opacity:1}
        .en-menu-badge{font-family:var(--font-body),sans-serif;font-size:14.5px;font-weight:500;letter-spacing:-.435px;color:rgb(184,184,184)}

        /* Divider */
        .en-divider{width:100%;height:1px;background:rgba(255,255,255,.1);flex-shrink:0}

        /* Section 2: Middle */
        .en-menu-middle{padding:48px;display:flex;flex-direction:column;gap:64px;justify-content:center;flex:0 0 327px}
        .en-menu-talk{display:flex;flex-direction:column;gap:6px}
        .en-menu-talk-content{display:flex;flex-direction:column;gap:24px}
        .en-menu-talk-link{display:flex;flex-direction:column;gap:6px;height:46px;overflow:visible;cursor:default;position:relative}
        .en-menu-talk-text-icon{display:flex;align-items:center;gap:8px;height:39px}
        .en-menu-talk-email{font-family:var(--font-body),sans-serif;font-size:30px;font-weight:600;letter-spacing:-1.2px;line-height:39px;color:#fff;cursor:pointer;display:inline-block;position:relative}
        .en-menu-talk-email::after{content:'';position:absolute;bottom:0;left:0;width:100%;height:1px;background:#fff;transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.25,1,.5,1)}
        .en-menu-talk-link:hover .en-menu-talk-email::after{transform:scaleX(1)}
        .en-menu-plus{width:14px;height:14px;position:relative;cursor:pointer;flex-shrink:0}
        .en-menu-plus-h{position:absolute;width:12px;height:2px;background:#fff;top:6px;left:1px}
        .en-menu-plus-v{position:absolute;width:2px;height:10px;background:#fff;top:2px;left:6px;transition:transform .3s cubic-bezier(.25,1,.5,1)}
        .en-menu-talk-link:hover .en-menu-plus-v{transform:rotate(90deg)}
        .en-menu-copied{font-family:var(--font-body),sans-serif;font-size:30px;font-weight:600;letter-spacing:-1.2px;line-height:39px;color:#fff;opacity:0;transition:opacity .3s ease}
        .en-menu-copied.visible{opacity:1}

        /* Popup */
        .en-popup{position:absolute;bottom:calc(100% + 8px);left:0;width:186px;background:rgb(22,22,22);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:0;opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .25s cubic-bezier(.25,1,.5,1),transform .25s cubic-bezier(.25,1,.5,1);z-index:10;overflow:hidden}
        .en-popup.is-open{opacity:1;transform:translateY(0);pointer-events:auto}
        .en-popup-header{padding:14px 16px 12px;border-bottom:1px solid rgba(255,255,255,.08)}
        .en-popup-brand{font-family:var(--font-display),sans-serif;font-size:13px;font-weight:800;letter-spacing:-.3px;color:#fff;line-height:1.2}
        .en-popup-sub{font-family:var(--font-body),sans-serif;font-size:11px;font-weight:500;color:rgb(140,140,140);margin-top:2px;line-height:1.3}
        .en-popup-actions{padding:6px 0}
        .en-popup-action{display:flex;align-items:center;gap:10px;padding:8px 16px;cursor:pointer;transition:background .15s ease;color:rgb(200,200,200);font-family:var(--font-body),sans-serif;font-size:12px;font-weight:500;letter-spacing:-.2px}
        .en-popup-action:hover{background:rgba(255,255,255,.06);color:#fff}
        .en-popup-action svg{width:14px;height:14px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.5}

        /* Location in menu */
        .en-menu-location{display:flex;align-items:center;gap:4px}
        .en-menu-location-text{font-family:var(--font-body),sans-serif;font-size:14.5px;font-weight:600;letter-spacing:-.435px;line-height:21.75px;color:rgb(184,184,184)}

        /* Socials */
        .en-menu-socials{display:flex;flex-direction:column;gap:18px}
        .en-social-icons{display:flex;gap:12px}
        .en-social-icon{width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:rgb(222,222,222);text-decoration:none;position:relative;overflow:hidden}
        .en-social-icon svg{width:18px;height:18px;fill:currentColor;transition:transform .4s cubic-bezier(.25,1,.5,1),opacity .1s cubic-bezier(.25,1,.5,1)}
        .en-social-icon .icon-normal{position:absolute;top:0;left:0;transform:translateY(0);opacity:1;display:block}
        .en-social-icon .icon-hover{position:absolute;top:0;left:0;transform:translateY(100%);opacity:0;display:block}
        .en-social-icon:hover .icon-normal{transform:translateY(-100%);opacity:0}
        .en-social-icon:hover .icon-hover{transform:translateY(0);opacity:1}

        /* Section 3: Footer */
        .en-menu-footer{padding:24px 48px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.08);flex:0 0 71px}
        .en-footer-links{display:flex;gap:24px;align-items:center}
        .en-footer-link-wrap{display:flex;align-items:center;gap:0}
        .en-footer-text-flip{display:flex;flex-direction:column;overflow:hidden;height:21.75px;position:relative}
        .en-menu-footer a{font-family:var(--font-body),sans-serif;font-size:14.5px;font-weight:600;letter-spacing:-.29px;line-height:21.75px;color:#fff;display:block;transition:transform .4s cubic-bezier(.25,1,.5,1),opacity .1s cubic-bezier(.25,1,.5,1);transform:perspective(1200px) translateY(0);white-space:nowrap;text-decoration:none}
        .en-menu-footer a.en-hover{position:absolute;top:0;left:0;opacity:0;transform:perspective(1200px) translateY(100%)}
        .en-footer-text-flip:hover a:first-child{opacity:0;transform:perspective(1200px) translateY(-100%)}
        .en-footer-text-flip:hover a.en-hover{opacity:1;transform:perspective(1200px) translateY(0)}
        .en-footer-arrow{width:14px;height:14px;flex-shrink:0;margin-left:2px}
        .en-footer-arrow svg{width:14px;height:14px;fill:none;stroke:#fff;stroke-width:1.5}
        .en-footer-right{display:flex;align-items:center;gap:32px}
        .en-footer-copyright{font-family:var(--font-body),sans-serif;font-size:12px;font-weight:400;letter-spacing:-.24px;line-height:14px;color:rgb(184,184,184);white-space:nowrap}

        /* ═══ LANGUAGE SWITCHER ═══ */
        .en-lang-desktop{position:relative;display:flex;align-items:center}
        .en-lang-trigger{display:flex;align-items:center;gap:2px;background:none;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;color:#fff;font-family:var(--font-body),sans-serif;font-size:14.5px;font-weight:600;letter-spacing:-.435px;line-height:21.75px;white-space:nowrap;transition:background .2s ease}
        .en-lang-trigger:hover{background:rgba(255,255,255,.08)}
        .en-lang-label{font-weight:600}
        .en-lang-paren{opacity:.6}
        .en-lang-code{font-weight:600}
        .en-lang-arrow{font-size:10px;opacity:.6;transition:transform .2s ease}
        .en-lang-arrow.is-open{transform:rotate(180deg)}
        .en-lang-dropdown{position:absolute;top:calc(100% + 6px);left:0;min-width:140px;background:rgb(12,12,12);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:4px;z-index:50;box-shadow:0 8px 24px rgba(0,0,0,.5)}
        .en-lang-option{display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;background:none;border:none;border-radius:5px;cursor:pointer;color:rgb(200,200,200);font-family:var(--font-body),sans-serif;font-size:13px;font-weight:500;letter-spacing:-.2px;text-align:left;transition:background .15s ease,color .15s ease}
        .en-lang-option:hover{background:rgba(255,255,255,.08);color:#fff}
        .en-lang-option.active{color:#fff;font-weight:600}
        .en-location{display:flex;align-items:center;gap:8px}
        .en-location-time{font-family:var(--font-body),sans-serif;font-size:14.5px;font-weight:600;letter-spacing:-.435px;line-height:21.75px;color:rgb(184,184,184);white-space:nowrap}
        .en-lang-mobile{display:flex;gap:8px;align-items:center}
        .en-lang-mobile-btn{background:none;border:1px solid rgba(255,255,255,.15);border-radius:6px;padding:4px 8px;cursor:pointer;font-size:18px;line-height:1;transition:background .15s ease,border-color .15s ease,opacity .15s ease}
        .en-lang-mobile-btn:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.3)}
        .en-lang-mobile-btn.active{border-color:rgba(255,255,255,.4);opacity:1}
        .en-lang-mobile-btn:not(.active){opacity:.45}

        /* ═══ NAV DARK MODE (over light backgrounds) ═══ */
        .en-topbar.nav-dark .en-logo-text,
        .en-topbar.nav-dark .en-logo-c,
        .en-topbar.nav-dark .en-work-text span{color:#000}
        .en-topbar.nav-dark .en-location-time,
        .en-topbar.nav-dark .en-work-count{color:rgba(0,0,0,.55)}
        .en-hamburger.nav-dark .en-line{background:#000}
        .en-topbar.nav-dark .en-lang-trigger{color:#000}
        .en-topbar.nav-dark .en-lang-trigger:hover{background:rgba(0,0,0,.05)}
        .en-topbar.nav-dark .en-lang-arrow{opacity:.4}

        /* Smooth transition between dark/light */
        .en-logo-text,.en-logo-c,.en-location-time,.en-work-count{transition:color .3s ease}
        .en-work-text span{transition:color .3s ease,transform .4s cubic-bezier(.25,1,.5,1),opacity .1s cubic-bezier(.25,1,.5,1)}
        .en-line{transition:background .3s ease,width .4s cubic-bezier(.25,1,.5,1),left .4s cubic-bezier(.25,1,.5,1)}

        /* ═══ DESKTOP 25% LARGER LOGO + HAMBURGER ═══ */
        @media(min-width:810px){
          .en-logo-text{font-size:31.25px;line-height:25px;letter-spacing:-.94px}
          .en-logo-c{font-size:7.8px}
          .en-ham-btn{width:56px;height:19px}
          .en-line-top{width:28px}
          .en-line-mid{width:56px;top:8px}
          .en-line-bot{width:28px;top:16px;left:28px}
          .en-ham-btn:not(.is-open):hover .en-line-top{width:56px}
          .en-ham-btn:not(.is-open):hover .en-line-bot{width:56px;left:0}
          .en-ham-btn.is-open{width:37px;height:37px}
          .en-ham-btn.is-open .en-line-top{width:37px;top:17px}
          .en-ham-btn.is-open .en-line-mid{width:37px;top:17px}
        }

        /* ═══ MOBILE ═══ */
        @media(max-width:809px){
          .en-topbar{padding:18px 24px}
          .en-col--center,.en-col--right{display:none}
          .en-hamburger{padding:18px 24px}
          .en-overlay-left{display:none}
          .en-overlay-right{flex:1;min-height:100vh;overflow-y:auto;overflow-x:hidden}
          .en-menu-top{padding:24px;flex:0 0 auto}
          .en-menu-middle{padding:24px;flex:0 0 auto}
          .en-menu-footer{padding:16px 24px;flex:0 0 auto}
          .en-menu-link-text{font-size:24px;letter-spacing:-.96px;line-height:31.2px}
          .en-menu-link{height:31.2px}
          .en-menu-link-wrap{height:31.2px}
          .en-menu-talk-email{font-size:24px;letter-spacing:-.96px;line-height:31.2px}
          .en-menu-copied{font-size:24px;letter-spacing:-.96px;line-height:31.2px}
          .en-menu-footer a{font-size:11.6px;letter-spacing:-.232px}
          .en-menu-badge{font-size:11.6px;letter-spacing:-.348px}
        }
      `}</style>

      {/* ═══ TOP BAR ═══ */}
      <nav ref={topbarRef} className={`en-topbar${navDark && !menuOpen ? ' nav-dark' : ''}`}>
        <div className="en-col en-col--left">
          <Link href={homeHref} className="en-logo" aria-label="Eteya home">
            <span className="en-logo-text"><span style={{marginRight:'0.04em'}}>E</span><span style={{marginRight:'0.02em'}}>T</span><span style={{marginRight:'0.02em'}}>E</span><span style={{marginRight:'-0.06em'}}>Y</span>A</span>
            <span className="en-logo-c">©</span>
          </Link>
        </div>
        <div className="en-col en-col--center" style={{ justifyContent: 'flex-start' }}>
          <LanguageSwitcher />
          <span className="en-location-time">{time}</span>
        </div>
        <div className="en-col en-col--right" style={{ justifyContent: 'flex-start' }}>
          <a
            href="#cases-section"
            className="en-work"
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById('cases-section')
              const navH = ( document.querySelector('.en-topbar') as HTMLElement | null)?.offsetHeight ?? 80
              if (el && window.__lenis) window.__lenis.scrollTo(el, { offset: navH + 15, duration: 1.2 })
            }}
          >
            <div className="en-work-text">
              <span>{t('ourCases')}</span>
              <span className="en-hover">{t('ourCases')}</span>
            </div>
            <span className="en-work-count">[5]</span>
          </a>
        </div>
      </nav>

      {/* ═══ HAMBURGER ═══ */}
      <div className={`en-hamburger${navDark && !menuOpen ? ' nav-dark' : ''}`}>
        <button
          className={`en-ham-btn${menuOpen ? ' is-open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="en-line en-line-top" />
          <span className="en-line en-line-mid" />
          <span className="en-line en-line-bot" />
        </button>
      </div>

      {/* ═══ BLUR BG ═══ */}
      <div
        ref={blurRef}
        className={`en-blur-bg${menuOpen ? ' is-open' : ''}`}
        onClick={handleBlurClick}
      />

      {/* ═══ OVERLAY ═══ */}
      <div ref={overlayRef} className={`en-overlay${menuOpen ? ' is-open' : ''}`}>
        {/* Left panel */}
        <div className="en-overlay-left">
          <div className="en-overlay-logo" ref={logoRef} style={{ display: 'flex', alignItems: 'flex-start', gap: '2px' }}>
            <span className="en-overlay-logo-text"><span style={{marginRight:'0.04em'}}>E</span><span style={{marginRight:'0.02em'}}>T</span><span style={{marginRight:'0.02em'}}>E</span><span style={{marginRight:'-0.06em'}}>Y</span>A</span>
            <span className="en-overlay-logo-c">©</span>
          </div>
          <p className="en-overlay-tagline" ref={taglineRef}>{t('tagline')}</p>
        </div>

        {/* Right panel */}
        <div className="en-overlay-right">
          {/* Section 1: Menu */}
          <div className="en-menu-top">
            <p className="en-menu-label" ref={menuLabelRef}>{t('menuLabel')}</p>
            <div className="en-menu-links">
              {NAV_LINKS.map((link, i) => (
                <HashLink
                  key={link.label}
                  href={link.href}
                  className="en-menu-link"
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  <div className="en-menu-link-wrap">
                    <span className="en-menu-link-text">{link.label}</span>
                    <span className="en-menu-link-text en-hover">{link.label}</span>
                  </div>
                  {link.badge && <span className="en-menu-badge">{link.badge}</span>}
                </HashLink>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="en-divider" />

          {/* Section 2: Middle */}
          <div className="en-menu-middle">
            <div className="en-menu-talk" ref={talkRef}>
              <p className="en-menu-label">{t('contactUs')}</p>
              <div className="en-menu-talk-content">
                <div
                  className="en-menu-talk-link"
                  onMouseEnter={openPopup}
                  onMouseLeave={closePopup}
                >
                  {/* Popup */}
                  <div
                    className={`en-popup${popupOpen ? ' is-open' : ''}`}
                    onMouseEnter={openPopup}
                    onMouseLeave={closePopup}
                  >
                    <div className="en-popup-header">
                      <div className="en-popup-brand" style={{position:'relative'}}><span style={{marginRight:'0.04em'}}>E</span><span style={{marginRight:'0.02em'}}>T</span><span style={{marginRight:'0.02em'}}>E</span><span style={{marginRight:'-0.06em'}}>Y</span>A<span style={{fontSize:'5px',position:'absolute',top:'1px',marginLeft:'1px'}}>©</span></div>
                      <div className="en-popup-sub">{t('popup.sub')}</div>
                    </div>
                    <div className="en-popup-actions">
                      <div className="en-popup-action" onClick={handleCopy}>
                        <svg viewBox="0 0 16 16"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M5 11H3.5A1.5 1.5 0 012 9.5v-6A1.5 1.5 0 013.5 2h6A1.5 1.5 0 0111 3.5V5"/></svg>
                        {t('popup.copyEmail')}
                      </div>
                      <div className="en-popup-action" onClick={handleMail}>
                        <svg viewBox="0 0 16 16"><rect x="1.5" y="3" width="13" height="10" rx="1.5"/><path d="M1.5 5l6.5 4 6.5-4"/></svg>
                        {t('popup.openMail')}
                      </div>
                      <div className="en-popup-action" onClick={handleBook}>
                        <svg viewBox="0 0 16 16"><rect x="2" y="2.5" width="12" height="11.5" rx="1.5"/><path d="M2 6h12M5.5 2.5V1M10.5 2.5V1"/></svg>
                        {t('popup.bookCall')}
                      </div>
                    </div>
                  </div>

                  <div className="en-menu-talk-text-icon">
                    <span className="en-menu-talk-email">{t('email')}</span>
                    <div className="en-menu-plus">
                      <div className="en-menu-plus-h" />
                      <div className="en-menu-plus-v" />
                    </div>
                  </div>
                  <span className={`en-menu-copied${copied ? ' visible' : ''}`}>{t('popup.copied')}</span>
                </div>

                <div className="en-menu-location">
                  <span className="en-menu-location-text">{t('location')}</span>
                  <span className="en-menu-location-text">{time}</span>
                </div>
              </div>
            </div>

            <div className="en-menu-socials" ref={socialsRef}>
              <p className="en-menu-label">{t('socialMedia')}</p>
              <div className="en-social-icons">
                {SOCIALS.map((s, i) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="en-social-icon"
                    aria-label={s.label}
                    ref={el => { socialIconRefs.current[i] = el }}
                  >
                    <svg className="icon-normal" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                    <svg className="icon-hover" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Footer */}
          <div className="en-menu-footer" ref={footerRef}>
            <div className="en-footer-links">
              <div className="en-footer-link-wrap">
                <div className="en-footer-text-flip">
                  <a href={t('footer.privacyHref')}>{t('footer.privacy')}</a>
                  <a href={t('footer.privacyHref')} className="en-hover">{t('footer.privacy')}</a>
                </div>
                <div className="en-footer-arrow">
                  <svg viewBox="0 0 14 14"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" /></svg>
                </div>
              </div>
              <div className="en-footer-link-wrap">
                <div className="en-footer-text-flip">
                  <a href={t('footer.termsHref')}>{t('footer.terms')}</a>
                  <a href={t('footer.termsHref')} className="en-hover">{t('footer.terms')}</a>
                </div>
                <div className="en-footer-arrow">
                  <svg viewBox="0 0 14 14"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" /></svg>
                </div>
              </div>
            </div>
            <div className="en-footer-right">
              <LanguageSwitcher inMobileMenu />
              <span className="en-footer-copyright">{t('footer.copyright')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}