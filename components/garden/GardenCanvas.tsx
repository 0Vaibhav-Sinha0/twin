"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { GARDEN_FLOWERS } from "@/data/garden";
import type { GardenFlower } from "@/data/garden";

interface GardenCanvasProps {
  onFlowerClick: (flower: GardenFlower) => void;
  activeFlowerId: string | null;
}

// Fox state
interface Fox {
  x: number;
  y: number;
  targetX: number;
  facing: 1 | -1;
  walking: boolean;
  frame: number;
  frameTimer: number;
}

// Firefly
interface Firefly {
  x: number; y: number;
  vx: number; vy: number;
  opacity: number; phase: number;
  r: number;
}

// Bloom state per flower
interface BloomState {
  [id: string]: number; // 0 = closed, 1 = fully bloomed
}

export default function GardenCanvas({ onFlowerClick, activeFlowerId }: GardenCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const foxRef = useRef<Fox>({ x: 0.1, y: 0, targetX: 0.1, facing: 1, walking: false, frame: 0, frameTimer: 0 });
  const firefliesRef = useRef<Firefly[]>([]);
  const bloomRef = useRef<BloomState>({});
  const rafRef = useRef<number>(0);
  const [size, setSize] = useState({ w: 800, h: 500 });

  // Track active flower for bloom
  useEffect(() => {
    if (activeFlowerId) {
      bloomRef.current[activeFlowerId] = bloomRef.current[activeFlowerId] ?? 0;
    }
  }, [activeFlowerId]);

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

  // Init fireflies
  useEffect(() => {
    firefliesRef.current = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random() * size.w,
      y: size.h * 0.2 + Math.random() * size.h * 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random(),
      phase: Math.random() * Math.PI * 2,
      r: 1.5 + Math.random() * 1.5,
    }));
  }, [size]);

  // Handle click — send fox to flower
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = e.clientY - rect.top;
    const groundY = size.h * 0.72;

    // Only respond to clicks near the ground level (where flowers are)
    if (clickY < groundY * 0.5) return;

    // Find nearest flower
    let nearest: GardenFlower | null = null;
    let nearestDist = Infinity;
    for (const flower of GARDEN_FLOWERS) {
      const dist = Math.abs(flower.x - clickX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = flower;
      }
    }

    if (nearest && nearestDist < 0.12) {
      const fox = foxRef.current;
      fox.targetX = nearest.x;
      fox.walking = true;
      fox.facing = nearest.x > fox.x ? 1 : -1;
      onFlowerClick(nearest);
    }
  }, [size, onFlowerClick]);

  // Main draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size.w;
    canvas.height = size.h;

    const W = size.w;
    const H = size.h;
    const groundY = H * 0.72;
    let t = 0;

    function drawSky() {
      if (!ctx) return;
      const sky = ctx.createLinearGradient(0, 0, 0, groundY);
      sky.addColorStop(0,   "#1a0a2e");
      sky.addColorStop(0.3, "#7c2d12");
      sky.addColorStop(0.6, "#ea580c");
      sky.addColorStop(0.85,"#fbbf24");
      sky.addColorStop(1,   "#fde68a");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, groundY);
    }

    function drawSun() {
      if (!ctx) return;
      const sx = W * 0.75, sy = H * 0.18;
      // Sun glow
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 90);
      glow.addColorStop(0,   "rgba(253,230,138,0.5)");
      glow.addColorStop(0.4, "rgba(251,191,36,0.2)");
      glow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(sx - 90, sy - 90, 180, 180);
      // Sun disc
      ctx.beginPath();
      ctx.arc(sx, sy, 32, 0, Math.PI * 2);
      ctx.fillStyle = "#fde68a";
      ctx.fill();
    }

    function drawClouds() {
      if (!ctx) return;
      const clouds = [
        { x: 0.15, y: 0.1, r: 28 },
        { x: 0.35, y: 0.07, r: 22 },
        { x: 0.55, y: 0.12, r: 32 },
      ];
      ctx.fillStyle = "rgba(253,230,138,0.18)";
      for (const c of clouds) {
        const cx = W * c.x + Math.sin(t * 0.08 + c.x * 10) * 6;
        const cy = H * c.y;
        ctx.beginPath();
        ctx.arc(cx,       cy,      c.r,       0, Math.PI * 2);
        ctx.arc(cx + c.r, cy - 6,  c.r * 0.7, 0, Math.PI * 2);
        ctx.arc(cx - c.r * 0.6, cy + 2, c.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawGround() {
      if (!ctx) return;
      // Far ground band
      const farGrad = ctx.createLinearGradient(0, groundY - 20, 0, groundY + 40);
      farGrad.addColorStop(0, "#365314");
      farGrad.addColorStop(1, "#4d7c0f");
      ctx.fillStyle = farGrad;
      ctx.fillRect(0, groundY - 20, W, 60);

      // Near ground
      const nearGrad = ctx.createLinearGradient(0, groundY + 30, 0, H);
      nearGrad.addColorStop(0, "#3f6212");
      nearGrad.addColorStop(1, "#1a2e05");
      ctx.fillStyle = nearGrad;
      ctx.fillRect(0, groundY + 30, W, H - groundY - 30);

      // Ground horizon glow
      const horizGlow = ctx.createLinearGradient(0, groundY - 30, 0, groundY + 30);
      horizGlow.addColorStop(0, "rgba(251,191,36,0.25)");
      horizGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = horizGlow;
      ctx.fillRect(0, groundY - 30, W, 60);
    }

    function drawFlower(flower: GardenFlower, bloom: number) {
      if (!ctx) return;
      const fx = flower.x * W;
      const fy = groundY + 10;
      const stemH = 55 + bloom * 10;
      const petalR = 7 + bloom * 9;

      // Stem
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + Math.sin(t * 0.5 + flower.x * 5) * 3, fy - stemH);
      ctx.strokeStyle = "#4d7c0f";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if (bloom < 0.05) {
        // Bud
        ctx.beginPath();
        ctx.ellipse(fx, fy - stemH, 4, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = flower.color;
        ctx.fill();
        return;
      }

      const headX = fx + Math.sin(t * 0.5 + flower.x * 5) * 3;
      const headY = fy - stemH;

      // Glow
      if (bloom > 0.5) {
        const glow = ctx.createRadialGradient(headX, headY, 0, headX, headY, petalR * 2.5);
        glow.addColorStop(0,   `${flower.glowColor}55`);
        glow.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(headX, headY, petalR * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Petals
      const petalCount = flower.type === "cherry" ? 5 : flower.type === "lavender" ? 6 : 8;
      for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2 + t * 0.15;
        const px = headX + Math.cos(angle) * petalR;
        const py = headY + Math.sin(angle) * petalR;
        ctx.beginPath();
        ctx.ellipse(px, py, petalR * 0.55 * bloom, petalR * 0.38 * bloom, angle, 0, Math.PI * 2);
        ctx.fillStyle = flower.color + "cc";
        ctx.fill();
      }

      // Centre
      ctx.beginPath();
      ctx.arc(headX, headY, petalR * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = flower.type === "sunflower" ? "#78350f" : "#fff7ed";
      ctx.fill();
    }

    function drawFox() {
      if (!ctx) return;
      const fox = foxRef.current;
      const fx = fox.x * W;
      const fy = groundY + 14;
      const dir = fox.facing;

      ctx.save();
      ctx.translate(fx, fy);
      ctx.scale(dir, 1);

      // Body
      ctx.beginPath();
      ctx.ellipse(0, -12, 13, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#c2410c";
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.ellipse(12, -20, 9, 8, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#ea580c";
      ctx.fill();

      // Ears
      ctx.beginPath();
      ctx.moveTo(8, -26); ctx.lineTo(12, -34); ctx.lineTo(16, -26);
      ctx.fillStyle = "#c2410c"; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(9, -26); ctx.lineTo(12, -31); ctx.lineTo(15, -26);
      ctx.fillStyle = "#fca5a5"; ctx.fill();

      // Face white patch
      ctx.beginPath();
      ctx.ellipse(15, -19, 5, 4, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "#fef3c7"; ctx.fill();

      // Eye
      ctx.beginPath();
      ctx.arc(17, -21, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#1c1917"; ctx.fill();

      // Nose
      ctx.beginPath();
      ctx.arc(20, -18, 1, 0, Math.PI * 2);
      ctx.fillStyle = "#1c1917"; ctx.fill();

      // Tail
      const tailWag = Math.sin(t * 3) * 0.2;
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.quadraticCurveTo(-22 + tailWag * 10, -6, -20, 2);
      ctx.lineWidth = 6; ctx.strokeStyle = "#ea580c"; ctx.stroke();
      ctx.lineWidth = 3; ctx.strokeStyle = "#fef3c7"; ctx.stroke();

      // Legs (walking animation)
      if (fox.walking) {
        const legSwing = Math.sin(fox.frameTimer * 0.25) * 5;
        // Front legs
        ctx.beginPath();
        ctx.moveTo(6, -5);
        ctx.lineTo(6 + legSwing, 4);
        ctx.lineWidth = 3; ctx.strokeStyle = "#c2410c"; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(2, -5);
        ctx.lineTo(2 - legSwing, 4);
        ctx.stroke();
        // Back legs
        ctx.beginPath();
        ctx.moveTo(-4, -5);
        ctx.lineTo(-4 + legSwing, 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-8, -5);
        ctx.lineTo(-8 - legSwing, 4);
        ctx.stroke();
      } else {
        // Standing legs
        for (const lx of [6, 2, -4, -8]) {
          ctx.beginPath();
          ctx.moveTo(lx, -5); ctx.lineTo(lx, 4);
          ctx.lineWidth = 3; ctx.strokeStyle = "#c2410c"; ctx.stroke();
        }
      }

      ctx.restore();
    }

    function drawFireflies() {
      if (!ctx) return;
      const ff = firefliesRef.current;
      for (const f of ff) {
        f.phase += 0.025;
        f.x += f.vx + Math.sin(f.phase * 0.7) * 0.3;
        f.y += f.vy + Math.cos(f.phase * 0.5) * 0.2;
        f.opacity = 0.3 + Math.sin(f.phase) * 0.7;
        if (f.x < 0) f.x = W; if (f.x > W) f.x = 0;
        if (f.y < H * 0.15 || f.y > groundY + 20) f.vy *= -1;

        const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 4);
        glow.addColorStop(0, `rgba(253,230,138,${f.opacity * 0.8})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253,230,138,${f.opacity})`;
        ctx.fill();
      }
    }

    function updateFox() {
      const fox = foxRef.current;
      if (fox.walking) {
        const dx = fox.targetX - fox.x;
        if (Math.abs(dx) < 0.008) {
          fox.x = fox.targetX;
          fox.walking = false;
        } else {
          fox.x += dx * 0.04;
          fox.facing = dx > 0 ? 1 : -1;
          fox.frameTimer += 1;
        }
      }
    }

    function updateBlooms() {
      for (const flower of GARDEN_FLOWERS) {
        const current = bloomRef.current[flower.id] ?? 0;
        const target = flower.id === activeFlowerId ? 1 : current > 0 ? current : 0;
        if (flower.id === activeFlowerId && current < 1) {
          bloomRef.current[flower.id] = Math.min(1, current + 0.025);
        }
      }
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      drawSky();
      drawSun();
      drawClouds();
      drawGround();
      updateBlooms();
      for (const flower of GARDEN_FLOWERS) {
        drawFlower(flower, bloomRef.current[flower.id] ?? 0);
      }
      drawFireflies();
      updateFox();
      drawFox();
      t += 0.016;
      rafRef.current = requestAnimationFrame(frame);
    }

    frame();
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, activeFlowerId]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-pointer"
      style={{ display: "block", touchAction: "manipulation" }}
      onClick={handleClick}
    />
  );
}
