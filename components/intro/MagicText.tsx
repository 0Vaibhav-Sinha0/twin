"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { IntroPhase } from "./useIntroSequence";
import { INTRO_CONFIG } from "@/lib/introConfig";

interface MagicTextProps {
  phase: IntroPhase;
}

export default function MagicText({ phase }: MagicTextProps) {
  const textGroupRef = useRef<SVGGElement>(null);
  const hasResolvedRef = useRef(false);

  useEffect(() => {
    if (phase !== "stroke-resolve" || hasResolvedRef.current) return;
    hasResolvedRef.current = true;

    const group = textGroupRef.current;
    if (!group) return;

    // Get all stroke paths and animate them drawing in
    const paths = group.querySelectorAll<SVGPathElement | SVGLineElement>("[data-stroke]");

    paths.forEach((path, i) => {
      const length = (path as SVGGeometryElement).getTotalLength?.() ?? 60;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: INTRO_CONFIG.timing.strokeResolve + 0.3,
        delay: i * 0.04,
        ease: "power2.inOut",
      });
    });

    // Fade in the fill text after stroke finishes
    const fills = group.querySelectorAll<SVGTextElement>("[data-fill]");
    gsap.to(fills, {
      opacity: 1,
      duration: 0.5,
      delay: INTRO_CONFIG.timing.strokeResolve + 0.2,
      ease: "power2.out",
    });
  }, [phase]);

  // Pulse effect
  useEffect(() => {
    if (phase !== "pulse") return;
    const group = textGroupRef.current;
    if (!group) return;

    gsap.to(group, {
      filter: "drop-shadow(0 0 24px #3aa9ff) drop-shadow(0 0 48px #9f7aea)",
      duration: INTRO_CONFIG.timing.pulse / 2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
  }, [phase]);

  // Fade out on zoom
  useEffect(() => {
    if (phase !== "zoom") return;
    const group = textGroupRef.current;
    if (!group) return;

    gsap.to(group, {
      opacity: 0,
      scale: 1.4,
      transformOrigin: "center center",
      duration: INTRO_CONFIG.timing.zoomThrough,
      ease: "power2.in",
    });
  }, [phase]);

  const isVisible =
    phase !== "void" && phase !== "particles-gather";

  const { colors, stroke } = INTRO_CONFIG;

  return (
    <svg
      viewBox="0 0 800 220"
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Neon glow filter */}
        <filter id="neon-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur1" />
          <feGaussianBlur stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft bloom for fill text */}
        <filter id="soft-bloom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        ref={textGroupRef}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {/* ── "Welcome," — display font, stroke then fill ── */}
        <text
          data-fill
          x="400"
          y="108"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="72"
          fontWeight="600"
          letterSpacing="8"
          fill={colors.glow}
          filter="url(#soft-bloom)"
          style={{ opacity: 0 }}
        >
          Welcome,
        </text>

        {/* Stroke layer — draws on top, drawn first, same position */}
        <text
          data-stroke
          x="400"
          y="108"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="72"
          fontWeight="600"
          letterSpacing="8"
          fill="none"
          stroke={stroke.color}
          strokeWidth={stroke.width}
          filter="url(#neon-glow)"
          style={{ opacity: 0 }}
        >
          Welcome,
        </text>

        {/* ── "Twin" — larger, centered below ── */}
        <text
          data-fill
          x="400"
          y="182"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="86"
          fontWeight="700"
          letterSpacing="24"
          fill={colors.electric}
          filter="url(#soft-bloom)"
          style={{ opacity: 0 }}
        >
          Twin
        </text>

        <text
          data-stroke
          x="400"
          y="182"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="86"
          fontWeight="700"
          letterSpacing="24"
          fill="none"
          stroke={colors.violet}
          strokeWidth={stroke.width + 0.5}
          filter="url(#neon-glow)"
          style={{ opacity: 0 }}
        >
          Twin
        </text>

        {/* Decorative horizontal rule under "Twin" */}
        <line
          data-stroke
          x1="300"
          y1="198"
          x2="500"
          y2="198"
          stroke={colors.electric}
          strokeWidth="1"
          opacity="0.5"
          style={{ opacity: 0 }}
        />
      </g>
    </svg>
  );
}
