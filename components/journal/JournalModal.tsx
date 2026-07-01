"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { JournalEntry } from "@/data/journal";

interface JournalModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
}

export default function JournalModal({ entry, onClose }: JournalModalProps) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (entry) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [entry]);

  return (
    <AnimatePresence>
      {entry && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 cursor-pointer"
            style={{ backgroundColor: "rgba(2,4,12,0.85)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto pointer-events-auto rounded-2xl"
              style={{
                background: "#fefcf7",
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 27px, rgba(122,92,62,0.07) 27px, rgba(122,92,62,0.07) 28px)",
                backgroundPositionY: "48px",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,136,107,0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="sticky top-0 z-10 flex items-start justify-between px-7 pt-7 pb-4"
                style={{
                  background: "linear-gradient(to bottom, #fefcf7 85%, transparent)",
                }}
              >
                <div className="flex flex-col gap-1">
                  {/* Mood + date */}
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "18px" }}>{entry.mood}</span>
                    <span
                      className="font-hand text-sm"
                      style={{ color: entry.moodColor }}
                    >
                      {entry.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-display text-xl tracking-wide leading-snug"
                    style={{ color: "#7a5c3e", maxWidth: "340px" }}
                  >
                    {entry.title}
                  </h2>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200 hover:scale-110"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "rgba(122,92,62,0.1)",
                    color: "#7a5c3e",
                    fontSize: "16px",
                    marginTop: "4px",
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Divider */}
              <div
                className="mx-7 mb-5"
                style={{ height: "1px", backgroundColor: "rgba(122,92,62,0.15)" }}
              />

              {/* Content */}
              <div className="px-7 pb-8 flex flex-col gap-5">
                {entry.content.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                    className="font-hand leading-relaxed"
                    style={{
                      fontSize: "15px",
                      color: "#7a5c3e",
                      lineHeight: "1.9",
                    }}
                  >
                    {para}
                  </motion.p>
                ))}

                {/* Fox signature */}
                <div
                  className="flex items-center gap-2 mt-4 pt-4"
                  style={{ borderTop: "1px solid rgba(122,92,62,0.12)" }}
                >
                  <span style={{ fontSize: "16px" }}>🦊</span>
                  <span
                    className="font-hand text-sm"
                    style={{ color: "rgba(122,92,62,0.4)" }}
                  >
                    written with care
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
