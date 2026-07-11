"use client";

import { motion } from "framer-motion";
import type { Thought } from "@/data/thoughts";
import { THOUGHT_COLORS } from "@/data/thoughts";

interface NicknameCardProps {
  thought: Thought;
  index: number;
}

export default function NicknameCard({ thought, index }: NicknameCardProps) {
  const isLeft = index % 2 === 0;
  const colors = THOUGHT_COLORS[thought.color];

  return (
    <div className="relative flex items-center w-full" style={{ minHeight: "96px" }}>
      {/* Left card slot */}
      <div className="flex-1 flex justify-end pr-6">
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: "220px", width: "100%" }}
          >
            <Card thought={thought} colors={colors} align="right" />
          </motion.div>
        )}
      </div>

      {/* Centre node — connects to the spine */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: 0.15, type: "spring", stiffness: 300 }}
        className="relative z-10 flex-shrink-0 rounded-full"
        style={{
          width: "10px",
          height: "10px",
          background: colors.text,
          boxShadow: `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}`,
        }}
      />

      {/* Right card slot */}
      <div className="flex-1 flex justify-start pl-6">
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: "220px", width: "100%" }}
          >
            <Card thought={thought} colors={colors} align="left" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Card({
  thought,
  colors,
  align,
}: {
  thought: Thought;
  colors: { bg: string; border: string; text: string; glow: string };
  align: "left" | "right";
}) {
  return (
    <div
      className="rounded-2xl px-5 py-4 transition-shadow duration-300"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 0 16px ${colors.glow}, 0 4px 16px rgba(0,0,0,0.4)`,
        textAlign: align,
        backdropFilter: "blur(12px)",
      }}
    >
      <p
        className="font-hand"
        style={{
          fontSize: "20px",
          color: colors.text,
          lineHeight: "1.4",
        }}
      >
        {thought.text}
      </p>
    </div>
  );
}
