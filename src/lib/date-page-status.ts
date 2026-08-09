/**
 * A page is visible to the public for as long as it is published, with no
 * billing gate of any kind.
 *
 * This used to expire 30 minutes after firstPublishedAt unless the owner
 * subscribed. That window closed on the recipient — the one person the link was
 * ever sent to — so a page that had done its job for its owner was serving a
 * dead end to the only visitor who mattered, and to everyone they might have
 * shown it to. Hosting a published page costs a row and a certificate; the
 * referral it generates is worth more than the subscription it protected.
 */
export function getLiveStatus(datePage: { status: string }): { isLive: boolean } {
  return { isLive: datePage.status === "PUBLISHED" };
}
