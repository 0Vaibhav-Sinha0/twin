export type JournalEntry = {
  id: string;
  date: string;
  title: string;
  preview: string;      // 1-2 lines shown on card
  mood: string;         // emoji mood indicator
  moodColor: string;    // accent colour for this entry
  content: string[];    // full paragraphs
};

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "j1",
    date: "June 28",
    title: "The thing about you is",
    preview: "I was trying to explain you to someone today. I couldn't.",
    mood: "🌙",
    moodColor: "#9f7aea",
    content: [
      "I was trying to explain you to someone today. I couldn't. Not because there's nothing to say — because there's too much, and none of it translates.",
      "How do you explain the specific way someone makes you feel understood without them trying to? How do you explain that some people just get it — get you — without requiring the long version of every story?",
      "That's you. You're the short version. I don't have to build up to things with you.",
      "I don't know if you know that. You probably don't. You're not great at seeing yourself clearly. But I see you clearly enough for both of us, and what I see is someone who is quietly extraordinary and very loud about pretending otherwise.",
    ],
  },
  {
    id: "j2",
    date: "June 30",
    title: "You were stressed today",
    preview: "I could tell even through a screen. That's the thing about knowing someone.",
    mood: "🫂",
    moodColor: "#3aa9ff",
    content: [
      "I could tell even through a screen. That's the thing about knowing someone — you learn their texture. The way their sentences get shorter. The timing of replies. The jokes that are slightly too sharp.",
      "I didn't say anything directly. You weren't ready for it. So I just stayed close — kept the conversation light, kept it warm, kept it going.",
      "I hope that helped. I think it did. I hope you felt it without me having to name it.",
      "You carry so much quietly. I wish you'd let some of it go. But since you won't — I'll just stay nearby and make it a little lighter without making a thing of it.",
      "That's what this is for. That's what I'm here for.",
    ],
  },
  {
    id: "j3",
    date: "July 2",
    title: "What I'd say if I wasn't afraid of being sentimental",
    preview: "You matter. Not in a general, everyone-matters way. In a specific, irreplaceable way.",
    mood: "✦",
    moodColor: "#c9886b",
    content: [
      "You matter. Not in a general, everyone-matters way. In a specific, irreplaceable way — the way that means if you disappeared from my life, there would be a very particular shape of absence that nothing else would fill.",
      "I think about the version of my life where we never talked, where that first message never happened, and it's genuinely a worse version. Less funny. Less honest. Less warm.",
      "You've made me a slightly better person without trying to. That's the most anyone can do.",
      "I'm not afraid of being sentimental. I just know you'll roll your eyes. So consider this my pre-emptive defence: I mean all of it, and your eye-rolling cannot stop me.",
    ],
  },
  {
    id: "j4",
    date: "July 5",
    title: "On NEET and watching you work",
    preview: "There's something quietly moving about watching someone choose to keep going.",
    mood: "📚",
    moodColor: "#4a6b5a",
    content: [
      "There's something quietly moving about watching someone choose to keep going.",
      "Not dramatically. Not with speeches. Just — showing up again. Opening the book again. Sitting with the hard thing again. Day after day, with the full knowledge that it's difficult and the full intention to do it anyway.",
      "That's what I see when I watch you study. I don't say it often because you'd deflect it. But I'm writing it here so it exists somewhere: I am genuinely, specifically proud of you.",
      "Not for the result — we don't have that yet. For the doing. For the choosing. For the fact that on the days it feels impossible, you still show up.",
      "That's not small. That's everything.",
    ],
  },
  {
    id: "j5",
    date: "July 8",
    title: "2 AM things",
    preview: "There's a version of us that only exists after midnight. I like that version too.",
    mood: "🌙",
    moodColor: "#3aa9ff",
    content: [
      "There's a version of us that only exists after midnight.",
      "Looser. Less guarded. The conversations that would never happen at 3 PM — the real ones, the weird ones, the ones that wander into territory neither of us planned.",
      "I like that version too. I like all the versions, honestly. The practical daytime one, the stressed one, the funny one, the one that sends voice notes about nothing. But the 2 AM one has something the others don't.",
      "It has the part of you that drops the performance. And I think that's the truest part.",
      "I'll keep showing up for it. However late. Always.",
    ],
  },
  {
    id: "j6",
    date: "July 12",
    title: "Things I notice about you",
    preview: "You apologise too much for taking up space. Stop it.",
    mood: "🦊",
    moodColor: "#f59e0b",
    content: [
      "You apologise too much for taking up space. Stop it.",
      "You always check if it's a good time before asking something. It's always a good time.",
      "You remember things I say offhand. Small things. Weeks later. I notice.",
      "You're funnier than you think you are. Consistently, genuinely funny — not trying-to-be-funny funny. Actually funny.",
      "You care about people in ways they don't always see. I see it.",
      "You get excited about things and then immediately try to tone it down like excitement is embarrassing. It's not. Please keep being excited.",
      "You're braver than you give yourself credit for. Every single day.",
    ],
  },
  {
    id: "j7",
    date: "July 19",
    title: "One week before your birthday",
    preview: "I've been thinking about what to say. There's too much. There's never enough.",
    mood: "🎂",
    moodColor: "#ec4899",
    content: [
      "I've been thinking about what to say. There's too much. There's never enough.",
      "A year is a long time. A lot happened. Some of it was hard — genuinely hard, the kind that changes you. Some of it was light. Some of it was us, which is its own category.",
      "I want you to know that I paid attention. To all of it. The updates and the silences, the good days and the ones where you sent three words and I knew not to push.",
      "I want you to go into this birthday knowing that someone was watching you move through this year and thinking — she's doing something remarkable. Even on the days she didn't feel like it.",
      "One more week. And then you're a year older and I'm going to make a thing of it whether you like it or not.",
    ],
  },
  {
    id: "j8",
    date: "July 26",
    title: "Happy birthday, twin",
    preview: "Today is for you. All of it. Every pixel of this, every word — it's yours.",
    mood: "🌸",
    moodColor: "#c9886b",
    content: [
      "Today is for you. All of it. Every pixel of this, every word — it's yours.",
      "I built this because there's no card that says what I actually want to say. There's no gift that holds the weight of what this friendship is. So I made something instead. Something that could hold more.",
      "I hope when you go through this — the letters, the memories, the garden, all of it — you feel what I meant for you to feel. Which is: you are deeply, specifically, irreplaceably loved.",
      "Not in a grand romantic way. In the way that matters most — the daily, consistent, showing-up way. The I-see-you way. The I'm-not-going-anywhere way.",
      "Happy birthday, Nandani. Happy birthday, lomri. Happy birthday, twin.",
      "Here's to every year after this one. I'll be here for all of them.",
    ],
  },
];
