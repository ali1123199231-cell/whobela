import type { SeoPage } from "./types";

// §5.6 — template pages at /templates/[slug]. Each has a unique example
// invitation and customization notes so it isn't thin/duplicate content.

type TemplateDef = {
  slug: string;
  name: string;
  keyword: string;
  emoji: string;
  description: string;
  intro: string;
  whenToUse: string[];
  example: { question: string; message: string };
  customize: string[];
  faq: { q: string; a: string }[];
};

const TEMPLATE_DEFS: TemplateDef[] = [
  {
    slug: "first-date",
    name: "First Date",
    keyword: "first date invitation",
    emoji: "🌷",
    description:
      "A warm, low-pressure first date invitation template. Friendly, personal, and easy to say yes to.",
    intro:
      "The first date invitation template keeps things light and genuine — perfect for asking someone you've just started talking to. It's friendly, not heavy, and gives them an easy, no-pressure way to say yes.",
    whenToUse: ["You've recently met or matched", "You want low pressure", "You'd like to keep it casual but clearly a date"],
    example: {
      question: "Want to grab a first coffee with me?",
      message: "I've loved talking to you — I'd really like to do it in person. No pressure, just a relaxed coffee and good conversation.",
    },
    customize: ["Soft, friendly theme", "A casual photo", "Light icebreaker questions", "An easy yes / not-yet option"],
    faq: [
      { q: "Is this too forward for a first date?", a: "No — it's warm and low-pressure, which makes it easy for someone to say yes." },
      { q: "Can I keep it casual?", a: "Yes. The template is designed to feel relaxed rather than intense." },
    ],
  },
  {
    slug: "romantic-dinner",
    name: "Romantic Dinner",
    keyword: "romantic dinner date invitation",
    emoji: "🕯️",
    description:
      "An elegant romantic dinner date invitation template — candlelit, heartfelt, and dressed up.",
    intro:
      "The romantic dinner template is for the evenings that deserve a little more — candlelight, your song, and a heartfelt message. Ideal for established couples or a special date you want to make feel like an occasion.",
    whenToUse: ["You're already dating", "You want to dress up the evening", "You're celebrating something small or big"],
    example: {
      question: "Dinner, just the two of us — Saturday?",
      message: "Let's put our phones away, dress up a little, and have the kind of evening we'll talk about later. I'll handle the reservation.",
    },
    customize: ["Candlelit rose/gold theme", "Your song as background music", "A favorite photo of you two", "Dress-code note"],
    faq: [
      { q: "Is this only for couples?", a: "It shines for couples, but it also works for a big, intentional date with someone new." },
      { q: "Can I add the restaurant?", a: "Yes — include the place, time, and a dress-code note right in the invitation." },
    ],
  },
  {
    slug: "coffee-date",
    name: "Coffee Date",
    keyword: "coffee date invitation",
    emoji: "☕",
    description: "A casual, cute coffee date invitation template — easy, friendly, low-key.",
    intro:
      "The coffee date template is the easy yes. Casual and friendly, it's perfect for a first meeting or a relaxed catch-up where the point is good conversation, not pressure.",
    whenToUse: ["First date or early days", "You want something low-key", "You'd like an easy, quick plan"],
    example: {
      question: "Coffee this weekend?",
      message: "I know a great little spot — I'd love to take you there and actually talk, no rush.",
    },
    customize: ["Cozy, casual theme", "A relaxed photo", "Pick-a-time scheduling", "Optional coffee-order question"],
    faq: [
      { q: "Why a coffee date?", a: "It's low-pressure, easy to say yes to, and leaves room to extend if it's going well." },
      { q: "Can they pick the time?", a: "Yes — they can choose a time right inside the invitation." },
    ],
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    keyword: "anniversary date invitation",
    emoji: "💞",
    description: "A heartfelt anniversary date invitation template to celebrate your milestone.",
    intro:
      "The anniversary template helps you turn another year together into a moment. Recall a favorite memory, say what they mean to you, and invite them to celebrate — beautifully.",
    whenToUse: ["Celebrating a relationship milestone", "Recreating your first date", "Planning an anniversary surprise"],
    example: {
      question: "Celebrate another year with me?",
      message: "Same us, one more year of memories. Let me take you somewhere special to celebrate everything we are.",
    },
    customize: ["Warm anniversary theme", "A timeline of your photos", "Your song", "A gratitude message"],
    faq: [
      { q: "Can I recreate our first date?", a: "Yes — use the message and photos to bring back the memory and invite them to relive it." },
      { q: "Is it good for a surprise?", a: "Definitely — keep the details a mystery and reveal them on the page." },
    ],
  },
  {
    slug: "marriage-proposal",
    name: "Marriage Proposal",
    keyword: "creative marriage proposal ideas",
    emoji: "💍",
    description: "A deeply personal marriage proposal invitation template for the biggest question.",
    intro:
      "The proposal template is for the most important question you'll ask. Tell your story, share the moments that brought you here, and set the scene — a beautiful page can be a meaningful part of how you propose.",
    whenToUse: ["You're ready to propose", "You want a personal, story-driven build-up", "You're planning the moment carefully"],
    example: {
      question: "Will you spend forever with me?",
      message: "From the first day to this one, every moment led here. I want all the next ones with you.",
    },
    customize: ["Elegant, emotional theme", "Your full photo story", "Your song", "A private, heartfelt message"],
    faq: [
      { q: "Should the whole proposal be digital?", a: "It works best as part of the moment — a beautiful build-up or reveal alongside being there in person." },
      { q: "Is it private?", a: "Completely — only the person you send it to can open it." },
    ],
  },
  {
    slug: "long-distance",
    name: "Long Distance",
    keyword: "long distance date ideas",
    emoji: "✈️",
    description: "A long distance date invitation template for couples and crushes apart.",
    intro:
      "The long distance template is built for love across the miles — plan a synchronized video date, count down to a visit, or surprise them from afar. Distance doesn't have to mean disconnected.",
    whenToUse: ["You're in a long distance relationship", "You're planning a virtual date", "You're counting down to a visit"],
    example: {
      question: "Virtual date night — same movie, same time?",
      message: "I miss you. Let's press play together tonight and close the distance for a couple of hours.",
    },
    customize: ["Two-timezone scheduling", "A shared playlist or movie", "A countdown to your next visit", "A heartfelt message"],
    faq: [
      { q: "How do virtual dates work?", a: "Plan a shared activity and a synced time; the invitation handles the time across both timezones." },
      { q: "Can I count down to a visit?", a: "Yes — make the invitation about the next time you'll be together." },
    ],
  },
  {
    slug: "surprise-date",
    name: "Surprise Date",
    keyword: "surprise date ideas",
    emoji: "🎁",
    description: "A surprise date invitation template that builds anticipation before the reveal.",
    intro:
      "The surprise date template turns anticipation into part of the gift. Drop a few hints, keep the details secret, and reveal the plan on the page — all they have to do is say yes.",
    whenToUse: ["You want to plan everything yourself", "You love building anticipation", "You want to take the pressure off them"],
    example: {
      question: "Free Saturday for a surprise?",
      message: "I've planned something just for you. You don't need to do a thing except say yes — I'll take care of the rest.",
    },
    customize: ["Mystery theme with hints", "Teaser photos", "A reveal section", "Just a time to keep free"],
    faq: [
      { q: "How much should I reveal?", a: "Just enough to intrigue — a vibe, a dress code, a time. Save the rest for the day." },
      { q: "What if they don't like surprises?", a: "Give a gentle hint about the type of plan so they feel comfortable." },
    ],
  },
  {
    slug: "funny-ask-out",
    name: "Funny Ask-Out",
    keyword: "funny way to ask someone out",
    emoji: "😄",
    description: "A funny, playful way-to-ask-someone-out template for low-pressure charm.",
    intro:
      "The funny ask-out template uses humor to break the ice. If you and your crush already joke around, a playful, lighthearted invitation is a charming, low-pressure way to pop the question.",
    whenToUse: ["You two already banter", "You want low pressure", "You'd rather make them laugh than swoon"],
    example: {
      question: "On a scale of 1 to date, how free are you Friday?",
      message: "I've run the numbers and the data strongly suggests we'd have a great time. Care to test the hypothesis?",
    },
    customize: ["Playful theme", "A meme-style photo", "Joke-format questions", "A clear (real) yes option"],
    faq: [
      { q: "Will they know I'm serious?", a: "Keep one clearly genuine line so the joke lands but the ask is real." },
      { q: "When does funny work best?", a: "When you already have a playful rapport — humor should feel natural, not forced." },
    ],
  },
  {
    slug: "beach-date",
    name: "Beach Date",
    keyword: "beach date invitation",
    emoji: "🌊",
    description: "A sunny beach date invitation template for warm-weather romance.",
    intro:
      "The beach date template is made for golden hour — sand, sunset, and an easy, happy plan. Perfect for summer dates and anyone who loves being outdoors together.",
    whenToUse: ["Warm weather", "You both love the outdoors", "You want a relaxed, scenic date"],
    example: {
      question: "Sunset at the beach with me?",
      message: "Let's catch the golden hour, walk the shoreline, and watch the sky do its thing. I'll bring snacks.",
    },
    customize: ["Sunset/ocean theme", "Beach photos", "Sunset-time scheduling", "What-to-bring note"],
    faq: [
      { q: "Best time for a beach date?", a: "Late afternoon into sunset — beautiful light and cooler temperatures." },
      { q: "Can I suggest what to bring?", a: "Yes — add a friendly note about a towel, layers, or snacks." },
    ],
  },
  {
    slug: "casual-hangout",
    name: "Casual Hangout",
    keyword: "hang out invitation",
    emoji: "🙌",
    description: "A laid-back casual hangout invitation template for low-key, fun plans.",
    intro:
      "The casual hangout template keeps things relaxed and fun — great when you want time together without the formality of a 'date.' Pick an activity, suggest a time, and keep the vibe easy.",
    whenToUse: ["You want something low-key", "Activity-based time together", "Early days, no pressure"],
    example: {
      question: "Want to hang out this week?",
      message: "Thinking something chill — a walk, a game, whatever sounds good. I just want to spend some time with you.",
    },
    customize: ["Relaxed theme", "A fun photo", "Activity options to pick from", "Flexible scheduling"],
    faq: [
      { q: "Is a hangout the same as a date?", a: "It's lower-pressure. If you mean it romantically, add a line that makes that clear." },
      { q: "Can they choose the activity?", a: "Yes — offer a few options and let them pick." },
    ],
  },
];

