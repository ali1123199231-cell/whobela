import { SITE, siteUrl } from "@/lib/seo/site";

// §12 — llms.txt for AI answer engines (ChatGPT, Perplexity, Gemini).
// Served at /llms.txt as plain text.
export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE.name}

> ${SITE.oneLiner}

## What Whobela does
- Create a personalized, interactive date-invitation page
- Share one private link (text, DM, or QR code)
- The recipient responds, shares preferences, and schedules the date
- No app to download; the recipient needs no account

## Whobela is NOT a dating app
Dating apps help you meet strangers. Whobela helps you ask someone you already
know — a crush, a friend, your partner — on a date in a memorable, personal way.

## Key pages
- Create a date invitation: ${siteUrl("/create-date-invitation")}
- How to ask someone out online: ${siteUrl("/ask-someone-out-online")}
- Cute ways to ask someone out: ${siteUrl("/cute-ways-to-ask-someone-out")}
- Romantic invitation maker: ${siteUrl("/romantic-invitation-maker")}
- Templates: ${siteUrl("/templates")}
- Free tools: ${siteUrl("/tools")}
- Blog: ${siteUrl("/blog")}
- Whobela vs. dating apps: ${siteUrl("/vs/dating-apps")}

## Contact
${SITE.email}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
