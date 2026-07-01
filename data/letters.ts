export type Letter = {
  id: string;
  condition: string;       // "Open when you're sad"
  shortLabel: string;      // shown on envelope
  sealColor: string;       // wax seal colour
  accentColor: string;     // envelope flap accent
  content: string[];       // paragraphs of the letter
  closing: string;         // sign-off line
};

export const LETTERS: Letter[] = [
  {
    id: "l1",
    condition: "Open when you're sad",
    shortLabel: "you're sad",
    sealColor: "#9f7aea",
    accentColor: "#131c44",
    content: [
      "I know. I know it feels heavy right now. Like something sitting on your chest that won't move no matter how many times you breathe deeply.",
      "I'm not going to tell you it gets better immediately, because sometimes it doesn't — not immediately. But I will tell you this: you've carried hard things before. You always come out the other side still being you. Still kind. Still warm. Still you.",
      "You don't have to perform okay-ness for anyone. Not even for me. But if you need someone who already knows and doesn't need you to explain — I'm here. I'm always going to be here.",
      "Cry if you need to. Eat something. Drink water. And when you're ready, come back. We'll talk about nothing until it feels like something again.",
    ],
    closing: "— your twin, who isn't going anywhere 🦊",
  },
  {
    id: "l2",
    condition: "Open when you're overthinking",
    shortLabel: "you're overthinking",
    sealColor: "#3aa9ff",
    accentColor: "#0b1230",
    content: [
      "Stop. Breathe. You're doing it again.",
      "I know exactly what's happening in your head right now — you're replaying something, picking it apart, finding all the ways it could go wrong or ways you could have said it differently. You're three conversations ahead of the one that's actually happening.",
      "Here's what I know about you: 90% of the things you've worried about have never happened. And the 10% that did — you handled them. Imperfectly, messily, beautifully — you handled them.",
      "The thought spiral isn't protecting you. It's just noise. Come back to right now. Right now is actually fine.",
    ],
    closing: "— the one person who out-talks your brain 🦊",
  },
  {
    id: "l3",
    condition: "Open when you miss me",
    shortLabel: "you miss me",
    sealColor: "#c9886b",
    accentColor: "#1a0f08",
    content: [
      "Oh, so you finally admit it.",
      "I'm kidding. Kind of. But also — I miss you too. Even when we just talked. There's a specific kind of missing that doesn't go away even when the person is close. That's the kind I feel.",
      "You know what I think about sometimes? The very specific way you say certain things. The timing of when you send a voice note. The fact that you always have an opinion even when you claim not to.",
      "Text me. Call me. Send a random meme that has nothing to do with anything. That's all I need. That's all this needs.",
    ],
    closing: "— missing you from approximately everywhere 🦊",
  },
  {
    id: "l4",
    condition: "Open when you're stressed",
    shortLabel: "you're stressed",
    sealColor: "#4a6b5a",
    accentColor: "#0d1a15",
    content: [
      "List it. Whatever it is — all of it. In your head or on paper, just list everything that's piling up.",
      "Now look at it. How many of those things are happening right now, in this exact moment? Probably very few. Stress is mostly future pain being felt in the present, and your brain is very good at making it feel urgent when it isn't.",
      "You are capable of handling more than you think. I've watched you do it. But you can't do it all at once, and you don't have to.",
      "One thing. Pick one thing. Do that. Then come back and tell me about it so I can tell you I told you so with love.",
    ],
    closing: "— your very calm, very unsolicited coach 🦊",
  },
  {
    id: "l5",
    condition: "Open when you need motivation",
    shortLabel: "you need motivation",
    sealColor: "#f59e0b",
    accentColor: "#1a1200",
    content: [
      "You already know what you have to do. That's the thing about motivation — it isn't what starts things, it's what you feel after you start. So start.",
      "But here's what I want you to actually hear: you are not behind. You are not failing. You are someone who is trying, in real time, against real odds, with real pressure. That counts. That counts enormously.",
      "I believe in you so specifically — not in a vague cheerleader way, but in a 'I've seen what you're capable of and I know exactly how far you can go' way.",
      "NEET. Med school. Whatever comes next. You are going to get there. Not because it's easy — because you are the kind of person who does hard things.",
    ],
    closing: "— the person betting everything on you 🦊",
  },
  {
    id: "l6",
    condition: "Open when exams feel impossible",
    shortLabel: "exams feel impossible",
    sealColor: "#ef4444",
    accentColor: "#1a0505",
    content: [
      "First: close one tab. Just one. You don't need twelve things open.",
      "Second: you have already studied more than you think. The knowledge is there. The panic is just louder than the knowledge right now.",
      "The exam is not the definition of you. It is a measure of a moment in time, taken under imperfect conditions, with an imperfect nervous system, by an imperfect human who is doing their absolute best. The result doesn't capture who you are.",
      "But here's the truth I also need you to hear: you've prepared. You've shown up. You've done the hard part repeatedly. Now it's just performance. You've rehearsed this. You know this.",
      "Go drink water. Splash your face. Come back to the page. One question at a time.",
    ],
    closing: "— your biggest fan who also wants you to sleep 🦊",
  },
  {
    id: "l7",
    condition: "Open when you can't sleep",
    shortLabel: "you can't sleep",
    sealColor: "#6366f1",
    accentColor: "#0a0b1a",
    content: [
      "You're awake again. It's that specific kind of awake — not alert, not energised, just unable to turn off.",
      "Don't fight it. Lie there. Let your body rest even if your brain won't. The rest still counts. The stillness still counts.",
      "If your mind is running — let it run somewhere gentle. Think about a conversation that made you laugh. Think about something you're looking forward to. Think about absolutely nothing and notice how hard that is.",
      "And if none of that works — text me. I'm probably awake too. We can talk about nothing until one of us drifts off. That's what 2 AM is for.",
    ],
    closing: "— also awake, probably 🦊",
  },
  {
    id: "l8",
    condition: "Open when you're happy",
    shortLabel: "you're happy",
    sealColor: "#10b981",
    accentColor: "#001a0d",
    content: [
      "YES. This is the one I've been waiting for you to open.",
      "Tell me everything. What happened? What does it feel like? Did you smile in a way that surprised you? Did something small turn into something that felt enormous?",
      "Hold onto this. Not desperately — just hold it like something warm in your hands. Let yourself actually feel it all the way through. You don't have to rush to the next thing.",
      "You deserve this. The happy ones. The light ones. The days that feel like exhaling after a very long hold.",
      "I love this version of you — not more than the struggling version, but I love seeing you in your full light. Stay there as long as you can.",
    ],
    closing: "— genuinely so happy you're happy 🦊",
  },
  {
    id: "l9",
    condition: "Open when you want to smile",
    shortLabel: "you want to smile",
    sealColor: "#f97316",
    accentColor: "#1a0800",
    content: [
      "Okay. Here. A very specific and completely true list of things about you that make me smile:",
      "The way you say something like you're not sure about it and then turn out to be completely right. The way you get genuinely excited about things and don't try to hide it. The fact that you care — deeply, actually, noticeably — even when you pretend not to. Your timing on a well-placed response. The voice notes.",
      "You are genuinely one of the funniest and warmest people I know. I don't say that because I have to. I say it because I keep being surprised by it, even after all this time.",
      "Smiling yet? Because I am, just writing this.",
    ],
    closing: "— the one who thinks you're hilarious 🦊",
  },
  {
    id: "l10",
    condition: "Open when life feels unfair",
    shortLabel: "life feels unfair",
    sealColor: "#64748b",
    accentColor: "#0d1117",
    content: [
      "It is. Sometimes it just is, and there's no reframe that makes that untrue.",
      "You don't always need a lesson. You don't always need to find the silver lining. Sometimes things are just hard and unfair and that's allowed to be the whole truth of it for a while.",
      "But here's what I also know: unfair doesn't mean permanent. It doesn't mean you're stuck. It doesn't mean this is what things will always look like.",
      "You're allowed to be angry. You're allowed to be tired. You're allowed to say 'this isn't okay' without immediately following it with 'but I'll be fine.' You will be fine. But that's not the point right now.",
      "The point right now is that I see you, and I think you're handling something really hard with more grace than you're giving yourself credit for.",
    ],
    closing: "— on your side, always 🦊",
  },
  {
    id: "l11",
    condition: "Open on your birthday next year",
    shortLabel: "birthday next year",
    sealColor: "#ec4899",
    accentColor: "#1a0010",
    content: [
      "Hello from the past. Or — the past relative to you right now. It's strange to write something for a future I can't see.",
      "I don't know what this year brought you. I don't know what changed, what stayed, what you had to let go of or what surprised you. But I know you made it here. That already tells me something.",
      "I hope this year was kinder to you than the last. I hope NEET went the way you worked for. I hope you laughed often. I hope there were late nights that were worth losing sleep over.",
      "Most of all — I hope you felt, at least once, how rare you are. How genuinely one-of-a-kind. How the world is a little more interesting and a little warmer because you're in it.",
      "Happy birthday, twin. Again. Always. I'll keep showing up for it.",
    ],
    closing: "— the one who will still be here next year, and the one after 🦊",
  },
];
