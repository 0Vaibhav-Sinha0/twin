export type ThoughtSize = "small" | "medium" | "large";
export type ThoughtColor =
  | "yellow"
  | "pink"
  | "blue"
  | "green"
  | "violet"
  | "orange";

export type Thought = {
  id: string;
  text: string;
  color: ThoughtColor;
  size: ThoughtSize;
  // Seed for deterministic random positioning (0-1)
  seed: number;
  // Slight rotation in degrees
  rotation: number;
};

// Color token map — night mode glowing sticky notes
export const THOUGHT_COLORS: Record<
  ThoughtColor,
  { bg: string; border: string; text: string; glow: string }
> = {
  yellow: {
    bg: "rgba(30, 25, 5, 0.85)",
    border: "rgba(251,191,36,0.35)",
    text: "#fde68a",
    glow: "rgba(251,191,36,0.15)",
  },
  pink: {
    bg: "rgba(30, 5, 18, 0.85)",
    border: "rgba(244,114,182,0.35)",
    text: "#fbcfe8",
    glow: "rgba(244,114,182,0.15)",
  },
  blue: {
    bg: "rgba(5, 15, 30, 0.85)",
    border: "rgba(58,169,255,0.35)",
    text: "#bae6fd",
    glow: "rgba(58,169,255,0.15)",
  },
  green: {
    bg: "rgba(5, 25, 15, 0.85)",
    border: "rgba(52,211,153,0.35)",
    text: "#a7f3d0",
    glow: "rgba(52,211,153,0.15)",
  },
  violet: {
    bg: "rgba(15, 8, 30, 0.85)",
    border: "rgba(167,139,250,0.35)",
    text: "#ddd6fe",
    glow: "rgba(167,139,250,0.15)",
  },
  orange: {
    bg: "rgba(28, 12, 3, 0.85)",
    border: "rgba(251,146,60,0.35)",
    text: "#fed7aa",
    glow: "rgba(251,146,60,0.15)",
  },
};

// ── ADD YOUR THOUGHTS HERE ──────────────────────────────────────────
// text: the thought itself
// color: yellow | pink | blue | green | violet | orange
// size: small | medium | large
// rotation: -4 to +4 (degrees of tilt, negative = left, positive = right)
// seed: 0–1 (controls position on screen — change to reposition)
// ───────────────────────────────────────────────────────────────────
export const THOUGHTS: Thought[] = [
  {
    id: "th1",
    text: "add your thought here",
    color: "yellow",
    size: "medium",
    seed: 0.08,
    rotation: -2,
  },
  {
    id: "th2",
    text: "add your thought here",
    color: "pink",
    size: "small",
    seed: 0.22,
    rotation: 1.5,
  },
  {
    id: "th3",
    text: "add your thought here",
    color: "blue",
    size: "large",
    seed: 0.35,
    rotation: -1,
  },
  {
    id: "th4",
    text: "add your thought here",
    color: "violet",
    size: "medium",
    seed: 0.48,
    rotation: 2.5,
  },
  {
    id: "th5",
    text: "add your thought here",
    color: "green",
    size: "small",
    seed: 0.60,
    rotation: -3,
  },
  {
    id: "th6",
    text: "add your thought here",
    color: "orange",
    size: "medium",
    seed: 0.72,
    rotation: 1,
  },
  {
    id: "th7",
    text: "add your thought here",
    color: "yellow",
    size: "small",
    seed: 0.15,
    rotation: 3,
  },
  {
    id: "th8",
    text: "add your thought here",
    color: "pink",
    size: "large",
    seed: 0.55,
    rotation: -1.5,
  },
  {
    id: "th9",
    text: "add your thought here",
    color: "blue",
    size: "medium",
    seed: 0.82,
    rotation: 2,
  },
  {
    id: "th10",
    text: "add your thought here",
    color: "violet",
    size: "small",
    seed: 0.90,
    rotation: -2.5,
  },
  {
    id: "th11",
    text: "add your thought here",
    color: "green",
    size: "medium",
    seed: 0.42,
    rotation: 1.5,
  },
  {
    id: "th12",
    text: "add your thought here",
    color: "orange",
    size: "small",
    seed: 0.28,
    rotation: -0.5,
  },
];
