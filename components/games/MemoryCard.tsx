"use client";

import { motion } from "framer-motion";
import type { GameCard } from "@/data/gameCards";

interface MemoryCardProps {
  card: GameCard;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled: boolean;
}

export default function MemoryCard({
  card,
  isFlipped,
  isMatched,
  onClick,
  disabled,
}: MemoryCardProps) {
  const { face, color, glowColor } = card;
  const revealed = isFlipped || isMatched;

  return (
    <motion.div
      onClick={() => !disabled && !revealed && onClick()}
      whileHover={!revealed && !disabled ? { scale: 1.06, y: -3 } : {}}
      whileTap={!revealed && !disabled ? { scale: 0.96 } : {}}
      transition={{ duration: 0.15 }}
      style={{
        perspective: "600px",
        cursor: revealed || disabled ? "default" : "pointer",
        aspectRatio: "1",
      }}
    >
      {/* Flip container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* ── Card Back (face down — shown when not flipped) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0b1230, #131c44)",
            border: "1px solid rgba(58,169,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          {/* Pattern */}
          <div style={{ opacity: 0.15 }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                fontSize="22" fill="#3aa9ff">✦</text>
            </svg>
          </div>
        </div>

        {/* ── Card Front (face up — shown when flipped) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "12px",
            background: isMatched
              ? `linear-gradient(135deg, ${color}22, ${color}11)`
              : "linear-gradient(135deg, #0d1535, #161f48)",
            border: `1px solid ${isMatched ? color + "66" : color + "33"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isMatched
              ? `0 0 20px ${glowColor}, 0 4px 16px rgba(0,0,0,0.3)`
              : `0 4px 16px rgba(0,0,0,0.3)`,
            transition: "box-shadow 0.4s ease, border-color 0.4s ease",
          }}
        >
          {face.type === "emoji" ? (
            <span style={{ fontSize: "clamp(20px, 5vw, 32px)", lineHeight: 1 }}>
              {face.symbol}
            </span>
          ) : (
            <span
              className="font-display"
              style={{
                fontSize: face.letter === "✦"
                  ? "clamp(18px, 4.5vw, 28px)"
                  : "clamp(22px, 6vw, 36px)",
                color: isMatched ? color : color + "cc",
                textShadow: isMatched ? `0 0 16px ${glowColor}` : "none",
                transition: "color 0.4s, text-shadow 0.4s",
                letterSpacing: "0.05em",
              }}
            >
              {face.letter}
            </span>
          )}

          {/* Matched shimmer overlay */}
          {isMatched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "12px",
                background: `radial-gradient(circle, ${color}44, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
