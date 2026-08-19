// A connected custom domain is stored bare, without a leading "www.", but
// Settings tells the owner they may point "www" at us as well. Both hostnames
// therefore have to resolve back to the one stored value — in
// /api/public/check-domain, so Caddy will issue a certificate for the "www"
// form, and in proxy.ts, so a request arriving on it reaches the same page.
export function bareDomain(host: string): string {
  if (!host.startsWith("www.")) return host;
  const rest = host.slice(4);
  // Guard against "www.com" and friends collapsing to a bare TLD.
  return rest.includes(".") ? rest : host;
}
