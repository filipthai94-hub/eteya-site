'use client';

import { useState, useEffect, useRef } from 'react';
import { VaultLock } from './VaultLock';
import type { PersonData } from './VaultDesktop';

const BEZEL_SIZE = 280;
const LOCK_SIZE = 560;
const SCALE = BEZEL_SIZE / LOCK_SIZE;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function VaultMobile({ person }: { person: PersonData }) {
  const [phase, setPhase] = useState(0);
  const [tick, setTick] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const CONTACTS = [
    { n: '01', k: 'TELEFON',  v: person.phone, href: `tel:${person.phone.replace(/\s/g, '')}`, target: undefined as string | undefined, rel: undefined as string | undefined },
    { n: '02', k: 'E-POST',   v: person.email, href: `mailto:${person.email}`, target: undefined as string | undefined, rel: undefined as string | undefined },
    { n: '03', k: 'WEBB',     v: person.website, href: `https://${person.website}`, target: '_blank' as string | undefined, rel: 'noopener' as string | undefined },
    { n: '04', k: 'LINKEDIN', v: person.linkedinName, href: person.linkedinUrl, target: '_blank' as string | undefined, rel: 'nofollow noopener' as string | undefined },
  ];

  // Phase sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // RAF tick for scanner + pulse
  useEffect(() => {
    let raf: number;
    const loop = (t: number) => { setTick(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const monogramVisible = phase < 1;
  const unlocked = phase >= 2;
  const settled = phase >= 3;
  const scannerAngle = (tick * 0.025) % 360;
  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.0016);

  // Custom slow scroll — starts at 2500ms (1400 settled + 1100 delay)
  // easeInOutCubic over 1200ms: starts slow, glides, eases out
  useEffect(() => {
    if (!settled) return;
    let raf: number;

    const timer = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;

      const startY = el.scrollTop;
      const targetY = el.scrollHeight - el.clientHeight;
      const distance = targetY - startY;
      if (distance <= 0) return;

      const duration = 1200;
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // el is guaranteed non-null here (checked above, const ref captured in closure)
        el!.scrollTop = startY + distance * easeInOutCubic(progress);
        if (progress < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }, 1100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [settled]);

  // Fade-in delays
  const fadeIn = (delay: string): React.CSSProperties => ({
    opacity: settled ? 1 : 0,
    transform: settled ? 'translateY(0)' : 'translateY(10px)',
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  });

  const today = new Date().toLocaleDateString('sv-SE', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  }).replace(/\//g, '.');

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'radial-gradient(ellipse at 50% 25%, #181816 0%, #0a0a09 55%, #010101 100%)',
      color: '#fff',
      fontFamily: "'Geist', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        .vm-scroll::-webkit-scrollbar { display: none; }
        .vm-contact { transition: border-left-color 0.2s ease, background 0.2s ease !important; }
        .vm-contact:active {
          border-left-color: rgba(200,255,0,0.55) !important;
          background: linear-gradient(90deg, rgba(200,255,0,0.06) 0%, transparent 55%) !important;
        }
        .vm-cta { transition: background 0.18s ease, border-color 0.18s ease, transform 0.15s ease !important; }
        .vm-cta:active {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(255,255,255,0.42) !important;
          transform: scale(0.975) !important;
        }
      `}</style>

      {/* Key light */}
      <div style={{
        position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)',
        width: '100%', height: '55%',
        background: 'radial-gradient(ellipse at center top, rgba(255,250,235,0.07) 0%, transparent 55%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 35%, transparent 20%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* ─── FIXED HERO: Status HUD + Bezel ─────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        position: 'relative', zIndex: 5,
        paddingBottom: 8,
      }}>
        {/* Status HUD */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7,
          paddingTop: 'max(18px, env(safe-area-inset-top))',
          paddingBottom: 12,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            transition: 'all 0.4s ease',
            background: unlocked ? '#C8FF00' : '#555',
            opacity: unlocked ? 1 : 0.35,
            boxShadow: unlocked ? '0 0 8px rgba(200,255,0,0.5)' : 'none',
          }} />
          <span style={{ color: unlocked ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)', transition: 'color 0.4s' }}>
            {unlocked ? 'OPEN' : 'SEALED'} · {today}
          </span>
        </div>

        {/* Bezel — scaled 560→280 */}
        <div style={{
          width: BEZEL_SIZE, height: BEZEL_SIZE,
          margin: '0 auto',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: LOCK_SIZE, height: LOCK_SIZE,
            transformOrigin: 'top left',
            transform: `scale(${SCALE})`,
            pointerEvents: 'none',
          }}>
            <VaultLock
              monogramVisible={monogramVisible}
              unlocked={unlocked}
              settled={settled}
              tick={tick}
              scannerAngle={scannerAngle}
              pulse={pulse}
              image={person.image}
              engraving={person.engraving}
              initials={person.initials}
            />
          </div>
        </div>

        {/* Ground shadow — sits directly under bezel */}
        <div style={{
          width: 200, height: 24, margin: '0 auto',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, transparent 72%)',
          pointerEvents: 'none',
          position: 'relative', zIndex: 4,
        }} />

        {/* Hero separator — lime-tinted glow line */}
        <div style={{
          position: 'absolute', bottom: 0, left: '8%', right: '8%',
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(200,255,0,0.1) 25%, rgba(200,255,0,0.3) 50%, rgba(200,255,0,0.1) 75%, transparent 100%)',
          boxShadow: '0 0 10px 3px rgba(200,255,0,0.07)',
        }} />
      </div>

      {/* ─── SCROLLABLE MIDDLE: Identity + Contacts ──────────────────────── */}
      <div
        ref={scrollRef}
        className="vm-scroll"
        style={{
          flex: 1, minHeight: 0,
          overflowY: 'auto', overflowX: 'hidden',
          position: 'relative', zIndex: 5,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        } as React.CSSProperties}
      >
        {/* Identity */}
        <div style={{ padding: '20px 24px 0', textAlign: 'center', ...fadeIn('0.2s') }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.42)', marginBottom: 5 }}>
            N° 001 — AUTH 14:32
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 56, lineHeight: 0.88, letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {person.name}
          </h1>
          <div style={{ marginTop: 7, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.58)' }}>
            {person.role} · Eteya Consulting
          </div>
        </div>

        {/* Contacts */}
        <div style={{ marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 4, ...fadeIn('0.4s') }}>
          {CONTACTS.map(c => (
            <a key={c.n} href={c.href} target={c.target} rel={c.rel}
              className="vm-contact"
              style={{
                display: 'grid', gridTemplateColumns: '26px 72px 1fr',
                alignItems: 'center', gap: 10,
                padding: '0 24px', minHeight: 52,
                textDecoration: 'none', color: '#fff',
                borderLeft: '2px solid transparent',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                WebkitTapHighlightColor: 'transparent',
              } as React.CSSProperties}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)' }}>{c.n}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.38)' }}>{c.k}</span>
              <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.v}</span>
            </a>
          ))}
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* ─── STICKY CTAs ─────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, zIndex: 10, position: 'relative',
        display: 'flex', gap: 10,
        paddingTop: 12,
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(14px, env(safe-area-inset-left))',
        paddingRight: 'max(14px, env(safe-area-inset-right))',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(to top, rgba(1,1,1,0.95) 0%, rgba(10,10,9,0.7) 100%)',
        ...fadeIn('0.6s'),
      }}>
        <a href={person.calUrl} className="vm-cta" style={{
          flex: 1, display: 'flex', flexDirection: 'column', gap: 5,
          padding: '14px 16px 13px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff', textDecoration: 'none',
          WebkitTapHighlightColor: 'transparent', minHeight: 60,
        } as React.CSSProperties}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 20 }}>Boka möte</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.36)' }}>30 min · via cal.com</span>
        </a>
        <a href={person.vcfHref} download={person.vcfDownload} className="vm-cta" style={{
          flex: 1, display: 'flex', flexDirection: 'column', gap: 5,
          padding: '14px 16px 13px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff', textDecoration: 'none',
          WebkitTapHighlightColor: 'transparent', minHeight: 60,
        } as React.CSSProperties}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 20 }}>Spara kontakt</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.36)' }}>.vcf · till telefon</span>
        </a>
      </div>
    </div>
  );
}