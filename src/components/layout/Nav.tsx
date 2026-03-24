'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/* ─── Data ──────────────────────────────────────────── */
interface DropdownCard { title: string; desc: string; iconPath: string }
interface NavItem { label: string; key: string; cards: DropdownCard[] }

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Arbete', key: 'a', cards: [
      { title: 'Telestore', desc: 'E-handel · AI Automation', iconPath: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>' },
      { title: 'AICaller', desc: 'AI Voice Agent · Restaurant Tech', iconPath: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07"/><path d="M5.07 5.07a16 16 0 0013.86 13.86"/>' },
      { title: 'ReturnAI', desc: 'AI Platform · E-handel', iconPath: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>' },
      { title: 'Partner Portal', desc: 'Custom Build · B2B', iconPath: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>' },
    ]
  },
  {
    label: 'Tjänster', key: 't', cards: [
      { title: 'AI Agents', desc: 'Autonoma agenter som jobbar åt dig', iconPath: '<circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>' },
      { title: 'Processautomation', desc: 'Eliminera manuellt repetitivt arbete', iconPath: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
      { title: 'Custom Builds', desc: 'Skräddarsydda lösningar från grunden', iconPath: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
    ]
  },
  {
    label: 'Om oss', key: 'o', cards: [
      { title: 'Vår story', desc: 'Hur Eteya startade och vart vi är på väg', iconPath: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
      { title: 'Filip Thai', desc: 'Grundare & CEO', iconPath: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
      { title: 'Värderingar', desc: 'Hur vi arbetar och vad vi tror på', iconPath: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
    ]
  },
  {
    label: 'Kontakt', key: 'k', cards: [
      { title: 'Boka samtal', desc: '30 min — helt gratis', iconPath: '<rect x="3" y="4" width="18" height="18" rx="1"/><path d="M16 2v4M8 2v4M3 10h18"/>' },
      { title: 'Skicka meddelande', desc: 'Svar inom 24h', iconPath: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
      { title: 'LinkedIn', desc: 'Följ Eteya', iconPath: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>' },
    ]
  },
]

/* ─── Component ─────────────────────────────────────── */
export default function Nav() {
  const pathname = usePathname()
  const lastYRef = useRef(0)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [hidden, setHidden] = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMobKeys, setOpenMobKeys] = useState<Set<string>>(new Set())
  const mobileSubRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const isEn = pathname?.startsWith('/en') ?? false
  const locale = isEn ? 'en' : 'sv'

  /* scroll hide/show */
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (y > 100) {
          if (y > lastYRef.current + 4) { setHidden(true); setOpenKey(null) }
          else if (y < lastYRef.current - 4) setHidden(false)
        } else setHidden(false)
        lastYRef.current = y
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* lock body when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* desktop dropdown */
  const handleEnter = useCallback((key: string) => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null }
    setOpenKey(key)
  }, [])

  const handleLeave = useCallback((key: string) => {
    closeTimerRef.current = setTimeout(() => {
      setOpenKey(prev => prev === key ? null : prev)
    }, 120)
  }, [])

  /* mobile sub-expand */
  const toggleMob = useCallback((key: string) => {
    setOpenMobKeys(prev => {
      const next = new Set(prev)
      const wasOpen = next.has(key)
      if (wasOpen) {
        next.delete(key)
        const sub = mobileSubRefs.current[key]
        if (sub) sub.style.maxHeight = '0px'
      } else {
        next.add(key)
        requestAnimationFrame(() => {
          const sub = mobileSubRefs.current[key]
          if (sub) sub.style.maxHeight = sub.scrollHeight + 'px'
        })
      }
      return next
    })
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
    setOpenMobKeys(new Set())
    Object.values(mobileSubRefs.current).forEach(sub => { if (sub) sub.style.maxHeight = '0px' })
  }, [])

  return (
    <>
      <style>{`
        .nav-wrap { position:fixed;top:0;left:0;right:0;z-index:1000; }
        .nav-header { background:#000;height:80px;padding:0 40px;box-shadow:0 1px 0 rgba(255,255,255,.05),0 4px 24px rgba(0,0,0,.5); }
        .nav-grid { display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:100%; }
        .nav-brand { font-family:var(--font-display),"Barlow Condensed",sans-serif;font-size:1.5rem;font-weight:800;text-transform:uppercase;letter-spacing:-.02em;color:#fff;text-decoration:none; }
        .nav-dmenu { display:flex;align-items:center; }
        .nav-ul { display:flex;list-style:none;margin:0;padding:0; }
        .nav-item { position:relative; }
        .nav-btn { display:flex;align-items:center;gap:5px;padding:0 14px;height:80px;font-family:var(--font-body),"Geist",sans-serif;font-size:15px;font-weight:400;color:rgba(255,255,255,.65);background:none;border:none;cursor:pointer;white-space:nowrap;transition:color .2s;letter-spacing:-.01em;text-transform:uppercase; }
        .nav-btn:hover,.nav-item.is-open .nav-btn { color:#fff; }
        .nav-caret { width:11px;height:11px;opacity:.4;flex-shrink:0;transition:transform .35s cubic-bezier(.165,.84,.44,1),opacity .2s; }
        .nav-item.is-open .nav-caret { transform:rotate(180deg)!important;opacity:.9!important; }

        /* DROPDOWN — CSS only, no ref manipulation */
        .nav-drop { position:absolute;top:100%;left:50%;transform:translateX(-50%);z-index:300;overflow:hidden;pointer-events:none;opacity:0;visibility:hidden;transition:opacity .3s ease, visibility .3s ease; }
        .nav-item.is-open .nav-drop { pointer-events:auto;opacity:1;visibility:visible; }
        .nav-drop-inner { padding:8px;background:#000;display:flex;flex-direction:row;gap:4px;margin-top:2px; }

        /* Cards — stagger via CSS delay */
        .nav-dc { display:flex;flex-direction:column;gap:10px;padding:16px;background:#121212;border:1px dashed rgba(255,255,255,0);border-radius:0;text-decoration:none;width:210px;transition:border-color .2s, opacity .25s ease, transform .3s cubic-bezier(.165,.84,.44,1);opacity:0;transform:translateY(8px); }
        .nav-item.is-open .nav-dc { opacity:1;transform:translateY(0); }
        .nav-item.is-open .nav-dc:nth-child(1) { transition-delay:0ms; }
        .nav-item.is-open .nav-dc:nth-child(2) { transition-delay:45ms; }
        .nav-item.is-open .nav-dc:nth-child(3) { transition-delay:90ms; }
        .nav-item.is-open .nav-dc:nth-child(4) { transition-delay:135ms; }
        .nav-dc:hover { border-color:rgba(255,255,255,.15); }
        .nav-dc-head { display:flex;align-items:center;gap:10px; }
        .nav-dc-icon { width:28px;height:28px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.4); }
        .nav-dc-title { font-size:15px;font-weight:500;color:#fff;line-height:1.2; }
        .nav-dc-desc { font-size:13px;color:rgba(255,255,255,.4);line-height:1.5;margin:0; }

        /* CTA area */
        .nav-cta { display:flex;justify-content:flex-end;align-items:center;gap:10px; }
        .nav-locale { display:flex;align-items:center;gap:2px; }
        .nav-loc-btn { font-size:11px;color:rgba(255,255,255,.25);text-decoration:none;padding:2px 4px;cursor:pointer;transition:color .2s; }
        .nav-loc-btn:hover,.nav-loc-btn.active { color:rgba(255,255,255,.75); }
        .nav-loc-sep { color:rgba(255,255,255,.1);font-size:10px; }
        .nav-cta-btn { display:inline-flex;align-items:center;background:#C8FF00;color:#121213;border:1px solid #C8FF00;border-radius:0;padding:0 22px;height:44px;font-family:var(--font-body),"Geist",sans-serif;font-size:13px;font-weight:400;text-decoration:none;cursor:pointer;white-space:nowrap;transition:background .25s,border-color .25s,transform .4s cubic-bezier(.165,.84,.44,1); }
        .nav-cta-btn:hover { background:#b8ef00;border-color:#b8ef00;transform:translateY(-.25rem); }

        /* Hamburger */
        .nav-ham { display:none;flex-direction:column;justify-content:center;gap:6px;cursor:pointer;background:none;border:none;width:32px;height:32px;padding:0;flex-shrink:0; }
        .nav-ham span { display:block;height:1.5px;background:#fff;transition:transform .25s cubic-bezier(.645,.045,.355,1),opacity .2s,width .25s; }

        /* Mobile overlay */
        .nav-mover { display:none;position:fixed;inset:0;background:rgba(22,22,22,.15);z-index:997;transition:opacity .7s cubic-bezier(.5,.5,0,1); }
        .nav-mover.show { display:block; }

        /* Mobile menu */
        .nav-mmenu { position:fixed;top:80px;left:0;right:0;background:#000;z-index:998;display:grid;grid-template-rows:0fr;transition:grid-template-rows .6s cubic-bezier(.625,.05,0,1); }
        .nav-mmenu.open { grid-template-rows:1fr; }
        .nav-minner { overflow:hidden;overflow-y:auto;max-height:calc(100svh - 80px); }
        .nav-mitem { border-bottom:1px solid rgb(51,51,51); }
        .nav-mtog { display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 24px;height:75px;background:none;border:none;cursor:pointer;font-family:var(--font-body),"Geist",sans-serif;font-size:20px;font-weight:500;color:rgba(255,255,255,.85);text-align:left;transition:color .2s; }
        .nav-mtog:hover { color:#fff; }
        .nav-mplus { width:12px;height:12px;position:relative;flex-shrink:0; }
        .nav-mph { position:absolute;top:50%;left:0;width:12px;height:1px;margin-top:-.5px;background:rgba(255,255,255,.4);transition:opacity .35s; }
        .nav-mpv { position:absolute;left:50%;top:0;width:1px;height:12px;margin-left:-.5px;background:rgba(255,255,255,.4);transition:transform .4s cubic-bezier(.165,.84,.44,1); }
        .nav-mitem.open .nav-mpv { transform:rotate(90deg); }
        .nav-mitem.open .nav-mph { opacity:0; }
        .nav-msub { overflow:hidden;max-height:0;transition:max-height .4s cubic-bezier(.625,.05,0,1); }
        .nav-msubinn { padding:4px 16px 12px;display:flex;flex-direction:column;gap:3px; }
        .nav-msl { display:flex;align-items:center;gap:12px;padding:12px 14px;text-decoration:none;background:rgb(18,18,18);border:1px solid transparent;transition:border-color .2s; }
        .nav-msl:hover { border-color:rgba(255,255,255,.1); }
        .nav-msico { width:18px;height:18px;flex-shrink:0;color:rgba(255,255,255,.35); }
        .nav-mstt { font-size:15px;font-weight:500;color:#fff;display:block; }
        .nav-msdsc { font-size:12px;color:rgba(255,255,255,.35);display:block;margin-top:1px; }
        .nav-mctaw { padding:20px 24px 40px; }
        .nav-mbtn { display:flex;align-items:center;justify-content:center;background:#C8FF00;color:#121213;border:1px solid #C8FF00;border-radius:0;padding:1rem;font-family:var(--font-body),"Geist",sans-serif;font-size:14px;text-decoration:none;cursor:pointer;width:100%;transition:background .2s; }
        .nav-mbtn:hover { background:#b8ef00; }

        @media(max-width:900px){
          .nav-dmenu,.nav-cta { display:none!important; }
          .nav-ham { display:flex!important; }
          .nav-mmenu { display:grid!important; }
          .nav-grid { grid-template-columns:1fr auto!important; }
          .nav-header { padding:0 20px!important; }
        }
      `}</style>

      {/* NAV */}
      <div
        className="nav-wrap"
        style={{
          transform: hidden ? 'translateY(-105%)' : 'translateY(0)',
          transition: 'transform .45s cubic-bezier(.165,.84,.44,1)',
          pointerEvents: hidden ? 'none' : 'auto',
        }}
      >
        <header className="nav-header">
          <div className="nav-grid">
            <Link href={`/${locale}`} className="nav-brand">Eteya</Link>

            {/* Desktop menu */}
            <nav className="nav-dmenu">
              <ul className="nav-ul">
                {NAV_ITEMS.map(item => (
                  <li
                    key={item.key}
                    className={`nav-item${openKey === item.key ? ' is-open' : ''}`}
                    onMouseEnter={() => handleEnter(item.key)}
                    onMouseLeave={() => handleLeave(item.key)}
                  >
                    <button className="nav-btn">
                      {item.label}
                      <svg className="nav-caret" viewBox="0 0 11 11" fill="none">
                        <path d="M1.5 3.5L5.5 7.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <div className="nav-drop">
                      <div className="nav-drop-inner">
                        {item.cards.map(card => (
                          <a key={card.title} href="#" className="nav-dc">
                            <div className="nav-dc-head">
                              <div className="nav-dc-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20" dangerouslySetInnerHTML={{ __html: card.iconPath }} />
                              </div>
                              <span className="nav-dc-title">{card.title}</span>
                            </div>
                            <p className="nav-dc-desc">{card.desc}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA */}
            <div className="nav-cta">
              <div className="nav-locale">
                <a href="#" className={`nav-loc-btn${!isEn ? ' active' : ''}`}>SV</a>
                <span className="nav-loc-sep">/</span>
                <a href="#" className={`nav-loc-btn${isEn ? ' active' : ''}`}>EN</a>
              </div>
              <a href="#" className="nav-cta-btn">Boka samtal</a>
            </div>

            {/* Hamburger */}
            <button className="nav-ham" onClick={() => mobileOpen ? closeMobile() : setMobileOpen(true)}>
              <span style={{ width: 22, transform: mobileOpen ? 'translateY(7.5px) rotate(45deg)' : 'none' }} />
              <span style={{ width: mobileOpen ? 0 : 16, opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ width: 22, transform: mobileOpen ? 'translateY(-7.5px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </header>
      </div>

      {/* Mobile overlay */}
      <div className={`nav-mover${mobileOpen ? ' show' : ''}`} onClick={closeMobile} style={{ opacity: mobileOpen ? 1 : 0 }} />

      {/* Mobile menu */}
      <div className={`nav-mmenu${mobileOpen ? ' open' : ''}`}>
        <div className="nav-minner">
          {NAV_ITEMS.map(item => {
            const isItemOpen = openMobKeys.has(item.key)
            return (
              <div key={item.key} className={`nav-mitem${isItemOpen ? ' open' : ''}`}>
                <button className="nav-mtog" onClick={() => toggleMob(item.key)}>
                  {item.label}
                  <div className="nav-mplus">
                    <div className="nav-mph" />
                    <div className="nav-mpv" />
                  </div>
                </button>
                <div
                  ref={el => { mobileSubRefs.current[item.key] = el }}
                  className="nav-msub"
                >
                  <div className="nav-msubinn">
                    {item.cards.map(card => (
                      <a key={card.title} href="#" className="nav-msl">
                        <div className="nav-msico">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18" dangerouslySetInnerHTML={{ __html: card.iconPath }} />
                        </div>
                        <div>
                          <span className="nav-mstt">{card.title}</span>
                          <span className="nav-msdsc">{card.desc}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
          <div className="nav-mctaw">
            <a href="#" className="nav-mbtn">Boka samtal</a>
          </div>
        </div>
      </div>
    </>
  )
}
