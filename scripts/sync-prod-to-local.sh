#!/usr/bin/env bash
# Rebuild a local, verbatim copy of the production database and uploads, so you
# can log into any production account locally and see exactly what that user
# sees. Run from the project root on your workstation (never on the server).
#
# This script only ever READS from production: it opens an SSH connection, runs
# pg_dump inside the prod postgres container, and streams the result straight
# into a local database. Nothing is written back, and no dump file is left on
# disk — the data goes over the pipe and into postgres, nowhere else.
#
# It is deliberately destructive locally and deliberately non-incremental: every
# run drops whobela_prod_copy entirely and rebuilds it from a fresh dump, so a
# run today and a run next month produce identical results from the same prod
# state. Your normal dev database (whobela_db) is never touched.
set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SSH_HOST="whobela-prod"

PROD_PG_CONTAINER="whobela-postgres"
PROD_DB="whobela_prod"
PROD_DB_USER="whobela"
PROD_UPLOADS_PATH="/var/lib/docker/volumes/whobela-prod_uploads_data/_data"

LOCAL_PG_CONTAINER="whobela_postgres"
LOCAL_DB="whobela_prod_copy"
LOCAL_DB_USER="whobela"
LOCAL_DB_PASSWORD="whobela_dev_pass"   # matches docker-compose.yml
LOCAL_DB_PORT="5434"                   # host-side port from docker-compose.yml

# Databases this script must never target, however it is edited. whobela_db is
# your own dev data; the others would mean it is pointed at a real environment.
readonly FORBIDDEN_TARGETS=("whobela_db" "whobela_prod" "whobela_staging" "postgres")

DEV_PASSWORD="prodcopy"
SKIP_UPLOADS=false
WRITE_ENV=true
SCRUB=false

usage() {
  cat <<'EOF'
Usage: scripts/sync-prod-to-local.sh [options]

Rebuilds the local whobela_prod_copy database and ./uploads-prod from production.

Options:
  --password <pw>   Password every account in the copy gets (default: prodcopy)
  --scrub           Strip live Stripe/PayPal/Resend credentials from the copy and
                    force sandbox + billing-bypass mode. Off by default, so the
                    copy is a verbatim mirror of production.
  --skip-uploads    Skip the rsync of profile photos and page media
  --no-env          Do not write .env.local (print the settings instead)
  -h, --help        Show this help

After a sync, `npm run dev` runs against the copy. To go back to your own dev
data, run scripts/use-dev-db.sh (which just removes .env.local).
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --password)     DEV_PASSWORD="${2:?--password needs a value}"; shift 2 ;;
    --scrub)        SCRUB=true; shift ;;
    --skip-uploads) SKIP_UPLOADS=true; shift ;;
    --no-env)       WRITE_ENV=false; shift ;;
    -h|--help)      usage; exit 0 ;;
    *)              echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPLOADS_DEST="${PROJECT_ROOT}/uploads-prod"
cd "$PROJECT_ROOT"

# ---------------------------------------------------------------------------
# Preflight
# ---------------------------------------------------------------------------
echo "==> Preflight checks..."

for forbidden in "${FORBIDDEN_TARGETS[@]}"; do
  if [[ "$LOCAL_DB" == "$forbidden" ]]; then
    echo "ERROR: refusing to use '$LOCAL_DB' as the restore target." >&2
    exit 1
  fi
done

[[ -f "prisma/schema.prisma" ]] || { echo "ERROR: not in the project root." >&2; exit 1; }

if ! docker ps --format '{{.Names}}' | grep -qx "$LOCAL_PG_CONTAINER"; then
  echo "ERROR: local postgres container '$LOCAL_PG_CONTAINER' is not running." >&2
  echo "       Start it with: docker compose up -d postgres" >&2
  exit 1
fi

if ! ssh -o BatchMode=yes -o ConnectTimeout=10 "$SSH_HOST" true 2>/dev/null; then
  echo "ERROR: cannot reach '$SSH_HOST' over SSH." >&2
  exit 1
