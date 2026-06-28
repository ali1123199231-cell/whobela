import type { ContentSection, FaqItem, RelatedLink } from "./types";

// §8 — Blog. Four clusters; every post links UP to a money page (no
// cannibalization: blog = informational, money pages = transactional).

export type BlogCategory = {
  slug: string;
  name: string;
  blurb: string;
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "asking-someone-out", name: "Asking Someone Out", blurb: "Confidence, scripts, and creative ways to ask." },
  { slug: "date-ideas", name: "Date Ideas", blurb: "First dates, romantic nights, and budget-friendly plans." },
  { slug: "relationships", name: "Relationships", blurb: "Memorable moments and creative romantic gestures." },
  { slug: "digital-dating", name: "Digital Dating", blurb: "Asking online, long distance, and modern romance." },
];

export type BlogPost = {
  slug: string;
  categorySlug: string;
  title: string;
  h1: string;
  description: string;
  keyword: string;
  published: string;
  author: string;
  intro: string;
  sections: ContentSection[];
  faq: FaqItem[];
  related: RelatedLink[];
};

const AUTHOR = "The Whobela Team";

export const BLOG_POSTS: BlogPost[] = [
  // ───────────────────────── Asking Someone Out ─────────────────────────
  {
    slug: "how-to-ask-someone-out",
    categorySlug: "asking-someone-out",
    title: "How to Ask Someone Out Without Being Awkward",
    h1: "How to Ask Someone Out Without Being Awkward",
    description:
      "A confident, low-pressure way to ask someone out — what to say, when to say it, and how to handle any answer gracefully.",
    keyword: "how to ask someone out",
    published: "2026-01-08",
    author: AUTHOR,
    intro:
      "To ask someone out without being awkward, keep it simple and sincere: give a genuine compliment, suggest a specific plan, and offer an easy way to say yes. Confidence isn't about perfect words — it's about being clear and kind.",
    sections: [
      { heading: "Why we overthink it", body: ["Most awkwardness comes from vagueness and fear of rejection. The fix for both is the same: be specific and treat a no as information, not failure."] },
      {
        heading: "The simple formula",
        steps: [
          { name: "Compliment", text: "Something genuine and specific about them." },
          { name: "Plan", text: "A real activity, day, and place." },
          { name: "Easy yes", text: "\"No pressure if you're busy\" lowers the stakes." },
        ],
      },
      { heading: "Make it memorable", body: ["If saying it out loud feels like too much, a personalized invitation does the brave part for you and gives them space to respond."] },
      { heading: "Handling the answer", body: ["Yes: lock in the details. Maybe: give space, follow up once. No: \"I appreciate the honesty — no hard feelings.\" Then move on with your dignity intact."] },
    ],
    faq: [
      { q: "What if I get nervous?", a: "Keep it short and rehearse one specific line. Nerves fade once you're being clear." },
      { q: "Should I ask in person or online?", a: "Either works. A personalized invitation is a great middle ground — personal but low-pressure." },
    ],
    related: [
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
      { href: "/for/crush", label: "How to ask your crush out" },
    ],
  },
  {
    slug: "ways-to-ask-your-crush-out",
    categorySlug: "asking-someone-out",
    title: "7 Best Ways to Ask Your Crush Out",
    h1: "7 Best Ways to Ask Your Crush Out",
    description:
      "Seven creative, confidence-friendly ways to ask your crush out — from a simple direct ask to a personalized invitation.",
    keyword: "ways to ask your crush out",
    published: "2026-01-12",
    author: AUTHOR,
    intro:
      "The best way to ask your crush out depends on your rapport — but every great approach is specific, genuine, and gives them an easy yes. Here are seven that work, from the simple and direct to the sweetly creative.",
    sections: [
      {
        heading: "7 ways that work",
        bullets: [
          "The direct ask: clear, confident, specific",
          "The personalized invitation: a page made just for them",
          "The shared-interest plan: build it around something they love",
          "The playful challenge: turn it into a game (if you banter)",
          "The handwritten note: brave and memorable",
          "The small gift + question: a coffee or treat with a note",
          "The playlist that ends with the ask",
        ],
      },
      { heading: "Reading their interest", body: ["Do they reply quickly, ask you questions, find reasons to talk? Those are green lights. You don't need certainty — just enough to take the shot."] },
    ],
    faq: [
      { q: "What if we're just friends?", a: "Be clear it's romantic so they're not left guessing. Reference your history and be brave." },
      { q: "What's the least scary way?", a: "A personalized invitation — it's thoughtful and gives them room to respond on their own time." },
    ],
    related: [
      { href: "/for/crush", label: "How to ask your crush out" },
      { href: "/cute-ways-to-ask-someone-out", label: "Cute ways to ask someone out" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
  {
    slug: "cute-messages-to-ask-on-a-date",
    categorySlug: "asking-someone-out",
    title: "Cute Messages to Ask Someone on a Date (with Examples)",
    h1: "Cute Messages to Ask Someone on a Date",
    description:
      "Copy-and-adapt cute messages to ask someone on a date — by personality, situation, and how well you know them.",
    keyword: "cute messages to ask someone out",
    published: "2026-01-15",
    author: AUTHOR,
    intro:
      "A cute message to ask someone out is short, specific, and clearly a little more than friendly. Here are examples you can adapt — keep the warmth, swap in your own plan and voice.",
    sections: [
      { heading: "For a new crush", bullets: ["\"I keep finding reasons to text you. Let's make it official — dinner Friday?\"", "\"You're my favorite notification. Coffee this weekend?\""] },
      { heading: "For someone you've been talking to", bullets: ["\"I'd rather hear your stories in person. Saturday?\"", "\"Let's trade the texting for a real date — are you free this week?\""] },
      { heading: "Make it more than a message", body: ["For a first ask, turn your message into a personalized invitation — it lands far better than a plain text."] },
    ],
    faq: [
      { q: "How long should the message be?", a: "Two or three sentences. Compliment, plan, easy yes." },
      { q: "Emojis or no?", a: "A couple can add warmth — just don't hide behind them. Be clear it's a date." },
    ],
    related: [
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
      { href: "/cute-ways-to-ask-someone-out", label: "Cute ways to ask someone out" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
  {
    slug: "confidence-tips-for-asking-out",
    categorySlug: "asking-someone-out",
    title: "How to Build the Confidence to Ask Someone Out",
    h1: "How to Build the Confidence to Ask Someone Out",
    description: "Practical confidence tips for asking someone out — reframing rejection, preparing, and taking the shot.",
    keyword: "confidence to ask someone out",
    published: "2026-01-18",
    author: AUTHOR,
    intro:
      "Confidence to ask someone out comes from preparation and a healthier view of rejection — not from waiting to feel fearless. Do the small things below and take the shot anyway; courage follows action.",
    sections: [
      { heading: "Reframe rejection", body: ["A no isn't a verdict on your worth — it's information about fit and timing. The people who date the most are simply the ones who ask the most."] },
      { heading: "Prepare one line", body: ["You don't need a script, just one specific, genuine opener you're comfortable saying. Preparation kills most nerves."] },
      { heading: "Lower the stakes", body: ["Ask for something small and specific — coffee, a walk. Or send a personalized invitation so the moment isn't all on the spot."] },
    ],
    faq: [
      { q: "What if I freeze up?", a: "Use a written approach — a message or a personalized invitation — so nerves don't get a vote." },
      { q: "How do I stop overthinking?", a: "Set a deadline to ask. Action shrinks anxiety faster than analysis." },
    ],
    related: [
      { href: "/for/crush", label: "How to ask your crush out" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
  {
    slug: "what-to-do-if-they-say-no",
    categorySlug: "asking-someone-out",
    title: "What to Do If They Say No (Gracefully)",
    h1: "What to Do If They Say No",
    description: "How to handle rejection with grace — what to say, what to avoid, and how to keep your confidence.",
    keyword: "what to do if they say no",
    published: "2026-01-22",
    author: AUTHOR,
    intro:
      "If someone says no, respond with grace: thank them for their honesty, don't push for reasons, and keep your dignity. A kind exit protects the friendship and your self-respect.",
    sections: [
      { heading: "What to say", body: ["\"I appreciate you being honest — no hard feelings.\" That's it. Short, warm, done."] },
      { heading: "What not to do", bullets: ["Don't ask why", "Don't try to negotiate", "Don't guilt-trip", "Don't ask again and again"] },
      { heading: "Moving forward", body: ["You asked — that's brave, and it's better than wondering. Give it a little time, then keep showing up as yourself."] },
    ],
    faq: [
      { q: "Can we still be friends?", a: "Often, yes — especially if you accept the no gracefully and give it some space." },
      { q: "How do I stop feeling embarrassed?", a: "Remember that asking is a strength. Most people respect the courage it took." },
    ],
    related: [
      { href: "/for/crush", label: "How to ask your crush out" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
    ],
  },
  {
    slug: "should-i-ask-them-out-signs",
    categorySlug: "asking-someone-out",
    title: "Should I Ask Them Out? Signs They're Interested",
    h1: "Should I Ask Them Out? Signs They're Interested",
    description: "Signs someone is interested and ready to be asked out — and why a little uncertainty shouldn't stop you.",
    keyword: "signs they like you",
    published: "2026-01-26",
    author: AUTHOR,
    intro:
      "Clear signs someone likes you include quick replies, asking you questions, finding reasons to talk, and remembering small details about you. You don't need certainty to ask — just enough green lights to take the shot.",
    sections: [
      { heading: "Green lights", bullets: ["They reply quickly and keep conversations going", "They ask about your life", "They remember little things you've said", "They find excuses to be near you"] },
      { heading: "Why uncertainty is normal", body: ["You'll rarely be 100% sure — and that's fine. Asking is how you find out. A specific, low-pressure ask makes it easy for both of you."] },
    ],
    faq: [
      { q: "What if I misread the signs?", a: "Ask kindly and specifically. If it's a no, a graceful exit keeps things easy." },
      { q: "How sure should I be before asking?", a: "Enough to think it's worth a shot. Certainty is rare; courage is the point." },
    ],
    related: [
      { href: "/for/crush", label: "How to ask your crush out" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },

  // ───────────────────────── Date Ideas ─────────────────────────
  {
    slug: "best-first-date-ideas",
    categorySlug: "date-ideas",
    title: "Best First Date Ideas That Lead to a Second",
    h1: "Best First Date Ideas That Lead to a Second",
    description: "The best first date ideas — low-pressure, conversation-friendly plans that make a great impression.",
    keyword: "best first date ideas",
    published: "2026-01-10",
    author: AUTHOR,
    intro:
      "The best first dates are low-pressure and leave room to talk: coffee, a relaxed walk, or a casual activity. Keep it short and easy so there's room for a second date — and ask in a way that makes yes effortless.",
    sections: [
      { heading: "Ideas that work", bullets: ["Coffee — easy and conversation-first", "A scenic walk", "A casual activity (market, gallery, mini golf)", "Lunch over dinner to ease nerves"] },
      { heading: "What to avoid", bullets: ["Loud venues where you can't talk", "Movies (no conversation)", "Anything that runs too long too soon"] },
      { heading: "How to ask", body: ["Keep it light and specific, or send a personalized invitation so the first date starts on a charming note."] },
    ],
    faq: [
      { q: "How long should a first date be?", a: "An hour or two. Short and good beats long and forced." },
      { q: "Who pays?", a: "Whoever asked can offer; splitting is also fine. Be gracious either way." },
    ],
    related: [
      { href: "/occasions/first-date", label: "First date ideas & how to ask" },
      { href: "/templates/first-date", label: "First date template" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
  {
    slug: "romantic-date-ideas-for-couples",
    categorySlug: "date-ideas",
    title: "25 Romantic Date Ideas for Couples",
    h1: "Romantic Date Ideas for Couples",
    description: "Romantic date ideas for couples — from at-home date nights to surprise plans that reignite the spark.",
    keyword: "romantic date ideas for couples",
    published: "2026-01-14",
    author: AUTHOR,
    intro:
      "The most romantic date ideas for couples mix novelty and intimacy — a candlelit dinner at home, recreating your first date, or a surprise night out. The secret isn't the budget; it's the intention behind it.",
    sections: [
      { heading: "At home", bullets: ["Cook a multi-course dinner together", "Dress up for a living-room date", "A themed movie marathon", "A wine or chocolate tasting"] },
      { heading: "Out and about", bullets: ["Recreate your first date", "Sunset picnic", "A surprise night out", "A new experience neither has tried"] },
      { heading: "Keep it intentional", body: ["A quick, thoughtful invitation turns 'we should do something' into a real plan worth looking forward to."] },
    ],
    faq: [
      { q: "How do we keep date night fresh?", a: "Alternate who plans, and add one new thing each time — a place, an activity, a theme." },
      { q: "Cheap but romantic?", a: "A sunset picnic, a home-cooked dinner, or stargazing all punch well above their cost." },
    ],
    related: [
      { href: "/for/couples", label: "Date ideas for couples" },
      { href: "/templates/romantic-dinner", label: "Romantic dinner template" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
    ],
  },
  {
    slug: "cheap-date-ideas",
    categorySlug: "date-ideas",
    title: "Cheap Date Ideas That Feel Expensive",
    h1: "Cheap Date Ideas That Feel Expensive",
    description: "Budget and free date ideas that still feel special — proof that effort beats expense.",
    keyword: "cheap date ideas",
    published: "2026-01-19",
    author: AUTHOR,
    intro:
      "Cheap date ideas can feel luxurious when you add a little intention: a sunset picnic, a home-cooked tasting menu, or stargazing with warm drinks. Thoughtfulness reads as romance — not the receipt.",
    sections: [
      { heading: "Free", bullets: ["Sunset walk", "Stargazing with blankets", "A hike to a view", "A free museum day"] },
      { heading: "Under $20", bullets: ["Picnic with their favorite snacks", "Coffee plus a bookstore browse", "Ice cream and a long walk", "A home movie night, done up"] },
      { heading: "Make it feel special", body: ["Plan ahead and personalize it — a thoughtful invitation makes even a free date feel like an occasion."] },
    ],
    faq: [
      { q: "Can a cheap date still impress?", a: "Absolutely. Effort and personalization matter far more than money." },
      { q: "What's the best free date?", a: "A sunset picnic or stargazing — romantic, relaxed, and zero cost." },
    ],
    related: [
      { href: "/for/couples", label: "Date ideas for couples" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
  {
    slug: "anniversary-date-ideas-by-year",
    categorySlug: "date-ideas",
    title: "Anniversary Date Ideas by Year",
    h1: "Anniversary Date Ideas by Year",
    description: "Anniversary date ideas for every milestone — from your first year to a decade together.",
    keyword: "anniversary date ideas",
    published: "2026-01-24",
    author: AUTHOR,
    intro:
      "Great anniversary dates grow with your story. The first year is about recreating the magic; later milestones are about honoring how far you've come. Here are ideas to match each chapter.",
    sections: [
      { heading: "Year 1", body: ["Recreate your first date, exactly. Same place, same order, new chapter."] },
      { heading: "Years 2–5", body: ["Try something neither of you has done — a class, a trip, an adventure that becomes a new shared memory."] },
      { heading: "5+ years", body: ["Reaffirm the commitment: revisit meaningful places, write letters, and plan toward the future together."] },
    ],
    faq: [
      { q: "How do I make it meaningful?", a: "Tie it to your history — memories and gratitude matter more than the price." },
      { q: "Surprise or plan together?", a: "Either works; a surprise invitation with hints is a lovely middle ground." },
    ],
    related: [
      { href: "/occasions/anniversary", label: "Anniversary date ideas" },
      { href: "/templates/anniversary", label: "Anniversary template" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
    ],
  },
  {
    slug: "date-ideas-for-introverts",
    categorySlug: "date-ideas",
    title: "Date Ideas for Introverts",
    h1: "Date Ideas for Introverts",
    description: "Low-key, low-stimulation date ideas for introverts — calm settings with room for real connection.",
    keyword: "date ideas for introverts",
    published: "2026-01-28",
    author: AUTHOR,
    intro:
      "The best date ideas for introverts are calm and conversation-friendly: a quiet café, a bookstore, a scenic walk, or a cozy night in. Skip the loud crowds — depth beats stimulation.",
    sections: [
      { heading: "Calm and connecting", bullets: ["A quiet café off-peak", "A bookstore browse", "A nature walk", "A home cooking date"] },
      { heading: "Why these work", body: ["Low-stimulation settings let introverts relax and actually connect, instead of competing with noise and crowds."] },
    ],
    faq: [
      { q: "What if my date is extroverted?", a: "Mix one lively activity with calm time so you both recharge." },
      { q: "Are home dates a cop-out?", a: "Not at all — a thoughtful at-home date can be the most intimate of all." },
    ],
    related: [
      { href: "/templates/coffee-date", label: "Coffee date template" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
  {
    slug: "how-to-plan-a-date-night",
    categorySlug: "date-ideas",
    title: "How to Plan the Perfect Date Night",
    h1: "How to Plan the Perfect Date Night",
    description: "A simple framework for planning a date night they'll remember — from idea to invitation to follow-up.",
    keyword: "how to plan a date night",
    published: "2026-02-02",
    author: AUTHOR,
    intro:
      "To plan a great date night, start with what they love, pick one clear activity, lock in the logistics, and invite them in a way that builds anticipation. A little planning turns an ordinary evening into a memory.",
    sections: [
      {
        heading: "The framework",
        steps: [
          { name: "Center them", text: "Build it around their favorites." },
          { name: "Pick one thing", text: "One clear activity beats a vague 'hang out.'" },
          { name: "Handle logistics", text: "Time, place, reservation, backup plan." },
          { name: "Invite with anticipation", text: "A personalized invitation makes it feel special before it even starts." },
        ],
      },
      { heading: "Don't skip the follow-up", body: ["A simple \"I had a great time\" the next day makes the night land even better."] },
    ],
    faq: [
      { q: "How far ahead should I plan?", a: "A few days to a week — enough to build anticipation and book anything you need." },
      { q: "What if plans fall through?", a: "Always have a low-effort backup so the night still happens." },
    ],
    related: [
      { href: "/for/couples", label: "Date ideas for couples" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },

  // ───────────────────────── Relationships ─────────────────────────
  {
    slug: "how-to-create-memorable-moments",
    categorySlug: "relationships",
    title: "How to Create Memorable Moments in a Relationship",
    h1: "How to Create Memorable Moments with Your Partner",
    description: "How to create memorable moments — intention, presence, and small gestures that become lasting memories.",
    keyword: "how to create memorable moments",
    published: "2026-01-16",
    author: AUTHOR,
    intro:
      "Memorable moments come from intention and presence, not expense. A surprise note, a phone-free evening, or a small ritual you repeat — these are what couples remember years later.",
    sections: [
      { heading: "The ingredients", bullets: ["Intention — you planned it on purpose", "Presence — phones away, fully there", "Novelty or meaning — new or deeply personal", "A way to remember it — a photo, a keepsake"] },
      { heading: "Small but mighty", body: ["A surprise invitation to an ordinary dinner can become a core memory simply because you made it feel chosen."] },
    ],
    faq: [
      { q: "Do grand gestures matter more?", a: "No — consistency and presence beat the occasional grand gesture." },
      { q: "How often?", a: "Small moments weekly; bigger ones occasionally. Rhythm matters more than scale." },
    ],
    related: [
      { href: "/for/couples", label: "Date ideas for couples" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
    ],
  },
  {
    slug: "creative-romantic-gestures",
    categorySlug: "relationships",
    title: "Creative Romantic Gestures (That Aren't Cheesy)",
    h1: "Creative Romantic Gestures That Aren't Cheesy",
    description: "Creative romantic gestures that feel genuine — personal, thoughtful, and never over the top.",
    keyword: "romantic gestures ideas",
    published: "2026-01-21",
    author: AUTHOR,
    intro:
      "The best romantic gestures are personal, not performative: a playlist of your songs, a surprise date invitation, a handwritten note tucked where they'll find it. Personalization is what keeps a gesture from tipping into cheesy.",
    sections: [
      { heading: "Gestures that land", bullets: ["A personalized date invitation out of the blue", "A playlist of songs that mean something", "A handwritten note in their bag", "Recreating an early memory"] },
      { heading: "The cheesy line", body: ["Generic equals cheesy; specific equals romantic. Tie every gesture to something real about them."] },
    ],
    faq: [
      { q: "What if I'm not romantic by nature?", a: "Start small and specific. A thoughtful invitation does a lot of the work for you." },
      { q: "How do I avoid being cringey?", a: "Keep it genuine and personal — reference real moments, not clichés." },
    ],
    related: [
      { href: "/cute-ways-to-ask-someone-out", label: "Cute ways to ask someone out" },
      { href: "/romantic-invitation-maker", label: "Romantic invitation maker" },
    ],
  },
  {
    slug: "how-to-make-someone-feel-loved",
    categorySlug: "relationships",
    title: "How to Make Someone Feel Loved Every Day",
    h1: "How to Make Someone Feel Loved Every Day",
    description: "Simple, consistent ways to make your partner feel loved — built on attention, presence, and follow-through.",
    keyword: "how to make someone feel loved",
    published: "2026-01-27",
    author: AUTHOR,
    intro:
      "People feel loved through consistent attention, not occasional grand gestures: really listening, following through on small promises, and creating little moments that say 'I was thinking of you.'",
    sections: [
      { heading: "Daily basics", bullets: ["Listen without fixing", "Follow through on the small things", "Express appreciation out loud", "Be fully present, phone down"] },
      { heading: "The occasional spark", body: ["Layer in surprises — a spontaneous date invitation reminds them they're a priority, not an afterthought."] },
    ],
    faq: [
      { q: "What are love languages?", a: "Different ways people give and receive love — words, time, gifts, acts, touch. Learn theirs and lead with it." },
      { q: "Is consistency really better than big gestures?", a: "Yes — steady, small acts build security that grand gestures alone can't." },
    ],
    related: [
      { href: "/for/couples", label: "Date ideas for couples" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
  {
    slug: "conversation-starters-for-couples",
    categorySlug: "relationships",
    title: "Deep Conversation Starters for Couples",
    h1: "Deep Conversation Starters for Couples",
    description: "Conversation starters for couples that go beyond small talk and deepen your connection.",
    keyword: "conversation starters for couples",
    published: "2026-02-04",
    author: AUTHOR,
    intro:
      "Good conversation starters for couples invite stories and feelings, not yes/no answers. Use these on a date night to get past the everyday and into what actually matters.",
    sections: [
      { heading: "To reconnect", bullets: ["What made you feel loved this week?", "What's something you're looking forward to?", "When did you last feel really proud of us?"] },
      { heading: "To dream together", bullets: ["What would our perfect weekend look like?", "Where do you want to travel next?", "What tradition should we start?"] },
      { heading: "Set the scene", body: ["Phones away and a relaxed date make these land. A planned date night is the perfect container for real talk."] },
    ],
    faq: [
      { q: "When's the best time for deep questions?", a: "On a relaxed date or a walk — anywhere without distractions and time pressure." },
      { q: "What if it gets too heavy?", a: "Balance deep questions with playful ones, and follow their lead." },
    ],
    related: [
      { href: "/for/couples", label: "Date ideas for couples" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },

  // ───────────────────────── Digital Dating ─────────────────────────
  {
    slug: "creative-ways-to-ask-someone-out-online",
    categorySlug: "digital-dating",
    title: "Creative Ways to Ask Someone Out Online",
    h1: "Creative Ways to Ask Someone Out Online",
    description: "Creative, modern ways to ask someone out online — beyond the plain text, with a personal touch.",
    keyword: "creative ways to ask someone out online",
    published: "2026-01-11",
    author: AUTHOR,
    intro:
      "The most creative way to ask someone out online is to make it personal: a custom invitation page, a playlist that ends with the question, or a message built around an inside joke. Effort stands out in a feed of plain texts.",
    sections: [
      { heading: "Ideas that stand out", bullets: ["A personalized invitation page", "A playlist titled for them", "A meme that turns into a real ask", "A voice note with a specific plan"] },
      { heading: "Why personal wins online", body: ["Online, anyone can send a text. A made-for-them invitation signals real interest and effort — and gets a warmer yes."] },
    ],
    faq: [
      { q: "Is online asking less sincere?", a: "Not when it's personal. A thoughtful invitation often shows more effort than asking in person." },
      { q: "What platform is best?", a: "Wherever you already talk — then send a personalized invitation link to elevate it." },
    ],
    related: [
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
      { href: "/vs/dating-apps", label: "Whobela vs. dating apps" },
    ],
  },
  {
    slug: "long-distance-date-ideas",
    categorySlug: "digital-dating",
    title: "Long Distance Date Ideas to Stay Connected",
    h1: "Long Distance Date Ideas",
    description: "Long distance date ideas that keep the spark alive — synced movie nights, virtual dinners, and surprises from afar.",
    keyword: "long distance date ideas",
    published: "2026-01-17",
    author: AUTHOR,
    intro:
      "Great long distance dates create shared moments despite the miles: a synced movie night, a virtual dinner where you cook the same meal, or a surprise delivery with an invitation. Connection is about presence, not proximity.",
    sections: [
      { heading: "Virtual date ideas", bullets: ["Synced movie or show night", "Cook the same recipe together on video", "An online game night", "A virtual museum tour"] },
      { heading: "Surprises from afar", bullets: ["A delivered treat with a personalized invitation", "A countdown to your next visit", "A shared playlist that grows over time"] },
    ],
    faq: [
      { q: "How often should we have virtual dates?", a: "Quality over quantity — a weekly real date beats constant low-effort check-ins." },
      { q: "How do I keep it from feeling routine?", a: "Plan and theme them, and surprise each other with invitations." },
    ],
    related: [
      { href: "/templates/long-distance", label: "Long distance template" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
  {
    slug: "why-personalized-invitations-beat-apps",
    categorySlug: "digital-dating",
    title: "Why a Personalized Invitation Beats a Dating App Message",
    h1: "Why a Personalized Invitation Beats a Dating App Message",
    description: "Why a personalized invitation gets a warmer yes than a dating app message — the psychology of effort and personalization.",
    keyword: "personalized invitation vs dating app",
    published: "2026-01-23",
    author: AUTHOR,
    intro:
      "A personalized invitation beats a dating app message because it shows unmistakable effort and is made for one specific person. Where app messages blur together, an invitation feels like a moment — and effort is what earns a yes.",
    sections: [
      { heading: "The psychology of effort", body: ["We value what someone clearly worked for. A made-for-them page reads as 'you matter,' which a copy-paste opener never can."] },
      { heading: "Not a dating app", body: ["Whobela isn't for meeting strangers — it's for asking someone you already know, beautifully. It's the step after the match, or instead of the app entirely."] },
    ],
    faq: [
      { q: "Should I stop using dating apps?", a: "Not necessarily — use Whobela to turn a promising match into a real, romantic first date." },
      { q: "Does this work for someone I haven't met yet?", a: "It works best once you've had real conversations and want to ask them out." },
    ],
    related: [
      { href: "/vs/dating-apps", label: "Whobela vs. dating apps" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
      { href: "/ask-someone-out-online", label: "How to ask someone out online" },
    ],
  },
  {
    slug: "digital-romance-trends",
    categorySlug: "digital-dating",
    title: "Digital Romance Trends Shaping How We Date",
    h1: "Digital Romance Trends Shaping How We Date",
    description: "The digital romance trends changing how people ask each other out — from intentional dating to personalized invitations.",
    keyword: "digital romance trends",
    published: "2026-01-30",
    author: AUTHOR,
    intro:
      "Digital romance is shifting from endless swiping toward intention: fewer matches, more meaning. Personalized invitations, slow dating, and effort-forward gestures are how a new generation is making romance feel real again online.",
    sections: [
      { heading: "What's changing", bullets: ["Intentional 'slow dating' over swipe fatigue", "Effort-forward gestures that stand out", "Personalized, made-for-you invitations", "Asking people you already know, not just strangers"] },
      { heading: "Where this goes", body: ["Expect more tools that help you be thoughtful, not just more matches. Romance online is becoming about quality and care."] },
    ],
    faq: [
      { q: "Is swiping going away?", a: "Not entirely — but people increasingly crave more intentional, personal ways to connect." },
      { q: "How do I date more intentionally?", a: "Focus on real conversations and thoughtful gestures, like a personalized invitation, over volume." },
    ],
    related: [
      { href: "/vs/dating-apps", label: "Whobela vs. dating apps" },
      { href: "/create-date-invitation", label: "Create a date invitation" },
    ],
  },
];

export const BLOG_SLUGS = BLOG_POSTS.map((p) => ({
  category: p.categorySlug,
  slug: p.slug,
}));

export function getBlogPost(category: string, slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.categorySlug === category && p.slug === slug);
}

export function postsInCategory(category: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.categorySlug === category);
}
