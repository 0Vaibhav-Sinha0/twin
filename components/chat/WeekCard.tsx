"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatWeek } from "@/data/chatMemories";
import MemoryItemCard from "./MemoryItemCard";

interface WeekCardProps {
  week: ChatWeek;
  index: number;
  defaultOpen?: boolean;
}

export default function WeekCard({ week, index, defaultOpen = false }: WeekCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Week header — click to expand/collapse */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full text-left rounded-2xl p-5 transition-all duration-300"
        style={{
          background: isOpen
            ? "rgba(11,18,48,0.9)"
            : "rgba(11,18,48,0.5)",
          border: "1px solid rgba(58,169,255,0.15)",
          boxShadow: isOpen
            ? "0 0 32px rgba(58,169,255,0.08)"
            : "none",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {/* Week label + date */}
            <div className="flex items-center gap-3">
              <span
                className="font-display text-sm tracking-widest"
                style={{ color: "#3aa9ff" }}
              >
                {week.week}
              </span>
              <span
                className="font-hand text-xs"
                style={{ color: "rgba(232,244,255,0.35)" }}
              >
                {week.dateRange}
              </span>
            </div>

            {/* Tagline */}
            <p
              className="font-body italic text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {week.tagline}
            </p>

            {/* Memory count */}
            <p
              className="font-hand text-xs mt-1"
              style={{ color: "rgba(58,169,255,0.5)" }}
            >
              {week.memories.length} memories inside
            </p>
          </div>

          {/* Expand chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 mt-1"
            style={{ color: "rgba(58,169,255,0.4)", fontSize: "16px" }}
          >
            ↓
          </motion.div>
        </div>
      </button>

      {/* Memories grid — slides open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="pt-3 pb-1"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "12px",
              }}
            >
              {week.memories.map((memory, i) => (
                <MemoryItemCard key={memory.id} memory={memory} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
