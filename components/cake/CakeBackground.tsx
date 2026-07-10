"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; r: number; opacity: number; phase: number; speed: number;
}

interface ShootingStar {
  x: number; y: number; vx: number; vy: number; life: number; trail: { x: number; y: number }[];
}

export default function CakeBackground({ dimmed }: { dimmed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const rafRef = useRef<number>(0);
  const nextShootTimeRef = useRef(3 + Math.random() * 4);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    particlesRef.current = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.5 + Math.random() * 1.3,
      opacity: 0.2 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.15,
    }));

    function spawnShootingStar() {
      if (!canvas) return;
      shootingStarsRef.current.push({
        x: Math.random() * canvas.width * 0.6 + canvas.width * 0.2,
        y: Math.random() * canvas.height * 0.25,
        vx: 3 + Math.random() * 2,
        vy: 1.5 + Math.random() * 1,
        life: 1,
        trail: [],
      });
    }

    function frame() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const t = tRef.current;

      ctx.clearRect(0, 0, W, H);

      // Dreamy purple gradient background
      const grad = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.6, W * 0.9);
      grad.addColorStop(0, dimmed ? "#0f0821" : "#1a0f38");
      grad.addColorStop(0.5, dimmed ? "#0a0618" : "#150b2e");
      grad.addColorStop(1, "#050310");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Moon glow — top right
      const moonGlow = ctx.createRadialGradient(W * 0.82, H * 0.15, 0, W * 0.82, H * 0.15, 140);
      moonGlow.addColorStop(0, "rgba(253,246,236,0.15)");
      moonGlow.addColorStop(0.5, "rgba(232,184,109,0.06)");
      moonGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = moonGlow;
      ctx.fillRect(0, 0, W, H);

      // Blurred fairy light bokeh circles
      const bokehSpots = [
        { x: 0.15, y: 0.25, r: 55, color: "251,191,36" },
        { x: 0.85, y: 0.4, r: 65, color: "244,114,182" },
        { x: 0.25, y: 0.7, r: 45, color: "192,132,252" },
        { x: 0.7, y: 0.75, r: 50, color: "168,85,247" },
        { x: 0.05, y: 0.55, r: 40, color: "251,207,232" },
      ];
      for (const spot of bokehSpots) {
        const pulse = 0.7 + Math.sin(t * 0.5 + spot.x * 10) * 0.3;
        const bg = ctx.createRadialGradient(
          spot.x * W, spot.y * H, 0,
          spot.x * W, spot.y * H, spot.r * pulse
        );
        bg.addColorStop(0, `rgba(${spot.color},${dimmed ? 0.08 : 0.14})`);
        bg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
      }

      // Ambient particles (dust/sparkle)
      for (const p of particlesRef.current) {
        p.phase += 0.02;
        p.y -= p.speed;
        if (p.y < -10) p.y = H + 10;
        const twinkle = 0.5 + Math.sin(p.phase) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253,230,138,${p.opacity * twinkle * (dimmed ? 1.4 : 1)})`;
        ctx.fill();
      }

      // Shooting stars — spawn occasionally
      nextShootTimeRef.current -= 0.016;
      if (nextShootTimeRef.current <= 0) {
        spawnShootingStar();
        nextShootTimeRef.current = 5 + Math.random() * 6;
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((s) => s.life > 0);
      for (const s of shootingStarsRef.current) {
        s.x += s.vx * 3;
        s.y += s.vy * 3;
        s.life -= 0.012;
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 12) s.trail.shift();

        // Trail
        for (let i = 0; i < s.trail.length; i++) {
          const pt = s.trail[i];
          const trailOpacity = (i / s.trail.length) * s.life * 0.6;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${trailOpacity})`;
          ctx.fill();
        }
        // Head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.life})`;
        ctx.fill();
      }

      tRef.current += 0.016;
      rafRef.current = requestAnimationFrame(frame);
    }

    frame();

    const onResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [dimmed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, transition: "opacity 0.8s ease" }}
    />
  );
}
