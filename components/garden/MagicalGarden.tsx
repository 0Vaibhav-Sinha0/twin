"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import GardenCanvas from "./GardenCanvas";
import MemoryBloom from "./MemoryBloom";
import type { GardenFlower } from "@/data/garden";

export default function MagicalGarden() {
  const [activeFlower, setActiveFlower] = useState<GardenFlower | null>(null);

  const handleFlowerClick = useCallback((flower: GardenFlower) => {
    setActiveFlower((prev) => (prev?.id === flower.id ? null : flower));
  }, []);

  const handleClose = useCallback(() => {
    setActiveFlower(null);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)", zIndex: 0 }}
    >
      {/* Page header — floats over canvas */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-10 pb-4 text-center pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-hand text-sm mb-1"
          style={{ color: "rgba(253,230,138,0.6)" }}
        >
          every flower holds a memory
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="font-display text-3xl tracking-widest"
          style={{
            color: "#fde68a",
            textShadow: "0 0 30px rgba(251,191,36,0.4)",
          }}
        >
          The Garden
        </motion.h1>
      </div>

      {/* Hint text */}
      {!activeFlower && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-24 left-0 right-0 text-center font-hand text-sm z-10 pointer-events-none"
          style={{ color: "rgba(253,230,138,0.35)" }}
        >
          tap a flower to send the fox to it 🦊
        </motion.p>
      )}

      {/* Garden canvas — fills everything */}
      <div className="flex-1 relative" style={{ paddingBottom: "72px" }}>
        <GardenCanvas
          onFlowerClick={handleFlowerClick}
          activeFlowerId={activeFlower?.id ?? null}
        />

        {/* Memory bloom card */}
        <MemoryBloom flower={activeFlower} onClose={handleClose} />
      </div>
    </div>
  );
}
