#!/usr/bin/env node
/**
 * Push the marketing URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * Why this exists: after the 2026-08-09 free pivot, search engines and AI
 * assistants kept quoting the discontinued $2.99/month price. A sitemap only
 * invites a recrawl; IndexNow *notifies*, usually within minutes, and it is the
 * only such channel that needs no account or verified property. Bing's index is
 * also what several AI answer engines read from, so this is the shortest path
 * from "we deployed the correction" to "the assistants see it".
 *
 * Google does NOT participate in IndexNow. Google needs Search Console
 * (Settings -> Crawl -> or the URL Inspection tool's "Request indexing").
 *
 * Run AFTER deploying, never before — you are asking crawlers to come now, and
 * if they arrive at the old HTML you have refreshed the stale version instead.
 *
 *   node scripts/submit-indexnow.mjs           # submit
 *   node scripts/submit-indexnow.mjs --dry-run # print what would be submitted
 */

const HOST = "whobela.com";
const KEY = "465356c0d8ab3428be43e14ae115a9d8";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

// The pages that carry a price signal, most important first. IndexNow accepts
// up to 10,000 URLs, but a focused list is the point: these are the pages whose
// content actually changed, and a submission full of untouched URLs is what
// gets a host's submissions deprioritised.
const URLS = [
  "/",
  "/pricing",
  "/faq",
  "/llms.txt",
  "/help",
  "/vs/dating-apps",
  "/legal/subscription-terms",
  "/legal/refund-policy",
  "/legal/terms",
  "/legal/privacy",
  "/create-date-invitation",
  "/ask-someone-out-online",
  "/cute-ways-to-ask-someone-out",
  "/romantic-invitation-maker",
  "/templates",
  "/tools",
  "/about",
].map((path) => `https://${HOST}${path}`);

const dryRun = process.argv.includes("--dry-run");

async function main() {
  // A key file that 404s makes the whole submission fail verification, and the
  // API answers 202 either way — so the only way to notice is to check first.
  const keyCheck = await fetch(KEY_LOCATION);
  const keyBody = keyCheck.ok ? (await keyCheck.text()).trim() : "";
  if (keyBody !== KEY) {
    console.error(
      `Key file not serving correctly at ${KEY_LOCATION}\n` +
        `  status: ${keyCheck.status}, body: ${JSON.stringify(keyBody.slice(0, 60))}\n` +
        `  Deploy public/${KEY}.txt first — IndexNow verifies ownership through it.`,
    );
    process.exit(1);
  }
  console.log(`Key file verified at ${KEY_LOCATION}`);

  if (dryRun) {
    console.log(`\nWould submit ${URLS.length} URLs:`);
    for (const url of URLS) console.log(`  ${url}`);
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: URLS }),
  });

  const text = await res.text();
  // 200 and 202 both mean accepted; 202 means "received, key validation pending".
  if (res.status === 200 || res.status === 202) {
    console.log(`Submitted ${URLS.length} URLs — HTTP ${res.status}. ${text}`.trim());
  } else {
    console.error(`IndexNow rejected the submission — HTTP ${res.status}. ${text}`.trim());
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
