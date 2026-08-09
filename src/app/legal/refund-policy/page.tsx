import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy — whobela",
  description: "Whobela is free, so there is nothing to refund. How past charges are handled.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updated="[Insert Date]">
      <p>
        <strong>Whobela is free</strong>, so there is nothing to refund. We do not collect
        payment details and do not bill anyone. This policy supplements our{" "}
        <Link href="/legal/subscription-terms">Subscription Terms</Link> and{" "}
        <Link href="/legal/terms">Terms &amp; Conditions</Link>.
      </p>

      <h2>1. Charges From the Previous Paid Plan</h2>
      <p>
        Whobela previously sold a subscription that kept a published page online. That plan has
        been discontinued, every subscription under it has been cancelled, and no further
        charges will be made. Everything the plan unlocked is now available to everyone at no
        cost.
      </p>

      <h2>2. Requesting a Refund for a Past Charge</h2>
      <p>
        If you were charged under the old plan and would like that charge refunded, email{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a> from your account address.
        Refunds are issued to the original payment method through the original processor
        (Stripe or PayPal); how quickly the money appears depends on your bank.
      </p>

      <h2>3. Unrecognised Charges</h2>
      <p>
        Because Whobela no longer bills anyone, a new charge described as Whobela is not from
        us. Contact your bank or card issuer, and let us know at{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a> so we can help you
        establish that.
      </p>

      <h2>4. Statutory Rights</h2>
      <p>
        Nothing here limits refund rights you may have under mandatory consumer-protection law
        in your country of residence.
      </p>

      <h2>5. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be communicated
        through the Service or by email.
      </p>

      <h2>6. Contact</h2>
      <p>
        Billing questions can be sent to{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
