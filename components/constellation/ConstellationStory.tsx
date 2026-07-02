"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import StarMap from "./StarMap";
import { CONSTELLATION_NODES } from "@/data/constellation";

export default function ConstellationStory() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which node is currently "active" based on progress
  const activeNodeIndex = Math.min(
    CONSTELLATION_NODES.length - 1,
    Math.floor(progress * (CONSTELLATION_NODES.length + 1)) - 1
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky star map — stays fixed while scrolling through story */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh", zIndex: 0 }}
      >
        <StarMap progress={progress} />

        {/* Page header — fades out as you scroll */}
        <div
          className="absolute top-0 left-0 right-0 pt-12 text-center pointer-events-none z-10"
          style={{ opacity: Math.max(0, 1 - progress * 8) }}
        >
          <p
            className="font-hand text-lg mb-2"
            style={{ color: "rgba(58,169,255,0.6)" }}
          >
            two stars. one story.
          </p>
          <h1
            className="font-display text-4xl tracking-widest"
            style={{
              color: "#e8f4ff",
              textShadow: "0 0 40px rgba(58,169,255,0.3)",
            }}
          >
            Our Constellation
          </h1>
          <motion.p
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-8 font-hand text-sm"
            style={{ color: "rgba(232,244,255,0.3)" }}
          >
            scroll to draw the stars ↓
          </motion.p>
        </div>

        {/* Active node story text — floats over the map */}
        {activeNodeIndex >= 0 && (
          <div
            className="absolute bottom-28 left-0 right-0 flex justify-center px-6 pointer-events-none z-10"
          >
            <motion.div
              key={activeNodeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-sm rounded-2xl p-5 text-center"
              style={{
                background: "rgba(2,4,12,0.75)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${CONSTELLATION_NODES[activeNodeIndex]?.color ?? "#3aa9ff"}33`,
                boxShadow: `0 0 32px ${CONSTELLATION_NODES[activeNodeIndex]?.color ?? "#3aa9ff"}15`,
              }}
            >
              <p
                className="font-display text-xs tracking-widest mb-3"
                style={{
                  color: CONSTELLATION_NODES[activeNodeIndex]?.color ?? "#3aa9ff",
                  opacity: 0.8,
                }}
              >
                ✦ {CONSTELLATION_NODES[activeNodeIndex]?.label} ✦
              </p>
              <p
                className="font-hand leading-relaxed"
                style={{
                  fontSize: "14px",
                  color: "rgba(232,244,255,0.85)",
                  lineHeight: "1.8",
                }}
              >
                {CONSTELLATION_NODES[activeNodeIndex]?.text}
              </p>
            </motion.div>
          </div>
        )}

        {/* Final message — appears when constellation is complete */}
        {progress > 0.92 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div
              className="max-w-md text-center px-8 py-10 rounded-3xl"
              style={{
                background: "rgba(2,4,12,0.88)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(253,230,138,0.2)",
                boxShadow: "0 0 80px rgba(253,230,138,0.08)",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>🌌</div>
              <h2
                className="font-display text-2xl tracking-widest mb-4"
                style={{ color: "#fde68a", textShadow: "0 0 30px rgba(253,230,138,0.4)" }}
              >
                The Constellation Is Complete
              </h2>
              <p
                className="font-hand leading-relaxed mb-3"
                style={{ fontSize: "15px", color: "rgba(232,244,255,0.75)", lineHeight: "1.9" }}
              >
                Every star is a moment. Every line is a choice we made —
                to keep talking, to keep showing up, to keep being this.
              </p>
              <p
                className="font-hand"
                style={{ fontSize: "15px", color: "rgba(232,244,255,0.75)", lineHeight: "1.9" }}
              >
                The constellation doesn&apos;t end here. It just keeps growing —
                one star at a time, one year at a time.
              </p>
              <div
                className="mt-6 pt-4 font-hand text-sm"
                style={{
                  color: "rgba(253,230,138,0.5)",
                  borderTop: "1px solid rgba(253,230,138,0.1)",
                }}
              >
                happy birthday, twin 🦊
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll spacer — drives the sticky animation */}
      <div
        style={{
          height: `${(CONSTELLATION_NODES.length + 2) * 100}vh`,
          marginTop: "-100vh",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
