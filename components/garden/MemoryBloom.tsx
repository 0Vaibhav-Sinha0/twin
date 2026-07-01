"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GardenFlower } from "@/data/garden";

interface MemoryBloomProps {
  flower: GardenFlower | null;
  onClose: () => void;
}

export default function MemoryBloom({ flower, onClose }: MemoryBloomProps) {
  return (
    <AnimatePresence>
      {flower && (
        <motion.div
          key={flower.id}
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full px-4"
          style={{ maxWidth: "480px", zIndex: 20 }}
        >
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: "rgba(12,7,3,0.82)",
              backdropFilter: "blur(16px)",
              border: `1px solid ${flower.glowColor}33`,
              boxShadow: `0 0 32px ${flower.glowColor}22, 0 8px 32px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Flower label + close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full"
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: flower.color,
                    boxShadow: `0 0 8px ${flower.glowColor}`,
                  }}
                />
                <span
                  className="font-display text-xs tracking-widest"
                  style={{ color: flower.glowColor }}
                >
                  {flower.label}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  width: "24px",
                  height: "24px",
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "14px",
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Memory text */}
            <p
              className="font-hand leading-relaxed"
              style={{
                fontSize: "15px",
                color: "rgba(253,230,138,0.9)",
                lineHeight: "1.8",
              }}
            >
              {flower.memory}
            </p>

            {/* Fox signature */}
            <p
              className="font-hand text-xs text-right"
              style={{ color: "rgba(253,230,138,0.3)" }}
            >
              🦊 tap another flower to explore
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
