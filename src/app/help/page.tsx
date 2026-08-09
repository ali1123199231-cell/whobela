import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Help Center — whobela",
  description: "Get help using whobela.",
};

export default function HelpCenterPage() {
  return (
    <LegalPage title="Help Center" backHref="/" backLabel="Home">
      <p>Need a hand with Whobela? Here&apos;s where to start:</p>
      <ul>
        <li>
          <strong>Getting started</strong> — Create an account, build your profile, and design
          your first invitation page from your dashboard.
        </li>
        <li>
          <strong>Sharing your page</strong> — Generate your unique link from your dashboard
          and share it directly with the person you want to invite.
        </li>
        <li>
          <strong>Managing responses</strong> — View responses, bookings, and contact details
          submitted through your page in your dashboard.
        </li>
        <li>
          <strong>Billing</strong> — There isn&apos;t any. Whobela is free and there is no plan to
          manage; see our <Link href="/legal/subscription-terms">Subscription Terms</Link>.
        </li>
        <li>
          <strong>Privacy &amp; safety</strong> — Review our{" "}
          <Link href="/legal/privacy">Privacy Policy</Link>,{" "}
          <Link href="/privacy-settings">Privacy Settings</Link>, and{" "}
          <Link href="/legal/safety">Safety Policy</Link>.
        </li>
      </ul>
      <p>
        Can&apos;t find what you need? Email{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a> and we&apos;ll help
        directly.
      </p>
    </LegalPage>
  );
}
