"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { THOUGHTS } from "@/data/thoughts";
import NicknameCard from "./NicknameCard";

const NO_RESPONSES = [
  "wrong answer twin ☠️",
  "okay but that was mean 😭",
  "that hurt. i'm going to cry now. okay bye.",
  "this is not the response i prepared for.",
];

export default function ThoughtsBoard() {
  const [shuffledThoughts, setShuffledThoughts] = useState(THOUGHTS);
  const [unlockState, setUnlockState] = useState<"idle" | "unlocked" | "no">("idle");
  const [noResponse, setNoResponse] = useState("");
  const [noCount, setNoCount] = useState(0);

  const handleShuffle = () => {
    const shuffled = [...shuffledThoughts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledThoughts(shuffled);
  };

  const handleNo = () => {
    const next = noCount + 1;
    setNoCount(next);
    setNoResponse(NO_RESPONSES[Math.floor(Math.random() * NO_RESPONSES.length)]);
    setUnlockState("no");
    // After 2s, reset back to idle so they can try again
    setTimeout(() => setUnlockState("idle"), 2200);
  };

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
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(159,122,234,0.04) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        {/* Page header */}
        <div className="pt-14 pb-6 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-hand text-lg mb-2"
            style={{ color: "rgba(251,191,36,0.6)" }}
          >
            all the names i have for you
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl tracking-widest"
            style={{ color: "var(--text-primary)" }}
          >
            Nicknames
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-4 h-px max-w-24"
            style={{ backgroundColor: "rgba(251,191,36,0.25)" }}
          />

          {/* Shuffle button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleShuffle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="mt-5 font-display text-xs tracking-widest px-6 py-2.5 rounded-full transition-all"
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
              color: "rgba(251,191,36,0.7)",
              letterSpacing: "0.2em",
            }}
          >
            ✦ SHUFFLE
          </motion.button>
        </div>

        {/* Nickname spine — alternating cards connected to a central line */}
        <div
          className="relative mx-auto px-2"
          style={{ maxWidth: "480px", paddingBottom: "60px" }}
        >
          {/* Gradient centre spine */}
          <div
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
            style={{
              width: "2px",
              background:
                "linear-gradient(to bottom, #fbbf24 0%, #f472b6 30%, #a78bfa 60%, #60a5fa 100%)",
              opacity: 0.4,
              borderRadius: "1px",
            }}
          />

          <div className="relative flex flex-col gap-2 pt-4">
            <AnimatePresence mode="popLayout">
              {shuffledThoughts.map((thought, i) => (
                <motion.div
                  key={thought.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <NicknameCard thought={thought} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* End cap */}
          <div className="flex flex-col items-center gap-3 pt-6">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #60a5fa33, #a78bfa33)",
                border: "1px solid rgba(167,139,250,0.4)",
                fontSize: "18px",
              }}
            >
              🦊
            </div>
          </div>
        </div>

        {/* ── Locked nickname section ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto px-6 pb-32 flex flex-col items-center gap-6"
          style={{ maxWidth: "420px" }}
        >
          {/* Divider */}
          <div className="flex items-center gap-3 w-full">
            <div className="h-px flex-1" style={{ background: "rgba(251,191,36,0.15)" }} />
            <span style={{ fontSize: "14px", opacity: 0.4 }}>🔒</span>
            <div className="h-px flex-1" style={{ background: "rgba(251,191,36,0.15)" }} />
          </div>

          {/* Lock card */}
          <div
            className="w-full rounded-2xl p-7 flex flex-col items-center gap-5 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(251,191,36,0.2)",
              boxShadow: "0 0 32px rgba(251,191,36,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Lock icon with pulse */}
            <motion.div
              animate={unlockState === "idle" ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "36px" }}
            >
              {unlockState === "unlocked" ? "🔓" : "🔒"}
            </motion.div>

            <div>
              <p
                className="font-display text-sm tracking-widest mb-1"
                style={{ color: "var(--text-muted)", letterSpacing: "0.18em" }}
              >
                1 NICKNAME LOCKED
              </p>
              <p
                className="font-hand text-xl leading-snug"
                style={{ color: "var(--text-primary)" }}
              >
                still waiting to unlock one nickname
              </p>
            </div>

            {/* State: idle — show Yes / No */}
            <AnimatePresence mode="wait">
              {unlockState === "idle" && (
                <motion.div
                  key="buttons"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-3 w-full"
                >
                  <p
                    className="font-hand text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    unlock it?
                  </p>
                  <div className="flex gap-3 w-full">
                    {/* YES */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setUnlockState("unlocked")}
                      className="flex-1 py-3 rounded-xl font-display text-xs tracking-widest"
                      style={{
                        background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,146,60,0.15))",
                        border: "1px solid rgba(251,191,36,0.4)",
                        color: "#fde68a",
                        boxShadow: "0 0 16px rgba(251,191,36,0.15)",
                      }}
                    >
                      YES ✦
                    </motion.button>

                    {/* NO */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNo}
                      className="flex-1 py-3 rounded-xl font-display text-xs tracking-widest"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "var(--text-muted)",
                      }}
                    >
                      NO
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* State: unlocked — show the nickname */}
              {unlockState === "unlocked" && (
                <motion.div
                  key="unlocked"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Sparkle burst */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: "28px", letterSpacing: "8px" }}
                  >
                    ✨✨✨
                  </motion.div>

                  {/* The nickname */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="font-display text-4xl tracking-widest"
                    style={{
                      color: "#fde68a",
                      textShadow: "0 0 32px rgba(251,191,36,0.6)",
                    }}
                  >
                    Mine
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="font-hand text-base text-center leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    waiting to call u by this nickname 😭
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="font-hand text-xs text-center"
                    style={{ color: "rgba(251,191,36,0.45)", letterSpacing: "0.04em" }}
                  >
                    (yes, this was a rizz. no, I'm not sorry.) 💀
                  </motion.p>
                </motion.div>
              )}

              {/* State: no — funny random response */}
              {unlockState === "no" && (
                <motion.div
                  key={`no-${noCount}`}
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-2"
                >
                  <span style={{ fontSize: "32px" }}>💀</span>
                  <p
                    className="font-hand text-lg text-center leading-snug"
                    style={{ color: "#fb923c" }}
                  >
                    {noResponse}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
