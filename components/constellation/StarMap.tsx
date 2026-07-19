"use client";

import { useRef, useEffect } from "react";
import {
  CONSTELLATION_NODES,
  CONSTELLATION_LINES,
  STAR_A,
  STAR_B,
} from "@/data/constellation";

interface StarMapProps {
  progress: number; // 0-1 scroll progress
}

interface BgStar {
  x: number; y: number; r: number; opacity: number; twinklePhase: number;
}

export default function StarMap({ progress }: StarMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgStarsRef = useRef<BgStar[]>([]);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Generate background stars once
    bgStarsRef.current = Array.from({ length: 280 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.3 + Math.random() * 1.4,
      opacity: 0.2 + Math.random() * 0.7,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function drawGlowStar(
      x: number, y: number, r: number,
      color: string, glowR: number, opacity: number
    ) {
      const glow = ctx!.createRadialGradient(x, y, 0, x, y, glowR);
      glow.addColorStop(0, color.replace(")", `,${opacity})`).replace("rgb", "rgba"));
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(x, y, glowR, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx!.fill();
    }

    function frame() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const t = tRef.current;

      // Deep space background
      ctx.fillStyle = "#02040c";
      ctx.fillRect(0, 0, W, H);

      // Nebula wisps
      const nebula1 = ctx.createRadialGradient(W * 0.3, H * 0.4, 0, W * 0.3, H * 0.4, W * 0.35);
      nebula1.addColorStop(0, "rgba(58,169,255,0.04)");
      nebula1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, W, H);

      const nebula2 = ctx.createRadialGradient(W * 0.7, H * 0.6, 0, W * 0.7, H * 0.6, W * 0.3);
      nebula2.addColorStop(0, "rgba(159,122,234,0.05)");
      nebula2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, W, H);

      // Background stars with twinkle
      for (const s of bgStarsRef.current) {
        const twinkle = 0.6 + Math.sin(t * 1.2 + s.twinklePhase) * 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,240,255,${s.opacity * twinkle})`;
        ctx.fill();
      }

      // ── Constellation nodes ────────────────────────────────────────
      // Each node appears sequentially based on progress
      const nodeProgress = progress * (CONSTELLATION_NODES.length + 1);

      // Draw lines first (under nodes)
      for (let li = 0; li < CONSTELLATION_LINES.length; li++) {
        const [ai, bi] = CONSTELLATION_LINES[li];
        const nodeA = CONSTELLATION_NODES[ai];
        const nodeB = CONSTELLATION_NODES[bi];

        // Line appears when both connected nodes are visible
        const lineThreshold = Math.max(ai, bi) + 1;
        const lineProgress = Math.max(0, Math.min(1, nodeProgress - lineThreshold));

        if (lineProgress <= 0) continue;

        const ax = nodeA.x * W, ay = nodeA.y * H;
        const bx = nodeB.x * W, by = nodeB.y * H;

        // Animate line drawing
        const mx = ax + (bx - ax) * lineProgress;
        const my = ay + (by - ay) * lineProgress;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(58,169,255,${0.25 * lineProgress})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw nodes
      for (let ni = 0; ni < CONSTELLATION_NODES.length; ni++) {
        const node = CONSTELLATION_NODES[ni];
        const appear = Math.max(0, Math.min(1, nodeProgress - ni));
        if (appear <= 0) continue;

        const nx = node.x * W;
        const ny = node.y * H;
        const r = node.size * 3 * appear;
        const glowR = node.size * 18 * appear;

        // Pulse
        const pulse = 1 + Math.sin(t * 2 + ni * 1.3) * 0.12;

        drawGlowStar(nx, ny, r * pulse, node.color, glowR * pulse, appear * 0.9);
      }

      // ── Two protagonist stars ──────────────────────────────────────
      const starProgress = Math.min(1, progress * 1.2);

      const axPos = lerp(STAR_A.startX, STAR_A.endX, starProgress) * W;
      const ayPos = lerp(STAR_A.startY, STAR_A.endY, starProgress) * H;
      const bxPos = lerp(STAR_B.startX, STAR_B.endX, starProgress) * W;
      const byPos = lerp(STAR_B.startY, STAR_B.endY, starProgress) * H;

      // Connecting thread between them — fades in as they approach
      const dist = Math.sqrt(Math.pow(bxPos - axPos, 2) + Math.pow(byPos - ayPos, 2));
      const maxDist = Math.sqrt(Math.pow(W * (STAR_B.startX - STAR_A.startX), 2) + Math.pow(H * (STAR_B.startY - STAR_A.startY), 2));
      const threadOpacity = Math.max(0, 1 - dist / maxDist) * 0.6;

      if (threadOpacity > 0.05) {
        ctx.beginPath();
        ctx.moveTo(axPos, ayPos);
        ctx.lineTo(bxPos, byPos);
        const grad = ctx.createLinearGradient(axPos, ayPos, bxPos, byPos);
        grad.addColorStop(0, `rgba(58,169,255,${threadOpacity})`);
        grad.addColorStop(1, `rgba(232,121,249,${threadOpacity})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Star A — electric blue (you)
      const aSize = 4 + Math.sin(t * 1.8) * 0.5;
      drawGlowStar(axPos, ayPos, aSize, "rgb(58,169,255)", 28, 0.95);

      // Star B — violet (her)
      const bSize = 4 + Math.sin(t * 1.5 + 1) * 0.5;
      drawGlowStar(bxPos, byPos, bSize, "rgb(232,121,249)", 28, 0.95);

      // Labels for protagonist stars (appear at start)
      if (progress < 0.15) {
        ctx.font = `11px var(--font-display)`;
        ctx.fillStyle = "rgba(58,169,255,0.6)";
        ctx.fillText("vaibhav", axPos + 12, ayPos - 10);
        ctx.fillStyle = "rgba(232,121,249,0.6)";
        ctx.fillText("nandani", bxPos + 12, byPos - 10);
      }

      tRef.current += 0.016;
      rafRef.current = requestAnimationFrame(frame);
    }

    frame();
    return () => cancelAnimationFrame(rafRef.current);
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
