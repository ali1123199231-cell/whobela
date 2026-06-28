import type { SeoPage } from "./types";

// §4/§5 — the canonical transactional pages. One per intent cluster to avoid
// cannibalization. Keyed by slug; routed by thin static page.tsx files.

export const MONEY_PAGES: Record<string, SeoPage> = {
  "create-date-invitation": {
    path: "/create-date-invitation",
    slug: "create-date-invitation",
    primaryKeyword: "create a date invitation",
    eyebrow: "Date invitation maker",
    title: "Create a Date Invitation Online — Free & Personalized | Whobela",
    description:
      "Create a personalized date invitation in minutes. Add photos, music, and custom questions, share a private link, and get an instant answer.",
    h1: "Create a Personalized Date Invitation",
    intro:
      "To create a date invitation with Whobela, pick a template, add your photos, message, and a few custom questions, then share one private link. The other person opens it, responds, and picks a time — no app to download, no awkward text. It takes about three minutes.",
    sections: [
      {
        heading: "Why an invitation beats a text",
        body: [
          "A text is easy to ignore and easy to forget. A personalized invitation page says something a text never can: I thought about this, and I thought about you.",
          "It also does the hard part for you. Instead of stumbling over the words in person, you let a beautiful page ask the question — and give them space to say yes.",
        ],
      },
      {
        heading: "How it works",
        steps: [
          { name: "Pick a template", text: "Start from a romantic, funny, or casual design — or a blank page." },
          { name: "Make it personal", text: "Add photos, your favorite song, a heartfelt message, and custom questions." },
          { name: "Get your private link", text: "Whobela gives you one unique link to share by text, DM, or QR code." },
          { name: "Send it", text: "They open the page on any device — it looks perfect on their phone." },
          { name: "See their answer", text: "When they respond, you see it instantly, plus their preferences." },
          { name: "Schedule the date", text: "Lock in a time right inside the invitation." },
        ],
      },
      {
        heading: "What you can customize",
        bullets: [
          "Themes and color palettes",
          "Background photos and a photo gallery",
          "Music or an audio message",
          "Custom questions about their preferences",
          "Your personal message and the exact question you ask",
          "What happens when they say yes (celebration, scheduling, confirmation)",
        ],
      },
      {
        heading: "A digital, interactive love invitation",
        body: [
          "Whobela invitations are interactive: the person you're asking responds right on the page, shares what they'd love to do, and helps pick a time. It's a two-way moment, not a one-way message.",
          "Everything is private. Only the person with your link can see it, and their answers are only visible to you.",
        ],
      },
    ],
    faq: [
      { q: "Is it free to create a date invitation?", a: "Yes — you can create and share your first invitation for free. Premium themes and features are available if you want more." },
      { q: "How long does it take?", a: "About three minutes from a blank page to a shareable link." },
      { q: "Can I change it after sending?", a: "Yes. You can edit your invitation any time; the same link stays live." },
      { q: "Is my invitation private?", a: "Completely. Only the person you send the link to can open it, and their responses are visible only to you." },
      { q: "Do they need an account?", a: "No. They just open your link and respond — no signup, no app." },
      { q: "Is this a dating app?", a: "No. Whobela is for asking someone you already know on a date in a memorable way, not for matching with strangers." },
    ],
    cta: {
      heading: "Ready to ask them out?",
      sub: "Build your invitation in about three minutes and share one private link.",
    },
    related: [
      { href: "/templates", label: "Browse date invitation templates" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
      { href: "/for/crush", label: "How to ask your crush out" },
    ],
    extraSchema: ["product", "howto"],
    howToName: "How to create a date invitation",
    howToSteps: [
      { name: "Pick a template", text: "Choose a romantic, funny, or casual design." },
      { name: "Make it personal", text: "Add photos, music, a message, and custom questions." },
      { name: "Get your link", text: "Whobela generates one private shareable link." },
      { name: "Send it", text: "Share by text, DM, or QR code." },
      { name: "See their answer and schedule", text: "View their response and lock in a time." },
    ],
  },

  "ask-someone-out-online": {
    path: "/ask-someone-out-online",
    slug: "ask-someone-out-online",
    primaryKeyword: "ask someone out online",
    eyebrow: "How-to guide",
    title: "How to Ask Someone Out Online (That Actually Works) | Whobela",
    description:
      "Creative, confident ways to ask someone out online — from the perfect message to a personalized invitation. Tips, scripts, and real examples.",
    h1: "How to Ask Someone Out Online",
    intro:
      "The best way to ask someone out online is to be genuine, specific, and a little bold: say you've enjoyed talking to them, name a real plan, and give them an easy way to say yes. A personalized invitation page does this better than a plain text — it shows effort and gives them space to respond.",
    sections: [
      {
        heading: "Why asking online works",
        bullets: [
          "Less pressure — they can take a moment instead of answering on the spot",
          "More thoughtful — it shows you made an effort",
          "More memorable — it stands out from everyday messages",
          "Less awkward — no nervous silence to sit through",
        ],
      },
      {
        heading: "5 ways to ask someone out online",
        steps: [
          { name: "Send a personalized invitation", text: "The most memorable option — a page made for them with your message and a real plan. This is what Whobela does." },
          { name: "Write a clever message", text: "Light, warm, with a specific plan: \"Coffee at that place you mentioned — Saturday?\"" },
          { name: "Be direct", text: "Confidence is attractive. \"I'd love to take you out this week. Are you free Thursday?\"" },
          { name: "Turn it into a playful challenge", text: "If you have banter, make it a game with a yes hidden at the end." },
          { name: "Ask about them first", text: "Reference something they love, then suggest doing it together." },
        ],
      },
      {
        heading: "What not to do",
        bullets: [
          "Don't be vague (\"we should hang out sometime\")",
          "Don't copy-paste a generic line",
          "Don't ask five times if they're quiet",
          "Don't ask at a bad moment (late night, mid-crisis)",
        ],
      },
      {
        heading: "If they say yes, maybe, or no",
        body: [
          "Yes: lock in the details right away and show you're excited. A Whobela invitation lets them pick a time on the spot.",
          "Maybe: give them room — \"No rush, let me know.\" Follow up once, a week later.",
          "No: be gracious. \"I appreciate the honesty — no hard feelings.\" You tried, and that's a win.",
        ],
      },
    ],
    faq: [
      { q: "Is asking someone out online less romantic?", a: "Not at all. A thoughtful, personalized invitation can be more romantic than asking in person, because it shows effort and care." },
      { q: "What should I say?", a: "Keep it short and specific: a genuine compliment, a real plan, and an easy yes. Two or three sentences is plenty." },
      { q: "Text or a call?", a: "If you know them well, a call is lovely. If you mostly talk online, a written invitation is clearer and less pressured." },
      { q: "How do I make it stand out?", a: "Use a personalized invitation page instead of a plain message — add a photo, your song, and the exact plan." },
    ],
    cta: {
      heading: "Make the ask unforgettable",
      sub: "Turn your message into a personalized invitation they'll want to screenshot.",
    },
    related: [
      { href: "/create-date-invitation", label: "Create a date invitation" },
      { href: "/cute-ways-to-ask-someone-out", label: "Cute ways to ask someone out" },
      { href: "/for/crush", label: "How to ask your crush out" },
      { href: "/blog/asking-someone-out/how-to-ask-someone-out", label: "How to ask someone out without being awkward" },
    ],
  },

  "romantic-invitation-maker": {
    path: "/romantic-invitation-maker",
    slug: "romantic-invitation-maker",
    primaryKeyword: "romantic invitation maker",
    eyebrow: "Romantic invitation maker",
    title: "Romantic Invitation Maker — Date & Love Invites | Whobela",
    description:
      "Design beautiful romantic invitations for dates, anniversaries, and proposals. Personalized, customizable, and instantly shareable.",
    h1: "Create Romantic Invitations That Express Your Heart",
    intro:
      "Whobela's romantic invitation maker lets you design a beautiful, personal page for any romantic moment — a first date, an anniversary, even a proposal. Add your photos, your song, and your words, then share one private link. It's the kind of gesture a text could never be.",
    sections: [
      {
        heading: "What makes an invitation romantic",
        bullets: [
          "Personalization — it's clearly about them",
          "Thoughtfulness — you put real effort in",
          "Emotion — it makes them feel something",
          "Sincerity — heartfelt, never cheesy",
        ],
      },
      {
        heading: "Built-in romantic touches",
        bullets: [
          "Elegant themes in rose, blush, navy, and gold",
          "Your favorite song or a recorded message",
          "Photos of the two of you",
          "Handwritten-style fonts and gentle animation",
          "A personal message and the exact words you want to say",
        ],
      },
      {
        heading: "Romantic invitations for every moment",
        bullets: [
          "First date invitations",
          "Anniversary celebrations",
          "Marriage proposals",
          "\"Will you be my...\" questions",
          "Romantic getaways and surprise dates",
        ],
      },
      {
        heading: "Beautiful on their phone, private by design",
        body: [
          "Every invitation is built mobile-first, so it looks perfect the moment they open your link.",
          "And it stays between the two of you — only the person with the link can see it, and their response is private to you.",
        ],
      },
    ],
    faq: [
      { q: "Can I add music?", a: "Yes — add your song or a recorded message so the moment has a soundtrack." },
      { q: "Can I use my own photos?", a: "Absolutely. Upload your favorite photos to make it personal." },
      { q: "Can I see if they opened it?", a: "Yes — you'll know when they've viewed and responded to your invitation." },
      { q: "Is it good for a proposal?", a: "It can be a beautiful part of one. Use the proposal template and make it deeply personal." },
    ],
    cta: {
      heading: "Say it beautifully",
      sub: "Design a romantic invitation that feels like the moment it's for.",
    },
    related: [
      { href: "/templates/anniversary", label: "Anniversary invitation template" },
      { href: "/templates/marriage-proposal", label: "Marriage proposal invitation template" },
      { href: "/occasions/valentines-day", label: "Valentine's Day date ideas" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
    extraSchema: ["product"],
  },

  "cute-ways-to-ask-someone-out": {
    path: "/cute-ways-to-ask-someone-out",
    slug: "cute-ways-to-ask-someone-out",
    primaryKeyword: "cute ways to ask someone out",
    eyebrow: "Ideas + examples",
    title: "Cute Ways to Ask Someone Out | 8 Ideas + Examples",
    description:
      "Cute, creative ways to ask someone out — from funny to romantic. Real examples, exact words to say, and templates to make them say yes.",
    h1: "Cute Ways to Ask Someone Out (That Make Their Heart Skip)",
    intro:
      "The cutest ways to ask someone out mix sincerity with a little charm — a personalized invitation, a handwritten note, a playlist that ends with the question, or a small gift with a sweet ask. The key is making it personal so they know it's really about them.",
    sections: [
      {
        heading: "Cute vs. cringey",
        body: [
          "Cute works when it's genuine. The moment it feels like a performance, it tips into cringey.",
          "The fix is always personalization: reference something real about them, and give them an easy, pressure-free way to say yes.",
        ],
      },
      {
        heading: "8 cute ways to ask someone out",
        steps: [
          { name: "A personalized invitation", text: "Make a page just for them with your song and the exact question. (This is what Whobela is for.)" },
          { name: "A handwritten note", text: "Old-school and brave — leave it where they'll find it." },
          { name: "A mini scavenger hunt", text: "A few clues that lead to the ask." },
          { name: "A small gift + the question", text: "A coffee, a flower, a treat they love, with a note." },
          { name: "A playlist", text: "Title it for them; let the last song ask the question." },
          { name: "A photo collage", text: "Arrange your favorite moments to spell \"DATE?\"" },
          { name: "An inside joke", text: "Turn something only you two share into the ask." },
          { name: "The confident classic", text: "\"You're wonderful. Can I take you out this week?\"" },
        ],
      },
      {
        heading: "By situation",
        bullets: [
          "Your crush: be sweet but clear it's romantic",
          "A friend: reference your history, and be brave",
          "Someone you met recently: keep it light and specific",
          "Someone online: a personalized invitation lands best",
        ],
      },
    ],
    faq: [
      { q: "What's the cutest way to ask someone out?", a: "A personalized invitation made just for them — it's specific, thoughtful, and gives them an easy way to say yes." },
      { q: "How do I keep it from being cringey?", a: "Make it personal and genuine, and always give them a no-pressure way to respond." },
      { q: "What should I actually say?", a: "Name something you like about them, suggest a specific plan, and ask clearly: \"Can I take you out Saturday?\"" },
    ],
    cta: {
      heading: "Pick your cutest idea",
      sub: "Turn it into a personalized invitation they'll never forget.",
    },
    related: [
      { href: "/templates/funny-ask-out", label: "Funny ask-out template" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
      { href: "/for/crush", label: "How to ask your crush out" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
};

export const MONEY_PAGE_SLUGS = Object.keys(MONEY_PAGES);
