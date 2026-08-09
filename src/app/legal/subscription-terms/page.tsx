import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Subscription Terms — whobela",
  description: "Whobela is free. There are no paid plans and nothing to subscribe to.",
};

export default function SubscriptionTermsPage() {
  return (
    <LegalPage title="Subscription Terms" updated="[Insert Date]">
      <p>
        <strong>Whobela is free.</strong> There are no paid plans, no subscriptions, and nothing
        to buy. This page supplements our <Link href="/legal/terms">Terms &amp; Conditions</Link>.
      </p>

      <h2>1. What Is Included</h2>
      <p>
        Every account can create an invitation page, publish it, share the link, connect a
        custom domain, and receive responses at no charge. A published page stays online for as
        long as you keep it published — there is no trial window and no expiry.
      </p>

      <h2>2. No Charges</h2>
      <p>
        We do not ask for payment details and do not bill you. If anything ever presents itself
        as a Whobela charge, it did not come from us — please report it to{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>

      <h2>3. Previously Paid Subscriptions</h2>
      <p>
        Whobela previously offered a paid subscription that kept a published page online. That
        subscription has been discontinued and everything it unlocked is now free for everyone.
        Any subscription created under the old model has been cancelled and will not renew or
        bill again. See our <Link href="/legal/refund-policy">Refund Policy</Link> for how
        historical charges are handled.
      </p>

      <h2>4. Future Changes</h2>
      <p>
        If we ever introduce paid features, they will be additions alongside what is free today,
        and we will publish the terms here before charging anyone. We will not retroactively put
        an existing published page behind a payment.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions can be sent to <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
