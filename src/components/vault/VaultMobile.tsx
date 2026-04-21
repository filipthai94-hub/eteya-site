'use client';

import { useState, useEffect } from 'react';
import { VaultBeams } from './VaultBeams';
import { VaultLock } from './VaultLock';

const BEZEL_SIZE = 280;
const LOCK_SIZE = 560;
const SCALE = BEZEL_SIZE / LOCK_SIZE;

const CONTACTS = [
  { n: '01', k: 'TELEFON',  v: '+46 73 982 39 62', href: 'tel:+46739823962', target: undefined, rel: undefined },
  { n: '02', k: 'E-POST',   v: 'kontakt@eteya.ai', href: 'mailto:kontakt@eteya.ai', target: undefined, rel: undefined },
  { n: '03', k: 'WEBB',     v: 'eteya.ai',          href: 'https://eteya.ai', target: '_blank', rel: 'noopener' },
  { n: '04', k: 'LINKEDIN', v: 'Filip Thai',        href: 'https://www.linkedin.com/in/filip-thai-10449a3b6/', target: '_blank', rel: 'nofollow noopener' },
];

export function VaultMobile() {
  const [phase, setPhase] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 1300);
    const t3 = setTimeout(() => setPhase(3), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

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

  const fadeIn = (delay: string): React.CSSProperties => ({
    opacity: settled ? 1 : 0,
    transform: settled ? 'translateY(0)' : 'translateY(10px)',
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}`,
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
      {/* Beams */}
      <VaultBeams intensity="strong" />

      {/* Scrollable body */}
      <div className="vm-scroll" style={{
        flex: 1, minHeight: 0,
        overflowY: 'auto', overflowX: 'hidden',
        position: 'relative', zIndex: 5,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      } as React.CSSProperties}>

        {/* Status HUD — centered above bezel */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7,
          paddingTop: 'max(18px, env(safe-area-inset-top))',
          paddingBottom: 12,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
          flexShrink: 0,
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
          position: 'relative', overflow: 'hidden', flexShrink: 0,
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
            />
          </div>
        </div>

        {/* Identity */}
        <div style={{ padding: '28px 24px 0', textAlign: 'center', ...fadeIn('1.4s') }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.42)', marginBottom: 5 }}>
            N° 001 — AUTH 14:32
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 56, lineHeight: 0.88, letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Filip Thai
          </h1>
          <div style={{ marginTop: 7, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.58)' }}>
            Grundare & VD · Eteya Consulting
          </div>
        </div>

        {/* Contacts */}
        <div style={{ marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 4, ...fadeIn('1.7s') }}>
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

      {/* Sticky CTAs */}
      <div style={{
        flexShrink: 0, zIndex: 10, position: 'relative',
        display: 'flex', gap: 10,
        paddingTop: 12,
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(14px, env(safe-area-inset-left))',
        paddingRight: 'max(14px, env(safe-area-inset-right))',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(to top, rgba(1,1,1,0.95) 0%, rgba(10,10,9,0.7) 100%)',
        ...fadeIn('2s'),
      }}>
        <a href="https://cal.com/filip" className="vm-cta" style={{
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
        <a href="/api/vcard/filip" download="Filip-Thai.vcf" className="vm-cta" style={{
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
