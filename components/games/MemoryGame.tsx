"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildShuffledDeck } from "@/data/gameCards";
import type { GameCard } from "@/data/gameCards";
import MemoryCardComponent from "./MemoryCard";
import { addStars, getStarRating } from "@/lib/stars";

const PAIRS = 8;
const FLIP_BACK_DELAY = 900;

type GameState = "idle" | "playing" | "won";

export default function MemoryGame() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [deck, setDeck] = useState<GameCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState]);

  const startGame = useCallback(() => {
    setDeck(buildShuffledDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setStarsEarned(0);
    setIsChecking(false);
    setGameState("playing");
  }, []);

  const handleCardClick = useCallback((cardId: string) => {
    if (isChecking) return;
    if (flipped.length === 2) return;
    if (flipped.includes(cardId)) return;
    if (matched.includes(cardId)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsChecking(true);

      const [a, b] = newFlipped.map((id) => deck.find((c) => c.id === id)!);
      if (a.pairId === b.pairId) {
        // Match found
        const newMatched = [...matched, a.id, b.id];
        setMatched(newMatched);
        setFlipped([]);
        setIsChecking(false);

        if (newMatched.length === PAIRS * 2) {
          // Game won
          const rating = getStarRating(moves + 1, PAIRS);
          const earned = addStars(rating);
          setStarsEarned(rating);
          void earned;
          setTimeout(() => setGameState("won"), 600);
        }
      } else {
        // No match — flip back after delay
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, FLIP_BACK_DELAY);
      }
    }
  }, [deck, flipped, matched, isChecking, moves]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      className="min-h-screen has-dock flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(58,169,255,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Header */}
        <div className="pt-12 pb-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-hand text-lg mb-1"
            style={{ color: "rgba(58,169,255,0.6)" }}
          >
            test your memory
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl tracking-widest"
            style={{ color: "var(--text-primary)" }}
          >
            Memory Match
          </motion.h1>
        </div>

        {/* Idle state */}
        {gameState === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 mt-8"
          >
            <div className="text-center max-w-xs">
              <p className="font-body italic text-base mb-2"
                style={{ color: "var(--text-secondary)" }}>
                Match all 8 pairs — emojis and initials.
              </p>
              <p className="font-hand text-sm"
                style={{ color: "rgba(58,169,255,0.5)" }}>
                Fewer moves = more stars ⭐
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={startGame}
              className="font-display text-sm tracking-widest px-10 py-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(58,169,255,0.15), rgba(159,122,234,0.15))",
                border: "1px solid rgba(58,169,255,0.3)",
                color: "var(--text-primary)",
                boxShadow: "0 0 24px rgba(58,169,255,0.15)",
              }}
            >
              START GAME
            </motion.button>
          </motion.div>
        )}

        {/* Playing state */}
        {gameState === "playing" && (
          <>
            {/* Stats bar */}
            <div className="flex items-center gap-8 mb-5">
              {[
                { label: "moves", value: moves },
                { label: "time", value: formatTime(seconds) },
                { label: "pairs", value: `${matched.length / 2}/${PAIRS}` },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5">
                  <span className="font-display text-xl" style={{ color: "#3aa9ff" }}>
                    {stat.value}
                  </span>
                  <span className="font-hand text-xs" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 4x4 Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
                width: "min(380px, 95vw)",
              }}
            >
              {deck.map((card) => (
                <MemoryCardComponent
                  key={card.id}
                  card={card}
                  isFlipped={flipped.includes(card.id)}
                  isMatched={matched.includes(card.id)}
                  onClick={() => handleCardClick(card.id)}
                  disabled={isChecking || matched.includes(card.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Won state */}
        <AnimatePresence>
          {gameState === "won" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 mt-6 text-center px-6"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontSize: "52px" }}
              >
                🦊
              </motion.div>

              <div>
                <h2 className="font-display text-2xl tracking-widest mb-1"
                  style={{ color: "var(--text-primary)" }}>
                  You got it!
                </h2>
                <p className="font-hand text-base"
                  style={{ color: "var(--text-secondary)" }}>
                  {moves} moves · {formatTime(seconds)}
                </p>
              </div>

              {/* Stars */}
              <div className="flex gap-3">
                {[1, 2, 3].map((star) => (
                  <motion.span
                    key={star}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + star * 0.15, type: "spring", stiffness: 300 }}
                    style={{
                      fontSize: "32px",
                      filter: star <= starsEarned
                        ? "drop-shadow(0 0 8px #fbbf24)"
                        : "grayscale(1) opacity(0.25)",
                    }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <p className="font-hand text-sm"
                style={{ color: "rgba(251,191,36,0.6)" }}>
                +{starsEarned} stars added to your total
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={startGame}
                className="font-display text-xs tracking-widest px-8 py-3 rounded-full"
                style={{
                  background: "rgba(58,169,255,0.1)",
                  border: "1px solid rgba(58,169,255,0.25)",
                  color: "var(--text-primary)",
                }}
              >
                PLAY AGAIN
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
