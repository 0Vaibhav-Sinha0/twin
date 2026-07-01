export type FlowerType = "sunflower" | "rose" | "cherry" | "lavender" | "lotus";

export type GardenFlower = {
  id: string;
  type: FlowerType;
  // Normalized position 0-1 across the garden ground
  x: number;
  label: string;
  memory: string;
  color: string;        // petal colour
  glowColor: string;    // bloom glow
};

export const GARDEN_FLOWERS: GardenFlower[] = [
  {
    id: "f1",
    type: "sunflower",
    x: 0.12,
    label: "The First Day",
    memory: "Every garden starts with one seed. This was ours — one message, one reply, one moment that quietly changed everything.",
    color: "#f59e0b",
    glowColor: "#fbbf24",
  },
  {
    id: "f2",
    type: "rose",
    x: 0.24,
    label: "Late Nights",
    memory: "2 AM conversations that were supposed to be short. They never were. And I was never sorry about that.",
    color: "#f43f5e",
    glowColor: "#fb7185",
  },
  {
    id: "f3",
    type: "cherry",
    x: 0.36,
    label: "The Inside Joke",
    memory: "No one else would understand it. That's exactly why it's here, blooming quietly just for us.",
    color: "#f9a8d4",
    glowColor: "#fbcfe8",
  },
  {
    id: "f4",
    type: "lavender",
    x: 0.48,
    label: "Hard Days",
    memory: "You didn't ask for help. You let me be there anyway. That's when I knew this friendship was real.",
    color: "#a78bfa",
    glowColor: "#c4b5fd",
  },
  {
    id: "f5",
    type: "sunflower",
    x: 0.58,
    label: "Proud of You",
    memory: "Every study session, every late night, every time you showed up even when it was hard. I watched all of it. I'm so proud.",
    color: "#fbbf24",
    glowColor: "#fde68a",
  },
  {
    id: "f6",
    type: "lotus",
    x: 0.68,
    label: "Twin",
    memory: "The moment you became more than a friend. The moment you became the word twin. I don't remember exactly when. I just know it's true.",
    color: "#34d399",
    glowColor: "#6ee7b7",
  },
  {
    id: "f7",
    type: "rose",
    x: 0.78,
    label: "You at Your Best",
    memory: "I hope you see yourself the way I see you. Even once. It would change everything.",
    color: "#fb923c",
    glowColor: "#fdba74",
  },
  {
    id: "f8",
    type: "cherry",
    x: 0.88,
    label: "Today",
    memory: "This flower is for your birthday. For every year after this one. For everything still to come. Happy birthday, lomri. 🦊",
    color: "#e879f9",
    glowColor: "#f0abfc",
  },
];
