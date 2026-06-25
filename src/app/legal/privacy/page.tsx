import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — whobela",
  description: "How whobela collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="[Insert Date]">
      <p>
        This Privacy Policy explains how Whobela (&ldquo;<strong>we</strong>,&rdquo;
        &ldquo;<strong>us</strong>,&rdquo; &ldquo;<strong>our</strong>&rdquo;) collects, uses,
        shares, and protects information when you use whobela.com and any related services
        (collectively, the &ldquo;<strong>Service</strong>&rdquo;). It applies to Users who
        create accounts and to Visitors who view or interact with invitation pages created on
        Whobela.
      </p>
      <p>
        Whobela is operated by [Company Legal Entity Name]. For the purposes of the EU/UK
        General Data Protection Regulation (&ldquo;<strong>GDPR</strong>&rdquo;), Whobela acts
        as the data controller for the personal data described below, unless stated
        otherwise.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>1.1 Account data</h3>
      <p>
        Email address, hashed password, account preferences, and any information you provide
        when creating or managing your account.
      </p>
      <h3>1.2 Profile data</h3>
      <p>
        Name, profile photos, interests, social links, preferences, and any other information
        you choose to add to your profile or invitation page.
      </p>
      <h3>1.3 Booking data</h3>
      <p>
        Information collected through your invitation pages and scheduling features, such as
        date and time selections, Visitor contact details (e.g., name, phone number, email),
        and messages or responses exchanged through the platform.
      </p>
      <h3>1.4 Technical data</h3>
      <p>
        IP address, browser type, device information, operating system, pages visited,
        timestamps, and similar analytics data collected automatically when you or a Visitor
        use the Service.
      </p>
      <h3>1.5 Payment data</h3>
      <p>
        Payments are processed by Stripe and/or PayPal. We do not store full payment card
        numbers or bank details. We may retain limited billing metadata (such as subscription
        status, billing history, and the last four digits of a payment card, where provided by
        our payment processor) for accounting and support purposes.
      </p>

      <h2>2. How We Use Information</h2>
      <p>We use the information described above to:</p>
      <ul>
        <li>Provide and operate the Service, including creating, hosting, and delivering invitation pages;</li>
        <li>Process bookings, responses, and contact details submitted through your pages;</li>
        <li>Send transactional notifications (e.g., booking confirmations, security alerts, billing receipts);</li>
        <li>Maintain, secure, and improve the Service, including diagnosing technical issues;</li>
        <li>Detect, investigate, and prevent fraud, abuse, and violations of our <Link href="/legal/terms">Terms &amp; Conditions</Link>;</li>
        <li>Communicate with you about your account, updates to our policies, or — where you have consented — product news.</li>
      </ul>

      <h2>3. Legal Basis for Processing (GDPR)</h2>
      <p>Where GDPR applies, we rely on the following legal bases:</p>
      <ul>
        <li><strong>Contract necessity</strong> — processing needed to create your account, build your pages, and deliver the Service you requested;</li>
        <li><strong>Consent</strong> — for optional features such as marketing emails or non-essential cookies, which you can withdraw at any time;</li>
        <li><strong>Legitimate interests</strong> — for security, fraud prevention, analytics, and improving the Service, balanced against your rights and interests;</li>
        <li><strong>Legal obligation</strong> — where we must retain or disclose information to comply with the law.</li>
      </ul>

      <h2>4. Data Sharing</h2>
      <p>
        We share information with the following categories of third parties, only as needed
        to operate the Service:
      </p>
      <ul>
        <li><strong>Hosting providers</strong> — to store and serve the platform and your data;</li>
        <li><strong>Payment processors</strong> (Stripe, PayPal) — to process subscription payments;</li>
        <li><strong>Storage providers</strong> — to store uploaded media such as profile photos;</li>
        <li><strong>Analytics providers</strong> — to understand product usage and improve the Service;</li>
        <li><strong>Email providers</strong> — to send account, booking, and transactional notifications.</li>
      </ul>
      <p>
        We do not sell your personal data. We may disclose information if required by law,
        court order, or governmental request, or to protect the rights, safety, or property of
        Whobela, our users, or the public.
      </p>

      <h2>5. User-Generated Content and Public Pages</h2>
      <p>
        Invitation pages you create are designed to be shared with specific Visitors via a
        unique link. Information you choose to include on a page — such as photos, your name,
        or interests — will be visible to anyone who accesses that link, unless you use
        available privacy controls to restrict access. You should only include information on
        a public page that you are comfortable sharing with the people you send the link to.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use cookies and similar technologies as described in our{" "}
        <Link href="/legal/cookies">Cookie Policy</Link>, including essential cookies
        (required for the Service to function), analytics cookies (to understand usage), and
        preference cookies (to remember your settings).
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain personal data for as long as your account is active, plus a limited period
        afterward to comply with legal, accounting, or security obligations. Specifically:
      </p>
      <ul>
        <li><strong>Account deletion</strong> — when you delete your account, we delete or anonymize your personal data within a reasonable period, except data we are required to retain by law (e.g., billing records) or data contained in backups, which are deleted on our standard backup rotation schedule;</li>
        <li><strong>Backup systems</strong> — data may persist in encrypted backups for a limited time after deletion from production systems;</li>
        <li><strong>Legal requirements</strong> — we may retain certain data longer where required by tax, accounting, or other applicable law.</li>
      </ul>

      <h2>8. Your Rights</h2>
      <p>If GDPR or a similar law applies to you, you have the right to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you;</li>
        <li><strong>Correct</strong> inaccurate or incomplete data;</li>
        <li><strong>Delete</strong> your data (&ldquo;right to be forgotten&rdquo;), subject to legal retention requirements;</li>
        <li><strong>Export</strong> your data in a portable format;</li>
        <li><strong>Restrict</strong> or object to certain processing, including processing based on legitimate interests or for direct marketing;</li>
        <li><strong>Withdraw consent</strong> at any time where processing is based on consent.</li>
      </ul>
      <p>
        To exercise these rights, contact{" "}
        <a href="mailto:privacy@whobela.com">privacy@whobela.com</a>. We will respond within
        the timeframe required by applicable law. If you are in the EU/UK, you also have the
        right to lodge a complaint with your local data protection authority.
      </p>

      <h2>9. International Transfers</h2>
      <p>
        Whobela uses infrastructure and service providers that may process data outside your
        country of residence, including outside the European Economic Area. Where we transfer
        personal data internationally, we use appropriate safeguards required by applicable
        law (such as Standard Contractual Clauses) to protect your data.
      </p>

      <h2>10. Security</h2>
      <p>
        We use industry-standard measures to protect your data, including encryption of data
        in transit, access controls restricting who can view personal data internally, hashed
        password storage, and regular review of our security practices. No system is
        completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>11. Children&apos;s Privacy</h2>
      <p>
        Whobela is not directed at individuals under 18, and we do not knowingly collect
        personal data from anyone under 18. If you believe a minor has provided us with
        personal data, contact{" "}
        <a href="mailto:privacy@whobela.com">privacy@whobela.com</a> so we can investigate and
        remove it.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of material
        changes by email or through the Service before they take effect.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about this Privacy Policy or how we handle your data can be sent to{" "}
        <a href="mailto:privacy@whobela.com">privacy@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