fi

# psql on the local container talks over the unix socket as the postgres
# superuser role, so no password is needed for the admin steps below.
local_psql() { docker exec -i "$LOCAL_PG_CONTAINER" psql -U "$LOCAL_DB_USER" "$@"; }

# ---------------------------------------------------------------------------
# Rebuild the copy
# ---------------------------------------------------------------------------
echo "==> Dropping and recreating ${LOCAL_DB}..."
# WITH (FORCE) terminates any connection `next dev` is still holding open;
# without it the drop fails whenever the dev server is running.
local_psql -d postgres -v ON_ERROR_STOP=1 -q \
  -c "DROP DATABASE IF EXISTS ${LOCAL_DB} WITH (FORCE);" \
  -c "CREATE DATABASE ${LOCAL_DB} OWNER ${LOCAL_DB_USER};"

echo "==> Streaming production database over SSH..."
# --no-owner/--no-acl because the local role set differs from prod's; the dump
# never touches the filesystem on either end.
ssh -o BatchMode=yes "$SSH_HOST" \
  "docker exec ${PROD_PG_CONTAINER} pg_dump -U ${PROD_DB_USER} -d ${PROD_DB} --no-owner --no-acl" \
  | local_psql -d "$LOCAL_DB" -v ON_ERROR_STOP=1 -q > /dev/null

echo "==> Applying any migrations prod has not run yet..."
# prisma.config.ts loads .env via dotenv and dotenv does not override variables
# already present in the environment — so exporting DATABASE_URL here reliably
# points the CLI at the copy, whatever .env or .env.local happen to contain.
DATABASE_URL="postgresql://${LOCAL_DB_USER}:${LOCAL_DB_PASSWORD}@localhost:${LOCAL_DB_PORT}/${LOCAL_DB}?schema=public" \
  npx prisma migrate deploy

# ---------------------------------------------------------------------------
# Make every account loginable
# ---------------------------------------------------------------------------
echo "==> Setting a known password on every account in the copy..."
# Hashed with the same bcryptjs and cost factor as hashPassword() in
# src/lib/auth.ts, so the real login flow accepts it unmodified.
PASSWORD_HASH="$(node -e 'process.stdout.write(require("bcryptjs").hashSync(process.argv[1], 10))' "$DEV_PASSWORD")"

# Clearing the lockout columns matters: src/app/api/auth/login/route.ts rejects
# a login outright while loginLockedUntil is in the future, and prod accounts
# can arrive mid-lockout. Email verification is left exactly as prod has it —
# login does not check it, and leaving it alone keeps the copy faithful.
# Fed on stdin rather than with -c: psql only interpolates -v variables in
# scripts, not in a -c command string.
local_psql -d "$LOCAL_DB" -v ON_ERROR_STOP=1 -q -v hash="$PASSWORD_HASH" <<'SQL'
UPDATE users
   SET "passwordHash"        = :'hash',
       "failedLoginAttempts" = 0,
       "loginLockedUntil"    = NULL;
SQL

# ---------------------------------------------------------------------------
# Optional scrub
# ---------------------------------------------------------------------------
if [[ "$SCRUB" == true ]]; then
  echo "==> Scrubbing live credentials and forcing sandbox mode..."
  local_psql -d "$LOCAL_DB" -v ON_ERROR_STOP=1 -q <<'SQL'
DELETE FROM system_config
 WHERE key LIKE '%SECRET%' OR key LIKE '%API_KEY%' OR key LIKE '%CLIENT_ID%';

