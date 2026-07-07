"use client";

import { motion } from "framer-motion";
import { CHAT_WEEKS } from "@/data/chatMemories";
import WeekCard from "./WeekCard";

export default function ChatTimeline() {
  const totalMemories = CHAT_WEEKS.reduce(
    (acc, w) => acc + w.memories.length,
    0
  );

  return (
    <div
      className="min-h-screen has-dock"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(58,169,255,0.05) 0%, transparent 70%)",
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
            style={{ color: "rgba(58,169,255,0.6)" }}
          >
            every message. every moment.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl tracking-widest"
            style={{ color: "var(--text-primary)" }}
          >
            Chat Memories
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-4 h-px max-w-24"
            style={{ backgroundColor: "rgba(58,169,255,0.3)" }}
          />

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-5"
          >
            {[
              { value: CHAT_WEEKS.length, label: "weeks" },
              { value: totalMemories, label: "memories" },
              { value: "∞", label: "more to make" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-0.5">
                <span
                  className="font-display text-2xl"
                  style={{ color: "#3aa9ff" }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-hand text-xs"
                  style={{ color: "rgba(232,244,255,0.35)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="font-body italic mt-4 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            tap any week to read what lived inside it
          </motion.p>
        </div>

        {/* Week accordion */}
        <div className="flex flex-col gap-4 pb-24">
          {CHAT_WEEKS.map((week, i) => (
            <WeekCard
              key={week.id}
              week={week}
              index={i}
              defaultOpen={i === 0}
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
          <span style={{ fontSize: "24px" }}>🦊</span>
          <p
            className="font-hand text-sm mt-2"
            style={{ color: "var(--text-muted)" }}
          >
            and there&apos;s so much more still being written
          </p>
        </motion.div>
      </div>
    </div>
  );
}
