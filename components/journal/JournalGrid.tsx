"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { JOURNAL_ENTRIES } from "@/data/journal";
import type { JournalEntry } from "@/data/journal";
import JournalCard from "./JournalCard";
import JournalModal from "./JournalModal";

export default function JournalGrid() {
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);

  return (
    <>
      <div
        className="min-h-screen has-dock"
        style={{ backgroundColor: "#05070f" }}
      >
        {/* Ambient glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(159,122,234,0.06) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-5">
          {/* Page header */}
          <div className="pt-14 pb-10 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-hand text-lg mb-2"
              style={{ color: "rgba(201,136,107,0.7)" }}
            >
              things I needed to write down
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl tracking-widest"
              style={{ color: "#e8f4ff" }}
            >
              Journal
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-4 h-px max-w-24"
              style={{ backgroundColor: "rgba(201,136,107,0.3)" }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="font-body italic mt-3 text-sm"
              style={{ color: "rgba(232,244,255,0.3)" }}
            >
              {JOURNAL_ENTRIES.length} entries. tap any to read in full.
            </motion.p>
          </div>

          {/* Cards grid */}
          <div
            className="pb-24"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {JOURNAL_ENTRIES.map((entry, i) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                index={i}
                onClick={() => setActiveEntry(entry)}
              />
            ))}
          </div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center pb-8"
          >
            <span style={{ fontSize: "20px" }}>🦊</span>
            <p
              className="font-hand text-sm mt-2"
              style={{ color: "rgba(232,244,255,0.2)" }}
            >
              more entries will appear here over time
            </p>
          </motion.div>
        </div>
      </div>

      {/* Modal — rendered outside the scroll container */}
      <JournalModal
        entry={activeEntry}
        onClose={() => setActiveEntry(null)}
      />
    </>
  );
}
