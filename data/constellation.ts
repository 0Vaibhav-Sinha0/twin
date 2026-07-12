export type StarNode = {
  id: string;
  // Normalized position 0-1 on the star map canvas
  x: number;
  y: number;
  label: string;
  text: string;         // story beat text shown beside the star
  size: number;         // relative star size 1-3
  color: string;        // star glow colour
};

// Two protagonist stars — these drift toward each other across the whole scene
export const STAR_A = { startX: 0.12, startY: 0.35, endX: 0.45, endY: 0.5 };
export const STAR_B = { startX: 0.88, startY: 0.65, endX: 0.55, endY: 0.5 };

// Constellation nodes — appear as you scroll, lines draw between them
export const CONSTELLATION_NODES: StarNode[] = [
  {
    id: "s1",
    x: 0.18, y: 0.28,
    label: "🌟 The Beginning",
    text: "It all started with one random message. Neither of us knew that one \"Hi\" would eventually lead to... all of this. ✨",
    size: 2,
    color: "#3aa9ff",
  },
  {
    id: "s2",
    x: 0.32, y: 0.42,
    label: "💬 The First Conversations",
    text: "From random chats to daily conversations... somewhere along the way, talking to you became one of my favorite parts of the day.",
    size: 1.5,
    color: "#9f7aea",
  },
  {
    id: "s3",
    x: 0.25, y: 0.62,
    label: "🌙 The Night Chats",
    text: "\"The infinite times bye before the final bye\" somehow always turned into long conversations. No complaints though... those were some of the best ones. 😂🌙",
    size: 1.8,
    color: "#60a5fa",
  },
  {
    id: "s4",
    x: 0.48, y: 0.30,
    label: "🦊 Twin",
    text: "One day you became \"Twin\"... and somehow that nickname just stuck. Honestly, I can't imagine calling you anything else now. 🦊🤍",
    size: 2.5,
    color: "#e879f9",
  },
  {
    id: "s5",
    x: 0.62, y: 0.55,
    label: "🌸 The Little Things",
    text: "Good mornings. Good nights. Reels. Random memes. Voice notes. Tiny moments... but somehow they became my favorite memories.",
    size: 1.6,
    color: "#f472b6",
  },
  {
    id: "s6",
    x: 0.72, y: 0.35,
    label: "📚 Future Doctor",
    text: "Watching you work towards your dreams has been genuinely inspiring. Future Dr. Nandani... you've got this. 💗🩺",
    size: 2,
    color: "#34d399",
  },
  {
    id: "s7",
    x: 0.55, y: 0.72,
    label: "✨ Three Months",
    text: "Three months. Countless conversations. Too many inside jokes. And somehow... it still feels like we're just getting started. 🌼",
    size: 1.8,
    color: "#fbbf24",
  },
  {
    id: "s8",
    x: 0.50, y: 0.50,
    label: "🌌 Today",
    text: "Every star here represents a memory we've made together. Happy Birthday, Twin. Here's to filling this sky with many more. ⭐🦊",
    size: 3,
    color: "#fde68a",
  },
];

// Which nodes connect with lines (index pairs)
export const CONSTELLATION_LINES: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [3, 4], [3, 5], [4, 6], [5, 7], [6, 7], [2, 6],
];
