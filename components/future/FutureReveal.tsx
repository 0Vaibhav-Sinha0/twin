"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROMISES } from "@/data/promises";

const TARGET_DATE = new Date("2027-07-26T00:00:00");

type FuturePhase = "message" | "timeline" | "countdown" | "letter" | "promises" | "skywall" | "final";

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Real calendar-aware breakdown — walks the calendar forward from
  // "now" toward the target, borrowing correctly from each unit
  // (accounts for actual month lengths and leap years, not fixed
  // 30-day/365-day approximations).
  let years = target.getFullYear() - now.getFullYear();
  let months = target.getMonth() - now.getMonth();
  let days = target.getDate() - now.getDate();
  let hours = target.getHours() - now.getHours();
  let minutes = target.getMinutes() - now.getMinutes();
  let seconds = target.getSeconds() - now.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    // Borrow from months using the number of days in the month
    // immediately before the target month
    const borrowMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += borrowMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const total = target.getTime() - now.getTime();
  if (total <= 0) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return { years, months, days, hours, minutes, seconds };
}

function AmbientStars({ count = 24 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 1 + (i % 3),
        duration: 3 + (i % 5),
        delay: i * 0.25,
      })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: "#fde68a",
          }}
          animate={{ opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl"
      style={{
        width: "56px",
        height: "64px",
        background: "rgba(159,122,234,0.08)",
        border: "1px solid rgba(232,244,255,0.12)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(159,122,234,0.1)",
      }}
    >
      <span
        className="font-display"
        style={{ fontSize: "22px", color: "#fde68a", textShadow: "0 0 16px rgba(253,230,138,0.4)" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className="font-hand"
        style={{ fontSize: "10px", color: "rgba(232,244,255,0.4)", letterSpacing: "0.05em" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function FutureReveal() {
  const [phase, setPhase] = useState<FuturePhase>("message");
  const [messageStep, setMessageStep] = useState(0);
  const [letterShaking, setLetterShaking] = useState(false);
  const [letterMessage, setLetterMessage] = useState(false);
  const countdown = useCountdown(TARGET_DATE);

  // Phase 1 — sequenced message reveal
  useEffect(() => {
    if (phase !== "message") return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    timeouts.push(setTimeout(() => setMessageStep(1), 800));
    timeouts.push(setTimeout(() => setMessageStep(2), 3200));
    timeouts.push(setTimeout(() => setMessageStep(3), 5600));
    timeouts.push(setTimeout(() => setPhase("timeline"), 8200));

    return () => timeouts.forEach(clearTimeout);
  }, [phase]);

  const handleLetterClick = useCallback(() => {
    if (letterShaking) return;
    setLetterShaking(true);
    setLetterMessage(true);
    setTimeout(() => setLetterShaking(false), 600);
  }, [letterShaking]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(159,122,234,0.06) 0%, transparent 70%), #05070f",
      }}
    >
      <AmbientStars />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* ── Phase 1 — One Last Message ── */}
        <AnimatePresence mode="wait">
          {phase === "message" && (
            <motion.div
              key="message"
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              {messageStep >= 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="font-hand text-2xl"
                  style={{ color: "var(--text-primary, #e8f4ff)" }}
                >
                  You thought this was the end?
                </motion.p>
              )}
              {messageStep >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="font-display text-xl tracking-wide"
                  style={{ color: "#fde68a", textShadow: "0 0 20px rgba(253,230,138,0.4)" }}
                >
                  Not even close.
                </motion.p>
              )}
              {messageStep >= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="font-hand text-lg"
                  style={{ color: "var(--text-secondary, rgba(232,244,255,0.6))" }}
                >
                  Because...
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phase 2 — Future Timeline ── */}
        <AnimatePresence>
          {phase === "timeline" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              {/* Glowing star that grows, then a line extends toward the date */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0.4 }}
                animate={{ scale: [0.6, 1.3, 1], opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="rounded-full"
                style={{
                  width: "14px",
                  height: "14px",
                  background: "#fde68a",
                  boxShadow: "0 0 20px #fde68a, 0 0 40px rgba(253,230,138,0.5)",
                }}
              />

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
                style={{
                  width: "min(70vw, 260px)",
                  height: "1px",
                  background: "linear-gradient(to right, #fde68a, rgba(253,230,138,0.1))",
                  transformOrigin: "left",
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 1 }}
                className="flex flex-col items-center gap-2"
              >
                <p
                  className="font-display text-2xl tracking-widest"
                  style={{ color: "#e8f4ff", textShadow: "0 0 24px rgba(232,244,255,0.2)" }}
                >
                  26 July 2027
                </p>
                <p className="font-hand text-sm" style={{ color: "rgba(253,230,138,0.6)" }}>
                  the next chapter has already been reserved
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.4 }}
                onClick={() => setPhase("countdown")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-display text-xs tracking-widest px-7 py-3 rounded-full mt-2"
                style={{
                  background: "rgba(159,122,234,0.1)",
                  border: "1px solid rgba(159,122,234,0.3)",
                  color: "#e8f4ff",
                }}
              >
                ✦ CONTINUE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phase 3 — Countdown ── */}
        <AnimatePresence>
          {phase === "countdown" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="flex flex-col items-center gap-8 text-center"
            >
              <div>
                <p className="font-hand text-sm mb-2" style={{ color: "rgba(253,230,138,0.6)" }}>
                  the next chapter has already been reserved
                </p>
                <p
                  className="font-display text-2xl tracking-widest"
                  style={{ color: "#e8f4ff", textShadow: "0 0 24px rgba(232,244,255,0.2)" }}
                >
                  26 July 2027
                </p>
              </div>

              <div className="flex gap-2 flex-wrap justify-center" style={{ maxWidth: "380px" }}>
                <CountdownUnit value={countdown.years} label="years" />
                <CountdownUnit value={countdown.months} label="months" />
                <CountdownUnit value={countdown.days} label="days" />
                <CountdownUnit value={countdown.hours} label="hrs" />
                <CountdownUnit value={countdown.minutes} label="min" />
                <CountdownUnit value={countdown.seconds} label="sec" />
              </div>

              <p className="font-hand text-sm" style={{ color: "rgba(232,244,255,0.35)" }}>
                time until the next adventure together
              </p>

              <motion.button
                onClick={() => setPhase("letter")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-display text-xs tracking-widest px-7 py-3 rounded-full mt-2"
                style={{
                  background: "rgba(159,122,234,0.1)",
                  border: "1px solid rgba(159,122,234,0.3)",
                  color: "#e8f4ff",
                }}
              >
                ✦ CONTINUE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phase 4 — Future Letter ── */}
        <AnimatePresence>
          {phase === "letter" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <motion.div
                onClick={handleLetterClick}
                animate={letterShaking ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="cursor-pointer relative"
                style={{ width: "180px", height: "120px" }}
              >
                {/* Envelope body */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #1a0f38, #0b1230)",
                    border: "1px solid rgba(232,184,109,0.3)",
                    boxShadow: "0 0 24px rgba(232,184,109,0.1)",
                  }}
                />
                {/* Envelope flap */}
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{
                    height: "0",
                    borderLeft: "90px solid transparent",
                    borderRight: "90px solid transparent",
                    borderTop: "60px solid rgba(232,184,109,0.15)",
                  }}
                />
                {/* Fox wax seal */}
                <div
                  className="absolute rounded-full flex items-center justify-center"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "36px",
                    height: "36px",
                    background: "radial-gradient(circle at 35% 35%, #d4af37, #92702a)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    fontSize: "16px",
                  }}
                >
                  🦊
                </div>
              </motion.div>

              <p className="font-display text-sm tracking-widest" style={{ color: "#fde68a" }}>
                OPEN ON 26 JULY 2027
              </p>
              <p className="font-hand text-sm" style={{ color: "rgba(232,244,255,0.4)" }}>
                some surprises are worth waiting for
              </p>

              <AnimatePresence>
                {letterMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-hand text-lg"
                    style={{ color: "#e879f9" }}
                  >
                    &quot;Not yet, Twin...&quot; 🦊✨
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                onClick={() => setPhase("promises")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-display text-xs tracking-widest px-7 py-3 rounded-full mt-4"
                style={{
                  background: "rgba(159,122,234,0.1)",
                  border: "1px solid rgba(159,122,234,0.3)",
                  color: "#e8f4ff",
                }}
              >
                ✦ CONTINUE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phase 5 — Promise Wall ── */}
        <AnimatePresence>
          {phase === "promises" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-6 text-center px-4"
            >
              <p
                className="font-display text-lg tracking-widest"
                style={{ color: "#e8f4ff" }}
              >
                Things Still Waiting For Us
              </p>

              <div className="flex flex-col gap-3 w-full" style={{ maxWidth: "320px" }}>
                {PROMISES.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.25, duration: 0.5 }}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                    style={{
                      background: "rgba(159,122,234,0.06)",
                      border: "1px solid rgba(232,244,255,0.1)",
                    }}
                  >
                    <span
                      className="flex-shrink-0 rounded-md"
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "1.5px solid rgba(232,244,255,0.3)",
                      }}
                    />
                    <span className="font-hand text-sm text-left flex-1" style={{ color: "rgba(232,244,255,0.7)" }}>
                      {p.text}
                    </span>
                    <span style={{ fontSize: "16px" }}>{p.emoji}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + PROMISES.length * 0.25 + 0.5 }}
                onClick={() => setPhase("skywall")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-display text-xs tracking-widest px-7 py-3 rounded-full mt-2"
                style={{
                  background: "rgba(159,122,234,0.1)",
                  border: "1px solid rgba(159,122,234,0.3)",
                  color: "#e8f4ff",
                }}
              >
                ✦ CONTINUE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Phase 6 — The Sky Never Stops Growing ── */}
        <AnimatePresence>
          {phase === "skywall" && <SkyWall onContinue={() => setPhase("final")} />}
        </AnimatePresence>

        {/* ── Phase 4 — Final Quote + Final Screen ── */}
        <AnimatePresence>
          {phase === "final" && <FinalScreen />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SkyWall({ onContinue }: { onContinue: () => void }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const dimStars = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        left: `${8 + ((i * 29) % 84)}%`,
        top: `${10 + ((i * 43) % 70)}%`,
        size: 2 + (i % 3),
        delay: (i % 10) * 0.15,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="flex flex-col items-center gap-6 text-center px-4"
    >
      <p className="font-display text-lg tracking-widest" style={{ color: "#e8f4ff" }}>
        The Sky Never Stops Growing
      </p>
      <p className="font-hand text-sm" style={{ color: "rgba(232,244,255,0.4)", maxWidth: "280px" }}>
        every memory you&apos;ve made is already connected. but the sky isn&apos;t finished yet.
      </p>

      <div className="relative" style={{ width: "min(85vw, 340px)", height: "260px" }}>
        {dimStars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full cursor-pointer"
            style={{
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: hoveredIdx === i ? "#fde68a" : "rgba(232,244,255,0.25)",
              boxShadow: hoveredIdx === i ? "0 0 12px #fde68a" : "none",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: s.delay, duration: 0.6 }}
            whileHover={{ scale: 1.8 }}
            onHoverStart={() => setHoveredIdx(i)}
            onHoverEnd={() => setHoveredIdx(null)}
            onTouchStart={() => setHoveredIdx(i)}
          />
        ))}

        <AnimatePresence>
          {hoveredIdx !== null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute font-hand text-xs pointer-events-none"
              style={{
                left: dimStars[hoveredIdx].left,
                top: `calc(${dimStars[hoveredIdx].top} - 20px)`,
                color: "rgba(253,230,138,0.8)",
                whiteSpace: "nowrap",
                transform: "translateX(-50%)",
              }}
            >
              reserved for future memories...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={onContinue}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="font-display text-xs tracking-widest px-7 py-3 rounded-full mt-2"
        style={{
          background: "rgba(159,122,234,0.1)",
          border: "1px solid rgba(159,122,234,0.3)",
          color: "#e8f4ff",
        }}
      >
        ✦ CONTINUE
      </motion.button>
    </motion.div>
  );
}

