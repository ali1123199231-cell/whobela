import Image from "next/image";
import { PLAY_STORE_URL } from "@/lib/app-store";

// Google's original artwork, in pixels. Every rendered size is derived from
// these two numbers so the badge can never be squashed by a hand-typed pair.
const BADGE_WIDTH = 646;
const BADGE_HEIGHT = 250;

/**
 * Google's official "Get it on Google Play" badge.
 *
 * The artwork is Google's and its use is governed by their brand guidelines:
 * it must not be recoloured, redrawn or retyped, which is why this is the
 * supplied PNG rather than markup that happens to look like it. It's served
 * from /public rather than Google's CDN so the page carries no third-party
 * request, and it is only ever scaled proportionally, which is the other thing
 * those guidelines require.
 *
 * `href` exists so callers can tag the link with a Play `referrer` and find out
 * which surface actually drove an install — see playStoreUrl.
 */
export function PlayBadge({
  className = "",
  href = PLAY_STORE_URL,
  scale = 0.26,
}: {
  className?: string;
  href?: string;
  scale?: number;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block ${className}`}
    >
      <Image
        src="/google-play-badge.png"
        alt="Get Whobela on Google Play"
        width={Math.round(BADGE_WIDTH * scale)}
        height={Math.round(BADGE_HEIGHT * scale)}
      />
    </a>
  );
}
