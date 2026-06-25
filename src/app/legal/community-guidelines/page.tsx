import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Community Guidelines — whobela",
  description: "Behavior rules for everyone using whobela.",
};

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage title="Community Guidelines" updated="[Insert Date]">
      <p>
        Whobela exists to help people create thoughtful, personal invitations. These
        guidelines explain the behavior we expect from everyone using the platform, and apply
        alongside our <Link href="/legal/terms">Terms &amp; Conditions</Link>.
      </p>

      <h2>1. What You Must Not Do</h2>
      <p>To keep Whobela safe and trustworthy, you must not:</p>
      <ul>
        <li><strong>Upload inappropriate photos</strong> — including sexually explicit, violent, or otherwise unlawful imagery, or photos of someone who has not consented to being featured;</li>
        <li><strong>Harass others</strong> — including sending threatening, abusive, demeaning, or unwanted repeated messages through the platform;</li>
        <li><strong>Create fake invitations</strong> — including pages impersonating someone else, built around a fabricated identity, or designed to deceive or prank a Visitor in a harmful way;</li>
        <li><strong>Abuse booking features</strong> — including submitting fake bookings, spamming scheduling slots, or using the booking flow to harvest contact details for unrelated purposes;</li>
        <li><strong>Collect personal data improperly</strong> — including using information submitted by Visitors (such as contact details) for purposes beyond responding to the invitation, or sharing that information with unauthorized third parties.</li>
      </ul>

      <h2>2. Reporting</h2>
      <p>
        If you encounter content or behavior that violates these guidelines, you can report it
        using the in-product reporting tool (where available) or by emailing{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a> with a description of the
        issue and, if possible, a link or screenshot. See our{" "}
        <Link href="/report-abuse">Report Abuse</Link> page for more detail.
      </p>

      <h2>3. Enforcement</h2>
      <p>
        Depending on the severity and frequency of a violation, we may take actions including:
      </p>
      <ul>
        <li>Removing or hiding the offending content;</li>
        <li>Issuing a warning;</li>
        <li>Temporarily suspending the account;</li>
        <li>Permanently terminating the account;</li>
        <li>Reporting unlawful activity to relevant authorities, where required or appropriate.</li>
      </ul>
      <p>
        We aim to apply these guidelines consistently and proportionately, but we retain
        discretion to act quickly to protect users when there is a risk of harm.
      </p>

      <h2>4. Contact</h2>
      <p>
        Questions about these guidelines can be sent to{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
