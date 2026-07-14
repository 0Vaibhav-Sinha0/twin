"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────
// A calm, painterly flower meadow. No characters, no memory system —
// just a beautiful ambient scene: soft dawn sky, layered hills,
// dozens of hand-drawn flowers swaying in the wind, butterflies,
// drifting pollen. Tapping the meadow gives a small delighted bloom
// pulse — purely decorative, nothing is stored or revealed.
// ─────────────────────────────────────────────────────────────────

type Species = "tulip" | "daisy" | "poppy" | "cosmos" | "sunflower" | "lavender" | "filler";
type Depth = "back" | "mid" | "front";

interface Flower {
  x: number; // 0-1 normalized horizontal position
  yBase: number; // pixel y of the flower's base (ground point)
  size: number;
  species: Species;
  color: string;
  centerColor: string;
  depth: Depth;
  phase: number; // sway phase offset
  pulseUntil: number; // timestamp when a tap-bloom pulse ends
}

interface Butterfly {
  baseX: number;
  baseY: number;
  radiusX: number;
  radiusY: number;
  speed: number;
  phase: number;
  color: string;
}

interface Pollen {
  x: number;
  y: number;
  vy: number;
  vx: number;
  r: number;
  phase: number;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const FLOWER_PALETTE: { color: string; centerColor: string }[] = [
  { color: "#f4a6c1", centerColor: "#fde68a" }, // pink
  { color: "#f8d3e0", centerColor: "#fbbf6b" }, // blush
  { color: "#c9a8e8", centerColor: "#fef3c7" }, // lavender-pink
  { color: "#f6c66b", centerColor: "#a5642a" }, // gold
  { color: "#f2867a", centerColor: "#7a3a1f" }, // coral
  { color: "#fdf3e0", centerColor: "#e8b86d" }, // cream
  { color: "#b48cd9", centerColor: "#fef3c7" }, // violet
  { color: "#f9e0a0", centerColor: "#c47c3a" }, // butter yellow
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function GardenCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flowersRef = useRef<Flower[]>([]);
  const butterfliesRef = useRef<Butterfly[]>([]);
  const pollenRef = useRef<Pollen[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);
  const [size, setSize] = useState({ w: 800, h: 600 });

  // Resize
  useEffect(() => {
    function onResize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setSize({ w: canvas.offsetWidth, h: canvas.offsetHeight });
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Build the meadow — flowers, butterflies, pollen — whenever size changes
  useEffect(() => {
    const groundTop = size.h * 0.5;
    const groundBottom = size.h * 0.97;

    const flowers: Flower[] = [];
    const species: Species[] = ["tulip", "daisy", "poppy", "cosmos", "sunflower", "lavender"];

    // Back layer — small, hazy, further into the meadow
    for (let i = 0; i < 22; i++) {
      const t = groundTop + (groundBottom - groundTop) * (0.05 + Math.random() * 0.22);
      const palette = pick(FLOWER_PALETTE);
      flowers.push({
        x: Math.random(),
        yBase: t,
        size: 10 + Math.random() * 6,
        species: pick(species),
        color: palette.color,
        centerColor: palette.centerColor,
        depth: "back",
        phase: Math.random() * Math.PI * 2,
        pulseUntil: 0,
      });
    }
    // Mid layer
    for (let i = 0; i < 24; i++) {
      const t = groundTop + (groundBottom - groundTop) * (0.28 + Math.random() * 0.32);
      const palette = pick(FLOWER_PALETTE);
      flowers.push({
        x: Math.random(),
        yBase: t,
        size: 16 + Math.random() * 8,
        species: pick(species),
        color: palette.color,
        centerColor: palette.centerColor,
        depth: "mid",
        phase: Math.random() * Math.PI * 2,
        pulseUntil: 0,
      });
    }
    // Front layer — large, rich, foreground
    for (let i = 0; i < 20; i++) {
      const t = groundTop + (groundBottom - groundTop) * (0.62 + Math.random() * 0.36);
      const palette = pick(FLOWER_PALETTE);
      flowers.push({
        x: Math.random(),
        yBase: t,
        size: 24 + Math.random() * 12,
        species: pick(species),
        color: palette.color,
        centerColor: palette.centerColor,
        depth: "front",
        phase: Math.random() * Math.PI * 2,
        pulseUntil: 0,
      });
    }
    // Filler blooms — tiny white texture flowers scattered throughout
    for (let i = 0; i < 30; i++) {
      const t = groundTop + (groundBottom - groundTop) * Math.random();
      flowers.push({
        x: Math.random(),
        yBase: t,
        size: 5 + Math.random() * 3,
        species: "filler",
        color: "#fffaf0",
        centerColor: "#f6c66b",
        depth: t > groundTop + (groundBottom - groundTop) * 0.55 ? "front" : "mid",
        phase: Math.random() * Math.PI * 2,
        pulseUntil: 0,
      });
    }

    // Painter's algorithm — draw back-to-front by y position
    flowers.sort((a, b) => a.yBase - b.yBase);
    flowersRef.current = flowers;

    butterfliesRef.current = Array.from({ length: 4 }, () => ({
      baseX: 0.15 + Math.random() * 0.7,
      baseY: size.h * (0.2 + Math.random() * 0.25),
      radiusX: 40 + Math.random() * 60,
      radiusY: 20 + Math.random() * 30,
      speed: 0.12 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
      color: pick(["#f4a6c1", "#c9a8e8", "#f9e0a0", "#f2867a"]),
    }));

    pollenRef.current = Array.from({ length: 22 }, () => ({
      x: Math.random() * size.w,
      y: size.h * 0.3 + Math.random() * size.h * 0.6,
      vy: -0.15 - Math.random() * 0.2,
      vx: (Math.random() - 0.5) * 0.2,
      r: 1 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [size]);

  // Tap/click — spawn a gentle bloom pulse + sparkle burst, purely decorative
  const handleTap = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const now = performance.now();
    for (const f of flowersRef.current) {
      if (f.species === "filler") continue;
      const fx = f.x * size.w;
      const fy = f.yBase;
      const dist = Math.hypot(fx - x, fy - y);
      const radius = 90;
      if (dist < radius) {
        f.pulseUntil = now + 700;
      }
    }

    // Sparkle burst
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.4;
      sparklesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        life: 1,
        color: pick(["#fde68a", "#f9a8d4", "#e9d5ff", "#fff"]),
      });
    }
  }, [size]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    handleTap(e.clientX, e.clientY);
  }, [handleTap]);

  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0] ?? e.changedTouches[0];
    if (touch) handleTap(touch.clientX, touch.clientY);
  }, [handleTap]);

  // ── Main draw loop ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size.w;
    canvas.height = size.h;
    const W = size.w;
    const H = size.h;
    const groundTop = H * 0.5;

    function drawSky() {
      if (!ctx) return;
      const sky = ctx.createLinearGradient(0, 0, 0, groundTop + 40);
      sky.addColorStop(0, "#b9a8e0");
      sky.addColorStop(0.35, "#e8b8d4");
      sky.addColorStop(0.68, "#fbd7ae");
      sky.addColorStop(1, "#fef3d0");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, groundTop + 40);
    }

    function drawSun() {
      if (!ctx) return;
      const t = tRef.current;
      const sx = W * 0.72;
      const sy = H * 0.2;

      // Soft rotating light rays
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(t * 0.02);
      const rayCount = 10;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        const grad = ctx.createLinearGradient(0, 0, 0, -180);
        grad.addColorStop(0, "rgba(254,243,199,0.16)");
        grad.addColorStop(1, "rgba(254,243,199,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.lineTo(0, -180);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // Glow
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 100);
      glow.addColorStop(0, "rgba(254,243,199,0.55)");
      glow.addColorStop(0.5, "rgba(253,215,174,0.2)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(sx - 100, sy - 100, 200, 200);

      // Disc
      ctx.beginPath();
      ctx.arc(sx, sy, 26, 0, Math.PI * 2);
      ctx.fillStyle = "#fef3d0";
      ctx.fill();
    }

    function drawClouds() {
      if (!ctx) return;
      const t = tRef.current;
      const clouds = [
        { x: 0.12, y: 0.12, r: 26 },
        { x: 0.32, y: 0.08, r: 20 },
        { x: 0.52, y: 0.16, r: 30 },
        { x: 0.85, y: 0.1, r: 22 },
      ];
      for (const c of clouds) {
        const cx = W * c.x + Math.sin(t * 0.05 + c.x * 8) * 8;
        const cy = H * c.y;
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.arc(cx, cy, c.r, 0, Math.PI * 2);
        ctx.arc(cx + c.r * 0.9, cy - 5, c.r * 0.65, 0, Math.PI * 2);
        ctx.arc(cx - c.r * 0.7, cy + 3, c.r * 0.55, 0, Math.PI * 2);
        ctx.arc(cx + c.r * 0.3, cy - 10, c.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawHills() {
      if (!ctx) return;
      // Back hill — hazy, atmospheric
      ctx.fillStyle = "#b3c9a8";
      ctx.beginPath();
      ctx.moveTo(0, groundTop + 10);
      ctx.quadraticCurveTo(W * 0.25, groundTop - 30, W * 0.5, groundTop + 5);
      ctx.quadraticCurveTo(W * 0.75, groundTop + 35, W, groundTop - 10);
      ctx.lineTo(W, groundTop + 60);
      ctx.lineTo(0, groundTop + 60);
      ctx.closePath();
      ctx.fill();

      // Mid hill
      ctx.fillStyle = "#9cbf8e";
      ctx.beginPath();
      ctx.moveTo(0, groundTop + 40);
      ctx.quadraticCurveTo(W * 0.3, groundTop + 5, W * 0.6, groundTop + 35);
      ctx.quadraticCurveTo(W * 0.85, groundTop + 60, W, groundTop + 25);
      ctx.lineTo(W, groundTop + 90);
      ctx.lineTo(0, groundTop + 90);
      ctx.closePath();
      ctx.fill();

      // Meadow ground
      const groundGrad = ctx.createLinearGradient(0, groundTop + 60, 0, H);
      groundGrad.addColorStop(0, "#7fa66a");
      groundGrad.addColorStop(1, "#4f7a45");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundTop + 60, W, H - groundTop - 60);
    }

    function drawGrassBlade(x: number, y: number, h: number, sway: number, color: string) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + sway * 0.6, y - h * 0.6, x + sway, y - h);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    function drawGrassStrip() {
      if (!ctx) return;
      const t = tRef.current;
      const bladeCount = 55;
      for (let i = 0; i < bladeCount; i++) {
        const x = (i / bladeCount) * W + Math.sin(i * 12.9) * 6;
        const yy = H - 4 - ((i * 37) % 20);
        const sway = Math.sin(t * 1.1 + x * 0.02) * 8;
        const h = 14 + (i % 5) * 3;
        drawGrassBlade(x, yy, h, sway, i % 2 === 0 ? "#3f6b3a" : "#5c8a4f");
      }
    }

    // ── Flower species drawers ──────────────────────────────────
    function drawStem(hx: number, hy: number, baseX: number, baseY: number, color: string) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo((baseX + hx) / 2, (baseY + hy) / 2 + 6, hx, hy);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function drawTulip(x: number, y: number, size: number, sway: number, color: string, pulse: number) {
      if (!ctx) return;
      const hx = x + sway;
      const hy = y - size * 2.1;
      drawStem(hx, hy, x, y, "#4f7a45");
      const s = size * (1 + pulse * 0.18);
      ctx.fillStyle = color;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.ellipse(hx + i * s * 0.22, hy - s * 0.08, s * 0.3, s * 0.5, i * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawDaisy(x: number, y: number, size: number, sway: number, color: string, centerColor: string, pulse: number, t: number, phase: number) {
      if (!ctx) return;
      const hx = x + sway;
      const hy = y - size * 2.0;
      drawStem(hx, hy, x, y, "#4f7a45");
      const s = size * (1 + pulse * 0.2);
      const petalCount = 9;
      const wobble = Math.sin(t * 1.5 + phase) * 0.05;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2 + wobble;
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.42, s * 0.16, s * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = centerColor;
      ctx.beginPath();
      ctx.arc(hx, hy, s * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPoppy(x: number, y: number, size: number, sway: number, color: string, centerColor: string, pulse: number) {
      if (!ctx) return;
      const hx = x + sway;
      const hy = y - size * 2.2;
      drawStem(hx, hy, x, y, "#4f7a45");
      const s = size * (1 + pulse * 0.2);
      ctx.fillStyle = color;
      const petals = 4;
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2 + Math.PI / 4;
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.32, s * 0.34, s * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = centerColor;
      ctx.beginPath();
      ctx.arc(hx, hy, s * 0.16, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawCosmos(x: number, y: number, size: number, sway: number, color: string, centerColor: string, pulse: number) {
      if (!ctx) return;
      const hx = x + sway;
      const hy = y - size * 2.1;
      drawStem(hx, hy, x, y, "#5c8a4f");
      const s = size * (1 + pulse * 0.2);
      const petalCount = 8;
      ctx.fillStyle = color;
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-s * 0.12, -s * 0.35);
        ctx.lineTo(0, -s * 0.5);
        ctx.lineTo(s * 0.12, -s * 0.35);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = centerColor;
      ctx.beginPath();
      ctx.arc(hx, hy, s * 0.14, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawSunflower(x: number, y: number, size: number, sway: number, pulse: number) {
      if (!ctx) return;
      const hx = x + sway;
      const hy = y - size * 2.3;
      drawStem(hx, hy, x, y, "#4f7a45");
      const s = size * (1 + pulse * 0.15);
      const petalCount = 13;
      ctx.fillStyle = "#f6c65f";
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.4, s * 0.14, s * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = "#7a4a24";
      ctx.beginPath();
      ctx.arc(hx, hy, s * 0.28, 0, Math.PI * 2);
      ctx.fill();
      // Seed texture dots
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(hx + Math.cos(a) * s * 0.14, hy + Math.sin(a) * s * 0.14, s * 0.03, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawLavender(x: number, y: number, size: number, sway: number, color: string) {
      if (!ctx) return;
      const hx = x + sway;
      const hy = y - size * 2.4;
      drawStem(hx, hy, x, y, "#6b8f5a");
      const s = size * 0.9;
      ctx.fillStyle = color;
      for (let i = 0; i < 7; i++) {
        const py = hy + (i - 3) * s * 0.14;
        const px = hx + sway * (i / 14);
        ctx.beginPath();
        ctx.arc(px, py, s * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawFiller(x: number, y: number, size: number, sway: number) {
      if (!ctx) return;
      const hx = x + sway;
      const hy = y - size * 1.4;
      ctx.strokeStyle = "#6b8f5a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(hx, hy);
      ctx.stroke();
      ctx.fillStyle = "#fffaf0";
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(hx + Math.cos(a) * size * 0.2, hy + Math.sin(a) * size * 0.2, size * 0.14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#f6c65f";
      ctx.beginPath();
      ctx.arc(hx, hy, size * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawFlower(f: Flower, t: number) {
      if (!ctx) return;
      const depthOpacity = f.depth === "back" ? 0.55 : f.depth === "mid" ? 0.8 : 1;
      const windSway = Math.sin(t * 0.8 + f.x * 6 + f.phase) * (f.size * 0.25);
      const now = performance.now();
      const pulse = f.pulseUntil > now ? (f.pulseUntil - now) / 700 : 0;

      ctx.globalAlpha = depthOpacity;
      const px = f.x * W;

      switch (f.species) {
        case "tulip":
          drawTulip(px, f.yBase, f.size, windSway, f.color, pulse);
          break;
        case "daisy":
          drawDaisy(px, f.yBase, f.size, windSway, f.color, f.centerColor, pulse, t, f.phase);
          break;
        case "poppy":
          drawPoppy(px, f.yBase, f.size, windSway, f.color, f.centerColor, pulse);
          break;
        case "cosmos":
          drawCosmos(px, f.yBase, f.size, windSway, f.color, f.centerColor, pulse);
          break;
        case "sunflower":
          drawSunflower(px, f.yBase, f.size, windSway, pulse);
          break;
        case "lavender":
          drawLavender(px, f.yBase, f.size, windSway, f.color);
          break;
        case "filler":
          drawFiller(px, f.yBase, f.size, windSway);
          break;
      }
      ctx.globalAlpha = 1;
    }

    function drawButterflies(t: number) {
      if (!ctx) return;
      for (const b of butterfliesRef.current) {
        const angle = t * b.speed + b.phase;
        const bx = b.baseX * W + Math.cos(angle) * b.radiusX;
        const by = b.baseY + Math.sin(angle * 1.3) * b.radiusY;
        const flap = Math.sin(t * 10 + b.phase) * 0.5 + 0.5;
        const dir = Math.cos(angle) > 0 ? 1 : -1;

        ctx.save();
        ctx.translate(bx, by);
        ctx.scale(dir, 1);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = 0.85;
        // Wings
        ctx.beginPath();
        ctx.ellipse(-3, -2, 6 * (0.4 + flap * 0.6), 8, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(3, -2, 6 * (0.4 + flap * 0.6), 8, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // Body
        ctx.fillStyle = "#3d2b1f";
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawPollen() {
      if (!ctx) return;
      for (const p of pollenRef.current) {
        p.phase += 0.02;
        p.x += p.vx + Math.sin(p.phase) * 0.15;
        p.y += p.vy;
        if (p.y < H * 0.15) {
          p.y = H * 0.9;
          p.x = Math.random() * W;
        }
        const twinkle = 0.4 + Math.sin(p.phase * 2) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,250,240,${twinkle})`;
        ctx.fill();
      }
    }

    function drawSparkles() {
      if (!ctx) return;
      sparklesRef.current = sparklesRef.current.filter((s) => s.life > 0.02);
      for (const s of sparklesRef.current) {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03;
        s.life -= 0.025;
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const t = tRef.current;

      drawSky();
      drawSun();
      drawClouds();
      drawHills();

      for (const f of flowersRef.current) drawFlower(f, t);

      drawGrassStrip();
      drawButterflies(t);
      drawPollen();
      drawSparkles();

      tRef.current += 0.016;
      rafRef.current = requestAnimationFrame(frame);
    }

    frame();
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block", touchAction: "manipulation", cursor: "pointer" }}
      onClick={handleClick}
      onTouchStart={handleTouch}
    />
  );
}
