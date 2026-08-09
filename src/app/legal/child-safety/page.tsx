import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Child Safety Standards — whobela",
  description: "Whobela is strictly for adults. Our standards on child safety, and how to report a concern.",
};

export default function ChildSafetyPage() {
  return (
    <LegalPage title="Child Safety Standards" updated={LEGAL.lastUpdated}>
      <p>
        Whobela is a tool for creating and sharing personal invitations, operated by{" "}
        {LEGAL.operatorName}. It is strictly for people aged 18 and over. We have zero
        tolerance for child sexual abuse and exploitation (CSAE) and for child sexual abuse
        material (CSAM). This page sets out the standards we hold ourselves to, how to report a
        concern, and what we do about it.
      </p>

      <h2>1. Whobela Is an Adults-Only Service</h2>
      <ul>
        <li>
          You must be at least 18 years old to create an account, and you are asked to confirm
          this when you sign up. It is a condition of our{" "}
          <Link href="/legal/terms">Terms &amp; Conditions</Link>.
        </li>
        <li>
          A Whobela page must not be about, or addressed to, anyone under 18 — whoever created
          it.
        </li>
        <li>
          If we determine that an account belongs to someone under 18, we terminate it and
          delete its data.
        </li>
      </ul>

      <h2>2. Prohibited Conduct</h2>
      <p>
        The following are banned outright, and we enforce this regardless of intent, context,
        or whether any real child was involved:
      </p>
      <ul>
        <li>
          Child sexual abuse material (CSAM) in any form, including photographs, drawings, and
          computer-generated or AI-generated imagery;
        </li>
        <li>Sexualising, grooming, soliciting, or attempting to meet a minor;</li>
        <li>Using Whobela while under 18, or helping a minor gain access to it;</li>
        <li>
          Creating an invitation page that is addressed to, or depicts, someone under 18 in a
          romantic or sexual context;
        </li>
        <li>
          Trafficking, extortion (including sexual extortion), or any other exploitation of a
          minor.
        </li>
      </ul>

      <h2>3. Reporting a Concern</h2>
      <p>
        Every invitation page carries a <strong>Report</strong> control, and one of its reasons
        is <em>&ldquo;It involves someone under 18&rdquo;</em>. You do not need a Whobela
        account to use it, you do not need to have answered the invitation, and you may report
        anonymously — giving us your email is optional and only used to reply to you.
      </p>
      <p>
        You can also email us directly at{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>. If you believe a
        child is in immediate danger, please contact your local emergency services first.
      </p>

      <h2>4. How We Respond</h2>
      <ul>
        <li>
          Reports naming child safety are flagged as such the moment they are filed and are
          reviewed ahead of all other reports.
        </li>
        <li>
          Every report is read by a person. We do not use automated systems to decide the
          outcome — see our <Link href="/legal/ai-disclosure">AI / Automation Disclosure</Link>.
        </li>
        <li>
          Where a report is substantiated, we remove the page, terminate the account, and block
          the person from creating another one.
        </li>
        <li>
          We report apparent child sexual abuse material and credible threats to a child to the
          relevant authorities, and preserve the associated data for them where the law
          requires it — including where that means retaining data we would otherwise delete.
        </li>
      </ul>

      <h2>5. Our Point of Contact</h2>
      <p>
        Child safety matters, including enquiries from regulators, law enforcement, or Google
        Play, should be directed to{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>, which is monitored by
        the operator named above.
      </p>

      <h2>6. Compliance</h2>
      <p>
        These standards are published to meet Google Play&apos;s Child Safety Standards policy
        and our obligations under applicable law. They sit alongside our{" "}
        <Link href="/legal/community-guidelines">Community Guidelines</Link>,{" "}
        <Link href="/legal/safety">Safety Policy</Link>, and{" "}
        <Link href="/legal/content-removal">Content Removal Policy</Link>.
      </p>
    </LegalPage>
  );
}
