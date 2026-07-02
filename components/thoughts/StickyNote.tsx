"use client";

import { motion } from "framer-motion";
import type { Thought } from "@/data/thoughts";
import { THOUGHT_COLORS } from "@/data/thoughts";

const SIZE_CONFIG = {
  small:  { width: 140, fontSize: "12.5px", padding: "14px" },
  medium: { width: 178, fontSize: "13.5px", padding: "16px" },
  large:  { width: 218, fontSize: "14.5px", padding: "18px" },
};

interface StickyNoteProps {
  thought: Thought;
  style?: React.CSSProperties;
  delay?: number;
}

export default function StickyNote({ thought, style, delay = 0 }: StickyNoteProps) {
  const colors = THOUGHT_COLORS[thought.color];
  const size = SIZE_CONFIG[thought.size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: thought.rotation }}
      animate={{ opacity: 1, scale: 1, rotate: thought.rotation }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.08,
        rotate: 0,
        zIndex: 50,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      style={{
        position: "absolute",
        width: `${size.width}px`,
        cursor: "default",
        ...style,
      }}
    >
      <div
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: "4px",
          padding: size.padding,
          boxShadow: `0 0 20px ${colors.glow}, 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
          backdropFilter: "blur(12px)",
          position: "relative",
        }}
      >
        {/* Pin at top */}
        <div
          style={{
            position: "absolute",
            top: "-7px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${colors.text}, ${colors.border})`,
            boxShadow: `0 0 6px ${colors.glow}`,
            zIndex: 2,
          }}
        />

        {/* Text */}
        <p
          className="font-hand text-center leading-relaxed"
          style={{
            fontSize: size.fontSize,
            color: colors.text,
            lineHeight: "1.75",
          }}
        >
          {thought.text}
        </p>

        {/* Subtle corner fold */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "18px",
            height: "18px",
            background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.3) 50%)`,
            borderRadius: "0 0 4px 0",
          }}
        />
      </div>
    </motion.div>
  );
}
