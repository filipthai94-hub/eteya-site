'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'

/* ── Data ─────────────────────────────────────────────── */

interface DropdownCard {
  title: string
  desc: string
  icon: React.ReactNode
}

interface NavItem {
  label: string
  key: string
  cards: DropdownCard[]
}

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" dangerouslySetInnerHTML={{ __html: d }} />
)

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Arbete', key: 'a', cards: [
      { title: 'Telestore', desc: 'E-handel · AI Automation', icon: icon('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>') },
      { title: 'AICaller', desc: 'AI Voice Agent · Restaurant Tech', icon: icon('<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07"/><path d="M2 2l20 20"/>') },
      { title: 'ReturnAI', desc: 'AI Platform · E-handel', icon: icon('<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>') },
      { title: 'Partner Portal', desc: 'Custom Build · B2B', icon: icon('<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>') },
    ]
  },
  {
    label: 'Tjänster', key: 't', cards: [
      { title: 'AI Agents', desc: 'Autonoma agenter som jobbar åt dig', icon: icon('<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>') },
      { title: 'Processautomation', desc: 'Eliminera manuellt repetitivt arbete', icon: icon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>') },
      { title: 'Custom Builds', desc: 'Skräddarsydda lösningar från grunden', icon: icon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>') },
    ]
  },
  {
    label: 'Om oss', key: 'o', cards: [
      { title: 'Vår story', desc: 'Hur Eteya startade och vart vi är på väg', icon: icon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>') },
      { title: 'Filip Thai', desc: 'Grundare & CEO', icon: icon('<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>') },
      { title: 'Värderingar', desc: 'Hur vi arbetar och vad vi tror på', icon: icon('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>') },
    ]
  },
  {
    label: 'Kontakt', key: 'k', cards: [
      { title: 'Boka samtal', desc: '30 min — helt gratis', icon: icon('<rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/>') },
      { title: 'Skicka meddelande', desc: 'Svar inom 24h', icon: icon('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>') },
      { title: 'LinkedIn', desc: 'Följ Eteya', icon: icon('<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>') },
    ]
  },
]

/* ── Caret SVG ────────────────────────────────────────── */
const CaretSvg = () => (
  <svg className="nav-caret" viewBox="0 0 11 11" fill="none" style={{ width: 11, height: 11, opacity: 0.4, flexShrink: 0, transition: 'transform .35s cubic-bezier(.165,.84,.44,1), opacity .2s' }}>
    <path d="M1.5 3.5L5.5 7.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Component ────────────────────────────────────────── */
export default function Nav() {
  const pathname = usePathname()
  const navWrapperRef = useRef<HTMLDivElement>(null)
  const lastYRef = useRef(0)
  const [hidden, setHidden] = useState(false)
  const [openDesktop, setOpenDesktop] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMobileItems, setOpenMobileItems] = useState<Set<string>>(new Set())
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const mobileSubRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const isEn = pathname.startsWith('/en')
  const locale = isEn ? 'en' : 'sv'

  /* ── Scroll hide/show ───────────────────────────────── */
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY
          if (y > 100) {
            if (y > lastYRef.current + 4) {
              setHidden(true)
              setOpenDesktop(null)
            } else if (y < lastYRef.current - 4) {
              setHidden(false)
            }
          } else {
            setHidden(false)
          }
          lastYRef.current = y
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Lock body on mobile open ───────────────────────── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* ── Desktop dropdown open/close ────────────────────── */
  const openDrop = useCallback((key: string) => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null }
    setOpenDesktop(key)
    // Animate dropdown height + card stagger
    requestAnimationFrame(() => {
      const pane = dropdownRefs.current[key]
      if (!pane) return
      const cards = pane.querySelectorAll<HTMLElement>('.nav-dc')
      pane.style.height = 'auto'
      const h = pane.scrollHeight
      pane.style.height = '0px'
      // force reflow
      void pane.offsetHeight
      pane.style.height = h + 'px'
      cards.forEach((c, i) => {
        c.style.transition = 'none'
        c.style.opacity = '0'
        c.style.transform = 'translateY(8px)'
        setTimeout(() => {
          c.style.transition = `opacity .25s ease ${i * 45}ms, transform .3s cubic-bezier(.165,.84,.44,1) ${i * 45}ms`
          c.style.opacity = '1'
          c.style.transform = 'translateY(0)'
        }, 10)
      })
    })
  }, [])

  const closeDrop = useCallback((key: string) => {
    const pane = dropdownRefs.current[key]
    if (pane) {
      pane.style.height = '0px'
      pane.querySelectorAll<HTMLElement>('.nav-dc').forEach(c => { c.style.opacity = '0' })
    }
    setOpenDesktop(prev => prev === key ? null : prev)
  }, [])

  const scheduleClose = useCallback((key: string) => {
    closeTimerRef.current = setTimeout(() => closeDrop(key), 100)
  }, [closeDrop])

  /* ── Mobile sub-expand ──────────────────────────────── */
  const toggleMobileItem = useCallback((key: string) => {
    setOpenMobileItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
        // collapse
        const sub = mobileSubRefs.current[key]
        if (sub) {
          sub.style.height = '0px'
          sub.querySelectorAll<HTMLElement>('.nav-msl').forEach(l => { l.style.opacity = '0' })
        }
      } else {
        next.add(key)
        // expand
        requestAnimationFrame(() => {
          const sub = mobileSubRefs.current[key]
          if (!sub) return
          sub.style.height = 'auto'
          const h = sub.scrollHeight
          sub.style.height = '0px'
          void sub.offsetHeight
          sub.style.height = h + 'px'
          const links = sub.querySelectorAll<HTMLElement>('.nav-msl')
          links.forEach((l, i) => {
            l.style.transition = 'none'
            l.style.opacity = '0'
            l.style.transform = 'translateY(6px)'
            setTimeout(() => {
              l.style.transition = `opacity .25s ease ${i * 50}ms, transform .3s cubic-bezier(.165,.84,.44,1) ${i * 50}ms`
              l.style.opacity = '1'
              l.style.transform = 'translateY(0)'
            }, 10)
          })
        })
      }
      return next
    })
  }, [])

  /* ── Close mobile ───────────────────────────────────── */
  const closeMobile = useCallback(() => {
    setMobileOpen(false)
    setOpenMobileItems(new Set())
  }, [])

  /* ── Close desktop on outside click ─────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.nav-ni')) {
        setOpenDesktop(prev => {
          if (prev) closeDrop(prev)
          return null
        })
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [closeDrop])

  return (
    <>
      {/* ── NAV WRAPPER ─────────────────────────────────── */}
      <div
        ref={navWrapperRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transform: hidden ? 'translateY(-105%)' : 'translateY(0)',
          transition: 'transform .45s cubic-bezier(.165,.84,.44,1)',
          pointerEvents: hidden ? 'none' : 'auto',
        }}
      >
        <header style={{
          background: '#000',
          height: 80,
          padding: '0 40px',
          position: 'relative',
          boxShadow: '0 1px 0 rgba(255,255,255,.05), 0 4px 24px rgba(0,0,0,.5)',
        }}>
          <div className="nav-inner" style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            height: '100%',
          }}>
            {/* ── Logo ──────────────────────────────────── */}
            <Link href={`/${locale}`} style={{
              fontFamily: 'var(--font-display), "Barlow Condensed", sans-serif',
              fontSize: '1.5rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: '#fff',
              textDecoration: 'none',
            }}>
              Eteya
            </Link>

            {/* ── Desktop Menu ──────────────────────────── */}
            <nav className="nav-dmenu" style={{ display: 'flex', alignItems: 'center' }}>
              <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                {NAV_ITEMS.map(item => {
                  const isOpen = openDesktop === item.key
                  return (
                    <li
                      key={item.key}
                      className="nav-ni"
                      style={{ position: 'relative' }}
                      onMouseEnter={() => openDrop(item.key)}
                      onMouseLeave={() => scheduleClose(item.key)}
                    >
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '0 14px',
                        height: 80,
                        fontFamily: 'var(--font-body), "Geist", sans-serif',
                        fontSize: 15,
                        fontWeight: 400,
                        color: isOpen ? '#fff' : 'rgba(255,255,255,.65)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'color .2s',
                        letterSpacing: '-0.01em',
                      }}>
                        {item.label}
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          style={{
                            width: 11,
                            height: 11,
                            opacity: isOpen ? 0.9 : 0.4,
                            flexShrink: 0,
                            transition: 'transform .35s cubic-bezier(.165,.84,.44,1), opacity .2s',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        >
                          <path d="M1.5 3.5L5.5 7.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {/* ── Dropdown Pane ────────────────── */}
                      <div
                        ref={el => { dropdownRefs.current[item.key] = el }}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 2px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 300,
                          overflow: 'hidden',
                          height: 0,
                          transition: 'height .42s cubic-bezier(.625,.05,0,1)',
                        }}
                      >
                        <div style={{
                          padding: 8,
                          background: '#000',
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 4,
                        }}>
                          {item.cards.map(card => (
                            <DesktopCard key={card.title} card={card} />
                          ))}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* ── CTA Area ──────────────────────────────── */}
            <div className="nav-cta" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocaleBtn label="SV" active={!isEn} />
                <span style={{ color: 'rgba(255,255,255,.1)', fontSize: 10 }}>/</span>
                <LocaleBtn label="EN" active={isEn} />
              </div>
              <Button variant="primary" href="#" size="sm">
                Boka samtal
              </Button>
            </div>

            {/* ── Hamburger ─────────────────────────────── */}
            <button
              className="nav-ham"
              onClick={() => { mobileOpen ? closeMobile() : setMobileOpen(true) }}
              style={{
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                width: 32,
                height: 32,
                padding: 0,
                flexShrink: 0,
              }}
            >
              <span style={{
                display: 'block',
                height: 1.5,
                background: '#fff',
                transition: 'transform .25s cubic-bezier(.645,.045,.355,1), opacity .2s, width .25s cubic-bezier(.645,.045,.355,1)',
                width: mobileOpen ? 22 : 22,
                transform: mobileOpen ? 'translateY(7.5px) rotate(45deg)' : 'none',
              }} />
              <span style={{
                display: 'block',
                height: 1.5,
                background: '#fff',
                transition: 'transform .25s cubic-bezier(.645,.045,.355,1), opacity .2s, width .25s cubic-bezier(.645,.045,.355,1)',
                width: mobileOpen ? 0 : 16,
                opacity: mobileOpen ? 0 : 1,
              }} />
              <span style={{
                display: 'block',
                height: 1.5,
                background: '#fff',
                transition: 'transform .25s cubic-bezier(.645,.045,.355,1), opacity .2s, width .25s cubic-bezier(.645,.045,.355,1)',
                width: mobileOpen ? 22 : 22,
                transform: mobileOpen ? 'translateY(-7.5px) rotate(-45deg)' : 'none',
              }} />
            </button>
          </div>
        </header>
      </div>

      {/* ── Mobile Overlay ────────────────────────────────── */}
      <div
        onClick={closeMobile}
        style={{
          display: mobileOpen ? 'block' : 'none',
          position: 'fixed',
          inset: 0,
          background: 'rgba(22,22,22,.15)',
          zIndex: 997,
          opacity: mobileOpen ? 1 : 0,
          transition: 'opacity .7s cubic-bezier(.5,.5,0,1)',
        }}
      />

      {/* ── Mobile Menu ───────────────────────────────────── */}
      <div
        className="nav-mmenu"
        style={{
          position: 'fixed',
          top: 80,
          left: 0,
          right: 0,
          background: '#000',
          zIndex: 998,
          display: 'grid',
          gridTemplateRows: mobileOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows .6s cubic-bezier(.625,.05,0,1)',
        }}
      >
        <div style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: 'calc(100svh - 80px)' }}>
          {NAV_ITEMS.map(item => {
            const isItemOpen = openMobileItems.has(item.key)
            return (
              <div key={item.key} style={{ borderBottom: '1px solid rgb(51,51,51)' }}>
                <button
                  onClick={() => toggleMobileItem(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0 24px',
                    height: 75,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body), "Geist", sans-serif',
                    fontSize: 20,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,.85)',
                    textAlign: 'left',
                    transition: 'color .2s',
                  }}
                >
                  {item.label}
                  <div style={{ width: 12, height: 12, position: 'relative', flexShrink: 0 }}>
                    {/* horizontal bar */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      width: 12,
                      height: 1,
                      marginTop: -0.5,
                      background: 'rgba(255,255,255,.4)',
                      transition: 'opacity .35s',
                      opacity: isItemOpen ? 0 : 1,
                    }} />
                    {/* vertical bar */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      width: 1,
                      height: 12,
                      marginLeft: -0.5,
                      background: 'rgba(255,255,255,.4)',
                      transition: 'transform .4s cubic-bezier(.165,.84,.44,1)',
                      transform: isItemOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    }} />
                  </div>
                </button>
                <div
                  ref={el => { mobileSubRefs.current[item.key] = el }}
                  style={{
                    overflow: 'hidden',
                    height: 0,
                    transition: 'height .4s cubic-bezier(.625,.05,0,1)',
                  }}
                >
                  <div style={{ padding: '4px 16px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {item.cards.map(card => (
                      <MobileCard key={card.title} card={card} />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}

          {/* ── Mobile CTA ──────────────────────────────── */}
          <div style={{ padding: '20px 24px 40px' }}>
            <Button variant="primary" href="#" style={{ width: '100%' }}>
              Boka samtal
            </Button>
          </div>
        </div>
      </div>

      {/* ── Responsive CSS ────────────────────────────────── */}
      <style jsx global>{`
        .nav-dmenu, .nav-cta {
          display: flex !important;
        }
        .nav-ham {
          display: none !important;
        }
        .nav-mmenu {
          display: none !important;
        }
        @media (max-width: 900px) {
          .nav-dmenu, .nav-cta {
            display: none !important;
          }
          .nav-ham {
            display: flex !important;
          }
          .nav-mmenu {
            display: grid !important;
          }
          .nav-inner {
            grid-template-columns: 1fr auto !important;
          }
          header {
            padding: 0 20px !important;
          }
        }
      `}</style>
    </>
  )
}

