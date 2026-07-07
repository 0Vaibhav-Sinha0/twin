"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

const CORRECT_PASSWORD = "mine";

interface PasswordScreenProps {
  onUnlocked: () => void;
}

export default function PasswordScreen({ onUnlocked }: PasswordScreenProps) {
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<"sealed" | "typing" | "wrong" | "unlocking">("sealed");
  const [attempts, setAttempts] = useState(0);
  const [sealBroken, setSealBroken] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Ambient particle canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.5 + Math.random() * 1.5,
      speed: 0.1 + Math.random() * 0.3,
      opacity: 0.1 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 0.3,
    }));

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58, 169, 255, ${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -4) {
          p.y = canvas.height + 4;
          p.x = Math.random() * canvas.width;
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Break the wax seal on click
  const handleSealClick = useCallback(() => {
    if (sealBroken) return;
    setSealBroken(true);
    setPhase("typing");

    if (sealRef.current) {
      gsap.to(sealRef.current, {
        scale: 1.3,
        opacity: 0,
        rotation: 15,
        duration: 0.5,
        ease: "back.in(2)",
        onComplete: () => {
          if (sealRef.current) sealRef.current.style.display = "none";
        },
      });
    }

    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power2.out" }
      );
    }

    setTimeout(() => inputRef.current?.focus(), 500);
  }, [sealBroken]);

  const handleWrongPassword = useCallback(() => {
    setAttempts((a) => a + 1);
    setPhase("wrong");
    setValue("");

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        x: -12,
        duration: 0.08,
        yoyo: true,
        repeat: 5,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(containerRef.current, { x: 0 });
          setPhase("typing");
          setTimeout(() => inputRef.current?.focus(), 50);
        },
      });
    }
  }, []);

  const handleUnlock = useCallback(() => {
    setPhase("unlocking");

    // Flash the container white then dissolve
    if (containerRef.current) {
      gsap.timeline()
        .to(containerRef.current, {
          filter: "brightness(2) saturate(0)",
          duration: 0.25,
          ease: "power2.in",
        })
        .to(containerRef.current, {
          opacity: 0,
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out",
        });
    }

    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          sessionStorage.setItem("twin_unlocked", "true");
          onUnlocked();
        },
      });
    }
  }, [onUnlocked]);

  const handleSubmit = useCallback(() => {
    if (phase === "unlocking") return;
    const trimmed = value.trim().toLowerCase();
    if (trimmed === CORRECT_PASSWORD) {
      handleUnlock();
    } else {
      handleWrongPassword();
    }
  }, [value, phase, handleUnlock, handleWrongPassword]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit]
  );

  const hintMessages = [
    "this is only for her.",
    "you know the word.",
    "one word. you know it.",
    "think about what you are to him.",
  ];

  return (
    <>
      {/* Full dissolve overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ backgroundColor: "var(--bg-primary)", opacity: 0 }}
      />

      {/* Main container */}
      <div
        ref={containerRef}
        className="fixed inset-0 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {/* Ambient particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Radial glow behind the letter */}
        <div
          className="absolute"
          style={{
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(11,18,48,0.9) 0%, rgba(5,7,15,0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* The letter / envelope card */}
        <div
          className="relative flex flex-col items-center"
          style={{ width: "min(480px, 92vw)" }}
        >
          {/* Top ornament */}
          <div className="flex items-center gap-3 mb-8 opacity-50">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--accent-primary)" }} />
            <span
              className="font-display text-xs tracking-[0.3em]"
              style={{ color: "#3aa9ff" }}
            >
              ✦ FOR NANDANI ✦
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--accent-primary)" }} />
          </div>

          {/* Card */}
          <div
            className="relative w-full rounded-2xl p-10 flex flex-col items-center gap-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(11,18,48,0.95) 0%, rgba(19,28,68,0.9) 100%)",
              border: "1px solid rgba(58,169,255,0.15)",
              boxShadow:
                "0 0 60px rgba(58,169,255,0.06), 0 0 120px rgba(159,122,234,0.04), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Corner decorations */}
            {[
              "top-3 left-3",
              "top-3 right-3 rotate-90",
              "bottom-3 left-3 -rotate-90",
              "bottom-3 right-3 rotate-180",
            ].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} opacity-20`}
                style={{ color: "#3aa9ff", fontSize: "14px" }}
              >
                ✦
              </div>
            ))}

            {/* Title */}
            <div className="text-center">
              <p
                className="font-hand text-lg mb-1"
                style={{ color: "rgba(232,244,255,0.5)" }}
              >
                a letter, sealed with care
              </p>
              <h1
                className="font-display text-3xl tracking-widest"
                style={{
                  color: "var(--text-primary)",
                  textShadow: "0 0 30px rgba(58,169,255,0.4)",
                }}
              >
                Twin
              </h1>
            </div>

            {/* Wax seal */}
            {!sealBroken && (
              <div
                ref={sealRef}
                className="flex flex-col items-center gap-3 cursor-pointer select-none"
                onClick={handleSealClick}
                role="button"
                aria-label="Break the seal to enter"
              >
                {/* Seal circle */}
                <div
                  className="relative flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
                  style={{
                    width: "96px",
                    height: "96px",
                    background:
                      "radial-gradient(circle at 35% 35%, #b45309, #7c2d12)",
                    boxShadow:
                      "0 0 0 3px rgba(180,83,9,0.3), 0 0 20px rgba(180,83,9,0.4), inset 0 2px 4px rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Fox emoji / motif */}
                  <span style={{ fontSize: "38px" }}>🦊</span>

                  {/* Seal ring text */}
                  <svg
                    viewBox="0 0 96 96"
                    className="absolute inset-0 w-full h-full"
                    style={{ overflow: "visible" }}
                  >
                    <path
                      id="sealPath"
                      d="M 48,48 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
                      fill="none"
                    />
                    <text
                      style={{
                        fontSize: "6.5px",
                        fill: "rgba(255,220,150,0.7)",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "2px",
                      }}
                    >
                      <textPath href="#sealPath">
                        ✦ OPEN WITH LOVE ✦ OPEN WITH LOVE ✦
                      </textPath>
                    </text>
                  </svg>
                </div>

                <p
                  className="font-hand text-sm animate-pulse"
                  style={{ color: "rgba(58,169,255,0.6)" }}
                >
                  tap to break the seal
                </p>
              </div>
            )}

            {/* Input form — hidden until seal is broken */}
            <div
              ref={formRef}
              className="w-full flex flex-col items-center gap-5"
              style={{ opacity: sealBroken ? 1 : 0 }}
            >
              <p
                className="font-body text-base italic text-center"
                style={{ color: "var(--text-secondary)" }}
              >
                {attempts > 0
                  ? hintMessages[Math.min(attempts - 1, hintMessages.length - 1)]
                  : "enter the word that opens this world"}
              </p>

              {/* Styled input */}
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  type="password"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={phase === "unlocking"}
                  placeholder="· · · · ·"
                  autoComplete="off"
                  className="w-full text-center font-display tracking-[0.4em] text-lg bg-transparent outline-none placeholder-opacity-30 pb-2"
                  style={{
                    color: phase === "wrong" ? "#f87171" : "#e8f4ff",
                    borderBottom: `1px solid ${phase === "wrong" ? "rgba(248,113,113,0.5)" : "rgba(58,169,255,0.3)"}`,
                    caretColor: "#3aa9ff",
                    transition: "color 0.3s, border-color 0.3s",
                  }}
                  maxLength={20}
                />
              </div>

              {/* Wrong password message */}
              {phase === "wrong" && (
                <p
                  className="font-hand text-sm"
                  style={{ color: "rgba(248,113,113,0.8)" }}
                >
                  that&apos;s not the word ✦ try again
                </p>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={phase === "unlocking" || value.length === 0}
                className="font-display text-sm tracking-[0.25em] px-8 py-3 rounded-full transition-all duration-300 disabled:opacity-30"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(58,169,255,0.15), rgba(159,122,234,0.15))",
                  border: "1px solid rgba(58,169,255,0.3)",
                  color: "var(--text-primary)",
                  boxShadow: value.length > 0
                    ? "0 0 20px rgba(58,169,255,0.2)"
                    : "none",
                }}
              >
                {phase === "unlocking" ? "opening…" : "OPEN"}
              </button>
            </div>
          </div>

          {/* Bottom note */}
          <p
            className="mt-6 font-hand text-sm opacity-30 text-center"
            style={{ color: "var(--text-primary)" }}
          >
            made with every bit of care
          </p>
        </div>
      </div>
    </>
  );
}
