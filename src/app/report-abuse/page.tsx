import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Report Abuse — whobela",
  description: "Report unsafe or abusive behavior on whobela.",
};

export default function ReportAbusePage() {
  return (
    <LegalPage title="Report Abuse" backHref="/" backLabel="Home">
      <p>
        If you&apos;ve encountered a page, message, or behavior on Whobela that feels unsafe,
        abusive, or violates our{" "}
        <Link href="/legal/community-guidelines">Community Guidelines</Link>, please tell us.
      </p>

      <h2>How to Report</h2>
      <ul>
        <li>
          Use the in-product &ldquo;Report&rdquo; option where available, attaching the
          relevant link or screenshot;
        </li>
        <li>
          Or email <a href="mailto:support@whobela.com">support@whobela.com</a> with a
          description of the issue, the link involved, and any supporting screenshots.
        </li>
      </ul>

      <h2>What Happens Next</h2>
      <p>
        We review reports as quickly as possible and may remove content, warn a user, or
        suspend or terminate an account depending on severity, in line with our{" "}
        <Link href="/legal/content-removal">Content Removal Policy</Link> and{" "}
        <Link href="/legal/community-guidelines">Community Guidelines</Link>.
      </p>
      <p>If you are in immediate danger, please contact local emergency services first.</p>
    </LegalPage>
  );
}
