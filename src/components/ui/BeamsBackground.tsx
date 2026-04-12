"use client";

import { useEffect, useRef } from "react";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

interface BeamsBackgroundProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

function createBeam(width: number, height: number, isMobile: boolean): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: isMobile ? 30 + Math.random() * 50 : 40 + Math.random() * 80,
    length: height * 2.5,
    angle: angle,
    speed: isMobile ? 0.8 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5,
    opacity: isMobile ? 0.05 + Math.random() * 0.07 : 0.06 + Math.random() * 0.10,
    hue: 205 + Math.random() * 15,  // 205-220 = Arctic Ice (cool white + subtle blue)
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.008 + Math.random() * 0.015,
  };
}

export default function BeamsBackground({
  className = "",
  intensity = "strong",
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const MINIMUM_BEAMS = 20;

  const opacityMap = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr * 1.2;
      canvas.height = rect.height * dpr * 1.2;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      const beamCount = isMobile ? Math.ceil(MINIMUM_BEAMS * 0.75) : MINIMUM_BEAMS * 1.5;
      beamsRef.current = Array.from({ length: beamCount }, () =>
        createBeam(canvas.width, canvas.height, isMobile)
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!container) return beam;
      
      const column = index % 3;
      const spacing = container.clientWidth / 3;

      beam.y = container.clientHeight + 100;
      beam.x =
        column * spacing +
        spacing / 2 +
        (Math.random() - 0.5) * spacing * 0.5;
      beam.width = isMobile ? 80 + Math.random() * 100 : 100 + Math.random() * 120;
      beam.speed = isMobile ? 0.8 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5;
      beam.hue = 205 + (index * 15) / totalBeams;
      beam.opacity = isMobile ? 0.08 + Math.random() * 0.06 : 0.10 + Math.random() * 0.08;
      return beam;
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      // Calculate pulsing opacity
      const pulsingOpacity =
        beam.opacity *
        (0.85 + Math.sin(beam.pulse) * 0.15) *
        opacityMap[intensity];

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

      // Enhanced gradient with multiple color stops — Arctic Ice (low saturation, high lightness)
      gradient.addColorStop(0, `hsla(${beam.hue}, 15%, 90%, 0)`);
      gradient.addColorStop(
        0.1,
        `hsla(${beam.hue}, 15%, 90%, ${pulsingOpacity * 0.5})`
      );
      gradient.addColorStop(
        0.4,
        `hsla(${beam.hue}, 12%, 85%, ${pulsingOpacity})`
      );
      gradient.addColorStop(
        0.6,
        `hsla(${beam.hue}, 12%, 85%, ${pulsingOpacity})`
      );
      gradient.addColorStop(
        0.9,
        `hsla(${beam.hue}, 15%, 90%, ${pulsingOpacity * 0.5})`
      );
      gradient.addColorStop(1, `hsla(${beam.hue}, 15%, 90%, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    // IntersectionObserver — pause animation when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(container);

    function animate() {
      if (!canvas || !ctx) return;

      // Skip rendering when off-screen or reduced motion
      if (!isVisibleRef.current || prefersReducedMotion) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spara state och sätt clipping region för rounded corners
      ctx.save();
      ctx.beginPath();
      
      // Använd roundRect om tillgängligt, annars fallback för äldre Safari
      // Minskad radius från 48px till 40px för att undvika att beams klipps
      if (ctx.roundRect) {
        ctx.roundRect(0, 0, canvas.width, canvas.height, 40);
      } else {
        // Manuell rounded rect path för Safari < 16.4
        const radius = 40;
        const w = canvas.width;
        const h = canvas.height;
        ctx.moveTo(radius, 0);
        ctx.lineTo(w - radius, 0);
        ctx.quadraticCurveTo(w, 0, w, radius);
        ctx.lineTo(w, h - radius);
        ctx.quadraticCurveTo(w, h, w - radius, h);
        ctx.lineTo(radius, h);
        ctx.quadraticCurveTo(0, h, 0, h - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
      }
      
      ctx.clip();

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        // Reset beam when it goes off screen
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }

        drawBeam(ctx, beam);
      });

      // Återställ state efter rendering
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 30,
        mixBlendMode: "screen",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          display: "block",
          filter: "blur(20px)",
          willChange: "transform",
          transform: "translateZ(0)",
          width: '100%',
        }}
      />
    </div>
  );
}
