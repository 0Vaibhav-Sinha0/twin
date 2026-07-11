export type MessageLine = {
  text: string;
  // Extra pause (ms) held after this line beyond the base reading time
  extraPause?: number;
  // Style variant — 'quote' for the ">" opening line, 'body' for normal, 'emphasis' for short punchy lines
  style?: "quote" | "body" | "emphasis";
};

export type MessagePart = {
  id: string;
  label: string; // "Part 1 — The Beginning"
  lines: MessageLine[];
};

export const FINALE_PARTS: MessagePart[] = [
  {
    id: "p1",
    label: "Part 1 — The Beginning",
    lines: [
      { text: "You've reached the final chapter.", style: "quote" },
      { text: "Everything before this was made to make you smile." },
      { text: "This one... was made from my heart." },
      { text: "First of all..." },
      { text: "It all started with one random message." },
      { text: "But... but... but..." },
      { text: "Now you've become one of the most important people in my life, Twin." },
    ],
  },
  {
    id: "p2",
    label: "Part 2 — Three Months",
    lines: [
      { text: "It's already been three months since we started talking.", style: "quote" },
      { text: "And honestly..." },
      { text: "The vibe and comfort I feel with you..." },
      { text: "I've never felt that with anyone before." },
      { text: "Twin..." },
      { text: "You're my Home away from home." },
      { text: "Biologically or not..." },
      { text: "You'll always count as my family." },
    ],
  },
  {
    id: "p3",
    label: "Part 3 — Safe Place",
    lines: [
      { text: "Whenever someone asks me who makes me happy...", style: "quote" },
      { text: "I immediately think of you." },
      { text: "You're not just a friend." },
      { text: "You're my safe place." },
      { text: "A million memories." },
      { text: "A bond that time can't erase." },
      { text: "Just like the moon..." },
      { text: "You're beautiful in all your phases. 🌙" },
    ],
  },
  {
    id: "p4",
    label: "Part 4 — You Changed Me",
    lines: [
      { text: "You already know this...", style: "quote" },
      { text: "\"Friendship wasn't for me.\"" },
      { text: "Until I met you." },
      { text: "Fortunately..." },
      { text: "You brought my spark back." },
      { text: "And I'll do everything I can..." },
      { text: "To keep this beautiful friendship forever." },
    ],
  },
  {
    id: "p5",
    label: "Part 5 — Twinship",
    lines: [
      { text: "You are my priority.", style: "quote" },
      { text: "You are important to me." },
      { text: "I appreciate you." },
      { text: "I cherish this friendship." },
      { text: "This twinship. 🦊🤍" },
    ],
  },
  {
    id: "p6",
    label: "Part 6 — Attachment",
    lines: [
      { text: "You once told me...", style: "quote" },
      { text: "\"Don't get attached.\"" },
      { text: "But..." },
      { text: "I'm already attached to you." },
      { text: "Because talking to you feels nice." },
      { text: "Sharing everything with you feels nice." },
      { text: "Sending you reels feels nice." },
      { text: "Honestly..." },
      { text: "Everything feels a little better..." },
      { text: "When it's with you." },
    ],
  },
  {
    id: "p7",
    label: "Part 7 — Destiny",
    lines: [
      { text: "I talk to you every day.", style: "quote" },
      { text: "I didn't grow up with you." },
      { text: "We are not from the same city." },
      { text: "We aren't childhood friends." },
      { text: "You're just someone..." },
      { text: "Destiny quietly placed..." },
      { text: "On the other side of a screen." },
    ],
  },
  {
    id: "p8",
    label: "Part 8 — Routine",
    lines: [
      { text: "The strange thing is...", style: "quote" },
      { text: "I don't remember..." },
      { text: "When our conversations became part of my routine." },
      { text: "One day..." },
      { text: "I was simply living my life." },
      { text: "And the next...", extraPause: 2000 },
      { text: "I became obsessed with you.", extraPause: 1000 },
      { text: "Me?", extraPause: 1000 },
      { text: "Obsessed??", extraPause: 1000 },
      { text: "With youuu?", extraPause: 1000 },
      { text: "Absolutely yesss...", style: "emphasis" },
      { text: "Yesss I am!! 😂", style: "emphasis" },
    ],
  },
  {
    id: "p9",
    label: "Part 9 — Best Friendships",
    lines: [
      { text: "I think that's how the best friendships happen.", style: "quote" },
      { text: "They don't arrive..." },
      { text: "With a grand introduction." },
      { text: "They quietly become part of your ordinary days..." },
      { text: "Until one day..." },
      { text: "You realise..." },
      { text: "Destiny gave you someone..." },
      { text: "You're simply grateful to know." },
    ],
  },
  {
    id: "p10",
    label: "Part 10 — Favorite Person",
    lines: [
      { text: "Out of billions of people...", style: "quote" },
      { text: "Still..." },
      { text: "\"Tuuuuuuu Chahiyeeeeeee.\" ❤️", style: "emphasis" },
      { text: "You're more than my favorite person." },
      { text: "You're different from everyone." },
      { text: "You have a very special place in my heart." },
      { text: "I genuinely love having you in my life." },
      { text: "And I love our friendship..." },
      { text: "So..." },
      { text: "So much." },
    ],
  },
  {
    id: "final",
    label: "Final Part",
    lines: [
      { text: "I WILL ADORE YOU TILL ETERNITY.", style: "emphasis" },
      { text: "Maybe..." },
      { text: "I couldn't express everything through words." },
      { text: "But I hope..." },
      { text: "This website expressed..." },
      { text: "The parts I couldn't." },
      { text: "Thank you..." },
      { text: "For being my Twin." },
      { text: "Thank you..." },
      { text: "For being you. 🦊🤍", style: "emphasis" },
    ],
  },
];
