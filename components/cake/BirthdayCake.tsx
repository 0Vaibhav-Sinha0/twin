"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Confetti from "./Confetti";
import CakeBackground from "./CakeBackground";
import { useBlowDetector } from "./useBlowDetector";
import { usePianoMusic } from "./usePianoMusic";
import type { CakePhase } from "./CakeScene";

const CakeScene = dynamic(() => import("./CakeScene"), { ssr: false });

const CANDLE_COUNT = 7;

const WISH_MESSAGE = "I hope every wish you make today finds its way to you.";

const HIDDEN_HEART_MESSAGE =
  "Every layer of this cake hides a little piece of my appreciation for you.";

const FINAL_MESSAGE_PARAGRAPHS = [
  "You did it. You blew them out.",
  "Happy birthday, Nandani. Happy birthday, lomri. Happy birthday, twin.",
  "This one's for you. 🦊🎂✨",
];

export default function BirthdayCake() {
  const [phase, setPhase] = useState<CakePhase>("idle");
  const [candlesLit, setCandlesLit] = useState<boolean[]>(Array(CANDLE_COUNT).fill(false));
  const [extinguishing, setExtinguishing] = useState(false);
  const [cutProgress, setCutProgress] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showHeartMessage, setShowHeartMessage] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lightingRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);

  const { play: playPiano, stop: stopPiano } = usePianoMusic();

  // Detect low-end / mobile for reduced particle count
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 480;
    setReducedMotion(isMobile && isSmallScreen);
  }, []);

  const handleBlow = useCallback(() => {
    setPhase("blowing");
    setExtinguishing(true);

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
        stopPiano();
        setTimeout(() => {
          setPhase("blown");
          setConfetti(true);
          setTimeout(() => setConfetti(false), 2500);
        }, 500);
      }
    }, 100);
  }, [stopPiano]);

  const { micStatus, start: startMicListening, stop: stopMicListening } = useBlowDetector({
    onBlow: handleBlow,
    threshold: 42,
    sustainedFrames: 3,
  });

  // Tap the cake to start lighting candles
  const handleCakeTap = useCallback(() => {
    if (phase !== "idle" || lightingRef.current) return;
    lightingRef.current = true;
    setPhase("lighting");

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
        playPiano();
      }
    }, 300);
  }, [phase, playPiano]);

  // Wish flow
  const handleMakeWish = useCallback(() => {
    setPhase("wishing");
  }, []);

  const handleReadyToBlow = useCallback(() => {
    // Try mic first
    startMicListening();
  }, [startMicListening]);

  // Swipe/drag fallback for blow
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (phase !== "wishing" || micStatus === "active") return;
    const endY = e.changedTouches[0].clientY;
    const startY = touchStartY.current ?? endY;
    if (startY - endY > 60) {
      stopMicListening();
      handleBlow();
    }
  }, [phase, micStatus, handleBlow, stopMicListening]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStartY.current = e.clientY;
  }, []);
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (phase !== "wishing" || micStatus === "active") return;
    const swipeUp = (mouseStartY.current ?? e.clientY) - e.clientY;
    if (swipeUp > 40) {
      stopMicListening();
      handleBlow();
    }
  }, [phase, micStatus, handleBlow, stopMicListening]);

  // Cutting flow
  const handleCutCake = useCallback(() => {
    setPhase("cutting");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      setCutProgress(Math.min(1, progress));
      if (progress >= 1) {
        clearInterval(interval);
        setPhase("cut");
        setConfetti(true);
        setTimeout(() => {
          setConfetti(false);
          setShowFinalMessage(true);
        }, 1500);
      }
    }, 30);
  }, []);

  const allLit = candlesLit.every(Boolean);
  const dimmed = phase === "wishing" || phase === "blowing" || phase === "blown" || phase === "cutting" || phase === "cut";

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <CakeBackground dimmed={dimmed} />

      {/* Page header */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-10 text-center pointer-events-none">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "cut" ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="font-hand text-sm mb-1"
          style={{ color: "rgba(253,230,138,0.7)" }}
        >
          {phase === "idle" && "tap the cake to light the candles"}
          {phase === "lighting" && "lighting up…"}
          {phase === "lit" && "make your wish when you're ready ✨"}
          {phase === "wishing" && "close your eyes for a second…"}
          {phase === "blowing" && "blowing out the candles…"}
          {phase === "blown" && "yay! 🎉"}
          {phase === "cutting" && "cutting the cake…"}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: phase === "cut" ? 0 : 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl tracking-widest"
          style={{
            color: "#fde68a",
            textShadow: "0 0 30px rgba(251,191,36,0.5)",
          }}
        >
          Birthday Cake
        </motion.h1>
      </div>

      {/* 3D Cake */}
      <div
        className="relative flex-1 w-full max-w-xl mx-auto cursor-pointer"
        style={{ paddingTop: "80px", paddingBottom: "140px" }}
        onClick={phase === "idle" ? handleCakeTap : undefined}
      >
        <CakeScene
          phase={phase}
          candlesLit={candlesLit}
          extinguishing={extinguishing}
          cutProgress={cutProgress}
          reducedMotion={reducedMotion}
        />

        {/* Tap hint — idle only */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-end justify-center pointer-events-none"
              style={{ paddingBottom: "160px" }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="font-hand text-base text-center px-6 py-3 rounded-2xl"
                style={{
                  color: "rgba(253,230,138,0.8)",
                  background: "rgba(20,10,40,0.4)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(253,230,138,0.15)",
                }}
              >
                tap to light 🕯
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Happy Birthday reveal + Make a Wish — lit state */}
        <AnimatePresence>
          {allLit && phase === "lit" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-end gap-5 pointer-events-none"
              style={{ paddingBottom: "160px" }}
            >
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-display text-xl tracking-widest text-center px-4"
                style={{
                  color: "#fde68a",
                  textShadow: "0 0 24px rgba(251,191,36,0.6)",
                }}
              >
                ✨ Happy Birthday Twin ✨
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={handleMakeWish}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto font-display text-xs tracking-widest px-7 py-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(244,114,182,0.2), rgba(192,132,252,0.2))",
                  border: "1px solid rgba(244,114,182,0.4)",
                  color: "#fce7f3",
                  boxShadow: "0 0 20px rgba(244,114,182,0.2)",
                }}
              >
                ✨ MAKE A WISH
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishing state — message + blow prompt */}
        <AnimatePresence>
          {phase === "wishing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 pointer-events-none"
            >
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="font-hand text-xl text-center leading-relaxed"
                style={{ color: "#f3e8ff", maxWidth: "320px" }}
              >
                {WISH_MESSAGE}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
                className="flex flex-col items-center gap-3 pointer-events-auto"
              >
                {micStatus === "idle" && (
                  <motion.button
                    onClick={handleReadyToBlow}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-display text-xs tracking-widest px-7 py-3 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,146,60,0.15))",
                      border: "1px solid rgba(251,191,36,0.4)",
                      color: "#fde68a",
                    }}
                  >
                    🎂 BLOW THE CANDLES
                  </motion.button>
                )}
                {micStatus === "requesting" && (
                  <p className="font-hand text-sm" style={{ color: "rgba(253,230,138,0.6)" }}>
                    listening for your breath… 🎤
                  </p>
                )}
                {micStatus === "active" && (
                  <p className="font-hand text-sm" style={{ color: "rgba(253,230,138,0.6)" }}>
                    go ahead, blow! 💨
                  </p>
                )}
                {(micStatus === "denied" || micStatus === "unavailable") && (
                  <p className="font-hand text-sm text-center" style={{ color: "rgba(253,230,138,0.6)", maxWidth: "260px" }}>
                    swipe up on the screen to blow 💨
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blown state — Cut the Cake button */}
        <AnimatePresence>
          {phase === "blown" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute inset-0 flex items-end justify-center pointer-events-none"
              style={{ paddingBottom: "160px" }}
            >
              <motion.button
                onClick={handleCutCake}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto font-display text-xs tracking-widest px-7 py-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(244,114,182,0.2), rgba(192,132,252,0.2))",
                  border: "1px solid rgba(244,114,182,0.4)",
                  color: "#fce7f3",
                }}
              >
                🎂 CUT THE CAKE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden heart reveal — after cut completes */}
        <AnimatePresence>
          {phase === "cut" && !showFinalMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="absolute inset-0 flex items-end justify-center pointer-events-none"
              style={{ paddingBottom: "160px" }}
            >
              <motion.button
                onClick={() => setShowHeartMessage(true)}
                whileHover={{ scale: 1.1 }}
                className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full"
                style={{
                  background: "rgba(244,114,182,0.15)",
                  border: "1px solid rgba(244,114,182,0.3)",
                }}
              >
                <span style={{ fontSize: "16px" }}>💗</span>
                <span className="font-hand text-sm" style={{ color: "#fce7f3" }}>
                  tap the heart
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confetti burst */}
      <Confetti active={confetti} />

      {/* Hidden heart message overlay */}
      <AnimatePresence>
        {showHeartMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: "rgba(10,5,20,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => {
              setShowHeartMessage(false);
              setShowFinalMessage(true);
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-sm text-center px-8 py-10 rounded-3xl"
              style={{
                background: "rgba(30,15,50,0.7)",
                border: "1px solid rgba(244,114,182,0.25)",
                boxShadow: "0 0 60px rgba(244,114,182,0.15)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: "36px", marginBottom: "16px" }}
              >
                💗
              </motion.div>
              <p
                className="font-hand text-lg leading-relaxed"
                style={{ color: "#fce7f3" }}
              >
                {HIDDEN_HEART_MESSAGE}
              </p>
              <p className="font-hand text-xs mt-4" style={{ color: "rgba(252,231,243,0.4)" }}>
                tap anywhere to continue
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final celebration message */}
      <AnimatePresence>
        {showFinalMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-40 flex items-center justify-center px-6"
            style={{
              background: "radial-gradient(ellipse at center, rgba(60,20,80,0.3) 0%, rgba(10,5,20,0.92) 70%)",
            }}
          >
            <div className="max-w-md text-center flex flex-col items-center gap-4">
              {FINAL_MESSAGE_PARAGRAPHS.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.5, duration: 0.7 }}
                  className={i === 1 ? "font-display text-xl tracking-wide" : "font-hand text-lg"}
                  style={{ color: i === 1 ? "#fde68a" : "#f3e8ff", lineHeight: "1.8" }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
