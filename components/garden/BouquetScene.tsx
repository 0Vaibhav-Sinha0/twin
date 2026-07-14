"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────
// A single, hand-composed flower bouquet. Not a scattered field —
// one deliberate, gathered arrangement: roses in front, peonies
// and ranunculus filling in, eucalyptus framing the edges, wrapped
// in kraft paper and tied with ribbon. Every petal is a real bezier
// shape with base-to-tip shading, not a canvas ellipse.
// ─────────────────────────────────────────────────────────────────

const C = {
  roseBase: "#a84f66", roseMid: "#e08ba0", roseTip: "#fbe4ea",
  peonyBase: "#d99ba3", peonyMid: "#f3d9d9", peonyTip: "#fef8f0",
  ranABase: "#c98454", ranAMid: "#eeb888", ranATip: "#fce8cf",
  ranBBase: "#c06c86", ranBMid: "#e8a3b8", ranBTip: "#fbe0e6",
  leafBase: "#4f6b40", leafMid: "#7c9c63", leafTip: "#a8c48f",
  stem: "#5f7d4f",
  wrapBase: "#c7a179", wrapMid: "#dcbd96", wrapTip: "#ecd7b8",
  ribbon: "#b96e84", ribbonDark: "#8f5064",
  centerDark: "#6b3a2a", centerGold: "#d4af7a",
};

// ── Shape primitives ──────────────────────────────────────────────

function petalPath(length: number, width: number): string {
  return `M 0,0 C ${-width},${-length * 0.28} ${-width * 0.85},${-length * 0.78} 0,${-length} C ${width * 0.85},${-length * 0.78} ${width},${-length * 0.28} 0,0 Z`;
}

function stemPath(fromX: number, fromY: number, toX: number, toY: number): string {
  const midX = (fromX + toX) / 2 + (toX - fromX) * 0.12;
  const midY = (fromY + toY) / 2 + 6;
  return `M ${fromX},${fromY} Q ${midX},${midY} ${toX},${toY}`;
}

interface Ring {
  count: number;
  radiusStart: number;
  petalLength: number;
  petalWidth: number;
  rotationOffset: number;
  gradientId: string;
  opacity?: number;
}

function FlowerHead({ rings, centerColor, centerRadius = 5 }: { rings: Ring[]; centerColor: string; centerRadius?: number }) {
  return (
    <g>
      {rings.map((ring, ri) => (
        <g key={ri}>
          {Array.from({ length: ring.count }).map((_, i) => {
            const angle = (360 / ring.count) * i + ring.rotationOffset;
            return (
              <g key={i} transform={`rotate(${angle}) translate(0, ${-ring.radiusStart})`}>
                <path d={petalPath(ring.petalLength, ring.petalWidth)} fill={`url(#${ring.gradientId})`} opacity={ring.opacity ?? 1} />
              </g>
            );
          })}
        </g>
      ))}
      <circle r={centerRadius} fill={centerColor} />
      <circle r={centerRadius * 0.4} fill={C.centerGold} opacity={0.7} />
    </g>
  );
}

function Rose() {
  return (
    <FlowerHead
      centerColor={C.centerDark}
      centerRadius={4}
      rings={[
        { count: 6, radiusStart: 13, petalLength: 21, petalWidth: 15, rotationOffset: 0, gradientId: "roseGrad" },
        { count: 6, radiusStart: 7, petalLength: 17, petalWidth: 12, rotationOffset: 30, gradientId: "roseGrad" },
        { count: 5, radiusStart: 2, petalLength: 11, petalWidth: 8, rotationOffset: 15, gradientId: "roseGradInner" },
      ]}
    />
  );
}

function Peony() {
  return (
    <FlowerHead
      centerColor={C.centerGold}
      centerRadius={4}
      rings={[
        { count: 7, radiusStart: 15, petalLength: 23, petalWidth: 19, rotationOffset: 0, gradientId: "peonyGrad" },
        { count: 7, radiusStart: 9, petalLength: 19, petalWidth: 16, rotationOffset: 26, gradientId: "peonyGrad" },
        { count: 6, radiusStart: 4, petalLength: 14, petalWidth: 12, rotationOffset: 10, gradientId: "peonyGradInner" },
        { count: 5, radiusStart: 1, petalLength: 8, petalWidth: 7, rotationOffset: 40, gradientId: "peonyGradInner" },
      ]}
    />
  );
}

