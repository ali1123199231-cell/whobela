import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Content Removal Policy — whobela",
  description: "How to request removal of content hosted on whobela.",
};

export default function ContentRemovalPage() {
  return (
    <LegalPage title="Content Removal Policy" updated="[Insert Date]">
      <p>
        Whobela respects the intellectual property and personal rights of others. This policy
        explains how to request the removal of content hosted on Whobela, including copyright
        complaints and other user reports.
      </p>

      <h2>1. Copyright Complaints</h2>
      <p>
        If you believe content hosted on Whobela infringes your copyright, you may submit a
        notice to <a href="mailto:support@whobela.com">support@whobela.com</a> including:
      </p>
      <ul>
        <li>Identification of the copyrighted work you claim has been infringed;</li>
        <li>The specific URL or link to the content you believe is infringing;</li>
        <li>Your contact information (name, address, phone number, email);</li>
        <li>A statement that you have a good-faith belief that the use is not authorized by the copyright owner, its agent, or the law;</li>
        <li>A statement, under penalty of perjury, that the information in the notice is accurate and that you are the copyright owner or authorized to act on their behalf;</li>
        <li>Your physical or electronic signature.</li>
      </ul>
      <p>
        We will review valid notices and remove or disable access to the identified content
        where appropriate, and will notify the affected user.
      </p>

      <h2>2. User Reports</h2>
      <p>
        Anyone — User or Visitor — can report content that they believe violates our{" "}
        <Link href="/legal/terms">Terms &amp; Conditions</Link> or{" "}
        <Link href="/legal/community-guidelines">Community Guidelines</Link>, including content
        that is abusive, impersonates someone without consent, or otherwise causes harm.
        Reports can be submitted through in-product reporting tools (where available) or by
        emailing <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>

      <h2>3. Removal Process</h2>
      <ol>
        <li>We review the report or notice to determine whether it meets the criteria for removal.</li>
        <li>If action is warranted, we remove or restrict access to the content, and may suspend the associated account depending on severity.</li>
        <li>We notify the User whose content was removed, where appropriate, and provide a brief explanation.</li>
        <li>
          A User who believes their content was removed in error may submit a counter-notice
          or appeal to <a href="mailto:support@whobela.com">support@whobela.com</a>, which we
          will review in good faith.
        </li>
      </ol>
      <p>
        We aim to act on valid reports and notices promptly, prioritizing reports involving
        safety risks or clear legal violations.
      </p>

      <h2>4. Repeat Infringers</h2>
      <p>
        Accounts found to repeatedly infringe the rights of others or repeatedly violate our
        policies may be suspended or permanently terminated.
      </p>

      <h2>5. Contact</h2>
      <p>
        Copyright complaints and content removal requests:{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