/* ── Desktop Dropdown Card ────────────────────────────── */
function DesktopCard({ card }: { card: DropdownCard }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#"
      className="nav-dc"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        background: '#121212',
        border: `1px dashed ${hovered ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,0)'}`,
        borderRadius: 0,
        textDecoration: 'none',
        width: 210,
        transition: 'border-color .2s',
        opacity: 0,
        transform: 'translateY(8px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.4)' }}>
          <div style={{ width: 20, height: 20 }}>{card.icon}</div>
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#fff', lineHeight: 1.2 }}>{card.title}</span>
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.5, margin: 0 }}>{card.desc}</p>
    </a>
  )
}

/* ── Mobile Sub-Card ──────────────────────────────────── */
function MobileCard({ card }: { card: DropdownCard }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#"
      className="nav-msl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        textDecoration: 'none',
        background: 'rgb(18,18,18)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,.1)' : 'transparent'}`,
        transition: 'border-color .2s',
        opacity: 0,
        transform: 'translateY(6px)',
      }}
    >
      <div style={{ width: 18, height: 18, flexShrink: 0, color: 'rgba(255,255,255,.35)' }}>
        {card.icon}
      </div>
      <div>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#fff', display: 'block' }}>{card.title}</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', display: 'block', marginTop: 1 }}>{card.desc}</span>
      </div>
    </a>
  )
}

/* ── Locale Button ────────────────────────────────────── */
function LocaleBtn({ label, active }: { label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 11,
        color: active || hovered ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.25)',
        textDecoration: 'none',
        padding: '2px 4px',
        cursor: 'pointer',
        transition: 'color .2s',
      }}
    >
      {label}
    </a>
  )
}

