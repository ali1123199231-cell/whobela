# Caddy plus the Cloudflare DNS provider.
#
# Wildcard certificates can only be validated over DNS-01, and the official
# caddy image ships no DNS providers at all — so *.whobela.com needs a build
# carrying the plugin for whatever DNS host the zone lives on (Cloudflare).
FROM caddy:2-builder-alpine AS builder

RUN xcaddy build \
    --with github.com/caddy-dns/cloudflare

FROM caddy:2-alpine

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
