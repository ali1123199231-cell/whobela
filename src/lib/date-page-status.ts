export const TRIAL_MINUTES = 30;

export function getTrialEndsAt(firstPublishedAt: Date | null): Date | null {
  if (!firstPublishedAt) return null;
  return new Date(firstPublishedAt.getTime() + TRIAL_MINUTES * 60_000);
}

/**
 * Whether a subscription still entitles the owner to a live page.
 *
 * Cancelling stops the next charge but doesn't refund the period already paid
 * for (see /legal/refund-policy), so a CANCELLED subscription keeps its
 * entitlement until currentPeriodEnd passes. This matters most for PayPal,
 * whose API cancels outright with no "at period end" option — without this the
 * page would go dark the instant the user clicked Cancel.
 *
 * PAST_DUE deliberately isn't extended: that's a failed payment, not a
 * paid-through period.
 */
export function isSubscriptionEntitled(
  subscription: { status: string; currentPeriodEnd: Date | null } | null | undefined
): boolean {
  if (!subscription) return false;
  if (subscription.status === "ACTIVE") return true;
  if (subscription.status !== "CANCELLED") return false;
  return !!subscription.currentPeriodEnd && subscription.currentPeriodEnd.getTime() > Date.now();
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
