import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — whobela",
  description: "How whobela collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated={LEGAL.lastUpdated}>
      <p>
        This Privacy Policy explains how Whobela (&ldquo;<strong>we</strong>,&rdquo;
        &ldquo;<strong>us</strong>,&rdquo; &ldquo;<strong>our</strong>&rdquo;) collects, uses,
        shares, and protects information when you use whobela.com and any related services
        (collectively, the &ldquo;<strong>Service</strong>&rdquo;). It applies to Users who
        create accounts and to Visitors who view or interact with invitation pages created on
        Whobela.
      </p>
      <p>
        Whobela is operated by {LEGAL.operatorName}, a sole trader based at{" "}
        {LEGAL.operatorAddress}, {LEGAL.governingLaw}. For the purposes of the EU/UK General
        Data Protection Regulation (&ldquo;<strong>GDPR</strong>&rdquo;), that person is the
        data controller for the personal data described below, and can be reached at{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
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
      <h3>1.3 Booking data (information about Visitors)</h3>
      <p>
        When a Visitor responds to an invitation page, we store what they enter: their name,
        the contact details they choose to give (Instagram, WhatsApp, phone, or email), an
        optional message, the date and time they picked, and any preferences they selected.
      </p>
      <p>
        If you are a Visitor: this information is collected so the person who sent you the
        invitation can reply to you, and it is visible to them in their dashboard. The
        controller named above is responsible for it, you have all the rights described in
        Section 8, and you can ask us to delete it at any time by emailing{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> — you do not need an
        account to make that request.
      </p>
      <h3>1.4 Technical data</h3>
      <p>
        Whobela does not run analytics, advertising, or tracking software, and does not build
        a profile of what you do on the site. Our servers keep short-lived operational logs in
        the ordinary course of running a web service, and we set a cookie to keep you signed
        in. We do not store your IP address against your account, and we do not track you
        across other websites.
      </p>
      <h3>1.5 Push notifications</h3>
      <p>
        If you turn on notifications, your browser gives us an address for that specific
        browser or device, plus two keys used to encrypt messages to it. We store these so we
        can tell you when someone answers your invitation. Delivery goes through the push
        service run by your browser&apos;s maker — Google, Apple, or Mozilla — which
        necessarily receives that address. Turning notifications off in your browser, or
        deleting your account, removes it.
      </p>
      <h3>1.6 Signup country and acquisition source</h3>
      <p>
        When you create an account we record the <strong>country</strong> your request came
        from, derived at our content-delivery network from your IP address. We store the
        two-letter country code only. We do <strong>not</strong> store the IP address it was
        derived from, and we do <strong>not</strong> record your city, region, or any more
        precise location. We also record how you first reached the site (the referring
        website and any campaign parameters in the link you followed).
      </p>
      <p>
        We use this solely to understand, in aggregate, which countries and channels our
        users come from. It is never used to target you individually and is never shared
        with advertisers.
      </p>
      <h3>1.7 Payment data</h3>
      <p>
        Whobela is free and we do not collect payment data. When we previously offered a paid
        subscription, payments were processed by Stripe and/or PayPal; we never stored full
        payment card numbers or bank details, and we retain only limited historical billing
        metadata (such as subscription status and history) for accounting and support purposes.
      </p>

      <h2>2. How We Use Information</h2>
      <p>We use the information described above to:</p>
      <ul>
        <li>Provide and operate the Service, including creating, hosting, and delivering invitation pages;</li>
        <li>Process bookings, responses, and contact details submitted through your pages;</li>
        <li>Send transactional notifications by email and — if you turn them on — browser push (e.g., someone answered your invitation, security alerts);</li>
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
        <li><strong>Hetzner</strong> — the German hosting provider whose server runs Whobela and stores its database and uploaded photos;</li>
        <li><strong>Cloudflare</strong> — sits in front of the site to route traffic, provide HTTPS, and pass on the two-letter country code described in Section 1.6;</li>
        <li><strong>Resend</strong> — sends account and booking emails;</li>
        <li><strong>Browser push services</strong> (Google, Apple, Mozilla) — deliver notifications to your device, as described in Section 1.5;</li>
        <li><strong>Stripe and PayPal</strong> — historically processed subscription payments. No new payments are processed and no payment details are collected.</li>
      </ul>
      <p>
        We do not use analytics or advertising services, and no third party receives your data
        for its own marketing purposes.
      </p>
      <p>
        We do not sell your personal data. We may disclose information if required by law,
        court order, or governmental request, or to protect the rights, safety, or property of
        Whobela, our users, or the public.
      </p>

      <h2>5. User-Generated Content and Public Pages</h2>
      <p>
        Your invitation page is published at a public address built from your username, such
        as <strong>yourname.whobela.com</strong>. Anything you put on it — photos, your name,
        your interests — is visible to anyone who opens that address. The address is
        predictable rather than secret, and there is currently no password or visibility
        setting available. We ask search engines not to index invitation pages, but that is a
        request rather than an access control.
      </p>
      <p>
        Only put things on a page that you are comfortable being seen by someone other than
        the person you send it to. See <Link href="/legal/terms">Terms &amp; Conditions</Link>{" "}
        §5.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use one essential cookie, to keep you signed in, and your browser&apos;s local
        storage to remember how you first reached the site. We do not use analytics or
        advertising cookies. See our <Link href="/legal/cookies">Cookie Policy</Link> for
        detail.
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
