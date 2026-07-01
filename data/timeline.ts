export type TimelineMilestone = {
  id: string;
  date: string;
  title: string;
  body: string;
  // 0 = pure night (beginning), 1 = pure day (now)
  // Controls colour temperature of this node
  warmth: number;
  icon: string;
  side: "left" | "right";
};

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: "t1",
    date: "the beginning",
    title: "First Message",
    body: "It started with something small. A reply that didn't have to happen. But it did. And somehow that one message quietly changed everything.",
    warmth: 0,
    icon: "✦",
    side: "right",
  },
  {
    id: "t2",
    date: "early days",
    title: "The First Real Conversation",
    body: "Not small talk. Not surface level. The first time we actually talked — about something that mattered. I remember thinking: this person is different.",
    warmth: 0.1,
    icon: "🌙",
    side: "left",
  },
  {
    id: "t3",
    date: "a few weeks in",
    title: "2 AM Without Reason",
    body: "We were up late for no reason except that neither of us wanted to stop talking. That was the night I realised this wasn't just a coincidence.",
    warmth: 0.2,
    icon: "⭐",
    side: "right",
  },
  {
    id: "t4",
    date: "somewhere in the middle",
    title: "The Inside Joke",
    body: "I can't even explain what it means. But you know. And I know. And that's exactly what makes it ours.",
    warmth: 0.35,
    icon: "🦊",
    side: "left",
  },
  {
    id: "t5",
    date: "one of the hard days",
    title: "When Things Got Real",
    body: "You were going through something. You didn't say much. But you let me be there. That's when I understood — this friendship was real, not just comfortable.",
    warmth: 0.45,
    icon: "🌿",
    side: "right",
  },
  {
    id: "t6",
    date: "after that",
    title: "I Called You Twin",
    body: "I don't remember the exact moment. But at some point you stopped being just a friend and started being the person who got it. Who got me. Who got everything without explanation.",
    warmth: 0.58,
    icon: "✨",
    side: "left",
  },
  {
    id: "t7",
    date: "neet prep days",
    title: "Proud of You, Lomri",
    body: "Watching you study, stress, push through — it was one of the most quietly inspiring things. I never told you enough how much I believed in you. I'm telling you now.",
    warmth: 0.68,
    icon: "📚",
    side: "right",
  },
  {
    id: "t8",
    date: "not long ago",
    title: "The Conversation I Needed",
    body: "There was a night I was the one struggling. You showed up without being asked. You said exactly what I needed to hear. I won't forget that.",
    warmth: 0.78,
    icon: "🌸",
    side: "left",
  },
  {
    id: "t9",
    date: "recently",
    title: "Still Here",
    body: "People come and go. Life gets busy. Things change. And yet — here we still are. Still talking. Still laughing. Still 2 AM sometimes. That means something.",
    warmth: 0.88,
    icon: "🌅",
    side: "right",
  },
  {
    id: "t10",
    date: "july 26",
    title: "Today",
    body: "You've made my life warmer, funnier, more honest, and more meaningful. Happy birthday, twin. This is just the chapter we're in — there's so much more ahead.",
    warmth: 1,
    icon: "🎂",
    side: "left",
  },
];
