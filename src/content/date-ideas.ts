import type { SeoPage } from "./types";

// §6.1 — programmatic /date-ideas/[activity]. Shipped noindex,follow by default
// (the quality gate): promote to index only the URLs that earn impressions.
// Each entry carries enough unique fields to clear the "non-templated content" bar.

type DateIdeaDef = {
  slug: string;
  name: string; // e.g. "Coffee Date"
  keyword: string;
  emoji: string;
  cost: "Free" | "Budget" | "Moderate" | "Splurge";
  duration: string;
  vibe: string;
  bestFor: string;
  why: string;
  ideas: string[];
  starters: string[];
  inviteLine: string;
};

const DATE_IDEAS: DateIdeaDef[] = [
  { slug: "coffee-date", name: "Coffee Date", keyword: "coffee date ideas", emoji: "☕", cost: "Budget", duration: "1–2 hours", vibe: "Casual, conversation-first", bestFor: "First dates", why: "Low cost, low pressure, and easy to extend if it's going well — the classic easy yes.", ideas: ["Try a café neither of you has been to", "Coffee plus a walk afterward", "Coffee plus a bookstore browse", "A different coffee spot each date"], starters: ["What's your go-to order?", "What are you into lately?", "Best hidden spot in town?"], inviteLine: "Coffee this weekend?" },
  { slug: "dinner-date", name: "Dinner Date", keyword: "dinner date ideas", emoji: "🍝", cost: "Moderate", duration: "2–3 hours", vibe: "Romantic, intentional", bestFor: "Couples and special dates", why: "Dinner gives you uninterrupted time and a sense of occasion — perfect for making someone feel special.", ideas: ["Their favorite cuisine, done well", "A new restaurant you both pick", "Dress-up dinner at home", "A tasting menu to share"], starters: ["What's a meal that means something to you?", "Adventurous or comfort food tonight?", "Best dish you've ever had?"], inviteLine: "Dinner, just us, Saturday?" },
  { slug: "movie-night", name: "Movie Night", keyword: "movie night date ideas", emoji: "🎬", cost: "Budget", duration: "2–3 hours", vibe: "Cozy, relaxed", bestFor: "Cozy nights and long distance", why: "Easy, comfortable, and great for both at-home and synced long-distance dates.", ideas: ["Pick each other's favorite films", "A themed double feature", "Build a blanket fort", "Sync a stream for a long-distance date"], starters: ["Comfort movie you rewatch?", "Scary or feel-good tonight?", "Favorite movie snack?"], inviteLine: "Movie night — your pick or mine?" },
  { slug: "picnic", name: "Picnic", keyword: "picnic date ideas", emoji: "🧺", cost: "Budget", duration: "2–3 hours", vibe: "Relaxed, romantic, outdoors", bestFor: "Warm weather", why: "A picnic is romantic, budget-friendly, and easy to personalize with their favorite snacks.", ideas: ["Sunset picnic in the park", "Picnic plus a bottle of something nice", "A themed snack spread they love", "Picnic plus stargazing after"], starters: ["Sweet or savory snacks?", "Favorite spot in nature?", "Beach, park, or rooftop?"], inviteLine: "Picnic at golden hour?" },
  { slug: "hiking", name: "Hiking Date", keyword: "hiking date ideas", emoji: "🥾", cost: "Free", duration: "Half day", vibe: "Active, adventurous", bestFor: "Outdoorsy couples", why: "Side-by-side and active, a hike makes conversation flow and rewards you with a view.", ideas: ["A scenic trail with a great view", "Sunrise hike plus breakfast after", "A waterfall trail", "An easy nature walk for a first date"], starters: ["Mountains or coast?", "Most beautiful place you've been?", "Early bird or sleep in?"], inviteLine: "Trail and a view this Saturday?" },
  { slug: "beach-date", name: "Beach Date", keyword: "beach date ideas", emoji: "🌊", cost: "Free", duration: "2–4 hours", vibe: "Sunny, easy, romantic", bestFor: "Summer dates", why: "Sand, sunset, and a relaxed pace make the beach an easy, happy date.", ideas: ["Sunset walk along the shore", "Beach picnic", "Swim then snacks", "Tide-pool exploring"], starters: ["Sunrise or sunset person?", "Swim or stay on the sand?", "Favorite beach memory?"], inviteLine: "Sunset at the beach with me?" },
  { slug: "wine-tasting", name: "Wine Tasting", keyword: "wine tasting date", emoji: "🍷", cost: "Moderate", duration: "2–3 hours", vibe: "Sophisticated, fun", bestFor: "A grown-up date", why: "Tasting gives you a built-in activity and plenty to talk about — relaxed but a little special.", ideas: ["A local winery or tasting room", "A home tasting with a few bottles", "Wine plus a cheese board", "A blind tasting game"], starters: ["Red, white, or surprise me?", "Sweet or dry?", "Most memorable bottle?"], inviteLine: "Wine tasting this weekend?" },
  { slug: "movie-in-the-park", name: "Movie in the Park", keyword: "outdoor movie date", emoji: "🌙", cost: "Budget", duration: "2–3 hours", vibe: "Cute, casual, outdoors", bestFor: "Warm evenings", why: "An outdoor screening pairs a relaxed activity with a romantic, under-the-stars setting.", ideas: ["A community outdoor screening", "Bring blankets and snacks", "Arrive early for a picnic", "Stay after to stargaze"], starters: ["Classic or new release?", "Favorite film score?", "Snacks: sweet or salty?"], inviteLine: "Movie under the stars Friday?" },
  { slug: "cooking-class", name: "Cooking Class", keyword: "cooking class date", emoji: "👩‍🍳", cost: "Moderate", duration: "2–3 hours", vibe: "Hands-on, playful", bestFor: "Trying something new", why: "Cooking together is interactive and fun, with a delicious payoff — great for breaking the ice.", ideas: ["A pasta-making class", "A sushi workshop", "A cook-along at home", "A dessert class"], starters: ["Cook or order in, usually?", "Signature dish?", "Sweet or savory?"], inviteLine: "Cook something together this week?" },
  { slug: "weekend-getaway", name: "Weekend Getaway", keyword: "weekend getaway date ideas", emoji: "🧳", cost: "Splurge", duration: "Weekend", vibe: "Romantic, immersive", bestFor: "Couples", why: "A change of scenery and uninterrupted time together make a getaway feel like a reset for your relationship.", ideas: ["A cozy cabin", "A nearby town you've never explored", "A beach bed & breakfast", "A spontaneous road trip"], starters: ["Mountains or sea?", "Plan it or wing it?", "Dream weekend trip?"], inviteLine: "Steal away for the weekend with me?" },
  { slug: "game-night", name: "Game Night", keyword: "game night date ideas", emoji: "🎲", cost: "Free", duration: "2–3 hours", vibe: "Playful, low-key", bestFor: "Cozy, fun nights", why: "A little friendly competition makes for an easy, laughter-filled date at home.", ideas: ["Board games and snacks", "A two-player card game", "Video games co-op", "A trivia night out"], starters: ["Competitive or chill?", "Favorite childhood game?", "Loser cooks?"], inviteLine: "Game night — winner picks dessert?" },
  { slug: "stargazing", name: "Stargazing", keyword: "stargazing date ideas", emoji: "✨", cost: "Free", duration: "1–2 hours", vibe: "Quiet, romantic", bestFor: "A dreamy night", why: "Quiet, free, and intimate — stargazing invites real conversation under a big sky.", ideas: ["Drive somewhere dark and clear", "Bring blankets and warm drinks", "Use a stars app together", "Pair with a late picnic"], starters: ["Believe in any of the zodiac stuff?", "Ever seen a shooting star?", "City lights or country dark?"], inviteLine: "Chase some stars with me?" },
];

