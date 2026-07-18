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
    date: "21 April",
    title: "First Hello",
    body: "One message. \"Hiiii.\" Sent to someone whose name I didn't even know yet. I called myself a stranger texting another zombie, and you didn't even blink. That's where all of this started.",
    warmth: 0,
    icon: "✦",
    side: "right",
  },
  {
    id: "t2",
    date: "22 April",
    title: "Zombie",
    body: "The first nickname, before we really knew each other at all. You warned me your dad — Kim Jong Un, apparently — wouldn't be shooting me. I knew right away this wasn't going to be a normal friendship.",
    warmth: 0.08,
    icon: "🧟",
    side: "left",
  },
  {
    id: "t3",
    date: "5 May",
    title: "The First Gift",
    body: "You didn't ask for anything. I just built you a small website, out of nowhere, and sent it without much explanation. I didn't know it yet, but that was the start of a pattern — I'd keep building things for you, over and over, just because.",
    warmth: 0.16,
    icon: "🎁",
    side: "right",
  },
  {
    id: "t4",
    date: "10 May",
    title: "You Told Me Everything",
    body: "Your real name — Raj Nandani, not the name I'd known you by. Your real home, Jharkhand, not Bihar. And that your mother had passed away, just two days after your last board exam. I didn't know what to say except the truth: I'll be the best stranger you've ever met. Somehow, that was enough.",
    warmth: 0.24,
    icon: "🌙",
    side: "left",
  },
  {
    id: "t5",
    date: "10–13 May",
    title: "I Called You Twin",
    body: "I don't remember choosing the word. It just slipped out, almost by accident, the way the right nicknames always seem to arrive. It never left.",
    warmth: 0.32,
    icon: "✨",
    side: "right",
  },
  {
    id: "t6",
    date: "May, week 3",
    title: "Dictator. Lomri.",
    body: "Two nicknames that stuck for good — Dictator, for reasons neither of us can fully explain, and Lomri, because I convinced myself you were secretly a fox after guessing your hometown a little too accurately. You insisted foxes don't do what I said they did. I didn't care. It fit anyway.",
    warmth: 0.4,
    icon: "🦊",
    side: "left",
  },
  {
    id: "t7",
    date: "29 May",
    title: "Kaash Tumse Pehle Mile Hote",
    body: "One month in, in the middle of a heavy conversation about the friendships you'd lost, you said it — and so did I, separately, almost at the same time. I wish we'd met sooner. Neither of us was joking.",
    warmth: 0.48,
    icon: "💭",
    side: "right",
  },
  {
    id: "t8",
    date: "14 June",
    title: "Your Whole Year, Out Loud",
    body: "You walked me through all of 2025, month by month — Spanish, your first real trip, tutoring a kid whose grades went from 50% to 90%, henna, journaling, a room you redesigned yourself. By the end you'd shocked even yourself. \"Koi bhi kar sakta hai,\" you said. Anyone can do this. I believed every word.",
    warmth: 0.56,
    icon: "🌿",
    side: "left",
  },
  {
    id: "t9",
    date: "22 June",
    title: "The Secret Comes Out",
    body: "I'd been building your birthday website for weeks, counting down out loud without ever saying what for. When I finally told you, you said something I haven't forgotten: \"Humko first time aaisa kuch mil rha hai kisi se.\" First time anyone's done something like this for you. That's exactly why I had to.",
    warmth: 0.64,
    icon: "🗝",
    side: "right",
  },
  {
    id: "t10",
    date: "27 June",
    title: "The First Call",
    body: "Forty minutes. The first time we actually heard each other's voices instead of just reading them. I don't remember most of what we said. I remember exactly how it felt.",
    warmth: 0.72,
    icon: "📞",
    side: "left",
  },
  {
    id: "t11",
    date: "early July",
    title: "Your Voice, For Real",
    body: "Your first voice note. I told you your voice was \"mstt\" and meant every word — I kept that message pinned in our chat and never told you that part. Consider this me finally admitting it.",
    warmth: 0.8,
    icon: "🎙",
    side: "right",
  },
  {
    id: "t12",
    date: "15–16 July",
    title: "You Said It First",
    body: "\"You're so good, Vaibhav... I feel like we appreciate you too little.\" You listed all of it — the texts, the good mornings, the good nights, the memes made just for you. I don't think I said this back clearly enough at the time. So I'm saying it now: right back at you. Always.",
    warmth: 0.9,
    icon: "💗",
    side: "left",
  },
  {
    id: "t13",
    date: "26 July",
    title: "Today",
    body: "87 days of everything above, and counting. You've made my life warmer, funnier, more honest. Happy birthday, Nandani. Happy birthday, twin. This chapter's just getting started.",
    warmth: 1,
    icon: "🎂",
    side: "right",
  },
];
