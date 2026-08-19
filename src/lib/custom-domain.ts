// A connected custom domain is stored bare, without a leading "www.", but the
// setup instructions put the CNAME on "www" and users may also point the apex
// at us. Both hostnames therefore have to resolve back to the one stored value
// — in /api/public/check-domain, so Caddy will issue a certificate for either
// form, and in proxy.ts, so a request arriving on either reaches the same page.
export function bareDomain(host: string): string {
  if (!host.startsWith("www.")) return host;
  const rest = host.slice(4);
  // Guard against "www.com" and friends collapsing to a bare TLD.
  return rest.includes(".") ? rest : host;
}

/**
 * The hostname a user points their own domain at with a CNAME.
 *
 * Deliberately a name and not a raw IP: the server can then move without every
 * connected domain breaking and every owner having to edit their own DNS. The
 * trade-off is that a CNAME cannot live at a zone apex, which is why the setup
 * flow puts it on "www" and asks the registrar to redirect the apex there.
 *
 * It sits inside the user-subdomain space, so "connect" is a reserved username
 * (see RESERVED_USERNAMES in lib/validation) — otherwise someone could sign up
 * as `connect` and take over the target every custom domain depends on.
 */
export function cnameTarget(): string {
  const explicit = process.env.CUSTOM_DOMAIN_CNAME_TARGET;
  if (explicit) return explicit.trim().toLowerCase();
  const root = (process.env.ROOT_DOMAIN ?? "localhost:3000").toLowerCase();
  return `connect.${root}`;
}

/** The hostname we tell the user to put the CNAME on, and serve as canonical. */
export function wwwForm(domain: string): string {
  return `www.${bareDomain(domain)}`;
}
