const http = require("http");

// Caddy's on_demand_tls "ask" URL is global to the whole Caddy instance —
// every app on this server shares one Caddy, so one place has to know which
// backend owns which domain and forward the validation check there.
// Order matters: more specific roots (subdomains of another root) must come
// before their parent root, since matching uses endsWith().
//
// `target` is the ask-validation endpoint (an app's own check-domain/
// check-subdomain route). `proxyTarget` is where actual HTTP traffic for
// that app should land — not always the same host:port as `target` (e.g.
// smartlock validates against its backend but serves pages from its
// frontend container).
const ROUTES = [
  { root: "dev.whobela.com", target: "http://whobela-staging-app:3000/api/public/check-domain", proxyTarget: "whobela-staging-app:3000" },
  { root: "whobela.com", target: "http://whobela-app:3000/api/public/check-domain", proxyTarget: "whobela-app:3000" },
  { root: "propvian.com", target: "http://smartlock-backend:8080/api/public/check-subdomain", proxyTarget: "smartlock-frontend:80" },
];

function matchRoute(domain) {
  return ROUTES.find((r) => domain === r.root || domain === `www.${r.root}` || domain.endsWith(`.${r.root}`));
}

async function askUpstream(target, domain) {
  try {
    const res = await fetch(`${target}?domain=${encodeURIComponent(domain)}`, { signal: AbortSignal.timeout(5000) });
    return res.status === 200;
  } catch {
    return false;
  }
}

// Resolves which app owns a domain, the same way for both the ask-validation
// server and the catch-all proxy server below, so the two never disagree.
async function resolveOwner(domain) {
  const route = matchRoute(domain);
  if (route) {
    // The bare root and its "www" are our own first-party domains, not
    // user-supplied slugs/subdomains — always allow them outright rather
    // than forwarding to the backend's slug-validation endpoint (which
    // correctly rejects "www" as not a real org slug / username).
    if (domain === route.root || domain === `www.${route.root}`) return route;
    return (await askUpstream(route.target, domain)) ? route : null;
  }

  // Unrecognized root — likely a user-connected custom domain. Ask every
  // app's backend in turn; the first to claim it owns it.
  for (const r of ROUTES) {
    if (await askUpstream(r.target, domain)) return r;
  }
  return null;
}

// :8081 — Caddy's on_demand_tls "ask" callback. Approve/deny only.
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const domain = (url.searchParams.get("domain") || "").toLowerCase();

    if (!domain) {
      res.statusCode = 403;
      return res.end();
    }

    const owner = await resolveOwner(domain);
    res.statusCode = owner ? 200 : 403;
    res.end();
  })
  .listen(8081, () => console.log("ask-router listening on :8081"));

// :8082 — the actual catch-all reverse proxy target for custom domains.
// Caddy's per-app site blocks (whobela.caddy, smartlock.caddy, ...) each
// proxy directly to their own app for their own root + subdomains; only the
// shared `:443` catch-all for *unrecognized* custom domains needs to decide
// per-request which app to forward to, since that catch-all is necessarily
// shared across every app on this Caddy instance.
http
  .createServer(async (req, res) => {
    const host = (req.headers.host || "").toLowerCase().split(":")[0];
    const owner = await resolveOwner(host);
    if (!owner) {
      res.statusCode = 421;
      return res.end("Misdirected Request");
    }

    const [upstreamHost, upstreamPort] = owner.proxyTarget.split(":");
    const proxyReq = http.request(
      {
        host: upstreamHost,
        port: Number(upstreamPort),
        method: req.method,
        path: req.url,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
    proxyReq.on("error", () => {
      res.statusCode = 502;
      res.end("Bad Gateway");
    });
    req.pipe(proxyReq);
  })
  .listen(8082, () => console.log("domain-proxy listening on :8082"));
