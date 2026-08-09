import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "AI / Automation Disclosure — whobela",
  description: "Whobela uses no AI and no automated decision-making. What little is automated, and what isn't.",
};

export default function AiDisclosurePage() {
  return (
    <LegalPage title="AI / Automation Disclosure" updated={LEGAL.lastUpdated}>
      <p>
        <strong>Whobela does not use artificial intelligence.</strong> There is no language
        model, no recommendation engine, no profiling, and no automated decision-making
        anywhere in the Service. This page exists to say so plainly, and to describe the
        ordinary automation that does exist.
      </p>

      <h2>1. What Is Automated</h2>
      <ul>
        <li>
          <strong>Emails.</strong> Account emails (verification, password reset) and booking
          emails (someone answered your invitation) are sent automatically when the event that
          triggers them happens.
        </li>
        <li>
          <strong>Push notifications.</strong> If you turn them on, the same events are also
          pushed to your browser.
        </li>
        <li>
          <strong>Rate limiting and lockouts.</strong> Repeated failed logins temporarily lock
          an account, and some endpoints limit how often they can be called. These are fixed
          rules protecting the Service, not judgments about you.
        </li>
      </ul>
      <p>That is the complete list.</p>

      <h2>2. What Is Not Automated</h2>
      <ul>
        <li>
          <strong>Content suggestions.</strong> The templates, date ideas, and question
          prompts on Whobela are written by hand and shown to everyone alike. Nothing is
          generated for you or selected based on your behaviour.
        </li>
        <li>
          <strong>Moderation.</strong> We do not run automated content scanning or abuse
          detection. Reports are read and acted on by a person — see our{" "}
          <a href="/legal/content-removal">Content Removal Policy</a>.
        </li>
        <li>
          <strong>Your photos.</strong> Uploaded images are stored exactly as you sent them.
          They are not resized, re-encoded, analysed, or scanned for content, and no facial
          recognition or other biometric processing is applied to them.
        </li>
        <li>
          <strong>Analytics.</strong> We run none. We do not measure how you use the product
          beyond the operational logs any web server keeps.
        </li>
      </ul>

      <h2>3. No Automated Decisions About You</h2>
      <p>
        Whobela makes no decisions about you by automated means — including the decisions
        described in Article 22 of the GDPR, which produce legal effects or similarly
        significantly affect a person. Account suspensions and content removals are decided by
        a person, and you can contest one by writing to us.
      </p>

      <h2>4. If This Changes</h2>
      <p>
        If we ever introduce AI-assisted features, we will update this page before they go
        live and explain what the system does, what it processes, and how to opt out where the
        law requires it.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions about automation can be sent to{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
      </p>
    </LegalPage>
  );
}
