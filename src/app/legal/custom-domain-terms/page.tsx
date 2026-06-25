import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Custom Domain Terms — whobela",
  description: "Rules for connecting a custom domain to whobela.",
};

export default function CustomDomainTermsPage() {
  return (
    <LegalPage title="Custom Domain Terms" updated="[Insert Date]">
      <p>
        These Custom Domain Terms apply if you connect a domain you own to your Whobela page
        as part of an eligible paid plan, and supplement our{" "}
        <Link href="/legal/terms">Terms &amp; Conditions</Link> and{" "}
        <Link href="/legal/subscription-terms">Subscription Terms</Link>.
      </p>

      <h2>1. Domain Ownership Responsibility</h2>
      <p>
        You are solely responsible for registering, owning, and maintaining any domain you
        connect to Whobela. You must have the legal right to use the domain you connect, and
        you confirm that connecting it to Whobela does not infringe any third party&apos;s
        rights.
      </p>

      <h2>2. DNS Requirements</h2>
      <p>
        To connect a custom domain, you must configure DNS records (such as CNAME or A
        records) at your domain registrar or DNS provider as instructed in your account
        settings. We are not responsible for delays, misconfigurations, or downtime caused by
        incorrect DNS settings, your registrar, or your DNS provider.
      </p>

      <h2>3. SSL</h2>
      <p>
        Where supported, Whobela will attempt to automatically provision and renew an SSL/TLS
        certificate for your connected custom domain so that it can be served securely over
        HTTPS. Certificate issuance depends on correct DNS configuration and availability of
        our certificate provider, and may occasionally fail or be delayed for reasons outside
        our control.
      </p>

      <h2>4. Abuse Prevention</h2>
      <p>
        You must not connect a domain to Whobela for any purpose that violates our{" "}
        <Link href="/legal/terms">Terms &amp; Conditions</Link> or{" "}
        <Link href="/legal/community-guidelines">Community Guidelines</Link>, including using a
        custom domain to impersonate another entity, distribute harmful content, or evade
        enforcement action taken against your Whobela-hosted page.
      </p>

      <h2>5. Removal Rights</h2>
      <p>We may disconnect or refuse to provision a custom domain, with or without notice, if:</p>
      <ul>
        <li>The domain or the content served through it violates our policies or applicable law;</li>
        <li>We detect abuse, fraud, or security risks associated with the domain;</li>
        <li>Your subscription plan no longer includes custom domain access;</li>
        <li>Continued connection creates technical, legal, or security risk to the Service.</li>
      </ul>

      <h2>6. No Domain Registration Services</h2>
      <p>
        Whobela is not a domain registrar. We do not sell, register, or renew domains on your
        behalf. Any dispute regarding domain ownership or registration must be resolved
        directly with your domain registrar.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about custom domains can be sent to{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
