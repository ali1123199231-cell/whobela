#!/usr/bin/env node
// Prints a fresh VAPID keypair for web push, as SQL ready to paste into
// system_config.
//
// Run once per environment. Replacing a keypair that is already in use
// silently invalidates every subscription granted under it — browsers keep
// pushing to endpoints signed by the old key and the push service rejects
// them — so treat the output as write-once.
import webpush from "web-push";

const { publicKey, privateKey } = webpush.generateVAPIDKeys();

console.log(`-- Generated ${new Date().toISOString()}
UPDATE system_config SET value = '${publicKey}',  "updatedAt" = now() WHERE key = 'VAPID_PUBLIC_KEY';
UPDATE system_config SET value = '${privateKey}', "updatedAt" = now() WHERE key = 'VAPID_PRIVATE_KEY';`);
