export type GalleryCard = {
  id: string;
  // Replace src with real image paths under /public/images/gallery/
  src: string;
  // Placeholder colour shown when no image is set
  placeholderColor: string;
  // Handwritten caption visible on the front
  caption: string;
  // Date shown under caption
  date: string;
  // Category tag
  category: "funny" | "emotional" | "random" | "milestone";
  // Message revealed on the back after flip
  backMessage: string;
  // Slight rotation for natural polaroid feel (-3 to +3 deg)
  rotation: number;
};

export const GALLERY_CARDS: GalleryCard[] = [
  {
    id: "g1",
    src: "",
    placeholderColor: "#c9886b",
    caption: "the day everything started",
    date: "whenever that was",
    category: "milestone",
    backMessage:
      "I don't remember the exact date. I just remember thinking — okay, this one's different.",
    rotation: -2,
  },
  {
    id: "g2",
    src: "",
    placeholderColor: "#4a6b5a",
    caption: "2 AM and still talking",
    date: "too many nights to count",
    category: "random",
    backMessage:
      "Sleep was never the priority when we had things to say. And we always had things to say.",
    rotation: 1.5,
  },
  {
    id: "g3",
    src: "",
    placeholderColor: "#7a5c3e",
    caption: "when you laughed so hard",
    date: "a tuesday, probably",
    category: "funny",
    backMessage:
      "I wish I had captured the exact sound of that laugh. I'd keep it somewhere safe.",
    rotation: -1,
  },
  {
    id: "g4",
    src: "",
    placeholderColor: "#9f7aea",
    caption: "one of the hard days",
    date: "we got through it",
    category: "emotional",
    backMessage:
      "You didn't ask for help. You never do. But I was there anyway. I'll always be there anyway.",
    rotation: 2.5,
  },
  {
    id: "g5",
    src: "",
    placeholderColor: "#3aa9ff",
    caption: "proud of you, lomri",
    date: "every single day",
    category: "milestone",
    backMessage:
      "You work so hard and you don't even see it. I see it. I see all of it.",
    rotation: -2.5,
  },
  {
    id: "g6",
    src: "",
    placeholderColor: "#c9886b",
    caption: "the inside joke that started it",
    date: "you know which one",
    category: "funny",
    backMessage:
      "I can't even write it here because no one else would understand. That's exactly the point.",
    rotation: 1,
  },
  {
    id: "g7",
    src: "",
    placeholderColor: "#4a6b5a",
    caption: "when you were overthinking again",
    date: "3:47 AM",
    category: "emotional",
    backMessage:
      "Your brain runs at 100 even when the world is asleep. I hope you know I don't mind waking up for it.",
    rotation: -1.5,
  },
  {
    id: "g8",
    src: "",
    placeholderColor: "#f0e4d0",
    caption: "random photo, core memory",
    date: "doesn't matter when",
    category: "random",
    backMessage:
      "Some moments don't announce themselves. They just quietly become everything.",
    rotation: 2,
  },
  {
    id: "g9",
    src: "",
    placeholderColor: "#9f7aea",
    caption: "you at your best",
    date: "which is most days",
    category: "milestone",
    backMessage:
      "I hope you see yourself the way I see you. Even once. It would change everything.",
    rotation: -0.5,
  },
  {
    id: "g10",
    src: "",
    placeholderColor: "#3aa9ff",
    caption: "this one always makes me smile",
    date: "saved forever",
    category: "funny",
    backMessage:
      "I've looked at this more times than I'll ever admit. It just makes everything better.",
    rotation: 1.5,
  },
  {
    id: "g11",
    src: "",
    placeholderColor: "#7a5c3e",
    caption: "the late night rant session",
    date: "wednesday, past midnight",
    category: "random",
    backMessage:
      "You needed to talk. I needed to listen. That's always been our thing.",
    rotation: -2,
  },
  {
    id: "g12",
    src: "",
    placeholderColor: "#c9886b",
    caption: "happy nandani moment",
    date: "july 26 forever",
    category: "milestone",
    backMessage:
      "This is what it's all been building to. Happy birthday, twin. You deserve every bit of this.",
    rotation: 0.5,
  },
];
