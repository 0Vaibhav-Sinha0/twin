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
    <div
      className="relative flex items-center justify-center mx-auto w-full"
      style={{ minHeight: "76px", maxWidth: "280px" }}
    >
      {/* Left card slot — fixed width, close to spine */}
      <div className="flex justify-end" style={{ width: "118px" }}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%" }}
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
          width: "8px",
          height: "8px",
          margin: "0 8px",
          background: colors.text,
          boxShadow: `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}`,
        }}
      />

      {/* Right card slot — fixed width, close to spine */}
      <div className="flex justify-start" style={{ width: "118px" }}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%" }}
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
      className="rounded-2xl px-3 py-2.5 transition-shadow duration-300"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 0 14px ${colors.glow}, 0 4px 14px rgba(0,0,0,0.4)`,
        textAlign: align,
        backdropFilter: "blur(12px)",
      }}
    >
      <p
        className="font-hand"
        style={{
          fontSize: "16px",
          color: colors.text,
          lineHeight: "1.35",
        }}
      >
        {thought.text}
      </p>
    </div>
  );
}
