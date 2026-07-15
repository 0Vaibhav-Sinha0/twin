"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────
// A dense, classic bouquet of red roses — one flower type, bundled
// tightly into a mound, wrapped in simple white paper, tied with a
// red ribbon. Matches a real bouquet's silhouette: full, uniform,
// no visual clutter.
// ─────────────────────────────────────────────────────────────────

const C = {
  wrapA: "#fffaf5", wrapB: "#f5ece0", wrapC: "#e8dac8",
  ribbon: "#d43f3f", ribbonDark: "#a3222a",
  centerShadow: "#4a0d14",
};

// Two rose colour variants for subtle natural variation across the cluster
const ROSE_GRADIENTS = ["roseGradA", "roseGradB"] as const;

// ── Shape primitives ──────────────────────────────────────────────

// Rounder, cupped petal — real rose petals curl and fold, they don't
// taper to a sharp point like a tulip.
function rosePetalPath(length: number, width: number): string {
  const flat = width * 0.32;
  return `M 0,0 C ${-width},${-length * 0.25} ${-width},${-length * 0.75} ${-flat},${-length} Q 0,${-length * 1.05} ${flat},${-length} C ${width},${-length * 0.75} ${width},${-length * 0.25} 0,0 Z`;
}

interface Ring {
  count: number;
  radiusStart: number;
  petalLength: number;
  petalWidth: number;
  rotationOffset: number;
  gradientId: string;
}

function RoseHead({ gradient }: { gradient: string }) {
  const rings: Ring[] = [
    { count: 5, radiusStart: 15, petalLength: 17, petalWidth: 15, rotationOffset: 0, gradientId: gradient },
    { count: 6, radiusStart: 10, petalLength: 15, petalWidth: 13, rotationOffset: 22, gradientId: gradient },
    { count: 6, radiusStart: 6, petalLength: 12, petalWidth: 11, rotationOffset: 40, gradientId: gradient },
    { count: 5, radiusStart: 3, petalLength: 9, petalWidth: 8, rotationOffset: 15, gradientId: gradient },
    { count: 4, radiusStart: 0.5, petalLength: 5.5, petalWidth: 5, rotationOffset: 35, gradientId: gradient },
  ];
  return (
    <g>
      {rings.map((ring, ri) => (
        <g key={ri}>
          {Array.from({ length: ring.count }).map((_, i) => {
            const angle = (360 / ring.count) * i + ring.rotationOffset;
            return (
              <g key={i} transform={`rotate(${angle}) translate(0, ${-ring.radiusStart})`}>
                <path d={rosePetalPath(ring.petalLength, ring.petalWidth)} fill={`url(#${ring.gradientId})`} />
              </g>
            );
          })}
        </g>
      ))}
      <circle r={1.6} fill={C.centerShadow} />
    </g>
  );
}

// ── Composition — a dense, hand-packed dome of roses ───────────────

interface RosePlacement { x: number; y: number; rotate: number; scale: number; variant: 0 | 1; }

const ROSES: RosePlacement[] = [
  // Row 1 — back, smallest
  { x: 150, y: 148, rotate: -8, scale: 0.58, variant: 0 },
  { x: 188, y: 144, rotate: 4, scale: 0.6, variant: 1 },
  { x: 226, y: 148, rotate: 10, scale: 0.58, variant: 0 },

  // Row 2
  { x: 118, y: 180, rotate: -14, scale: 0.72, variant: 1 },
  { x: 158, y: 175, rotate: -3, scale: 0.76, variant: 0 },
  { x: 197, y: 173, rotate: 6, scale: 0.78, variant: 1 },
  { x: 236, y: 177, rotate: -5, scale: 0.75, variant: 0 },
  { x: 270, y: 182, rotate: 12, scale: 0.7, variant: 1 },

  // Row 3
  { x: 100, y: 216, rotate: -16, scale: 0.88, variant: 0 },
  { x: 141, y: 209, rotate: 5, scale: 0.94, variant: 1 },
  { x: 183, y: 206, rotate: -6, scale: 0.98, variant: 0 },
  { x: 224, y: 209, rotate: 8, scale: 0.94, variant: 1 },
  { x: 264, y: 215, rotate: -10, scale: 0.88, variant: 0 },

  // Row 4 — front, larger
  { x: 121, y: 251, rotate: -12, scale: 1.05, variant: 1 },
  { x: 163, y: 245, rotate: 4, scale: 1.15, variant: 0 },
  { x: 205, y: 244, rotate: -7, scale: 1.18, variant: 1 },
  { x: 246, y: 248, rotate: 10, scale: 1.12, variant: 0 },
  { x: 284, y: 255, rotate: -4, scale: 1.0, variant: 1 },

  // Row 5 — very front, biggest, closest to the wrap
  { x: 150, y: 281, rotate: 6, scale: 1.1, variant: 0 },
  { x: 200, y: 285, rotate: -5, scale: 1.16, variant: 1 },
  { x: 245, y: 281, rotate: 9, scale: 1.08, variant: 0 },
];

interface Sparkle { id: number; x: number; y: number; tx: number; ty: number; color: string; }
interface FallingPetal { id: number; x: number; startY: number; endY: number; drift: number; color: string; duration: number; }

let idCounter = 0;

