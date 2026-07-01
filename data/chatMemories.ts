export type MemoryType =
  | "screenshot"
  | "voice"
  | "moment"
  | "joke"
  | "emotional"
  | "random";

export type MemoryItem = {
  id: string;
  type: MemoryType;
  caption: string;
  // Optional: path to screenshot image under /public/images/chat/
  imageSrc?: string;
  // Placeholder colour when no image
  placeholderColor?: string;
  // Small reaction or tag
  reaction?: string;
};

export type ChatWeek = {
  id: string;
  week: string;         // "Week 1"
  dateRange: string;    // "June 1 – June 7"
  tagline: string;      // one-line emotional summary of this week
  memories: MemoryItem[];
};

export const CHAT_WEEKS: ChatWeek[] = [
  {
    id: "w1",
    week: "Week 1",
    dateRange: "the very beginning",
    tagline: "when we were still figuring out that this was going to be something.",
    memories: [
      {
        id: "w1m1",
        type: "moment",
        caption: "The first real reply. The one that didn't have to happen but did.",
        placeholderColor: "#0b1230",
        reaction: "✦",
      },
      {
        id: "w1m2",
        type: "screenshot",
        caption: "First conversation that went past small talk.",
        placeholderColor: "#131c44",
        reaction: "💬",
      },
      {
        id: "w1m3",
        type: "random",
        caption: "Something completely random that made me think — okay, I like this person.",
        placeholderColor: "#1a2456",
        reaction: "😭",
      },
    ],
  },
  {
    id: "w2",
    week: "Week 2",
    dateRange: "early days",
    tagline: "still new, but it was already feeling comfortable. that was the sign.",
    memories: [
      {
        id: "w2m1",
        type: "joke",
        caption: "The first inside joke. I don't even remember how it started.",
        placeholderColor: "#1a1230",
        reaction: "💀",
      },
      {
        id: "w2m2",
        type: "moment",
        caption: "First time we talked about something that actually mattered.",
        placeholderColor: "#0d1a2e",
        reaction: "🌙",
      },
      {
        id: "w2m3",
        type: "screenshot",
        caption: "This exchange — I've reread it more times than I'll admit.",
        placeholderColor: "#12203a",
        reaction: "⭐",
      },
      {
        id: "w2m4",
        type: "random",
        caption: "Sent at 1 AM. For no reason. That was the beginning of the 2 AM era.",
        placeholderColor: "#0f1830",
        reaction: "😴",
      },
    ],
  },
  {
    id: "w3",
    week: "Week 3",
    dateRange: "somewhere in the middle",
    tagline: "late nights, long messages, absolutely zero business being awake at this hour.",
    memories: [
      {
        id: "w3m1",
        type: "voice",
        caption: "The voice note that was supposed to be 30 seconds. It was 4 minutes.",
        placeholderColor: "#1a0f30",
        reaction: "🎙",
      },
      {
        id: "w3m2",
        type: "emotional",
        caption: "One of those conversations where you say things you don't usually say.",
        placeholderColor: "#1a1040",
        reaction: "🫂",
      },
      {
        id: "w3m3",
        type: "joke",
        caption: "I don't know why this was so funny. It still is.",
        placeholderColor: "#130d30",
        reaction: "💀",
      },
    ],
  },
  {
    id: "w4",
    week: "Week 4",
    dateRange: "when things got real",
    tagline: "this is the week I knew. not friendship — this specific friendship.",
    memories: [
      {
        id: "w4m1",
        type: "emotional",
        caption: "You were going through something. You didn't have to tell me. You did anyway.",
        placeholderColor: "#1a0b20",
        reaction: "💜",
      },
      {
        id: "w4m2",
        type: "screenshot",
        caption: "The message I saved. I didn't tell you I saved it.",
        placeholderColor: "#1a0d2a",
        reaction: "🌸",
      },
      {
        id: "w4m3",
        type: "moment",
        caption: "First time I called you twin. Out loud. In the chat.",
        placeholderColor: "#200a1a",
        reaction: "🦊",
      },
    ],
  },
  {
    id: "w5",
    week: "Week 5 onward",
    dateRange: "the era we're still in",
    tagline: "consistent, warm, honest. still here. still this.",
    memories: [
      {
        id: "w5m1",
        type: "random",
        caption: "A meme you sent that had absolutely nothing to do with anything. Perfect.",
        placeholderColor: "#0f2a1a",
        reaction: "😭",
      },
      {
        id: "w5m2",
        type: "voice",
        caption: "Voice note at 2:47 AM. The timing alone tells the whole story.",
        placeholderColor: "#0a2218",
        reaction: "🎙",
      },
      {
        id: "w5m3",
        type: "moment",
        caption: "When you were studying and still somehow replied in 30 seconds.",
        placeholderColor: "#0d2820",
        reaction: "📚",
      },
      {
        id: "w5m4",
        type: "emotional",
        caption: "The check-in that reminded me why this friendship is different.",
        placeholderColor: "#0f2a1e",
        reaction: "🌿",
      },
      {
        id: "w5m5",
        type: "screenshot",
        caption: "Saving this one forever. No notes.",
        placeholderColor: "#0a2016",
        reaction: "✦",
      },
    ],
  },
];
