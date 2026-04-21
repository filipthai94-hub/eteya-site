'use client';

import { useEffect, useRef } from 'react';

interface Beam {
  x: number; y: number; width: number; length: number;
  angle: number; speed: number; opacity: number;
  hue: number; pulse: number; pulseSpeed: number;
}

interface VaultBeamsProps {
  intensity?: 'subtle' | 'medium' | 'strong';
  style?: React.CSSProperties;
}

export function VaultBeams({ intensity = 'strong', style }: VaultBeamsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const MINIMUM_BEAMS = 20;
  const opacityMap = { subtle: 0.7, medium: 0.85, strong: 1 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const BLEED = 40;

    function createBeam(width: number, height: number): Beam {
      return {
        x: -100 + Math.random() * (width + 200),
        y: Math.random() * height * 1.5 - height * 0.25,
        width: isMobile ? 30 + Math.random() * 50 : 40 + Math.random() * 80,
        length: height * 2.5,
        angle: -35 + Math.random() * 10,
        speed: isMobile ? 0.8 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5,
        opacity: isMobile ? 0.05 + Math.random() * 0.07 : 0.06 + Math.random() * 0.10,
        hue: 205 + Math.random() * 15,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.015,
      };
    }

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = (rect.width + BLEED * 2) * dpr;
      canvas.height = (rect.height + BLEED * 2) * dpr;
      canvas.style.width = (rect.width + BLEED * 2) + 'px';
      canvas.style.height = (rect.height + BLEED * 2) + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.translate(BLEED, BLEED);
      const beamCount = isMobile ? Math.ceil(MINIMUM_BEAMS * 0.75) : MINIMUM_BEAMS * 1.5;
      beamsRef.current = Array.from({ length: beamCount }, () =>
        createBeam(rect.width, rect.height)
      );
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!container || !ctx) return;
      const column = index % 3;
      const totalWidth = container.clientWidth + 200;
      const spacing = totalWidth / 3;
      beam.y = container.clientHeight + 100;
      beam.x = -100 + column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing;
      beam.width = isMobile ? 80 + Math.random() * 100 : 100 + Math.random() * 120;
      beam.speed = isMobile ? 0.8 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5;
      beam.hue = 205 + (index * 15) / totalBeams;
      beam.opacity = isMobile ? 0.08 + Math.random() * 0.06 : 0.10 + Math.random() * 0.08;
      return beam;
    }

    function drawBeam(beam: Beam) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);
      const pulsingOpacity =
        beam.opacity * (0.85 + Math.sin(beam.pulse) * 0.15) * opacityMap[intensity];
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0,   `hsla(${beam.hue}, 15%, 90%, 0)`);
      gradient.addColorStop(0.1, `hsla(${beam.hue}, 15%, 90%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 12%, 85%, ${pulsingOpacity})`);
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 12%, 85%, ${pulsingOpacity})`);
      gradient.addColorStop(0.9, `hsla(${beam.hue}, 15%, 90%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(1,   `hsla(${beam.hue}, 15%, 90%, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(container);

    function animate() {
      if (!ctx || !isVisibleRef.current || prefersReducedMotion) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.restore();
      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) resetBeam(beam, index, totalBeams);
        drawBeam(beam);
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      observer.disconnect();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none',
        zIndex: 4,
        mixBlendMode: 'screen',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          top: -40, left: -40,
          filter: 'blur(20px)',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
}