function FinalScreen() {
  const [step, setStep] = useState(0);
  const [isMidnightTwinkle, setIsMidnightTwinkle] = useState(false);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    timeouts.push(setTimeout(() => setStep(1), 600));
    timeouts.push(setTimeout(() => setStep(2), 3000));
    timeouts.push(setTimeout(() => setStep(3), 5400));
    timeouts.push(setTimeout(() => setStep(4), 7800));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Phase 7 — a tiny hidden reminder that quietly appears only around midnight.
  // No explanation given if she notices it; that's the point.
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      setIsMidnightTwinkle(now.getHours() === 0);
    };
    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <AnimatePresence mode="wait">
        {step < 4 && (
          <motion.div key="quote" exit={{ opacity: 0 }} className="flex flex-col items-center gap-5">
            {step >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="font-hand text-xl"
                style={{ color: "#e8f4ff", maxWidth: "300px" }}
              >
                &quot;The best part about memories...&quot;
              </motion.p>
            )}
            {step >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="font-hand text-xl"
                style={{ color: "#e8f4ff", maxWidth: "300px" }}
              >
                ...is knowing there are still so many left to make.
              </motion.p>
            )}
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-1 mt-2"
              >
                <p className="font-display text-lg tracking-wide" style={{ color: "#fde68a" }}>
                  This is not the end.
                </p>
                <p className="font-display text-lg tracking-wide" style={{ color: "#fde68a" }}>
                  It&apos;s only Chapter One. 🤍
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {step >= 4 && (
        <motion.div
          key="finalscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: "32px" }}
          >
            🦊
          </motion.span>
          <p className="font-hand text-lg" style={{ color: "rgba(232,244,255,0.5)" }}>
            See you on 26 July 2027, Twin.
          </p>

          {/* Phase 7 — quietly twinkles only around midnight, no explanation given */}
          {isMidnightTwinkle && (
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full"
              style={{
                width: "4px",
                height: "4px",
                background: "#fde68a",
                boxShadow: "0 0 10px #fde68a",
              }}
            />
          )}

          {/* Hidden version line — barely visible */}
          <p
            className="font-hand mt-16"
            style={{ fontSize: "10px", color: "rgba(232,244,255,0.12)" }}
          >
            Version 1.0 — Built with countless memories, countless prompts, and one amazing Twin. 🤍
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