function buildDateIdeaPage(def: DateIdeaDef): SeoPage {
  return {
    path: `/date-ideas/${def.slug}`,
    slug: def.slug,
    primaryKeyword: def.keyword,
    eyebrow: `${def.emoji} Date idea`,
    title: `${def.name} Ideas — Plan It & Ask | Whobela`,
    description: `${def.name} ideas plus a cute way to ask. ${def.vibe}. Best for ${def.bestFor.toLowerCase()}.`,
    h1: `${def.name} Ideas (and How to Ask)`,
    intro: `${def.why} Below are specific ${def.name.toLowerCase()} ideas, conversation starters, and an easy way to ask — turn any of these into a personalized invitation in minutes.`,
    sections: [
      {
        heading: "At a glance",
        bullets: [
          `Cost: ${def.cost}`,
          `Time: ${def.duration}`,
          `Vibe: ${def.vibe}`,
          `Best for: ${def.bestFor}`,
        ],
      },
      { heading: `${def.name} ideas`, bullets: def.ideas },
      { heading: "Conversation starters", bullets: def.starters },
      {
        heading: "How to ask",
        body: [
          `Keep it specific and warm: “${def.inviteLine}”`,
          "Better yet, turn it into a personalized invitation — add a photo, the plan, and let them pick the time on the page.",
        ],
      },
    ],
    faq: [
      { q: `Is a ${def.name.toLowerCase()} a good date?`, a: `Yes — it's ${def.vibe.toLowerCase()} and great for ${def.bestFor.toLowerCase()}.` },
      { q: "How do I ask them?", a: `Be specific and warm, or send a personalized invitation: “${def.inviteLine}”` },
    ],
    cta: { heading: `Plan your ${def.name.toLowerCase()}`, sub: "Turn this idea into a personalized invitation." },
    related: [
      { href: "/date-ideas", label: "Browse all date ideas" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
    ],
    // Quality gate: noindex until it earns impressions (see §6).
    noindex: true,
  };
}

export const DATE_IDEA_PAGES: Record<string, SeoPage> = Object.fromEntries(
  DATE_IDEAS.map((d) => [d.slug, buildDateIdeaPage(d)]),
);

export const DATE_IDEA_LIST = DATE_IDEAS.map((d) => ({
  slug: d.slug,
  name: d.name,
  emoji: d.emoji,
  vibe: d.vibe,
}));

export const DATE_IDEA_SLUGS = DATE_IDEAS.map((d) => d.slug);
