"use client";

import { useState, useEffect, useRef } from "react";

export function useTimelineScroll() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalHeight = container.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalHeight));
      setProgress(p);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { progress, containerRef };
}

// Interpolate between night and day colours based on warmth (0-1)
export function interpolateColor(
  nightColor: string,
  dayColor: string,
  warmth: number
): string {
  const night = hexToRgb(nightColor);
  const day = hexToRgb(dayColor);
  if (!night || !day) return nightColor;

  const r = Math.round(night.r + (day.r - night.r) * warmth);
  const g = Math.round(night.g + (day.g - night.g) * warmth);
  const b = Math.round(night.b + (day.b - night.b) * warmth);
  return `rgb(${r},${g},${b})`;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
