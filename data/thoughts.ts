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
  seed: number;
  rotation: number;
};

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

export const THOUGHTS: Thought[] = [
  {
    id: "th1",
    text: "Zombie",
    color: "green",
    size: "medium",
    seed: 0.08,
    rotation: -2,
  },
  {
    id: "th2",
    text: "Lomri",
    color: "orange",
    size: "large",
    seed: 0.22,
    rotation: 1.5,
  },
  {
    id: "th3",
    text: "Heera",
    color: "blue",
    size: "medium",
    seed: 0.35,
    rotation: -1,
  },
  {
    id: "th4",
    text: "Silver Fox",
    color: "violet",
    size: "large",
    seed: 0.48,
    rotation: 2.5,
  },
  {
    id: "th5",
    text: "Dictator",
    color: "pink",
    size: "medium",
    seed: 0.60,
    rotation: -3,
  },
  {
    id: "th6",
    text: "Diamond Fox",
    color: "yellow",
    size: "large",
    seed: 0.72,
    rotation: 1,
  },
  {
    id: "th7",
    text: "Moon",
    color: "blue",
    size: "medium",
    seed: 0.15,
    rotation: 3,
  },
  {
    id: "th8",
    text: "Twin",
    color: "pink",
    size: "large",
    seed: 0.55,
    rotation: -1.5,
  },
  {
    id: "th9",
    text: "Twinie",
    color: "violet",
    size: "medium",
    seed: 0.82,
    rotation: 2,
  },
  {
    id: "th10",
    text: "Twinsie",
    color: "yellow",
    size: "small",
    seed: 0.90,
    rotation: -2.5,
  },
  {
    id: "th11",
    text: "Twinskie",
    color: "green",
    size: "medium",
    seed: 0.42,
    rotation: 1.5,
  },
];
