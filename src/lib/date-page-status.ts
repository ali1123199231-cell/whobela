export const TRIAL_MINUTES = 30;

export function getTrialEndsAt(firstPublishedAt: Date | null): Date | null {
  if (!firstPublishedAt) return null;
  return new Date(firstPublishedAt.getTime() + TRIAL_MINUTES * 60_000);
}

/**
 * A page is visible to the public once it's published, and stays visible either
 * while the owner has an active subscription or until the one-time trial window
 * (anchored to firstPublishedAt, not the latest publish) runs out.
 */
export function getLiveStatus(
  datePage: { status: string; firstPublishedAt: Date | null },
  subscriptionActive: boolean
): { isLive: boolean; trialEndsAt: Date | null } {
  if (datePage.status !== "PUBLISHED") return { isLive: false, trialEndsAt: null };
  if (subscriptionActive) return { isLive: true, trialEndsAt: null };

  const trialEndsAt = getTrialEndsAt(datePage.firstPublishedAt);
  const isLive = !!trialEndsAt && trialEndsAt.getTime() > Date.now();
  return { isLive, trialEndsAt: isLive ? trialEndsAt : null };
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
