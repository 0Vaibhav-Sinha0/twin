"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FINALE_PARTS } from "@/data/finale";
import FutureReveal from "@/components/future/FutureReveal";

// Typewriter speed — fast, ms per character
const TYPE_SPEED_MS = 18;
// Pause after a part finishes typing, before the next part begins
const PAUSE_BETWEEN_PARTS_MS = 8000;
// Extra pause after the very first part (gives her a moment to settle in)
const INITIAL_PAUSE_MS = 600;

type PlaybackState = "idle" | "playing" | "done";

// Flattens a part's lines into one displayable block of text,
// preserving each line as its own paragraph within the block.
function partToText(partIndex: number): string[] {
  return FINALE_PARTS[partIndex].lines.map((l) => l.text);
}

export default function FinaleSequence({ onFutureRevealed }: { onFutureRevealed?: () => void }) {
  const [playback, setPlayback] = useState<PlaybackState>("idle");
  const [completedParts, setCompletedParts] = useState<string[][]>([]);
  const [typingPartIndex, setTypingPartIndex] = useState(-1);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineChars, setCurrentLineChars] = useState(0);
  const [showFuture, setShowFuture] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const songTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (songTimeoutRef.current) clearTimeout(songTimeoutRef.current);
  }, []);

  // Auto-scroll to keep the newest content in view
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [completedParts, typedLines, currentLineChars]);

  // Type out a single part, line by line, character by character, fast
  const typeOutPart = useCallback((partIndex: number) => {
    if (partIndex >= FINALE_PARTS.length) {
      setPlayback("done");
      return;
    }

    setTypingPartIndex(partIndex);
    setTypedLines([]);
    setCurrentLineChars(0);

    const lines = partToText(partIndex);
    let lineIdx = 0;
    let charIdx = 0;
    const finishedLines: string[] = [];

    function typeChar() {
      const line = lines[lineIdx];
      charIdx++;
      setCurrentLineChars(charIdx);

      if (charIdx >= line.length) {
        // Line finished — commit it, move to next line
        finishedLines.push(line);
        setTypedLines([...finishedLines]);
        lineIdx++;
        charIdx = 0;
        setCurrentLineChars(0);

        if (lineIdx >= lines.length) {
          // Part finished typing — commit to completed, pause, then next part
          if (intervalRef.current) clearInterval(intervalRef.current);
          timeoutRef.current = setTimeout(() => {
            setCompletedParts((prev) => [...prev, lines]);
            setTypingPartIndex(-1);
            setTypedLines([]);
            typeOutPart(partIndex + 1);
          }, PAUSE_BETWEEN_PARTS_MS);
        }
      }
    }

    intervalRef.current = setInterval(typeChar, TYPE_SPEED_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBegin = useCallback(() => {
    setPlayback("playing");
    setCompletedParts([]);

    // Song 2 starts 5 seconds after she presses Begin, looping
    songTimeoutRef.current = setTimeout(() => {
      if (!audioRef.current) {
        const audio = new Audio("/audio/song-2.mp4");
        audio.loop = true;
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
        // No audio yet — sequence still plays silently
      });
    }, 5000);

    timeoutRef.current = setTimeout(() => {
      typeOutPart(0);
    }, INITIAL_PAUSE_MS);
  }, [typeOutPart]);

  // Fade out music once the message sequence finishes typing.
  // "The Future" no longer auto-triggers — she controls the pace via a Next button.
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

  const handleContinueToFuture = useCallback(() => {
    setShowFuture(true);
    onFutureRevealed?.();
  }, [onFutureRevealed]);

  useEffect(() => clearTimers, [clearTimers]);

  // Determine line style — same logic as before, matches data model
  const getLineStyle = (partIdx: number, lineIdx: number) => {
    const line = FINALE_PARTS[partIdx]?.lines[lineIdx];
    return line?.style ?? "body";
  };

  const renderLine = (text: string, partIdx: number, lineIdx: number, key: string) => {
    const style = getLineStyle(partIdx, lineIdx);
    return (
      <p
        key={key}
        className="text-center w-full"
        style={{
          fontFamily:
            style === "quote" || style === "emphasis" ? "var(--font-hand)" : "var(--font-body)",
          fontStyle: style === "body" ? "italic" : "normal",
          fontSize: style === "emphasis" ? "24px" : style === "quote" ? "20px" : "18px",
          color:
            style === "emphasis"
              ? "#e879f9"
              : style === "quote"
              ? "var(--accent-secondary)"
              : "var(--text-primary)",
          lineHeight: "1.7",
          textShadow: style === "emphasis" ? "0 0 20px rgba(232,121,249,0.3)" : "none",
          marginBottom: "0.4em",
        }}
      >
        {text}
      </p>
    );
  };

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(159,122,234,0.05) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Sparse ambient stars */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: "2px",
              height: "2px",
              left: `${(i * 41) % 100}%`,
              top: `${(i * 61) % 100}%`,
              backgroundColor: "var(--text-muted)",
            }}
            animate={{ opacity: [0.1, 0.35, 0.1] }}
            transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Idle — begin button */}
      {playback === "idle" && (
        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <span style={{ fontSize: "32px" }}>🦊</span>
            <p className="font-hand text-lg" style={{ color: "var(--text-secondary)" }}>
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
        </div>
      )}

      {/* Playing / Done — stacked parts, nothing ever disappears */}
      {(playback === "playing" || playback === "done") && (
        <div className="relative z-10 w-full max-w-lg mx-auto px-8 pt-16 has-dock flex flex-col gap-10">
          {completedParts.map((lines, partIdx) => (
            <div key={`part-${partIdx}`} className="flex flex-col items-center">
              <p
                className="font-hand text-center mb-3"
                style={{ fontSize: "14px", color: "var(--text-muted)", opacity: 0.6 }}
              >
                {FINALE_PARTS[partIdx].label}
              </p>
              {lines.map((text, lineIdx) => renderLine(text, partIdx, lineIdx, `${partIdx}-${lineIdx}`))}
            </div>
          ))}

          {/* Currently typing part */}
          {typingPartIndex >= 0 && (
            <div className="flex flex-col items-center">
              <p
                className="font-hand text-center mb-3"
                style={{ fontSize: "14px", color: "var(--text-muted)", opacity: 0.6 }}
              >
                {FINALE_PARTS[typingPartIndex].label}
              </p>
              {typedLines.map((text, lineIdx) =>
                renderLine(text, typingPartIndex, lineIdx, `typing-${lineIdx}`)
              )}
              {/* Currently-typing line, partial */}
              {currentLineChars > 0 && (
                <p
                  className="text-center w-full"
                  style={{
                    fontFamily:
                      getLineStyle(typingPartIndex, typedLines.length) === "quote" ||
                      getLineStyle(typingPartIndex, typedLines.length) === "emphasis"
                        ? "var(--font-hand)"
                        : "var(--font-body)",
                    fontStyle:
                      getLineStyle(typingPartIndex, typedLines.length) === "body" ? "italic" : "normal",
                    fontSize:
                      getLineStyle(typingPartIndex, typedLines.length) === "emphasis"
                        ? "24px"
                        : getLineStyle(typingPartIndex, typedLines.length) === "quote"
                        ? "20px"
                        : "18px",
                    color:
                      getLineStyle(typingPartIndex, typedLines.length) === "emphasis"
                        ? "#e879f9"
                        : getLineStyle(typingPartIndex, typedLines.length) === "quote"
                        ? "var(--accent-secondary)"
                        : "var(--text-primary)",
                    lineHeight: "1.7",
                    marginBottom: "0.4em",
                  }}
                >
                  {FINALE_PARTS[typingPartIndex].lines[typedLines.length]?.text.slice(0, currentLineChars)}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ opacity: 0.6 }}
                  >
                    |
                  </motion.span>
                </p>
              )}
            </div>
          )}

          {/* Done state — closing line + manual continue */}
          {playback === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="flex flex-col items-center gap-4 pt-8"
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ fontSize: "36px" }}
              >
                🦊🤍
              </motion.span>
              <p className="font-hand text-xl" style={{ color: "var(--accent-warm)" }}>
                thank you for being you
              </p>

              {/* Take your time — button only appears once everything has finished typing */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                onClick={handleContinueToFuture}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-display text-xs tracking-widest px-8 py-3.5 rounded-full mt-6"
                style={{
                  background: "linear-gradient(135deg, rgba(159,122,234,0.18), rgba(58,169,255,0.12))",
                  border: "1px solid var(--border-accent)",
                  color: "var(--text-primary)",
                  boxShadow: "0 0 24px var(--accent-glow)",
                }}
              >
                NEXT ✦
              </motion.button>
            </motion.div>
          )}

          <div ref={scrollAnchorRef} />
        </div>
      )}

      {/* The Future — replaces everything once revealed, no way back */}
      {showFuture && (
        <div className="fixed inset-0" style={{ zIndex: 100 }}>
          <FutureReveal />
        </div>
      )}
    </div>
  );
}
