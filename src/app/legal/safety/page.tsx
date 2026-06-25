import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Safety Policy — whobela",
  description: "Practical safety guidance for meeting people through whobela.",
};

export default function SafetyPage() {
  return (
    <LegalPage title="Safety Policy" updated="[Insert Date]">
      <p>
        Whobela is a tool for creating and sharing romantic invitations — meeting new people
        always carries some personal risk, whether arranged online or offline. This page
        offers practical guidance to help you stay safe. It does not replace your own
        judgment, and Whobela cannot guarantee the safety of any interaction.
      </p>

      <h2>1. Meeting Strangers</h2>
      <ul>
        <li>Choose a public place for a first in-person meeting, especially when meeting someone you connected with through an invitation page;</li>
        <li>Arrange your own transportation to and from the meeting rather than relying on the other person;</li>
        <li>Tell a friend or family member where you&apos;re going, who you&apos;re meeting, and when you expect to be back;</li>
        <li>Stay sober enough to make clear decisions, and trust your instincts — it&apos;s always okay to leave if something feels wrong.</li>
      </ul>

      <h2>2. Protecting Personal Information</h2>
      <ul>
        <li>Avoid sharing sensitive details — such as your home address, workplace, financial information, or government ID — with someone you&apos;ve just met through the platform;</li>
        <li>Use the contact information features built into Whobela rather than immediately sharing personal phone numbers or addresses, where possible;</li>
        <li>Be cautious of anyone who pressures you to share personal or financial information quickly.</li>
      </ul>

      <h2>3. Public Sharing</h2>
      <ul>
        <li>Remember that an invitation page link can potentially be shared further by anyone who receives it, unless you&apos;ve restricted access using available privacy settings;</li>
        <li>Only include information on a page that you&apos;re comfortable being seen by people beyond your intended recipient;</li>
        <li>Review your privacy settings before sending a link, especially if the page contains personal photos or details.</li>
      </ul>

      <h2>4. Online Interactions</h2>
      <ul>
        <li>Be alert to inconsistencies in what someone tells you about themselves — this can be a sign of a fake identity;</li>
        <li>Be wary of anyone who asks you for money, gift cards, or financial assistance, however the request is framed;</li>
        <li>Don&apos;t click links or download files sent by people you don&apos;t know and trust.</li>
      </ul>

      <h2>5. Reporting Problems</h2>
      <p>
        If you experience or witness harassment, suspected fraud, fake identities, or any
        behavior that makes you feel unsafe, report it immediately:
      </p>
      <ul>
        <li>Use the in-product reporting tool where available;</li>
        <li>Email <a href="mailto:support@whobela.com">support@whobela.com</a> with details and any relevant screenshots or links;</li>
        <li>If you are in immediate danger, contact local emergency services before contacting us.</li>
      </ul>

      <h2>6. Contact</h2>
      <p>
        Safety concerns and reports can be sent to{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
