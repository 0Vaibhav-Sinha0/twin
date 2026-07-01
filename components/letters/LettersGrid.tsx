"use client";

import { motion } from "framer-motion";
import { LETTERS } from "@/data/letters";
import EnvelopeCard from "./EnvelopeCard";

export default function LettersGrid() {
  return (
    <div
      className="min-h-screen has-dock"
      style={{ backgroundColor: "#05070f" }}
    >
      {/* Ambient radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(11,18,48,0.8) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        {/* Page header */}
        <div className="pt-14 pb-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-hand text-lg mb-2"
            style={{ color: "rgba(159,122,234,0.7)" }}
          >
            written for every version of you
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl tracking-widest"
            style={{ color: "#e8f4ff" }}
          >
            Open When…
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-4 h-px max-w-24"
            style={{ backgroundColor: "rgba(159,122,234,0.4)" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-body italic mt-3 text-base"
            style={{ color: "rgba(232,244,255,0.4)" }}
          >
            eleven letters. one for every feeling. tap the seal to open.
          </motion.p>
        </div>

        {/* Envelopes grid */}
        <div
          className="px-6 pb-24"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {LETTERS.map((letter, i) => (
            <EnvelopeCard key={letter.id} letter={letter} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
