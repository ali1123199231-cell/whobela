// Coarse signup geography.
//
// Cloudflare proxies whobela.com and sets `CF-IPCountry` on every request it
// forwards to the origin, so a country is available without a GeoIP database,
// without a third-party lookup, and without the request IP ever being read or
// stored. If the header is absent - a direct hit on the origin, or Cloudflare's
// IP Geolocation setting turned off - the country is simply unknown, which the
// reporting treats as its own bucket rather than as an error.
//
// Deliberately country and nothing finer. Cloudflare can also supply city and
// coordinates, but at this user count a city plus a signup timestamp is close
// enough to an identifier that it does not belong in a database we then email
// summaries of.
//
// This is read server-side from the header, never from the request body: a
// client-supplied country would be trivially spoofable, and Cloudflare strips
// client-supplied CF-* headers before forwarding.

/** Values Cloudflare uses for "no country", which are not countries. */
const NOT_A_COUNTRY = new Set([
  "XX", // could not be determined
  "T1", // Tor exit node
]);

/**
 * ISO 3166-1 alpha-2 country for the request, or undefined when unknown.
 */
export function countryFromRequest(request: Request): string | undefined {
  const raw = request.headers.get("cf-ipcountry");
  if (!raw) return undefined;

  const code = raw.trim().toUpperCase();
  if (code.length !== 2 || !/^[A-Z]{2}$/.test(code)) return undefined;
  if (NOT_A_COUNTRY.has(code)) return undefined;

  return code;
}
