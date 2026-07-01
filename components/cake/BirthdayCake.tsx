"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Confetti from "./Confetti";
import WishReveal from "./WishReveal";

// Dynamic import — Three.js is client-only
const CakeScene = dynamic(() => import("./CakeScene"), { ssr: false });

type Phase = "idle" | "lighting" | "lit" | "blown";

const CANDLE_COUNT = 7;

export default function BirthdayCake() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [candlesLit, setCandlesLit] = useState<boolean[]>(
    Array(CANDLE_COUNT).fill(false)
  );
  const [confetti, setConfetti] = useState(false);
  const [showWish, setShowWish] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const lightingRef = useRef(false);

  // Tap the cake area to start lighting candles one by one
  const handleCakeTap = useCallback(() => {
    if (phase !== "idle" || lightingRef.current) return;
    lightingRef.current = true;
    setPhase("lighting");

    // Light candles one by one with delay
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setCandlesLit((prev) => {
        const next = [...prev];
        next[count - 1] = true;
        return next;
      });
      if (count >= CANDLE_COUNT) {
        clearInterval(interval);
        setPhase("lit");
        lightingRef.current = false;
      }
    }, 260);
  }, [phase]);

  // Swipe up to blow
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (phase !== "lit") return;
    const endY = e.changedTouches[0].clientY;
    const startY = touchStartY.current ?? endY;
    const swipeUp = startY - endY;

    if (swipeUp > 60) {
      handleBlow();
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mouse drag fallback for desktop
  const mouseStartY = useRef<number | null>(null);
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStartY.current = e.clientY;
  }, []);
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (phase !== "lit") return;
    const swipeUp = (mouseStartY.current ?? e.clientY) - e.clientY;
    if (swipeUp > 40) handleBlow();
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBlow = useCallback(() => {
    if (phase !== "lit") return;
    setPhase("blown");

    // Extinguish candles one by one fast
    let count = CANDLE_COUNT;
    const interval = setInterval(() => {
      count--;
      setCandlesLit((prev) => {
        const next = [...prev];
        next[count] = false;
        return next;
      });
      if (count <= 0) {
        clearInterval(interval);
        setTimeout(() => {
          setConfetti(true);
          setTimeout(() => setShowWish(true), 600);
        }, 400);
      }
    }, 80);
  }, [phase]);

  const allLit = candlesLit.every(Boolean);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center"
      style={{
        background:
          phase === "blown" || showWish
            ? "linear-gradient(135deg, #fdf2f8 0%, #fef3c7 100%)"
            : "linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 40%, #4a2060 100%)",
        transition: "background 1.2s ease",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Page header */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-10 text-center pointer-events-none">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-hand text-sm mb-1"
          style={{ color: phase === "blown" ? "#c9886b" : "rgba(253,230,138,0.6)" }}
        >
          {phase === "idle" && "tap the cake to light the candles"}
          {phase === "lighting" && "lighting up…"}
          {phase === "lit" && "now swipe up to blow ↑"}
          {phase === "blown" && "you did it! 🎉"}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-3xl tracking-widest"
          style={{
            color: phase === "blown" ? "#7c3aed" : "#fde68a",
            textShadow:
              phase !== "blown"
                ? "0 0 30px rgba(251,191,36,0.5)"
                : "none",
          }}
        >
          Birthday Cake
        </motion.h1>
      </div>

      {/* 3D Cake — centre of screen */}
      <div
        className="relative flex-1 w-full max-w-xl cursor-pointer"
        style={{ paddingTop: "80px", paddingBottom: "120px" }}
        onClick={handleCakeTap}
      >
        <CakeScene phase={phase} candlesLit={candlesLit} />

        {/* Tap hint overlay — idle only */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-end justify-center pointer-events-none"
              style={{ paddingBottom: "140px" }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="font-hand text-base text-center px-6 py-3 rounded-2xl"
                style={{
                  color: "rgba(253,230,138,0.7)",
                  background: "rgba(0,0,0,0.3)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(253,230,138,0.15)",
                }}
              >
                tap to light 🕯
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swipe up cue — lit only */}
        <AnimatePresence>
          {allLit && phase === "lit" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-end justify-center pointer-events-none"
              style={{ paddingBottom: "140px" }}
            >
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ color: "rgba(253,230,138,0.6)", fontSize: "28px" }}
                >
                  ↑
                </motion.div>
                <div
                  className="font-hand text-sm px-5 py-2 rounded-xl"
                  style={{
                    color: "rgba(253,230,138,0.8)",
                    background: "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(253,230,138,0.15)",
                  }}
                >
                  swipe up to blow the candles 💨
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confetti burst */}
      <Confetti active={confetti} />

      {/* Wish reveal */}
      <WishReveal visible={showWish} />
    </div>
  );
}
