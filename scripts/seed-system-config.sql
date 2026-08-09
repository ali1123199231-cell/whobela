-- Seeds empty placeholder rows for every key src/lib/config.ts's CONFIG_KEYS expects.
-- Safe to re-run: ON CONFLICT DO NOTHING leaves any already-filled-in value untouched.
INSERT INTO system_config (id, key, value, "updatedAt") VALUES
  -- Defaults to 'false' (live) so a freshly seeded environment fails safe; flip to 'true' for local/dev.
  (gen_random_uuid(), 'STRIPE_SANDBOX_MODE', 'false', now()),
  (gen_random_uuid(), 'STRIPE_SANDBOX_SECRET_KEY', '', now()),
  (gen_random_uuid(), 'STRIPE_SANDBOX_PUBLISHABLE_KEY', '', now()),
  (gen_random_uuid(), 'STRIPE_SANDBOX_WEBHOOK_SECRET', '', now()),
  (gen_random_uuid(), 'STRIPE_SANDBOX_PRICE_ID', '', now()),
  (gen_random_uuid(), 'STRIPE_LIVE_SECRET_KEY', '', now()),
  (gen_random_uuid(), 'STRIPE_LIVE_PUBLISHABLE_KEY', '', now()),
  (gen_random_uuid(), 'STRIPE_LIVE_WEBHOOK_SECRET', '', now()),
  (gen_random_uuid(), 'STRIPE_LIVE_PRICE_ID', '', now()),
  (gen_random_uuid(), 'PAYPAL_SANDBOX_MODE', 'false', now()),
  (gen_random_uuid(), 'PAYPAL_SANDBOX_CLIENT_ID', '', now()),
  (gen_random_uuid(), 'PAYPAL_SANDBOX_CLIENT_SECRET', '', now()),
  (gen_random_uuid(), 'PAYPAL_SANDBOX_WEBHOOK_ID', '', now()),
  (gen_random_uuid(), 'PAYPAL_SANDBOX_PLAN_ID', '', now()),
  (gen_random_uuid(), 'PAYPAL_LIVE_CLIENT_ID', '', now()),
  (gen_random_uuid(), 'PAYPAL_LIVE_CLIENT_SECRET', '', now()),
  (gen_random_uuid(), 'PAYPAL_LIVE_WEBHOOK_ID', '', now()),
  (gen_random_uuid(), 'PAYPAL_LIVE_PLAN_ID', '', now()),
  (gen_random_uuid(), 'RESEND_API_KEY', '', now()),
  (gen_random_uuid(), 'RESEND_FROM_EMAIL', '', now()),
  -- Generate once with `node scripts/generate-vapid-keys.mjs` and paste in.
  -- Changing them later invalidates every push subscription already granted.
  (gen_random_uuid(), 'VAPID_PUBLIC_KEY', '', now()),
  (gen_random_uuid(), 'VAPID_PRIVATE_KEY', '', now())
ON CONFLICT (key) DO NOTHING;
