#!/usr/bin/env bash
# Deploy whobela.com to the given environment (prod or staging) on the
# shared VPS. Run this from the project root on the server, after `git pull`.
set -euo pipefail

ENV_NAME="${1:-prod}"
if [[ "$ENV_NAME" != "prod" && "$ENV_NAME" != "staging" ]]; then
  echo "Usage: scripts/deploy.sh [prod|staging]"
  exit 1
fi

COMPOSE_FILE="docker-compose.${ENV_NAME}.yml"
ENV_FILE=".env.${ENV_NAME}"
CONTAINER_PREFIX="whobela"
[[ "$ENV_NAME" == "staging" ]] && CONTAINER_PREFIX="whobela-staging"
# Explicit project name is required: both compose files live in the same
# directory, so without -p they'd default to the same project name and
# share (collide on) the same named volumes between prod and staging.
PROJECT_NAME="whobela-${ENV_NAME}"

DC="docker compose -p $PROJECT_NAME -f $COMPOSE_FILE --env-file $ENV_FILE"

echo "==> Deploying whobela.com (${ENV_NAME})..."
echo "==> Building app image..."
$DC build app

echo "==> Ensuring database is up..."
$DC up -d postgres

# Run migrations against the *new* image's migrations folder in a throwaway
# container (--name avoids colliding with the fixed container_name) while the
# old app container — still compatible with the old schema — keeps serving.
# Running migrations only after swapping in the new app container left a gap
# where the new code (new schema expectations) ran against the old DB schema,
# 500ing every request until migrate deploy finished.
echo "==> Running database migrations..."
$DC run --rm --name "${CONTAINER_PREFIX}-migrate" app npx prisma migrate deploy

echo "==> Starting app..."
$DC up -d app

echo "==> Waiting for app to become healthy..."
for i in $(seq 1 20); do
  if docker exec "${CONTAINER_PREFIX}-app" wget -qO- http://localhost:3000 >/dev/null 2>&1; then
    echo "==> App is responding"
    break
  fi
  echo "  attempt $i/20..."
  if [ "$i" -eq 20 ]; then
    echo "ERROR: app did not respond in time"
    docker logs "${CONTAINER_PREFIX}-app" --tail=50
    exit 1
  fi
  sleep 5
done

echo "==> Deploy complete."
