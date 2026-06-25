import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Settings — whobela",
  description: "Control who can see your invitation page and your data.",
};

export default function PrivacySettingsPage() {
  return (
    <LegalPage title="Privacy Settings" backHref="/" backLabel="Home">
      <p>Control who can see your invitation page and what information it includes.</p>

      <h2>What You Can Control</h2>
      <ul>
        <li>
          <strong>Page visibility</strong> — depending on plan, restrict your page so it&apos;s
          only viewable via your direct link, rather than being indexed or discoverable.
        </li>
        <li>
          <strong>Information shown</strong> — choose what photos, details, and contact
          options appear on your page before sharing it.
        </li>
        <li>
          <strong>Booking &amp; contact data</strong> — review who has submitted responses or
          contact details through your page in your dashboard.
        </li>
        <li>
          <strong>Marketing emails</strong> — opt in or out of non-essential product or
          marketing emails; account and security emails cannot be disabled.
        </li>
        <li>
          <strong>Account data</strong> — request access, correction, export, or deletion of
          your data at any time — see our <Link href="/legal/privacy">Privacy Policy</Link>{" "}
          for full details on exercising your rights.
        </li>
      </ul>
      <p>
        Settings can be managed from your account dashboard. For help, contact{" "}
        <a href="mailto:privacy@whobela.com">privacy@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
