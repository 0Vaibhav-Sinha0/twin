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
    dateRange: "21–30 April",
    tagline: "two complete strangers, immediately committing to the bit.",
    memories: [
      {
        id: "w1m1",
        type: "moment",
        caption: "The actual first message: \"Hiiii.\" Followed by hours of silence before you replied.",
        placeholderColor: "#0b1230",
        reaction: "✦",
      },
      {
        id: "w1m2",
        type: "joke",
        caption: "\"Don't worry, my dad (Kim Jong Un) won't shoot you.\" Deadpan, day one.",
        placeholderColor: "#131c44",
        reaction: "😂",
      },
      {
        id: "w1m3",
        type: "random",
        caption: "The missile-launch-training joke that became our entire vocabulary for \"what are you up to.\"",
        placeholderColor: "#1a2456",
        reaction: "🚀",
      },
    ],
  },
  {
    id: "w2",
    week: "Week 2",
    dateRange: "1–7 May",
    tagline: "batman, spiderman, and the first website I ever built you.",
    memories: [
      {
        id: "w2m1",
        type: "joke",
        caption: "\"I'm finally ready to tell you... I'm batman.\" You didn't even flinch — \"Yeah and I'm spiderman.\"",
        placeholderColor: "#1a1230",
        reaction: "😭",
      },
      {
        id: "w2m2",
        type: "moment",
        caption: "A real, numbered list of college advice, sent on your very first day of class.",
        placeholderColor: "#0d1a2e",
        reaction: "📋",
      },
      {
        id: "w2m3",
        type: "moment",
        caption: "The first website. Built and sent for absolutely no reason at all.",
        placeholderColor: "#12203a",
        reaction: "🎁",
      },
    ],
  },
  {
    id: "w3",
    week: "Week 3",
    dateRange: "8–15 May",
    tagline: "the week you told me everything, and I stayed anyway.",
    memories: [
      {
        id: "w3m1",
        type: "emotional",
        caption: "You told me something real — your real name, your real home. \"Tum bohot strong ho yaar,\" I said. You corrected me gently. I answered the only way that felt true: I will be the best stranger you would have ever met.",
        placeholderColor: "#1a0f30",
        reaction: "🌙",
      },
      {
        id: "w3m2",
        type: "emotional",
        caption: "\"Tum sach me aache nikle.\" You really turned out to be a good person. Right back at you.",
        placeholderColor: "#1a1040",
        reaction: "💗",
      },
      {
        id: "w3m3",
        type: "moment",
        caption: "\"Twin\" — used for the very first time, almost by accident.",
        placeholderColor: "#130d30",
        reaction: "🦊",
      },
    ],
  },
  {
    id: "w4",
    week: "Week 4",
    dateRange: "16–24 May",
    tagline: "day 4, day 4.5, and the birth of lomri.",
    memories: [
      {
        id: "w4m1",
        type: "joke",
        caption: "\"Day 4 of missing you, Dictator.\" Then 4.5. Then \"now I'm genuinely worried.\"",
        placeholderColor: "#1a0b20",
        reaction: "😅",
      },
      {
        id: "w4m2",
        type: "joke",
        caption: "Guessed your hometown a little too accurately and decided you were secretly a fox. Lomri stuck for good.",
        placeholderColor: "#1a0d2a",
        reaction: "🦊",
      },
      {
        id: "w4m3",
        type: "moment",
        caption: "\"Pehli baar koi mila hai mere jaisa.\" First time I've met someone like me.",
        placeholderColor: "#200a1a",
        reaction: "✨",
      },
    ],
  },
  {
    id: "w5",
    week: "Week 5",
    dateRange: "25–31 May",
    tagline: "one month in, and both of us wishing we'd met sooner.",
    memories: [
      {
        id: "w5m1",
        type: "random",
        caption: "\"1 month hogya humlog ko baat krte krte.\" Somehow already a month.",
        placeholderColor: "#0f2a1a",
        reaction: "🗓",
      },
      {
        id: "w5m2",
        type: "emotional",
        caption: "\"Tum already aache dost ho... mere liye tum ek safe space create kiye ho.\"",
        placeholderColor: "#0a2218",
        reaction: "💜",
      },
      {
        id: "w5m3",
        type: "emotional",
        caption: "\"Kaash tumse pehle mile hote.\" Said by both of us, separately, in the same breath.",
        placeholderColor: "#0d2820",
        reaction: "🌸",
      },
    ],
  },
  {
    id: "w6",
    week: "Week 6",
    dateRange: "1–7 June",
    tagline: "your first night alone, and asking an AI what foxes eat at 6 AM.",
    memories: [
      {
        id: "w6m1",
        type: "emotional",
        caption: "Your first night completely alone in Noida. You cried. You told me anyway.",
        placeholderColor: "#0f2a1e",
        reaction: "🫂",
      },
      {
        id: "w6m2",
        type: "random",
        caption: "Asked Meta AI what foxes eat, on your behalf, at 6 in the morning. Completely normal behaviour.",
        placeholderColor: "#0a2016",
        reaction: "🦊",
      },
      {
        id: "w6m3",
        type: "moment",
        caption: "\"Humko to ab lg rha ki tumse bohot kuch seekh jayenge life k baare mei.\"",
        placeholderColor: "#0d1a2e",
        reaction: "🌿",
      },
    ],
  },
  {
    id: "w7",
    week: "Week 7",
    dateRange: "8–14 June",
    tagline: "secretly building your birthday site while you walked me through your whole year.",
    memories: [
      {
        id: "w7m1",
        type: "moment",
        caption: "\"More 40 days to go.\" You had no idea what the countdown was actually for.",
        placeholderColor: "#131c44",
        reaction: "🤫",
      },
      {
        id: "w7m2",
        type: "emotional",
        caption: "Nearly two hours past midnight — your entire 2025, month by month. Spanish, tutoring, henna, journaling.",
        placeholderColor: "#1a1230",
        reaction: "📖",
      },
      {
        id: "w7m3",
        type: "moment",
        caption: "\"Koi bhi kar sakta hai.\" Anyone can do this. I believed you completely.",
        placeholderColor: "#12203a",
        reaction: "✨",
      },
    ],
  },
  {
    id: "w8",
    week: "Week 8",
    dateRange: "15–21 June",
    tagline: "your actual birthday, and eight Harry Potter films in a row.",
    memories: [
      {
        id: "w8m1",
        type: "random",
        caption: "Watched all eight Harry Potter films back to back, just because you'd mentioned it once.",
        placeholderColor: "#1a0f30",
        reaction: "🎬",
      },
      {
        id: "w8m2",
        type: "joke",
        caption: "Called you \"Nandani\" by accident mid-sentence because Hagrid's storyline short-circuited my brain.",
        placeholderColor: "#1a1040",
        reaction: "😂",
      },
      {
        id: "w8m3",
        type: "moment",
        caption: "\"Tumse acha koi nhi, twin.\" Half-joking. Not joking at all.",
        placeholderColor: "#130d30",
        reaction: "💗",
      },
    ],
  },
  {
    id: "w9",
    week: "Week 9",
    dateRange: "22–30 June",
    tagline: "the secret came out, your first voice note, and our first phone call.",
    memories: [
      {
        id: "w9m1",
        type: "moment",
        caption: "Told you about the birthday website. \"Humko first time aaisa kuch mil rha hai kisi se.\"",
        placeholderColor: "#1a0b20",
        reaction: "🎉",
      },
      {
        id: "w9m2",
        type: "emotional",
        caption: "\"Hum tumhare safe space bnne ka kosis krenge. I really love each and everything about you.\"",
        placeholderColor: "#1a0d2a",
        reaction: "💞",
      },
      {
        id: "w9m3",
        type: "voice",
        caption: "Your first ever voice note. \"Kitna msttt h tumhara aawazz.\" I kept it pinned.",
        placeholderColor: "#170c24",
        reaction: "🎙",
      },
      {
        id: "w9m4",
        type: "voice",
        caption: "Our first call barely lasted ten minutes. The second, a little later, stretched to forty. \"Mzaaa aaya tumse baat krke.\"",
        placeholderColor: "#200a1a",
        reaction: "📞",
      },
    ],
  },
  {
    id: "w10",
    week: "Week 10",
    dateRange: "1–7 July",
    tagline: "our first real disagreement, resolved like adults.",
    memories: [
      {
        id: "w10m1",
        type: "emotional",
        caption: "Talked through our first real misunderstanding properly, instead of letting it sit.",
        placeholderColor: "#0f2a1a",
        reaction: "🤝",
      },
      {
        id: "w10m2",
        type: "joke",
        caption: "Half-joking, mid-build: \"Tum gift krdo n mereko claude subscription 24k wala.\" Absolutely the wrong moment to ask.",
        placeholderColor: "#0a2218",
        reaction: "😂",
      },
      {
        id: "w10m3",
        type: "moment",
        caption: "Retold, together, the exact mysterious story of how we first followed each other.",
        placeholderColor: "#0d2820",
        reaction: "✦",
      },
    ],
  },
  {
    id: "w11",
    week: "Week 11",
    dateRange: "8–14 July",
    tagline: "the website hit 90%, and \"twin\" became the only name that fit.",
    memories: [
      {
        id: "w11m1",
        type: "moment",
        caption: "\"14 days left.\" The countdown was getting real.",
        placeholderColor: "#0f2a1e",
        reaction: "🗓",
      },
      {
        id: "w11m2",
        type: "emotional",
        caption: "A hard night after your brother scolded you. \"Justify to nhi krre unka daatna, but maybe unka din acha nhi rha hoga.\"",
        placeholderColor: "#0a2016",
        reaction: "🫂",
      },
      {
        id: "w11m3",
        type: "moment",
        caption: "\"I will always be here to listen to you.\" Still true.",
        placeholderColor: "#0d1a2e",
        reaction: "🌙",
      },
    ],
  },
  {
    id: "w12",
    week: "Week 12",
    dateRange: "15–16 July",
    tagline: "the most honest exchange of the whole chat, nine days before your birthday.",
    memories: [
      {
        id: "w12m1",
        type: "emotional",
        caption: "\"You're so good, Vaibhav... I feel like we appreciate you too little.\" You listed every reason.",
        placeholderColor: "#131c44",
        reaction: "💗",
      },
      {
        id: "w12m2",
        type: "random",
        caption: "A very serious, very silly 🌚🌝 moon debate to close out the night.",
        placeholderColor: "#1a1230",
        reaction: "🌙",
      },
      {
        id: "w12m3",
        type: "moment",
        caption: "\"Bohot Acha lga yaar tumse baat krke aaj, daily lgta, but aaj or zada.\"",
        placeholderColor: "#12203a",
        reaction: "✨",
      },
    ],
  },
];