function Ranunculus({ variant }: { variant: "a" | "b" }) {
  const outer = variant === "a" ? "ranAGrad" : "ranBGrad";
  const inner = variant === "a" ? "ranAGradInner" : "ranBGradInner";
  return (
    <FlowerHead
      centerColor={variant === "a" ? C.ranABase : C.ranBBase}
      centerRadius={3}
      rings={[
        { count: 6, radiusStart: 8, petalLength: 11, petalWidth: 9, rotationOffset: 0, gradientId: outer },
        { count: 6, radiusStart: 4.5, petalLength: 9, petalWidth: 7, rotationOffset: 28, gradientId: outer },
        { count: 5, radiusStart: 2, petalLength: 6, petalWidth: 5, rotationOffset: 12, gradientId: inner },
        { count: 4, radiusStart: 0, petalLength: 3.5, petalWidth: 3.5, rotationOffset: 40, gradientId: inner },
      ]}
    />
  );
}

function EucalyptusSprig({ length, curve }: { length: number; curve: number }) {
  const leafPairs = 4;
  const leaves = [];
  for (let i = 1; i <= leafPairs; i++) {
    const t = i / (leafPairs + 0.5);
    const y = -length * t;
    const x = curve * t * t;
    const s = 1 - t * 0.35;
    leaves.push(
      <g key={`l${i}`} transform={`translate(${x - 6},${y}) rotate(-55) scale(${s})`}>
        <path d={petalPath(11, 5.5)} fill="url(#leafGrad)" />
      </g>,
      <g key={`r${i}`} transform={`translate(${x + 6},${y}) rotate(55) scale(${s})`}>
        <path d={petalPath(11, 5.5)} fill="url(#leafGrad)" />
      </g>
    );
  }
  return (
    <g>
      <path d={`M 0,0 Q ${curve * 0.5},${-length * 0.5} ${curve},${-length}`} stroke={C.stem} strokeWidth={1.6} fill="none" />
      {leaves}
    </g>
  );
}

function BabysBreath() {
  const sprigs = [
    { x: -8, y: -14 }, { x: 9, y: -16 }, { x: 0, y: -20 }, { x: -14, y: -6 }, { x: 15, y: -8 },
  ];
  return (
    <g>
      {sprigs.map((s, i) => (
        <g key={i}>
          <path d={`M 0,0 L ${s.x},${s.y}`} stroke={C.leafMid} strokeWidth={0.8} fill="none" opacity={0.7} />
          <circle cx={s.x} cy={s.y} r={2.6} fill="#fffaf2" opacity={0.95} />
        </g>
      ))}
    </g>
  );
}

// ── Composition — hand-placed, not randomized ─────────────────────

const TIE_POINT = { x: 190, y: 398 };

const ROSES = [
  { x: 190, y: 226, rotate: 0, scale: 1.15 },
  { x: 138, y: 252, rotate: -16, scale: 0.92 },
  { x: 242, y: 248, rotate: 14, scale: 0.92 },
];
const PEONIES = [
  { x: 92, y: 272, rotate: -22, scale: 1.02 },
  { x: 288, y: 266, rotate: 20, scale: 1.02 },
];
const RANUNCULUS = [
  { x: 163, y: 190, rotate: -8, scale: 0.85, variant: "a" as const },
  { x: 216, y: 186, rotate: 9, scale: 0.85, variant: "b" as const },
  { x: 118, y: 222, rotate: -14, scale: 0.75, variant: "b" as const },
];
const EUCALYPTUS = [
  { x: 66, y: 338, length: 130, curve: -55 },
  { x: 314, y: 332, length: 128, curve: 58 },
  { x: 190, y: 278, length: 118, curve: 8 },
];
const FILLER = [
  { x: 152, y: 240 }, { x: 228, y: 236 }, { x: 190, y: 205 },
  { x: 96, y: 296 }, { x: 282, y: 296 },
];

