"use client";

import { motion } from "framer-motion";
import type { TimelineMilestone } from "@/data/timeline";
import { interpolateColor } from "./useTimelineScroll";

interface MilestoneCardProps {
  milestone: TimelineMilestone;
  index: number;
}

// Night colours (early milestones — blue)
const N_BG     = "#0b1230";
const N_BORDER = "#3aa9ff";
const N_TITLE  = "#e8f4ff";
const N_BODY   = "#9fb8d8";
const N_DATE   = "#3aa9ff";
const N_NODE   = "#3aa9ff";

// "Warm" end colours (later milestones — deep violet, still dark)
const D_BG     = "#1e1240";
const D_BORDER = "#c084fc";
const D_TITLE  = "#f3e8ff";
const D_BODY   = "#d8c5f0";
const D_DATE   = "#c084fc";
const D_NODE   = "#e879f9";

export default function MilestoneCard({ milestone, index }: MilestoneCardProps) {
  const { warmth, side } = milestone;
  const isLeft = side === "left";

  const bg     = interpolateColor(N_BG,     D_BG,     warmth);
  const border = interpolateColor(N_BORDER, D_BORDER, warmth);
  const title  = interpolateColor(N_TITLE,  D_TITLE,  warmth);
  const body   = interpolateColor(N_BODY,   D_BODY,   warmth);
  const date   = interpolateColor(N_DATE,   D_DATE,   warmth);
  const node   = interpolateColor(N_NODE,   D_NODE,   warmth);

  return (
    <div className="relative flex items-center w-full" style={{ minHeight: "120px" }}>

      {/* ── Left card slot ── */}
      <div className="flex-1 flex justify-end pr-8">
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ maxWidth: "340px", width: "100%" }}
          >
            <Card
              milestone={milestone}
              bg={bg}
              border={border}
              title={title}
              body={body}
              date={date}
              align="right"
            />
          </motion.div>
        )}
      </div>

      {/* ── Centre node ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 300 }}
        className="relative z-10 flex items-center justify-center flex-shrink-0"
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: bg,
          border: `2px solid ${node}`,
          boxShadow: `0 0 16px ${node}55, 0 0 32px ${node}22`,
          fontSize: "18px",
        }}
      >
        {milestone.icon}
      </motion.div>

      {/* ── Right card slot ── */}
      <div className="flex-1 flex justify-start pl-8">
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ maxWidth: "340px", width: "100%" }}
          >
            <Card
              milestone={milestone}
              bg={bg}
              border={border}
              title={title}
              body={body}
              date={date}
              align="left"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Card({
  milestone,
  bg,
  border,
  title,
  body,
  date,
  align,
}: {
  milestone: TimelineMilestone;
  bg: string;
  border: string;
  title: string;
  body: string;
  date: string;
  align: "left" | "right";
}) {
  return (
    <div
      className="rounded-2xl p-5 transition-shadow duration-300"
      style={{
        background: bg,
        border: `1px solid ${border}33`,
        boxShadow: `0 4px 24px ${border}15`,
        textAlign: align,
      }}
    >
      <p
        className="font-hand text-sm mb-1"
        style={{ color: date, opacity: 0.8 }}
      >
        {milestone.date}
      </p>
      <h3
        className="font-display text-lg tracking-wide mb-2"
        style={{ color: title }}
      >
        {milestone.title}
      </h3>
      <p
        className="font-body text-sm leading-relaxed italic"
        style={{ color: body, opacity: 0.85 }}
      >
        {milestone.body}
      </p>
    </div>
  );
}