INSERT INTO system_config (id, key, value, "updatedAt")
VALUES (gen_random_uuid(), 'STRIPE_SANDBOX_MODE', 'true', now()),
       (gen_random_uuid(), 'PAYPAL_SANDBOX_MODE', 'true', now()),
       (gen_random_uuid(), 'BILLING_BYPASS',      'true', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, "updatedAt" = now();
SQL
fi

# ---------------------------------------------------------------------------
# Uploads
# ---------------------------------------------------------------------------
if [[ "$SKIP_UPLOADS" == true ]]; then
  echo "==> Skipping uploads (--skip-uploads)."
else
  echo "==> Syncing uploads to ./uploads-prod..."
  mkdir -p "$UPLOADS_DEST"
  # --delete keeps the directory an exact mirror, so a file deleted in prod
  # does not linger locally and make a stale row look valid.
  rsync -az --delete "${SSH_HOST}:${PROD_UPLOADS_PATH}/" "${UPLOADS_DEST}/"
fi

# ---------------------------------------------------------------------------
# Point the app at the copy
# ---------------------------------------------------------------------------
COPY_DATABASE_URL="postgresql://${LOCAL_DB_USER}:${LOCAL_DB_PASSWORD}@localhost:${LOCAL_DB_PORT}/${LOCAL_DB}?schema=public"

if [[ "$WRITE_ENV" == true ]]; then
  echo "==> Writing .env.local..."
  # .env.local takes precedence over .env in Next, and is already gitignored by
  # the .env* rule. Deleting it is the whole revert.
  cat > "${PROJECT_ROOT}/.env.local" <<EOF
# Generated by scripts/sync-prod-to-local.sh — do not commit.
# Points the dev server at the production copy instead of your dev database.
# Revert with: scripts/use-dev-db.sh
DATABASE_URL="${COPY_DATABASE_URL}"
UPLOAD_DIR="${UPLOADS_DEST}"
EOF
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
USER_COUNT="$(local_psql -d "$LOCAL_DB" -tAc 'SELECT count(*) FROM users')"
PAGE_COUNT="$(local_psql -d "$LOCAL_DB" -tAc 'SELECT count(*) FROM date_pages')"
STRIPE_MODE="$(local_psql -d "$LOCAL_DB" -tAc "SELECT value FROM system_config WHERE key = 'STRIPE_SANDBOX_MODE'")"
BILLING_BYPASS="$(local_psql -d "$LOCAL_DB" -tAc "SELECT value FROM system_config WHERE key = 'BILLING_BYPASS'")"

echo
echo "==> Done. ${USER_COUNT} users, ${PAGE_COUNT} date pages."
echo "    Log in at http://localhost:3000/login with any prod email."
echo "    Password: ${DEV_PASSWORD}"
echo
echo "    Emails go to Mailhog (http://localhost:8025), never to real users —"
echo "    src/lib/email.ts forces this whenever APP_ENV=development."
echo

# Billing config is read from the system_config table, not from .env, so a
# verbatim copy inherits whatever mode production is in.
if [[ "$BILLING_BYPASS" == "true" ]]; then
  echo "    Billing: BILLING_BYPASS=true — checkout is bypassed, no payment calls."
elif [[ "$STRIPE_MODE" == "true" ]]; then
  echo "    Billing: Stripe sandbox mode — safe to click through checkout."
else
  echo "    !! Billing: STRIPE_SANDBOX_MODE=${STRIPE_MODE:-unset} and BILLING_BYPASS=${BILLING_BYPASS:-unset}."
  echo "    !! The copy holds LIVE Stripe keys. An upgrade click will hit live Stripe"
  echo "    !! for real. Re-run with --scrub, or avoid the billing flow."
fi

echo
if [[ "$WRITE_ENV" == true ]]; then
  echo "    Active via .env.local. Restart \`npm run dev\` to pick it up."
  echo "    Back to your dev data: scripts/use-dev-db.sh"
else
  echo "    Set these yourself (--no-env was passed):"
  echo "      DATABASE_URL=\"${COPY_DATABASE_URL}\""
  echo "      UPLOAD_DIR=\"${UPLOADS_DEST}\""
fi
echo
echo "    Note: the Prisma CLI reads .env only, so plain \`npx prisma studio\` or"
echo "    \`migrate\` still targets your dev database. Prefix them with"
echo "    DATABASE_URL=\"${COPY_DATABASE_URL}\" to work on the copy."
