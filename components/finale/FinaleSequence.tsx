"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FINALE_PARTS } from "@/data/finale";
import type { MessageLine } from "@/data/finale";
import { getLineDisplayDuration, FADE_MS } from "@/lib/readingPace";

type PlaybackState = "idle" | "playing" | "done";

export default function FinaleSequence() {
  const [playback, setPlayback] = useState<PlaybackState>("idle");
  const [partIndex, setPartIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(-1); // -1 = showing part label only
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentPart = FINALE_PARTS[partIndex];
  const currentLine: MessageLine | null =
    lineIndex >= 0 && currentPart ? currentPart.lines[lineIndex] : null;

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const advance = useCallback(() => {
    setPartIndex((pIdx) => {
      const part = FINALE_PARTS[pIdx];
      setLineIndex((lIdx) => {
        // Still label-only phase → move to first line
        if (lIdx === -1) return 0;
        // More lines in this part
        if (lIdx + 1 < part.lines.length) return lIdx + 1;
        return lIdx; // will be handled by part transition below
      });
      return pIdx;
    });
  }, []);

  // Core sequencing loop
  useEffect(() => {
    if (playback !== "playing") return;

    clearTimer();
    setVisible(true);

    const part = FINALE_PARTS[partIndex];
    if (!part) {
      setPlayback("done");
      return;
    }

    // Label-only beat — held briefly before first line
    if (lineIndex === -1) {
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        timeoutRef.current = setTimeout(() => {
          setLineIndex(0);
        }, FADE_MS);
      }, 1800);
      return;
    }

    const line = part.lines[lineIndex];
    if (!line) return;

    const duration = getLineDisplayDuration(line);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      timeoutRef.current = setTimeout(() => {
        // Move to next line or next part
        if (lineIndex + 1 < part.lines.length) {
          setLineIndex((i) => i + 1);
        } else if (partIndex + 1 < FINALE_PARTS.length) {
          setPartIndex((i) => i + 1);
          setLineIndex(-1);
        } else {
          setPlayback("done");
        }
      }, FADE_MS);
    }, duration);

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback, partIndex, lineIndex]);

  const handleBegin = useCallback(() => {
    setPlayback("playing");
    setPartIndex(0);
    setLineIndex(-1);
    setVisible(true);

    // Piano music — gracefully no-ops if file doesn't exist yet
    if (!audioRef.current) {
      const audio = new Audio("/audio/finale-song.mp3");
      audio.volume = 0;
      audioRef.current = audio;
    }
    const audio = audioRef.current;
    audio.play().then(() => {
      let vol = 0;
      const fade = setInterval(() => {
        vol += 0.04;
        if (vol >= 0.4) {
          vol = 0.4;
          clearInterval(fade);
        }
        audio.volume = vol;
      }, 150);
    }).catch(() => {
      // No audio file yet — sequence still plays silently
    });
  }, []);

  // Fade out music when done
  useEffect(() => {
    if (playback === "done" && audioRef.current) {
      const audio = audioRef.current;
      let vol = audio.volume;
      const fade = setInterval(() => {
        vol -= 0.02;
        if (vol <= 0) {
          vol = 0;
          audio.pause();
          clearInterval(fade);
        }
        audio.volume = vol;
      }, 200);
    }
  }, [playback]);

  useEffect(() => clearTimer, [clearTimer]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Ambient embient glow — subtle, doesn't compete with text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(159,122,234,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Floating ambient stars — very sparse, just enough to feel alive */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: "2px",
              height: "2px",
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              backgroundColor: "var(--text-muted)",
            }}
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{
              duration: 3 + (i % 5),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Idle — begin button */}
      {playback === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center gap-6 text-center px-6"
        >
          <span style={{ fontSize: "32px" }}>🦊</span>
          <p
            className="font-hand text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            one last thing before you go
          </p>
          <motion.button
            onClick={handleBegin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-display text-xs tracking-widest px-8 py-3.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(159,122,234,0.18), rgba(58,169,255,0.12))",
              border: "1px solid var(--border-accent)",
              color: "var(--text-primary)",
              boxShadow: "0 0 24px var(--accent-glow)",
            }}
          >
            ✦ BEGIN
          </motion.button>
        </motion.div>
      )}

      {/* Playing — part label or line, one at a time */}
      {playback === "playing" && (
        <div className="relative z-10 w-full max-w-lg px-8 flex items-center justify-center" style={{ minHeight: "40vh" }}>
          <AnimatePresence mode="wait">
            {lineIndex === -1 && visible && (
              <motion.p
                key={`label-${partIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
                className="font-hand text-center w-full"
                style={{
                  fontSize: "20px",
                  color: "var(--text-muted)",
                  letterSpacing: "0.02em",
                }}
              >
                {currentPart?.label}
              </motion.p>
            )}

            {currentLine && visible && (
              <motion.p
                key={`line-${partIndex}-${lineIndex}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
                className="text-center w-full"
                style={{
                  fontFamily:
                    currentLine.style === "quote" || currentLine.style === "emphasis"
                      ? "var(--font-hand)"
                      : "var(--font-body)",
                  fontStyle: currentLine.style === "body" || !currentLine.style ? "italic" : "normal",
                  fontSize:
                    currentLine.style === "emphasis"
                      ? "26px"
                      : currentLine.style === "quote"
                      ? "22px"
                      : "20px",
                  color:
                    currentLine.style === "emphasis"
                      ? "#e879f9"
                      : currentLine.style === "quote"
                      ? "var(--accent-secondary)"
                      : "var(--text-primary)",
                  lineHeight: "1.7",
                  textShadow:
                    currentLine.style === "emphasis"
                      ? "0 0 24px rgba(232,121,249,0.35)"
                      : "none",
                }}
              >
                {currentLine.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Done — final lingering state */}
      {playback === "done" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 flex flex-col items-center gap-5 text-center px-8"
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ fontSize: "40px" }}
          >
            🦊🤍
          </motion.span>
          <p
            className="font-hand text-2xl"
            style={{ color: "var(--accent-warm)" }}
          >
            thank you for being you
          </p>
        </motion.div>
      )}
    </div>
  );
}
