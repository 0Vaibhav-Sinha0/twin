"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { THOUGHTS } from "@/data/thoughts";
import StickyNote from "./StickyNote";

// Deterministic position from seed — avoids overlap by dividing screen into zones
function seedToPosition(seed: number, index: number, total: number) {
  // Divide into a loose grid of zones, offset by seed for organic feel
  const cols = 4;
  const rows = Math.ceil(total / cols);
  const col = index % cols;
  const row = Math.floor(index / cols);

  const zoneW = 100 / cols;
  const zoneH = 100 / rows;

  // Base position in zone + seed-driven offset for organic scatter
  const xBase = col * zoneW + zoneW * 0.1;
  const yBase = row * zoneH + zoneH * 0.1;
  const xOffset = (seed * zoneW * 0.7);
  const yOffset = ((seed * 7.3) % 1) * zoneH * 0.6;

  return {
    left: `${Math.min(xBase + xOffset, 88)}%`,
    top: `${Math.min(yBase + yOffset, 85)}%`,
  };
}

export default function ThoughtsBoard() {
  const [shuffleKey, setShuffleKey] = useState(0);

  const positions = useMemo(() => {
    return THOUGHTS.map((t, i) => seedToPosition(t.seed + shuffleKey * 0.13, i, THOUGHTS.length));
  }, [shuffleKey]);

  // Estimate total scrollable height based on note count
  const boardHeight = Math.max(900, Math.ceil(THOUGHTS.length / 4) * 280 + 200);

  return (
    <div
      className="min-h-screen has-dock"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(159,122,234,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        {/* Page header */}
        <div className="pt-14 pb-6 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-hand text-lg mb-2"
            style={{ color: "rgba(251,191,36,0.6)" }}
          >
            things that crossed my mind
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl tracking-widest"
            style={{ color: "var(--text-primary)" }}
          >
            Random Thoughts
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-4 h-px max-w-24"
            style={{ backgroundColor: "rgba(251,191,36,0.25)" }}
          />

          {/* Shuffle button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setShuffleKey((k) => k + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="mt-5 font-display text-xs tracking-widest px-6 py-2.5 rounded-full transition-all"
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
              color: "rgba(251,191,36,0.7)",
              letterSpacing: "0.2em",
            }}
          >
            ✦ SHUFFLE
          </motion.button>
        </div>

        {/* Board — notes float freely */}
        <div
          className="relative w-full px-4"
          style={{ height: `${boardHeight}px` }}
        >
          {THOUGHTS.map((thought, i) => (
            <StickyNote
              key={`${thought.id}-${shuffleKey}`}
              thought={thought}
              style={positions[i]}
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
