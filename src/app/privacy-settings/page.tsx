import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Settings — whobela",
  description: "What you can control about your data on whobela, and what you can't yet.",
};

export default function PrivacySettingsPage() {
  return (
    <LegalPage title="Privacy Settings" backHref="/" backLabel="Home">
      <p>
        Whobela is free and there are no plans or tiers — everyone gets the same controls.
        Here is exactly what you can change today, and what you can&apos;t.
      </p>

      <h2>What You Can Control</h2>
      <ul>
        <li>
          <strong>What&apos;s on your page</strong> — you choose every photo, every word, and
          which contact options appear, before you publish and at any time afterwards.
        </li>
        <li>
          <strong>Email notifications</strong> — turn booking emails on or off in your
          dashboard settings. Account and security emails cannot be switched off.
        </li>
        <li>
          <strong>Push notifications</strong> — granted and revoked in your browser, per
          device.
        </li>
        <li>
          <strong>Responses you&apos;ve received</strong> — review everything submitted through
          your page in your dashboard inbox.
        </li>
        <li>
          <strong>Taking your page offline</strong> — <strong>Take offline</strong> in your
          dashboard stops the link working immediately, and you keep the responses you already
          received. You can publish again whenever you like.
        </li>
        <li>
          <strong>Your account</strong> — delete it at any time from settings, which removes
          your profile, your page, your photos, and the responses you received. See{" "}
          <Link href="/delete-account">Delete Account</Link>.
        </li>
      </ul>

      <h2>What You Can&apos;t Control Yet</h2>
      <p>
        We&apos;d rather tell you plainly than imply a setting exists:
      </p>
      <ul>
        <li>
          <strong>Page visibility.</strong> There is no password, allow-list, or private mode.
          While your page is published it sits at <strong>yourname.whobela.com</strong>, the
          address is easy to guess, and anyone who has it can open the page. We ask search
          engines not to index invitation pages, so they shouldn&apos;t turn up in search
          results — but that is a request, not a lock. If you want a page seen by one person
          only, take it offline once they&apos;ve answered.
        </li>
      </ul>

      <h2>Your Data Rights</h2>
      <p>
        You can ask for a copy of your data, ask us to correct it, or ask us to delete it — and
        so can someone who answered your invitation, even though they never made an account.
        Write to <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>. Full detail
        is in our <Link href="/legal/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
