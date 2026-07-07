"use client";

import { motion } from "framer-motion";

import type { Transition } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease } as Transition,
});

export default function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center has-dock">
      {/* Top accent */}
      <motion.div
        {...fadeUp(0.3)}
        className="flex items-center gap-3 mb-8"
      >
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-teal-400/40" />
        <span
          className="font-hand text-sm tracking-widest"
          style={{ color: "rgba(100,255,200,0.55)" }}
        >
          july 26 · a day for you
        </span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-teal-400/40" />
      </motion.div>

      {/* Main name */}
      <motion.div {...fadeUp(0.5)} className="mb-4">
        <h1
          className="font-display font-bold leading-none"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 8rem)",
            color: "var(--text-primary)",
            textShadow:
              "0 0 40px rgba(100,255,200,0.3), 0 0 80px rgba(58,169,255,0.15)",
            letterSpacing: "0.12em",
          }}
        >
          Nandani
        </h1>
      </motion.div>

      {/* Decorative rule */}
      <motion.div
        {...fadeUp(0.65)}
        className="flex items-center gap-4 mb-8"
      >
        <div
          className="h-px flex-1 max-w-24"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(100,255,200,0.4))",
          }}
        />
        <span style={{ color: "rgba(160,80,255,0.6)", fontSize: "10px" }}>
          ✦
        </span>
        <div
          className="h-px flex-1 max-w-24"
          style={{
            background:
              "linear-gradient(to left, transparent, rgba(100,255,200,0.4))",
          }}
        />
      </motion.div>

      {/* Personal message */}
      <motion.p
        {...fadeUp(0.8)}
        className="font-body text-xl md:text-2xl italic max-w-lg leading-relaxed mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        This entire world was built for you —
        <br />
        every pixel, every word, every memory.
      </motion.p>

      <motion.p
        {...fadeUp(0.95)}
        className="font-hand text-lg mb-16"
        style={{ color: "rgba(100,255,200,0.5)" }}
      >
        happy birthday, twin 🦊
      </motion.p>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-28 flex flex-col items-center gap-2"
      >
        <span
          className="font-display text-xs tracking-widest"
          style={{ color: "var(--text-muted)", letterSpacing: "0.2em" }}
        >
          EXPLORE
        </span>
        {/* Animated chevron */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: "rgba(58,169,255,0.4)", fontSize: "20px" }}
        >
          ↓
        </motion.div>
      </motion.div>
    </div>
  );
}
