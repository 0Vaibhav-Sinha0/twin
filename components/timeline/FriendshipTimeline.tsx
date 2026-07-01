"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TIMELINE_MILESTONES } from "@/data/timeline";
import MilestoneCard from "./MilestoneCard";
import { useTimelineScroll, interpolateColor } from "./useTimelineScroll";

export default function FriendshipTimeline() {
  const { progress, containerRef } = useTimelineScroll();

  // Background interpolates from night void → day parchment as you scroll
  const bgColor = useMemo(
    () => interpolateColor("#05070f", "#fbf6ec", progress),
    [progress]
  );

  const textColor = useMemo(
    () => interpolateColor("#e8f4ff", "#7a5c3e", progress),
    [progress]
  );

  const accentColor = useMemo(
    () => interpolateColor("#3aa9ff", "#c9886b", progress),
    [progress]
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen has-dock transition-colors duration-100"
      style={{ backgroundColor: bgColor }}
    >
      {/* Page header */}
      <div className="pt-14 pb-4 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-hand text-lg mb-2"
          style={{ color: accentColor }}
        >
          from the very first message
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl tracking-widest"
          style={{ color: textColor }}
        >
          Our Story
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-4 h-px max-w-24"
          style={{ backgroundColor: accentColor, opacity: 0.4 }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="font-body italic mt-3 text-base"
          style={{ color: textColor, opacity: 0.5 }}
        >
          scroll to watch it unfold
        </motion.p>
      </div>

      {/* Timeline body */}
      <div
        className="relative mx-auto px-4"
        style={{ maxWidth: "880px", paddingBottom: "120px" }}
      >
        {/* The gradient centre line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
          style={{
            width: "2px",
            background:
              "linear-gradient(to bottom, #3aa9ff 0%, #9f7aea 35%, #c9886b 65%, #4a6b5a 100%)",
            opacity: 0.4,
            borderRadius: "1px",
          }}
        />

        {/* Milestones */}
        <div className="relative flex flex-col gap-16 pt-8">
          {TIMELINE_MILESTONES.map((milestone, i) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              index={i}
            />
          ))}
        </div>

        {/* End cap */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative z-10 mx-auto mt-16 flex flex-col items-center gap-3"
          style={{ width: "fit-content" }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: "56px",
              height: "56px",
              background: "linear-gradient(135deg, #c9886b33, #4a6b5a33)",
              border: "1px solid rgba(201,136,107,0.4)",
              fontSize: "24px",
            }}
          >
            🦊
          </div>
          <p
            className="font-hand text-center"
            style={{ color: "#7a5c3e", opacity: 0.6, fontSize: "14px" }}
          >
            and this is only the beginning
          </p>
        </motion.div>
      </div>
    </div>
  );
}
