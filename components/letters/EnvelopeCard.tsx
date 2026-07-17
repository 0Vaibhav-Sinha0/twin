"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Letter } from "@/data/letters";

interface EnvelopeCardProps {
  letter: Letter;
  index: number;
}

export default function EnvelopeCard({ letter, index }: EnvelopeCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col"
    >
      {/* ── Envelope ── */}
      <div
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(true)}
        role="button"
        aria-label={`Open when ${letter.condition}`}
      >
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative rounded-xl overflow-hidden"
          style={{
            background: `linear-gradient(160deg, ${letter.accentColor} 0%, #05070f 100%)`,
            border: `1px solid ${letter.sealColor}22`,
            boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
          }}
        >
          {/* Envelope flap — triangular top */}
          <div
            style={{
              height: "60px",
              background: `linear-gradient(135deg, ${letter.accentColor}cc, ${letter.sealColor}22)`,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              borderBottom: `1px solid ${letter.sealColor}33`,
            }}
          />

          {/* Envelope body */}
          <div className="px-5 pb-5 pt-2 flex flex-col items-center gap-4">
            {/* Wax seal */}
            <div
              className="relative flex items-center justify-center rounded-full -mt-4"
              style={{
                width: "52px",
                height: "52px",
                background: `radial-gradient(circle at 35% 35%, ${letter.sealColor}dd, ${letter.sealColor}88)`,
                boxShadow: `0 0 0 2px ${letter.sealColor}44, 0 0 16px ${letter.sealColor}44`,
                fontSize: "22px",
                zIndex: 2,
              }}
            >
              🦊
            </div>

            {/* "Open when..." label */}
            <div className="text-center">
              <p
                className="font-hand text-xs mb-1"
                style={{ color: `${letter.sealColor}88`, letterSpacing: "0.12em" }}
              >
                open when
              </p>
              <p
                className="font-display text-sm tracking-wide leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {letter.shortLabel}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Letter modal — centered popup over dimmed backdrop ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 cursor-pointer"
              style={{ backgroundColor: "rgba(2,4,12,0.82)", backdropFilter: "blur(6px)" }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="relative w-full max-w-lg max-h-[82vh] overflow-y-auto pointer-events-auto rounded-2xl"
                style={{
                  background: "#0d0714",
                  border: `1px solid ${letter.sealColor}22`,
                  boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${letter.sealColor}11`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top gradient line + close button */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-7 pt-6 pb-4" style={{ background: "#0d0714" }}>
                  <div
                    className="flex-1 mr-4"
                    style={{
                      height: "2px",
                      background: `linear-gradient(to right, ${letter.sealColor}, transparent)`,
                      borderRadius: "1px",
                    }}
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200 hover:scale-110"
                    style={{
                      width: "30px",
                      height: "30px",
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "15px",
                    }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="px-7 pb-8 flex flex-col gap-4">
                  <span style={{ fontSize: "26px" }}>
                    {letter.sealColor === "#f59e0b" ? "⭐" : letter.sealColor === "#f472b6" ? "🌸" : "💗"}
                  </span>

                  <h2
                    className="font-display text-2xl leading-snug"
                    style={{ color: "#f2eee8" }}
                  >
                    {letter.condition}
                  </h2>

                  {letter.content.map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                      className="font-body leading-relaxed"
                      style={{
                        fontSize: "15px",
                        color: "rgba(232,228,222,0.75)",
                        lineHeight: "1.85",
                      }}
                    >
                      {para}
                    </motion.p>
                  ))}

                  {/* Closing */}
                  <p
                    className="font-hand italic mt-2 pt-4"
                    style={{
                      color: letter.sealColor,
                      fontSize: "14px",
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {letter.closing}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
