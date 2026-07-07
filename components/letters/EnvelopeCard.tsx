"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Letter } from "@/data/letters";

interface EnvelopeCardProps {
  letter: Letter;
  index: number;
}

export default function EnvelopeCard({ letter, index }: EnvelopeCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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
        onClick={() => setIsOpen((o) => !o)}
        role="button"
        aria-expanded={isOpen}
        aria-label={`Open when ${letter.condition}`}
      >
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative rounded-xl overflow-hidden"
          style={{
            background: `linear-gradient(160deg, ${letter.accentColor} 0%, #05070f 100%)`,
            border: `1px solid ${letter.sealColor}22`,
            boxShadow: isOpen
              ? `0 8px 32px ${letter.sealColor}33`
              : `0 4px 16px rgba(0,0,0,0.4)`,
            transition: "box-shadow 0.3s ease",
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
            <motion.div
              animate={isOpen ? { scale: 0.85, opacity: 0.5 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
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
            </motion.div>

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

            {/* Open/close cue */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{
                color: `${letter.sealColor}66`,
                fontSize: "12px",
                lineHeight: 1,
              }}
            >
              ↓
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Letter (slides out below envelope) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="mt-2 rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "#fefcf7",
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 27px, rgba(122,92,62,0.07) 27px, rgba(122,92,62,0.07) 28px)",
                backgroundPositionY: "20px",
                boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${letter.sealColor}22`,
                borderRadius: "0 0 12px 12px",
              }}
            >
              {/* Letter header */}
              <div className="flex items-center gap-2 pb-2" style={{ borderBottom: `1px solid rgba(122,92,62,0.15)` }}>
                <span style={{ fontSize: "16px" }}>🦊</span>
                <p
                  className="font-hand text-sm"
                  style={{ color: letter.sealColor, opacity: 0.9 }}
                >
                  {letter.condition}
                </p>
              </div>

              {/* Letter paragraphs */}
              {letter.content.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="font-hand leading-relaxed"
                  style={{
                    fontSize: "14.5px",
                    color: "#7a5c3e",
                    lineHeight: "1.85",
                  }}
                >
                  {para}
                </motion.p>
              ))}

              {/* Closing */}
              <p
                className="font-hand text-right mt-2 pt-3"
                style={{
                  color: "#c9886b",
                  fontSize: "13px",
                  borderTop: "1px solid rgba(122,92,62,0.12)",
                }}
              >
                {letter.closing}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
