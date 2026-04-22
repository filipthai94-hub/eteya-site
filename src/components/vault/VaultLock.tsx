'use client';

interface VaultLockProps {
  monogramVisible: boolean;
  unlocked: boolean;
  settled: boolean;
  tick: number;
  scannerAngle: number;
  pulse: number;
  image?: string;
}

export function VaultLock({
  monogramVisible, unlocked, settled, tick, scannerAngle, pulse,
  image = '/images/team/filip.png',
}: VaultLockProps) {
  return (
    <div style={{ position: 'relative', width: 560, height: 560 }}>
      <style>{`
        @keyframes vaultSweep {
          0%   { opacity: 0; transform: rotate(-120deg); }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: rotate(240deg); }
        }
        .vault-contact { position: relative; }
        .vault-contact:hover {
          border-left-color: rgba(255,255,255,0.45) !important;
          background: linear-gradient(90deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0) 70%) !important;
          transform: translateX(3px);
        }
        .vault-contact:hover > span:first-child { color: #ffffff !important; }
        .cta-tile:hover {
          border-color: rgba(255,255,255,0.28) !important;
          background: linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), inset 1px 0 0 rgba(255,255,255,0.1),
                      inset 0 -1px 0 rgba(0,0,0,0.45), inset -1px 0 0 rgba(0,0,0,0.2) !important;
          transform: translateY(-1px);
        }
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

      <svg viewBox="0 0 600 600" style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
        <defs>
          <radialGradient id="vl-bezelMetal" cx="50%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#3e3e3b" />
            <stop offset="38%"  stopColor="#2a2a27" />
            <stop offset="62%"  stopColor="#1a1a17" />
            <stop offset="100%" stopColor="#0a0a08" />
          </radialGradient>
          <linearGradient id="vl-outerChrome" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.35)" />
            <stop offset="50%"  stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
          </linearGradient>
          <linearGradient id="vl-innerBevel" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.8)" />
            <stop offset="50%"  stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
          <filter id="vl-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="18" />
            <feOffset dx="0" dy="16" result="off" />
            <feComponentTransfer><feFuncA type="linear" slope="0.5" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="vl-lensGlass" cx="50%" cy="50%" r="60%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
            <stop offset="70%"  stopColor="rgba(0,0,0,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
          <radialGradient id="vl-specLobe" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,255,240,0.32)" />
            <stop offset="50%"  stopColor="rgba(240,240,210,0.08)" />
            <stop offset="100%" stopColor="rgba(220,230,180,0)" />
          </radialGradient>
          <radialGradient id="vl-specLobeDim" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(230,240,200,0.18)" />
            <stop offset="100%" stopColor="rgba(200,220,150,0)" />
          </radialGradient>
          <linearGradient id="vl-sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(200,255,0,0)" />
            <stop offset="50%"  stopColor="rgba(240,255,180,0.7)" />
            <stop offset="100%" stopColor="rgba(200,255,0,0)" />
          </linearGradient>
          <clipPath id="vl-photoClip">
            <circle
              cx="300" cy="300"
              r={unlocked ? 200 : 0}
              style={{ transition: 'r 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
            />
          </clipPath>
        </defs>

        {/* Drop shadow */}
        <ellipse cx="300" cy="560" rx="220" ry="14"
          fill="rgba(0,0,0,0.5)" filter="url(#vl-shadow)" />

        {/* Bezel */}
        <g filter="url(#vl-shadow)">
          <circle cx="300" cy="300" r="280" fill="url(#vl-bezelMetal)" />
          <circle cx="300" cy="300" r="279" fill="none" stroke="url(#vl-outerChrome)" strokeWidth="2.5" />
          <circle cx="300" cy="300" r="276" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1" />
          <circle cx="300" cy="300" r="220" fill="none" stroke="rgba(0,0,0,0.9)" strokeWidth="3" />
          <circle cx="300" cy="300" r="217" fill="none" stroke="url(#vl-innerBevel)" strokeWidth="2" />
        </g>

        {/* Tick ring */}
        <g style={{ transformOrigin: '300px 300px', transform: `rotate(${tick * 0.003}deg)` }}>
          {Array.from({ length: 120 }).map((_, i) => {
            const a = (i / 120) * Math.PI * 2;
            const cardinal = i % 30 === 0;
            const major = i % 10 === 0 && !cardinal;
            const r1 = 268;
            const r2 = cardinal ? 232 : major ? 244 : 256;
            const x1 = 300 + Math.cos(a) * r1;
            const y1 = 300 + Math.sin(a) * r1;
            const x2 = 300 + Math.cos(a) * r2;
            const y2 = 300 + Math.sin(a) * r2;
            const degAngle = ((a * 180 / Math.PI) + 90 + 360) % 360;
            const diff = Math.min(
              Math.abs(degAngle - scannerAngle),
              360 - Math.abs(degAngle - scannerAngle)
            );
            const scanBoost = diff < 22 ? (1 - diff / 22) : 0;
            const baseOpacity = cardinal ? 0.85 : major ? 0.55 : 0.28;
            const color = cardinal
              ? `rgba(200,255,0,${Math.min(1, baseOpacity + scanBoost * 0.5)})`
              : `rgba(245,245,240,${Math.min(1, baseOpacity + scanBoost * 0.55)})`;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color}
                strokeWidth={cardinal ? 2 : major ? 1.4 : 0.7}
                strokeLinecap="round"
                style={scanBoost > 0.5 ? {
                  filter: `drop-shadow(0 0 ${3 + scanBoost * 4}px rgba(200,255,0,${0.5 + scanBoost * 0.5}))`
                } : undefined}
              />
            );
          })}
          {[45, 135, 225, 315].map(deg => {
            const a = (deg - 90) * Math.PI / 180;
            const cx = 300 + Math.cos(a) * 250;
            const cy = 300 + Math.sin(a) * 250;
            return (
              <g key={deg}>
                <circle cx={cx} cy={cy} r="2.5" fill="rgba(0,0,0,0.7)" />
                <circle cx={cx} cy={cy} r="1.5" fill="rgba(255,255,255,0.3)" />
              </g>
            );
          })}
        </g>

        {/* Lens well */}
        <circle cx="300" cy="300" r="217" fill="#030303" />
        <circle cx="300" cy="300" r="215" fill="url(#vl-lensGlass)" />

        {/* Portrait — SVG-native image with clipPath iris-fade */}
        <image
          href={image}
          x="100" y="100" width="400" height="400"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#vl-photoClip)"
          style={{
            filter: 'contrast(1.08) saturate(0.95) brightness(0.96)',
            transition: 'opacity 0.8s ease 0.3s',
            opacity: unlocked ? 1 : 0,
          }}
        />
        {/* Tone overlay — clipped to same circle */}
        <rect
          x="100" y="100" width="400" height="400"
          clipPath="url(#vl-photoClip)"
          fill="url(#vl-photoTone)"
          style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
        />
        {/* Vignette — clipped to same circle */}
        <circle
          cx="300" cy="300" r="200"
          clipPath="url(#vl-photoClip)"
          fill="url(#vl-photoVignette)"
          style={{ pointerEvents: 'none' }}
        />

        {/* ─── Lime glow ring — ambient outer layer ─── */}
        <circle cx="300" cy="300" r="218" fill="none"
          stroke={`rgba(200,255,0,${unlocked ? 0.04 + pulse * 0.03 : 0})`}
          strokeWidth="20"
          style={{ filter: 'blur(14px)', transition: 'stroke 0.8s ease' }}
        />
        {/* ─── Lime glow ring — tight inner ring ─── */}
        <circle cx="300" cy="300" r="215" fill="none"
          stroke={`rgba(200,255,0,${unlocked ? 0.15 + pulse * 0.1 : 0})`}
          strokeWidth="2"
          style={{ filter: 'blur(3px)', transition: 'stroke 0.6s ease' }}
        />

        {/* Specular highlights */}
        <g style={{
          pointerEvents: 'none', mixBlendMode: 'screen',
          opacity: unlocked ? 1 : 0.6, transition: 'opacity 1.2s ease',
        }}>
          <ellipse cx="220" cy="170" rx="110" ry="60"
            fill="url(#vl-specLobe)" transform="rotate(-35 220 170)"
            style={{ filter: 'blur(8px)' }} />
          <ellipse cx="400" cy="440" rx="80" ry="40"
            fill="url(#vl-specLobeDim)" transform="rotate(-35 400 440)"
            style={{ filter: 'blur(10px)' }} />
        </g>

        {/* One-time unlock sweep */}
        {unlocked && (
          <g style={{
            pointerEvents: 'none', mixBlendMode: 'screen',
            animation: 'vaultSweep 1.8s ease-out 0.3s 1 forwards',
            transformOrigin: '300px 300px', opacity: 0,
          }}>
            <circle cx="300" cy="300" r="248" fill="none"
              stroke="url(#vl-sweepGrad)" strokeWidth="10"
              strokeDasharray="260 1298"
              style={{ filter: 'blur(3px)' }} />
          </g>
        )}

        {/* Locked overlay */}
        <g style={{
          opacity: monogramVisible ? 1 : 0,
          transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
        }}>
          <circle cx="300" cy="300" r="216" fill="rgba(6,8,6,0.55)" />
          <path id="vl-engraveTop" d="M 114 300 A 186 186 0 0 1 486 300" fill="none" />
          <path id="vl-engraveBottom" d="M 120 310 A 180 180 0 0 0 480 310" fill="none" />
          <text fontFamily="'JetBrains Mono', monospace" fontSize="13" letterSpacing="13" fill="rgba(255,255,255,0.78)">
            <textPath href="#vl-engraveTop" startOffset="50%" textAnchor="middle">ETEYA</textPath>
          </text>
          <text fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="4" fill="rgba(255,255,255,0.55)">
            <textPath href="#vl-engraveBottom" startOffset="50%" textAnchor="middle">N° 001 · FILIP THAI</textPath>
          </text>
          <line x1="290" y1="300" x2="310" y2="300" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          <circle cx="486" cy="300" r="1.4" fill="rgba(255,255,255,0.4)" />
          <circle cx="114" cy="300" r="1.4" fill="rgba(255,255,255,0.4)" />
        </g>

        {/* Index pin at 12 o'clock */}
        <g>
          <rect x="294" y="22" width="12" height="16" rx="1" fill="rgba(0,0,0,0.6)" />
          <path d="M 300 24 L 292 36 L 308 36 Z" fill="#C8FF00"
            style={{
              filter: unlocked ? 'drop-shadow(0 0 3px rgba(200,255,0,0.6))' : 'none',
              transition: 'filter 0.6s',
            }}
          />
        </g>

        {/* Serial at 6 o'clock */}
        <g transform="translate(300, 572)"
          style={{ opacity: settled ? 0.7 : 0, transition: 'opacity 0.8s 2s' }}>
          <rect x="-46" y="-9" width="92" height="18" rx="2"
            fill="rgba(12,12,10,0.9)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <text x="0" y="4" textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9" letterSpacing="2.4"
            fill="rgba(200,255,0,0.7)">
            ET-001 · F.T.
          </text>
        </g>
      </svg>
    </div>
  );
}
