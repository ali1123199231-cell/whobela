import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Data Processing Agreement — whobela",
  description: "DPA for business customers using whobela.",
};

export default function DpaPage() {
  return (
    <LegalPage title="Data Processing Agreement (DPA)" updated="[Insert Date]">
      <p>
        This Data Processing Agreement (&ldquo;<strong>DPA</strong>&rdquo;) forms part of the
        agreement between Whobela and any business or organizational customer
        (&ldquo;<strong>Customer</strong>&rdquo;) that uses Whobela in a way that involves
        Whobela processing personal data on the Customer&apos;s behalf, to the extent required
        by the GDPR or equivalent data protection law. Where Whobela is acting as controller
        of a User&apos;s or Visitor&apos;s personal data in the ordinary operation of the
        consumer-facing Service, this DPA does not apply, and our{" "}
        <Link href="/legal/privacy">Privacy Policy</Link> governs instead.
      </p>

      <h2>1. Roles</h2>
      <ul>
        <li><strong>Customer</strong> acts as the data controller for personal data it submits to or collects via the Service in a business context.</li>
        <li><strong>Whobela</strong> acts as the data processor, processing personal data only on behalf of, and under the instructions of, the Customer for the purposes of providing the Service.</li>
      </ul>

      <h2>2. Processing Instructions</h2>
      <p>
        Whobela will process personal data only as necessary to provide the Service, in
        accordance with the Customer&apos;s documented instructions, and as otherwise required
        by applicable law. If Whobela believes an instruction violates data protection law, it
        will inform the Customer before carrying it out.
      </p>

      <h2>3. Confidentiality</h2>
      <p>
        Whobela ensures that personnel authorized to process personal data are bound by
        appropriate confidentiality obligations.
      </p>

      <h2>4. Security Measures</h2>
      <p>Whobela implements appropriate technical and organizational measures to protect personal data, including:</p>
      <ul>
        <li>Encryption of data in transit;</li>
        <li>Access controls limiting personal data access to personnel who need it;</li>
        <li>Hashed storage of account passwords;</li>
        <li>Regular review and improvement of security practices;</li>
        <li>Monitoring and processes to detect and respond to security incidents.</li>
      </ul>

      <h2>5. Subprocessors</h2>
      <p>
        Whobela uses the following categories of subprocessors to provide the Service: hosting
        providers, payment processors (Stripe, PayPal), storage providers, analytics
        providers, and email delivery providers. Whobela ensures subprocessors are bound by
        data protection obligations consistent with this DPA, and will make reasonable efforts
        to notify Customers of material changes to subprocessors where required by law.
      </p>

      <h2>6. Data Subject Requests</h2>
      <p>
        Whobela will provide reasonable assistance to the Customer in responding to requests
        from data subjects exercising their rights under applicable data protection law, to
        the extent Whobela is able to do so.
      </p>

      <h2>7. Personal Data Breach</h2>
      <p>
        Whobela will notify the Customer without undue delay after becoming aware of a
        personal data breach affecting the Customer&apos;s data, and will provide reasonably
        available information to help the Customer meet its own notification obligations.
      </p>

      <h2>8. International Transfers</h2>
      <p>
        Where personal data is transferred outside the Customer&apos;s jurisdiction, Whobela
        will use appropriate safeguards as required by applicable data protection law (such as
        Standard Contractual Clauses).
      </p>

      <h2>9. Data Deletion</h2>
      <p>
        On termination of the Service, or upon Customer request, Whobela will delete or return
        personal data processed on the Customer&apos;s behalf, except to the extent retention
        is required by applicable law, consistent with the retention practices described in
        our <Link href="/legal/privacy">Privacy Policy</Link>.
      </p>

      <h2>10. Audits</h2>
      <p>
        Whobela will make available information reasonably necessary to demonstrate compliance
        with this DPA and will allow for audits, including inspections, conducted by the
        Customer or an auditor mandated by the Customer, subject to reasonable notice and
        confidentiality protections.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about this DPA can be sent to{" "}
        <a href="mailto:privacy@whobela.com">privacy@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
