"use client";

import { useRef, useEffect } from "react";

// Smooth noise via layered sine waves — no external dependency needed
function noise(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 1.2 + t * 0.4) * 0.4 +
    Math.sin(y * 0.8 + t * 0.3 + 1.2) * 0.3 +
    Math.sin((x + y) * 0.6 + t * 0.2 + 2.4) * 0.2 +
    Math.sin(x * 2.1 - y * 0.9 + t * 0.5 + 0.8) * 0.1
  );
}

// Aurora colour palette — green → teal → violet → indigo
const AURORA_BANDS = [
  { r: 0,   g: 255, b: 180, a: 0.12 }, // bright green
  { r: 0,   g: 210, b: 230, a: 0.10 }, // teal
  { r: 80,  g: 120, b: 255, a: 0.09 }, // blue
  { r: 160, g: 80,  b: 255, a: 0.08 }, // violet
  { r: 100, g: 60,  b: 200, a: 0.07 }, // deep indigo
];

export default function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Stars layer — rendered once, stored as imageData then composited each frame
    function drawStars(w: number, h: number) {
      if (!ctx) return;
      // Tiny white dots scattered across upper 70% of canvas
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h * 0.7;
        const r = 0.3 + Math.random() * 1.0;
        const brightness = 0.3 + Math.random() * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 240, 255, ${brightness})`;
        ctx.fill();
      }
    }

    // Draw stars once on first frame
    let starsDrawn = false;

    function frame() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;

      // Sky gradient base
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#020814");
      sky.addColorStop(0.5, "#05112b");
      sky.addColorStop(1, "#080d1f");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars (draw once, baked into background)
      if (!starsDrawn) {
        drawStars(W, H);
        starsDrawn = true;
      }

      // ── Aurora curtains ────────────────────────────────────────────
      // Each band is a set of vertical strips sampled with noise
      const STRIPS = 120;
      const stripW = W / STRIPS;

      AURORA_BANDS.forEach((band, bandIdx) => {
        const bandOffset = bandIdx * 0.9;
        const verticalOffset = 0.15 + bandIdx * 0.06; // each band sits slightly lower

        for (let i = 0; i < STRIPS; i++) {
          const nx = i / STRIPS;
          const n = noise(nx * 3, bandOffset, t + bandOffset);

          // Curtain top — wavy
          const curtainTop = H * (verticalOffset + n * 0.12);
          // Curtain bottom — falls further with second noise layer
          const n2 = noise(nx * 2.5 + 1, bandOffset + 0.5, t * 0.7 + bandOffset);
          const curtainHeight = H * (0.25 + n2 * 0.18 + Math.abs(n) * 0.1);

          const grad = ctx.createLinearGradient(0, curtainTop, 0, curtainTop + curtainHeight);
          grad.addColorStop(0, `rgba(${band.r},${band.g},${band.b},0)`);
          grad.addColorStop(0.2, `rgba(${band.r},${band.g},${band.b},${band.a * 1.4})`);
          grad.addColorStop(0.5, `rgba(${band.r},${band.g},${band.b},${band.a})`);
          grad.addColorStop(1, `rgba(${band.r},${band.g},${band.b},0)`);

          ctx.fillStyle = grad;
          ctx.fillRect(i * stripW, curtainTop, stripW + 1, curtainHeight);
        }
      });

      // ── Shimmer overlay — horizontal glow sweep ────────────────────
      const shimmerX = (Math.sin(t * 0.15) * 0.5 + 0.5) * W;
      const shimmer = ctx.createRadialGradient(shimmerX, H * 0.3, 0, shimmerX, H * 0.3, W * 0.5);
      shimmer.addColorStop(0, "rgba(100, 255, 200, 0.04)");
      shimmer.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, W, H);

      // ── Ground horizon glow ────────────────────────────────────────
      const ground = ctx.createLinearGradient(0, H * 0.75, 0, H);
      ground.addColorStop(0, "rgba(0,0,0,0)");
      ground.addColorStop(1, "rgba(2,6,20,0.95)");
      ctx.fillStyle = ground;
      ctx.fillRect(0, H * 0.75, W, H * 0.25);

      t += 0.004;
      rafRef.current = requestAnimationFrame(frame);
    }

    frame();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
