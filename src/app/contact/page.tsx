import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Contact — whobela",
  description: "How to reach the whobela team.",
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact" backHref="/" backLabel="Home">
      <p>We&apos;re happy to help with questions, feedback, or issues.</p>
      <ul>
        <li>
          <strong>General support:</strong>{" "}
          <a href="mailto:support@whobela.com">support@whobela.com</a>
        </li>
        <li>
          <strong>Privacy &amp; data requests:</strong>{" "}
          <a href="mailto:privacy@whobela.com">privacy@whobela.com</a>
        </li>
      </ul>
      <p>
        We aim to respond to all inquiries as quickly as possible. For account-specific
        issues, please contact us from the email address associated with your account when
        possible.
      </p>
    </LegalPage>
  );
}
