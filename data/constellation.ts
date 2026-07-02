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
    label: "The Beginning",
    text: "Two people. Different worlds. One message that didn't have to happen — but did. That's where this starts.",
    size: 2,
    color: "#3aa9ff",
  },
  {
    id: "s2",
    x: 0.32, y: 0.42,
    label: "First Real Words",
    text: "Not small talk. Not surface things. The first conversation that actually meant something. That was the signal.",
    size: 1.5,
    color: "#9f7aea",
  },
  {
    id: "s3",
    x: 0.25, y: 0.62,
    label: "2 AM",
    text: "The late night conversations that were supposed to be short. They never were. And neither of us was sorry.",
    size: 1.8,
    color: "#60a5fa",
  },
  {
    id: "s4",
    x: 0.48, y: 0.30,
    label: "Twin",
    text: "At some point the word just appeared. Twin. Not just a friend. Something more specific than that. Something irreplaceable.",
    size: 2.5,
    color: "#e879f9",
  },
  {
    id: "s5",
    x: 0.62, y: 0.55,
    label: "Hard Days",
    text: "You were struggling. You didn't ask for help. I stayed close anyway. That's when friendship becomes something permanent.",
    size: 1.6,
    color: "#f472b6",
  },
  {
    id: "s6",
    x: 0.72, y: 0.35,
    label: "Proud of You",
    text: "Watching you choose to keep going — every study session, every hard day — quietly, without speeches. That takes everything.",
    size: 2,
    color: "#34d399",
  },
  {
    id: "s7",
    x: 0.55, y: 0.72,
    label: "Still Here",
    text: "People come and go. Life changes shape. And yet — here we still are. That's not luck. That's something we both chose.",
    size: 1.8,
    color: "#fbbf24",
  },
  {
    id: "s8",
    x: 0.50, y: 0.50,
    label: "Today",
    text: "This star is where the two meet. Where everything converges. Happy birthday, twin. This constellation is yours — and it's only getting bigger.",
    size: 3,
    color: "#fde68a",
  },
];

// Which nodes connect with lines (index pairs)
export const CONSTELLATION_LINES: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [3, 4], [3, 5], [4, 6], [5, 7], [6, 7], [2, 6],
];
