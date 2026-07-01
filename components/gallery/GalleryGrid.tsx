"use client";

import { GALLERY_CARDS } from "@/data/gallery";
import PolaroidCard from "./PolaroidCard";
import { motion } from "framer-motion";

export default function GalleryGrid() {
  return (
    <div
      className="min-h-screen has-dock"
      style={{ backgroundColor: "var(--day-parchment)" }}
    >
      {/* Page header */}
      <div className="pt-14 pb-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-hand text-lg mb-2"
          style={{ color: "var(--day-terracotta)" }}
        >
          every photo tells something
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl tracking-widest"
          style={{ color: "var(--day-ink)" }}
        >
          Memory Gallery
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 h-px max-w-24"
          style={{ backgroundColor: "var(--day-terracotta)", opacity: 0.3 }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-body italic mt-4 text-base"
          style={{ color: "var(--day-ink)", opacity: 0.5 }}
        >
          tap any card to read what&apos;s on the other side
        </motion.p>
      </div>

      {/* Grid */}
      <div
        className="px-6 pb-16"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "32px",
          maxWidth: "1100px",
          margin: "0 auto",
          justifyItems: "center",
        }}
      >
        {GALLERY_CARDS.map((card, i) => (
          <PolaroidCard key={card.id} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}
