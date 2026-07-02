export type CardFace =
  | { type: "emoji"; symbol: string; label: string }
  | { type: "initial"; letter: string; label: string };

export type GameCard = {
  id: string;
  pairId: string;
  face: CardFace;
  color: string;       // accent colour for this pair
  glowColor: string;
};

// 8 pairs — 4 emoji + 4 Cinzel initial
export const CARD_PAIRS: Omit<GameCard, "id">[] = [
  // ── Emoji pairs ──────────────────────────────────
  {
    pairId: "p1",
    face: { type: "emoji", symbol: "🦊", label: "Fox" },
    color: "#ea580c",
    glowColor: "rgba(234,88,12,0.4)",
  },
  {
    pairId: "p2",
    face: { type: "emoji", symbol: "🌸", label: "Blossom" },
    color: "#f472b6",
    glowColor: "rgba(244,114,182,0.4)",
  },
  {
    pairId: "p3",
    face: { type: "emoji", symbol: "🌙", label: "Moon" },
    color: "#a78bfa",
    glowColor: "rgba(167,139,250,0.4)",
  },
  {
    pairId: "p4",
    face: { type: "emoji", symbol: "⭐", label: "Star" },
    color: "#fbbf24",
    glowColor: "rgba(251,191,36,0.4)",
  },
  // ── Cinzel initial pairs ─────────────────────────
  {
    pairId: "p5",
    face: { type: "initial", letter: "T", label: "Twin" },
    color: "#3aa9ff",
    glowColor: "rgba(58,169,255,0.4)",
  },
  {
    pairId: "p6",
    face: { type: "initial", letter: "N", label: "Nandani" },
    color: "#34d399",
    glowColor: "rgba(52,211,153,0.4)",
  },
  {
    pairId: "p7",
    face: { type: "initial", letter: "V", label: "Vaibhav" },
    color: "#f87171",
    glowColor: "rgba(248,113,113,0.4)",
  },
  {
    pairId: "p8",
    face: { type: "initial", letter: "✦", label: "Us" },
    color: "#e879f9",
    glowColor: "rgba(232,121,249,0.4)",
  },
];

// Shuffle utility
export function buildShuffledDeck(): GameCard[] {
  const deck: GameCard[] = [];
  let counter = 0;
  for (const pair of CARD_PAIRS) {
    deck.push({ ...pair, id: `card-${counter++}` });
    deck.push({ ...pair, id: `card-${counter++}` });
  }
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
