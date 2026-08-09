-- Coarse signup geography: ISO 3166-1 alpha-2 only.
--
-- Filled from Cloudflare's CF-IPCountry header at signup (see src/lib/geo.ts).
-- The request IP is never read or stored, and nothing finer than a country is
-- kept. Fills forward: existing rows stay NULL and cannot be backfilled, since
-- Caddy discards access logs and no IP was ever recorded.

ALTER TABLE "users" ADD COLUMN "signupCountry" CHAR(2);

COMMENT ON COLUMN "users"."signupCountry" IS
    'ISO 3166-1 alpha-2 country from the Cloudflare edge at signup. The IP is never stored. NULL for accounts predating this column and for unknown countries.';

-- Partial: the reporting job groups by country and most historical rows are
-- NULL, so indexing only the populated ones keeps it small.
CREATE INDEX "users_signupCountry_idx" ON "users" ("signupCountry")
    WHERE "signupCountry" IS NOT NULL;
