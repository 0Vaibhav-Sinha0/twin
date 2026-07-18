"use client";

import { motion } from "framer-motion";
import BouquetScene from "./BouquetScene";

export default function MagicalGarden() {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ zIndex: 0 }}>
      {/* Page header — floats over the bouquet */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-10 pb-4 text-center pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-hand text-sm mb-1"
          style={{ color: "rgba(122,74,36,0.55)" }}
        >
          gathered, tied, and picked just for you
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="font-display text-3xl tracking-widest"
          style={{
            color: "#5a3a1f",
            textShadow: "0 0 24px rgba(255,255,255,0.5)",
          }}
        >
          The Garden
        </motion.h1>
      </div>

      {/* Gentle hint — fades once she's had a moment to notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="absolute bottom-24 left-0 right-0 text-center font-hand text-sm z-10 pointer-events-none"
        style={{ color: "rgba(122,74,36,0.4)" }}
      >
        tap to release a few petals ✦
      </motion.p>

      {/* Bouquet — fills everything */}
      <div className="flex-1 relative" style={{ paddingBottom: "72px" }}>
        <BouquetScene />
      </div>
    </div>
  );
}