function buildTemplatePage(def: TemplateDef): SeoPage {
  return {
    path: `/templates/${def.slug}`,
    slug: def.slug,
    primaryKeyword: def.keyword,
    eyebrow: `${def.emoji} Template`,
    title: `${def.name} Date Invitation Template | Whobela`,
    description: def.description,
    h1: `${def.name} Date Invitation Template`,
    intro: def.intro,
    sections: [
      { heading: `When to use the ${def.name.toLowerCase()} template`, bullets: def.whenToUse },
      {
        heading: "Example invitation",
        body: [
          `The question: “${def.example.question}”`,
          `The message: “${def.example.message}”`,
          "Swap in your own words, photos, and plan — this is just a starting point.",
        ],
      },
      { heading: "What you can customize", bullets: def.customize },
      {
        heading: "How to use this template",
        steps: [
          { name: "Open the template", text: "Start from this design with one click." },
          { name: "Personalize it", text: "Add your message, photos, music, and the plan." },
          { name: "Share your link", text: "Send the private link by text, DM, or QR code." },
          { name: "Get their answer", text: "See their response and schedule the date." },
        ],
      },
    ],
    faq: def.faq,
    cta: {
      heading: `Use the ${def.name.toLowerCase()} template`,
      sub: "Personalize it in minutes and share one private link.",
    },
    related: [
      { href: "/templates", label: "Browse all templates" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
    ],
    extraSchema: ["howto"],
    howToName: `How to use the ${def.name} invitation template`,
    howToSteps: [
      { name: "Open the template", text: "Start from this design." },
      { name: "Personalize it", text: "Add your message, photos, and plan." },
      { name: "Share your link", text: "Send the private link." },
      { name: "Get their answer", text: "See their response and schedule." },
    ],
  };
}

export const TEMPLATE_PAGES: Record<string, SeoPage> = Object.fromEntries(
  TEMPLATE_DEFS.map((def) => [def.slug, buildTemplatePage(def)]),
);

export const TEMPLATE_LIST = TEMPLATE_DEFS.map((d) => ({
  slug: d.slug,
  name: d.name,
  emoji: d.emoji,
  description: d.description,
}));

export const TEMPLATE_SLUGS = TEMPLATE_DEFS.map((d) => d.slug);
