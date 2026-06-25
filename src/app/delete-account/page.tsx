import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Delete Account — whobela",
  description: "How to delete your whobela account and what happens to your data.",
};

export default function DeleteAccountPage() {
  return (
    <LegalPage title="Delete Account" backHref="/" backLabel="Home">
      <p>You can delete your Whobela account at any time.</p>

      <h2>How to Delete Your Account</h2>
      <ol>
        <li>Go to your account settings.</li>
        <li>Select <strong>Delete Account</strong> and confirm.</li>
        <li>
          If you have an active subscription, cancel it first to avoid future billing — see
          our <Link href="/legal/subscription-terms">Subscription Terms</Link>.
        </li>
      </ol>
      <p>
        If you&apos;re unable to access settings, email{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a> from your account email
        and we&apos;ll process the deletion for you.
      </p>

      <h2>What Happens to Your Data</h2>
      <p>
        Deleting your account removes your profile, pages, and uploaded content from public
        access, and we delete or anonymize your personal data within a reasonable period,
        except where we&apos;re required to retain certain records (such as billing history)
        by law, consistent with our <Link href="/legal/privacy">Privacy Policy</Link>. Data
        may persist briefly in encrypted backups until they roll over on our standard
        schedule.
      </p>
      <p>Account deletion is permanent and cannot be undone.</p>
    </LegalPage>
  );
}
