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
  const [daysOpen, setDaysOpen] = useState(false);
  const days = week.days ?? [];

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
            ? "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(11,18,48,0.92))"
            : "linear-gradient(135deg, rgba(251,191,36,0.04), rgba(11,18,48,0.6))",
          border: "1px solid rgba(251,191,36,0.3)",
          borderLeft: "3px solid rgba(251,191,36,0.7)",
          boxShadow: isOpen
            ? "0 0 32px rgba(251,191,36,0.1)"
            : "none",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {/* Week label + date */}
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "11px" }}>📅</span>
              <span
                className="font-display text-sm tracking-widest"
                style={{ color: "#fbbf24" }}
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
              style={{ color: "rgba(251,191,36,0.55)" }}
            >
              {week.memories.length} memories inside
            </p>
          </div>

          {/* Expand chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 mt-1"
            style={{ color: "rgba(251,191,36,0.5)", fontSize: "16px" }}
          >
            ↓
          </motion.div>
        </div>
      </button>

      {/* Memories grid — nested visibly beneath the week header */}
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
              className="pt-3 pb-1 pl-4 ml-1"
              style={{
                borderLeft: "2px solid rgba(251,191,36,0.15)",
              }}
            >
              <div
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

              {/* Day-by-day toggle */}
              <div className="mt-4 mb-2">
                <button
                  onClick={() => setDaysOpen((o) => !o)}
                  aria-expanded={daysOpen}
                  className="font-hand text-sm rounded-full px-4 py-2 transition-all duration-300"
                  style={{
                    color: "#fbbf24",
                    background: daysOpen
                      ? "rgba(251,191,36,0.14)"
                      : "rgba(251,191,36,0.06)",
                    border: "1px solid rgba(251,191,36,0.35)",
                  }}
                >
                  {daysOpen ? "hide day by day ↑" : "📖 day by day ↓"}
                </button>

                <AnimatePresence initial={false}>
                  {daysOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      {days.length === 0 ? (
                        <p
                          className="font-hand text-sm pt-3"
                          style={{ color: "rgba(232,244,255,0.4)" }}
                        >
                          the day-by-day story for this week is on its way 🦊
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3 pt-3">
                          {days.map((day) => (
                            <div
                              key={day.id}
                              className="rounded-xl p-4"
                              style={{
                                background: "rgba(11,18,48,0.7)",
                                border: "1px solid rgba(251,191,36,0.18)",
                              }}
                            >
                              <div className="flex items-baseline gap-3 mb-1">
                                <span
                                  className="font-display text-xs tracking-widest"
                                  style={{ color: "#fbbf24" }}
                                >
                                  {day.date}
                                </span>
                                {day.title && (
                                  <span
                                    className="font-hand text-sm"
                                    style={{ color: "rgba(232,244,255,0.55)" }}
                                  >
                                    {day.title}
                                  </span>
                                )}
                              </div>
                              <p
                                className="font-body text-sm leading-relaxed"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {day.summary}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
