"use client";

import { useCallback, useEffect, useRef } from "react";
import { useIntroSequence } from "./useIntroSequence";
import ParticleField from "./ParticleField";
import MagicText from "./MagicText";
import { INTRO_CONFIG } from "@/lib/introConfig";

interface IntroSceneProps {
  onComplete: () => void;
}

export default function IntroScene({ onComplete }: IntroSceneProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const { phase } = useIntroSequence(handleComplete);

  // Play audio as soon as particles start gathering
  useEffect(() => {
    if (phase !== "particles-gather") return;

    const audio = new Audio("/audio/intro-chime.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {
      // Autoplay blocked — silent fallback, the visual still runs perfectly
    });
    audioRef.current = audio;

    return () => {
      audioRef.current?.pause();
    };
  }, [phase]);

  // Fade out the whole container on zoom phase
  useEffect(() => {
    if (phase !== "zoom") return;
    const container = containerRef.current;
    if (!container) return;

    container.style.transition = `opacity ${INTRO_CONFIG.timing.zoomThrough}s ease-in`;
    container.style.opacity = "0";
  }, [phase]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: INTRO_CONFIG.colors.void,
        opacity: 1,
        zIndex: 50,
      }}
    >
      {/* Three.js particle canvas */}
      <ParticleField phase={phase} />

      {/* SVG text drawn over canvas */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative"
          style={{ width: "min(800px, 95vw)", height: "220px" }}
        >
          <MagicText phase={phase} />
        </div>
      </div>

      {/* Phase indicator for dev — remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div
          className="absolute bottom-4 left-4 text-xs font-mono opacity-30"
          style={{ color: INTRO_CONFIG.colors.electric }}
        >
          phase: {phase}
        </div>
      )}
    </div>
  );
}
