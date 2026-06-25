import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy — whobela",
  description: "Refund rules for whobela subscriptions.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updated="[Insert Date]">
      <p>
        This Refund Policy applies to paid subscriptions purchased on Whobela and supplements
        our <Link href="/legal/subscription-terms">Subscription Terms</Link> and{" "}
        <Link href="/legal/terms">Terms &amp; Conditions</Link>.
      </p>

      <h2>1. Monthly Subscriptions</h2>
      <p>
        Whobela subscriptions are billed in advance on a recurring basis (e.g., monthly or
        annually, depending on the plan you select). Charges are generally non-refundable for
        the period already billed, except as described below.
      </p>

      <h2>2. Stripe and PayPal Payments</h2>
      <p>
        All payments are processed securely through Stripe and/or PayPal. Refunds, where
        granted, are issued back to the original payment method through the same processor
        used for the original charge. Processing times for refunds depend on your payment
        provider or bank and are outside our control.
      </p>

      <h2>3. Cancellation</h2>
      <p>
        You may cancel your subscription at any time through your account settings.
        Cancellation stops future renewals but does not automatically refund the current
        billing period — you will retain access to paid features until the end of the period
        you&apos;ve already paid for.
      </p>

      <h2>4. Refund Eligibility</h2>
      <p>We will consider a refund in the following circumstances:</p>
      <ul>
        <li>You were charged due to a verified billing error or duplicate charge;</li>
        <li>A technical failure on our part prevented you from accessing paid features you were charged for, and we were unable to resolve it in a reasonable time;</li>
        <li>You are entitled to a refund under mandatory consumer-protection law in your country of residence (for example, statutory cooling-off periods, where applicable).</li>
      </ul>
      <p>
        To request a refund, contact{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a> within 14 days of the
        charge with your account email and a description of the issue.
      </p>

      <h2>5. Exceptions</h2>
      <p>We do not provide refunds for:</p>
      <ul>
        <li>Partial use of a billing period after voluntary cancellation;</li>
        <li>Failure to cancel before a renewal date;</li>
        <li>
          Dissatisfaction with results obtained through use of the platform (e.g., lack of
          responses to an invitation), since Whobela provides technology only and does not
          guarantee outcomes as described in our{" "}
          <Link href="/legal/terms">Terms &amp; Conditions</Link>;
        </li>
        <li>
          Accounts terminated for violation of our{" "}
          <Link href="/legal/terms">Terms &amp; Conditions</Link> or{" "}
          <Link href="/legal/community-guidelines">Community Guidelines</Link>.
        </li>
      </ul>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this Refund Policy from time to time. Material changes will be
        communicated through the Service or by email.
      </p>

      <h2>7. Contact</h2>
      <p>
        Refund requests and billing questions can be sent to{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