const ALL_FLOWER_HEADS = [
  ...ROSES.map((f) => ({ ...f, kind: "rose" as const })),
  ...PEONIES.map((f) => ({ ...f, kind: "peony" as const })),
  ...RANUNCULUS.map((f) => ({ ...f, kind: "ranunculus" as const })),
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
      const source = ALL_FLOWER_HEADS[Math.floor(Math.random() * ALL_FLOWER_HEADS.length)];
      const id = idCounter++;
      const petal: FallingPetal = {
        id,
        x: source.x + (Math.random() - 0.5) * 20,
        startY: source.y,
        endY: source.y + 160 + Math.random() * 80,
        drift: (Math.random() - 0.5) * 60,
        color: [C.roseTip, C.peonyMid, C.ranBMid][Math.floor(Math.random() * 3)],
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
        color: [C.roseTip, C.peonyTip, C.ranATip, "#fffaf2"][Math.floor(Math.random() * 4)],
      });
    }
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.some((n) => n.id === s.id)));
    }, 1100);
  }, []);

  const bokeh = useMemo(
    () => [
      { left: "8%", top: "12%", size: 140, color: "rgba(242,184,198,0.35)" },
      { left: "78%", top: "8%", size: 110, color: "rgba(212,175,122,0.3)" },
      { left: "85%", top: "55%", size: 160, color: "rgba(224,139,160,0.25)" },
      { left: "5%", top: "60%", size: 130, color: "rgba(143,167,122,0.28)" },
      { left: "50%", top: "82%", size: 180, color: "rgba(236,215,184,0.3)" },
    ],
    []
  );

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f6e9dc 0%, #f2ddd3 55%, #eed2ca 100%)",
      }}
    >
      {/* Soft bokeh backdrop */}
      {bokeh.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: b.left,
            top: b.top,
            width: `${b.size}px`,
            height: `${b.size}px`,
            background: b.color,
            filter: "blur(40px)",
          }}
        />
      ))}

      {/* Ground shadow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: "50%",
          bottom: "14%",
          transform: "translateX(-50%)",
          width: "180px",
          height: "24px",
          background: "radial-gradient(ellipse, rgba(107,58,42,0.18), transparent 70%)",
          filter: "blur(4px)",
        }}
      />

      <motion.svg
        ref={svgRef}
        viewBox="0 0 380 480"
        className="relative z-10"
        style={{ width: "min(78vw, 340px)", height: "auto", cursor: "pointer" }}
        onClick={(e) => handleTap(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) handleTap(t.clientX, t.clientY);
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: 1,
          y: [0, -4, 0],
        }}
        transition={{
          opacity: { duration: 1.2 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        }}
      >
        <defs>
          <radialGradient id="roseGrad" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor={C.roseBase} />
            <stop offset="65%" stopColor={C.roseMid} />
            <stop offset="100%" stopColor={C.roseTip} />
          </radialGradient>
          <radialGradient id="roseGradInner" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor={C.roseMid} />
            <stop offset="100%" stopColor={C.roseTip} />
          </radialGradient>

          <radialGradient id="peonyGrad" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor={C.peonyBase} />
            <stop offset="65%" stopColor={C.peonyMid} />
            <stop offset="100%" stopColor={C.peonyTip} />
          </radialGradient>
          <radialGradient id="peonyGradInner" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor={C.peonyMid} />
            <stop offset="100%" stopColor={C.peonyTip} />
          </radialGradient>

          <radialGradient id="ranAGrad" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor={C.ranABase} />
            <stop offset="60%" stopColor={C.ranAMid} />
            <stop offset="100%" stopColor={C.ranATip} />
          </radialGradient>
          <radialGradient id="ranAGradInner" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor={C.ranAMid} />
            <stop offset="100%" stopColor={C.ranATip} />
          </radialGradient>
          <radialGradient id="ranBGrad" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor={C.ranBBase} />
            <stop offset="60%" stopColor={C.ranBMid} />
            <stop offset="100%" stopColor={C.ranBTip} />
          </radialGradient>
          <radialGradient id="ranBGradInner" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor={C.ranBMid} />
            <stop offset="100%" stopColor={C.ranBTip} />
          </radialGradient>

          <radialGradient id="leafGrad" cx="0.5" cy="1" r="1">
            <stop offset="0%" stopColor={C.leafBase} />
            <stop offset="70%" stopColor={C.leafMid} />
            <stop offset="100%" stopColor={C.leafTip} />
          </radialGradient>

          <linearGradient id="wrapGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.wrapTip} />
            <stop offset="50%" stopColor={C.wrapMid} />
            <stop offset="100%" stopColor={C.wrapBase} />
          </linearGradient>
        </defs>

        {/* ── Wrap (paper cone) ── */}
        <path
          d="M 120,388 Q 190,410 260,388 L 235,478 Q 190,490 145,478 Z"
          fill="url(#wrapGrad)"
          stroke="rgba(122,74,36,0.15)"
          strokeWidth={1}
        />
        <path d="M 150,400 L 175,470" stroke="rgba(122,74,36,0.12)" strokeWidth={1} fill="none" />
        <path d="M 190,405 L 195,475" stroke="rgba(122,74,36,0.12)" strokeWidth={1} fill="none" />
        <path d="M 230,400 L 210,470" stroke="rgba(122,74,36,0.12)" strokeWidth={1} fill="none" />

        {/* ── Stems ── */}
        {ALL_FLOWER_HEADS.map((f, i) => (
          <path
            key={`stem-${i}`}
            d={stemPath(TIE_POINT.x, TIE_POINT.y, f.x, f.y + 18)}
            stroke={C.stem}
            strokeWidth={1.8}
            fill="none"
          />
        ))}

        {/* ── Eucalyptus (greenery, behind everything) ── */}
        {EUCALYPTUS.map((e, i) => (
          <g key={`euc-${i}`} transform={`translate(${e.x},${e.y})`}>
            <EucalyptusSprig length={e.length} curve={e.curve} />
          </g>
        ))}

        {/* ── Baby's breath filler ── */}
        {FILLER.map((f, i) => (
          <g key={`fill-${i}`} transform={`translate(${f.x},${f.y})`}>
            <BabysBreath />
          </g>
        ))}

        {/* ── Ranunculus ── */}
        {RANUNCULUS.map((r, i) => (
          <motion.g
            key={`ran-${i}`}
            transform={`translate(${r.x},${r.y}) rotate(${r.rotate}) scale(${r.scale})`}
            animate={{ rotate: [r.rotate - 1.5, r.rotate + 1.5, r.rotate - 1.5] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            style={{ transformOrigin: `${r.x}px ${r.y}px` }}
          >
            <Ranunculus variant={r.variant} />
          </motion.g>
        ))}

        {/* ── Peonies ── */}
        {PEONIES.map((p, i) => (
          <motion.g
            key={`peo-${i}`}
            transform={`translate(${p.x},${p.y}) rotate(${p.rotate}) scale(${p.scale})`}
            animate={{ rotate: [p.rotate - 1.2, p.rotate + 1.2, p.rotate - 1.2] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          >
            <Peony />
          </motion.g>
        ))}

        {/* ── Roses (focal, front-most) ── */}
        {ROSES.map((r, i) => (
          <motion.g
            key={`rose-${i}`}
            transform={`translate(${r.x},${r.y}) rotate(${r.rotate}) scale(${r.scale})`}
            animate={{ rotate: [r.rotate - 1, r.rotate + 1, r.rotate - 1] }}
            transition={{ duration: 5.5 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            style={{ transformOrigin: `${r.x}px ${r.y}px` }}
          >
            <Rose />
          </motion.g>
        ))}

        {/* ── Ribbon bow, tied over the gathered stems ── */}
        <g transform={`translate(${TIE_POINT.x},${TIE_POINT.y - 4})`}>
          <path d="M 0,0 C -22,-14 -34,2 -18,10 C -8,15 -2,6 0,0 Z" fill={C.ribbon} stroke={C.ribbonDark} strokeWidth={1} />
          <path d="M 0,0 C 22,-14 34,2 18,10 C 8,15 2,6 0,0 Z" fill={C.ribbon} stroke={C.ribbonDark} strokeWidth={1} />
          <path d="M -4,2 L -14,42 L -4,36 Z" fill={C.ribbon} />
          <path d="M 6,2 L 18,44 L 8,37 Z" fill={C.ribbon} />
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
              <path d={petalPath(9, 6)} fill={p.color} />
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
