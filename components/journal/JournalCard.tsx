"use client";

import { motion } from "framer-motion";
import type { JournalEntry } from "@/data/journal";

interface JournalCardProps {
  entry: JournalEntry;
  index: number;
  onClick: () => void;
}

export default function JournalCard({ entry, index, onClick }: JournalCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left rounded-2xl p-5 flex flex-col gap-3 transition-shadow duration-300"
      style={{
        background: "rgba(11,18,48,0.7)",
        border: `1px solid ${entry.moodColor}20`,
        backdropFilter: "blur(12px)",
        boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
        cursor: "pointer",
      }}
    >
      {/* Top row — mood + date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "16px" }}>{entry.mood}</span>
          <span
            className="font-hand text-xs"
            style={{ color: entry.moodColor, opacity: 0.8 }}
          >
            {entry.date}
          </span>
        </div>

        {/* Read cue */}
        <span
          className="font-display text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: entry.moodColor, fontSize: "9px" }}
        >
          READ →
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-display text-base tracking-wide leading-snug"
        style={{ color: "#e8f4ff" }}
      >
        {entry.title}
      </h3>

      {/* Preview */}
      <p
        className="font-hand text-sm leading-relaxed"
        style={{
          color: "rgba(232,244,255,0.5)",
          lineHeight: "1.7",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {entry.preview}
      </p>

      {/* Bottom accent line */}
      <div
        className="h-px w-8 rounded-full mt-1"
        style={{ backgroundColor: entry.moodColor, opacity: 0.4 }}
      />
    </motion.button>
  );
}
