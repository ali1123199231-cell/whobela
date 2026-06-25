import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Subscription Terms — whobela",
  description: "How whobela's free and paid plans work.",
};

export default function SubscriptionTermsPage() {
  return (
    <LegalPage title="Subscription Terms" updated="[Insert Date]">
      <p>
        These Subscription Terms describe how Whobela&apos;s free and paid plans work and
        supplement our <Link href="/legal/terms">Terms &amp; Conditions</Link> and{" "}
        <Link href="/legal/refund-policy">Refund Policy</Link>.
      </p>

      <h2>1. Free Features</h2>
      <p>
        Whobela offers a free tier that allows you to create an account, build a basic
        invitation page, and share it with Visitors, subject to any limits we set on the
        number of pages, photos, or features available without a paid subscription.
      </p>

      <h2>2. Paid Features</h2>
      <p>Paid subscriptions unlock additional features, which may include, depending on the plan:</p>
      <ul>
        <li>Additional or unlimited invitation pages;</li>
        <li>Custom domain connection;</li>
        <li>Removal of Whobela branding from your pages;</li>
        <li>Advanced analytics on page views and responses;</li>
        <li>Priority support.</li>
      </ul>
      <p>
        The specific features included in each plan are described on our pricing page at the
        time of purchase and may be updated as the product evolves.
      </p>

      <h2>3. Billing Cycle</h2>
      <p>
        Paid subscriptions are billed in advance on a recurring basis (e.g., monthly or
        annually, depending on the plan you choose) through Stripe or PayPal. Your
        subscription will automatically renew at the end of each billing cycle unless you
        cancel before the renewal date.
      </p>

      <h2>4. Price Changes</h2>
      <p>
        We may change subscription prices from time to time. If we increase the price of your
        plan, we will notify you in advance (by email or through the Service) before the
        change applies to your next billing cycle. Continuing your subscription after the
        price change takes effect constitutes acceptance of the new price; if you do not
        agree, you may cancel before the change takes effect.
      </p>

      <h2>5. Cancellation</h2>
      <p>
        You may cancel your subscription at any time through your account settings.
        Cancellation stops future billing but does not entitle you to a refund for the current
        billing period, except as described in our{" "}
        <Link href="/legal/refund-policy">Refund Policy</Link>. You will retain access to paid
        features until the end of the period you&apos;ve already paid for.
      </p>

      <h2>6. Renewal</h2>
      <p>
        Unless cancelled, subscriptions renew automatically at the same price and billing
        interval, except where a price change has been communicated in advance as described in
        Section 4.
      </p>

      <h2>7. Downgrades</h2>
      <p>
        If you downgrade from a paid plan or let a subscription lapse, features exclusive to
        that plan (such as custom domains or branding removal) will be disabled, though your
        underlying account and content will generally remain intact subject to free-tier
        limits.
      </p>

      <h2>8. Contact</h2>
      <p>
        Billing and subscription questions can be sent to{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
