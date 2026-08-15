import { NextResponse } from "next/server";
import { getConfigMany, CONFIG_KEYS } from "@/lib/config";
import { PLAY_STORE_URL } from "@/lib/app-store";

/**
 * What the app asks the server before it trusts itself.
 *
 * A bad web deploy is fixed in minutes; a bad APK is on people's phones for as
 * long as they decline to update. This is the one lever that works after the
 * fact — raise APP_MIN_VERSION_CODE in system_config and every install below it
 * shows an update wall instead of making requests the server can no longer
 * answer correctly.
 *
 * Deliberately public and unauthenticated: an app that must be told to update
 * has to hear it before it tries to sign anyone in.
 */
export async function GET() {
  const config = await getConfigMany([
    CONFIG_KEYS.APP_MIN_VERSION_CODE,
    CONFIG_KEYS.APP_LATEST_VERSION_CODE,
  ]);

  return NextResponse.json({
    // Defaults are deliberately permissive. A missing or unparseable row must
    // never lock every install out of the product — the failure mode of this
    // endpoint should be "no update prompt", not "nobody can open the app".
    minVersionCode: positiveInt(config[CONFIG_KEYS.APP_MIN_VERSION_CODE]) ?? 1,
    latestVersionCode: positiveInt(config[CONFIG_KEYS.APP_LATEST_VERSION_CODE]) ?? 1,
    updateUrl: PLAY_STORE_URL,
  });
}

function positiveInt(raw: string | null): number | null {
  if (!raw) return null;
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : null;
}
