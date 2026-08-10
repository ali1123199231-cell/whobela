import Image from "next/image";
import { PLAY_STORE_URL } from "@/lib/app-store";

/**
 * Google's official "Get it on Google Play" badge.
 *
 * The artwork is Google's and its use is governed by their brand guidelines:
 * it must not be recoloured, redrawn or retyped, which is why this is the
 * supplied PNG rather than markup that happens to look like it. It's served
 * from /public rather than Google's CDN so the page carries no third-party
 * request, and the 646×250 original is scaled proportionally (×0.26) to keep
 * the badge's aspect ratio exactly as Google requires.
 */
export function PlayBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block ${className}`}
    >
      <Image src="/google-play-badge.png" alt="Get Whobela on Google Play" width={168} height={65} />
    </a>
  );
}