export default function BouquetScene() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [fallingPetals, setFallingPetals] = useState<FallingPetal[]>([]);

  // Occasional single petal drifting down — rare, adds life without noise
  useEffect(() => {
    function spawnPetal() {
      const source = ROSES[Math.floor(Math.random() * ROSES.length)];
      const id = idCounter++;
      const petal: FallingPetal = {
        id,
        x: source.x + (Math.random() - 0.5) * 16,
        startY: source.y,
        endY: source.y + 170 + Math.random() * 90,
        drift: (Math.random() - 0.5) * 60,
        color: ["#e2483f", "#b9273a", "#fdf3ed"][Math.floor(Math.random() * 3)],
        duration: 4 + Math.random() * 2,
      };
      setFallingPetals((prev) => [...prev, petal]);
      setTimeout(() => {
        setFallingPetals((prev) => prev.filter((p) => p.id !== id));
      }, petal.duration * 1000 + 200);
    }

    const interval = setInterval(spawnPetal, 9000 + Math.random() * 6000);
    return () => clearInterval(interval);
  }, []);

  const handleTap = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const vbX = ((clientX - rect.left) / rect.width) * 380;
    const vbY = ((clientY - rect.top) / rect.height) * 480;

    const newSparkles: Sparkle[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 60;
      newSparkles.push({
        id: idCounter++,
        x: vbX, y: vbY,
        tx: vbX + Math.cos(angle) * dist,
        ty: vbY + Math.sin(angle) * dist - 30,
        color: ["#e2483f", "#fdf3ed", "#fbcfc9"][Math.floor(Math.random() * 3)],
      });
    }
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.some((n) => n.id === s.id)));
    }, 1100);
  }, []);

  const bgGradient = useMemo(
    () => "linear-gradient(180deg, #f5f1d8 0%, #f8dfe9 55%, #f3c9db 100%)",
    []
  );

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: bgGradient }}
    >
      <motion.svg
        ref={svgRef}
        viewBox="0 0 380 480"
        className="relative z-10"
        style={{ width: "min(80vw, 340px)", height: "auto", cursor: "pointer" }}
        onClick={(e) => handleTap(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) handleTap(t.clientX, t.clientY);
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: [0, -4, 0] }}
        transition={{
          opacity: { duration: 1.2 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        }}
      >
        <defs>
          <radialGradient id="roseGradA" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor="#5c0f18" />
            <stop offset="45%" stopColor="#a81f2c" />
            <stop offset="100%" stopColor="#e2483f" />
          </radialGradient>
          <radialGradient id="roseGradB" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor="#6b1420" />
            <stop offset="45%" stopColor="#b9273a" />
            <stop offset="100%" stopColor="#eb5044" />
          </radialGradient>
          <linearGradient id="wrapGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.wrapA} />
            <stop offset="55%" stopColor={C.wrapB} />
            <stop offset="100%" stopColor={C.wrapC} />
          </linearGradient>
        </defs>

        {/* ── Wrap (paper cone) ── */}
        <path
          d="M 105,308 Q 195,338 285,308 L 250,468 Q 195,484 140,468 Z"
          fill="url(#wrapGrad)"
          stroke="rgba(122,90,60,0.15)"
          strokeWidth={1}
        />
        <path d="M 145,320 L 168,462" stroke="rgba(122,90,60,0.1)" strokeWidth={1} fill="none" />
        <path d="M 195,325 L 197,470" stroke="rgba(122,90,60,0.1)" strokeWidth={1} fill="none" />
        <path d="M 245,320 L 222,462" stroke="rgba(122,90,60,0.1)" strokeWidth={1} fill="none" />

        {/* ── Rose cluster — back to front ── */}
        {ROSES.map((r, i) => (
          <g key={i} transform={`translate(${r.x},${r.y}) rotate(${r.rotate}) scale(${r.scale})`}>
            <RoseHead gradient={ROSE_GRADIENTS[r.variant]} />
          </g>
        ))}

        {/* ── Ribbon bow, tied over the wrap ── */}
        <g transform="translate(195,326)">
          <path d="M 0,0 C -22,-14 -34,2 -18,10 C -8,15 -2,6 0,0 Z" fill={C.ribbon} stroke={C.ribbonDark} strokeWidth={1} />
          <path d="M 0,0 C 22,-14 34,2 18,10 C 8,15 2,6 0,0 Z" fill={C.ribbon} stroke={C.ribbonDark} strokeWidth={1} />
          <path d="M -4,2 L -16,52 L -5,44 Z" fill={C.ribbon} />
          <path d="M 6,2 L 20,54 L 9,45 Z" fill={C.ribbon} />
          <circle r={6} fill={C.ribbonDark} />
        </g>

        {/* ── Falling petals ── */}
        <AnimatePresence>
          {fallingPetals.map((p) => (
            <motion.g
              key={p.id}
              initial={{ x: p.x, y: p.startY, opacity: 0, rotate: 0 }}
              animate={{
                x: p.x + p.drift,
                y: p.endY,
                opacity: [0, 0.9, 0.9, 0],
                rotate: 340,
              }}
              transition={{ duration: p.duration, ease: "easeIn" }}
            >
              <path d={rosePetalPath(9, 7)} fill={p.color} />
            </motion.g>
          ))}
        </AnimatePresence>

        {/* ── Tap sparkle burst ── */}
        <AnimatePresence>
          {sparkles.map((s) => (
            <motion.circle
              key={s.id}
              initial={{ cx: s.x, cy: s.y, opacity: 1, r: 3 }}
              animate={{ cx: s.tx, cy: s.ty, opacity: 0, r: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              fill={s.color}
            />
          ))}
        </AnimatePresence>
      </motion.svg>
    </div>
  );
}
