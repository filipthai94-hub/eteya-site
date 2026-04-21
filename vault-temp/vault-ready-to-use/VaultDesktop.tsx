'use client';

import { useState, useEffect } from 'react';
import { VaultBeams } from './VaultBeams';
import { VaultLock } from './VaultLock';

const CONTACTS = [
  { n: '01', k: 'TELEFON',  v: '+46 73 982 39 62', href: 'tel:+46739823962', target: undefined, rel: undefined },
  { n: '02', k: 'E-POST',   v: 'kontakt@eteya.ai', href: 'mailto:kontakt@eteya.ai', target: undefined, rel: undefined },
  { n: '03', k: 'WEBB',     v: 'eteya.ai',          href: 'https://eteya.ai', target: '_blank', rel: 'noopener' },
  { n: '04', k: 'LINKEDIN', v: 'Filip Thai',        href: 'https://www.linkedin.com/in/filip-thai-10449a3b6/', target: '_blank', rel: 'nofollow noopener' },
];

const tileStyle: React.CSSProperties = {
  position: 'relative',
  display: 'grid', gridTemplateRows: 'auto auto', gap: 6,
  padding: '20px 26px', flex: 1,
  background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 60%, rgba(255,255,255,0.025) 100%)',
  color: '#fff', textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), inset 1px 0 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.45), inset -1px 0 0 rgba(0,0,0,0.2)',
  transition: 'transform 0.22s cubic-bezier(0.22,1,0.36,1), background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
  willChange: 'transform',
};

const contactStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '32px 88px 1fr',
  alignItems: 'baseline', gap: 12,
  padding: '14px',
  textDecoration: 'none', color: '#fff',
  borderLeft: '1px solid rgba(255,255,255,0.12)',
  background: 'linear-gradient(90deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 60%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.35)',
  transition: 'border-color 0.28s cubic-bezier(0.22,1,0.36,1), background 0.28s, transform 0.28s',
  willChange: 'transform',
};

export function VaultDesktop() {
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

  const today = new Date().toLocaleDateString('sv-SE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).replace(/\//g, '.');

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'transparent', color: '#fff',
      fontFamily: "'Geist', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      paddingBottom: 20,
    }}>
      {/* Ambient key light */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: '70%',
        background: 'radial-gradient(ellipse at center top, rgba(255,250,235,0.07) 0%, transparent 55%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 42%, transparent 30%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-radial-gradient(circle at 30% 30%, rgba(255,255,255,0.014) 0, transparent 2px), repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px)',
        mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 3,
      }} />
      {/* Beams */}
      <VaultBeams intensity="strong" />

      {/* Main — 3-column grid */}
      <main style={{
        flex: 1, position: 'relative', zIndex: 5,
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        gap: 40, padding: '0 60px',
        minHeight: 0, alignItems: 'center',
      }}>

        {/* LEFT */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 20,
          opacity: settled ? 1 : 0,
          transform: settled ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 1.4s',
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.5)' }}>
            N° 001 — AUTH 14:32
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 120, lineHeight: 0.9, letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase' }}>
            Filip<br />Thai
          </h1>
          <div style={{ marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
            Grundare & VD · Eteya Consulting
          </div>
        </div>

        {/* CENTER */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <VaultLock
            monogramVisible={monogramVisible}
            unlocked={unlocked}
            settled={settled}
            tick={tick}
            scannerAngle={scannerAngle}
            pulse={pulse}
          />
          <div style={{
            display: 'flex', gap: 20, marginTop: 28, width: 560,
            opacity: settled ? 1 : 0,
            transform: settled ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 1.7s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 1.7s',
          }}>
            <a href="https://cal.com/filip" className="cta-tile" style={tileStyle}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 28 }}>Boka möte</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.38)' }}>30 min · via cal.com</span>
            </a>
            <a href="/filip-thai.vcf" download="Filip-Thai.vcf" className="cta-tile" style={tileStyle}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 28 }}>Spara kontakt</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.38)' }}>.vcf · till telefon</span>
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 20,
          opacity: settled ? 1 : 0,
          transform: settled ? 'translateX(0)' : 'translateX(30px)',
          transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 1.4s',
        }}>
          {CONTACTS.map(c => (
            <a key={c.n} href={c.href} target={c.target} rel={c.rel}
              className="vault-contact" style={contactStyle}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.75)', transition: 'color 0.28s ease' }}>{c.n}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.55)' }}>{c.k}</span>
              <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 15, fontWeight: 500 }}>{c.v}</span>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 44px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.4)',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span>STOCKHOLM / SE</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
          <span>© 2026 ETEYA CONSULTING AB</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            boxShadow: '0 0 14px rgba(200,255,0,0.6)',
            transition: 'all 0.4s ease',
            opacity: unlocked ? 1 : 0.25,
            background: unlocked ? '#C8FF00' : '#555',
          }} />
          <span style={{ color: unlocked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>
            {unlocked ? 'OPEN' : 'SEALED'} · {today}
          </span>
        </div>
      </footer>
    </div>
  );
}
