import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Accessibility Statement — whobela",
  description: "whobela's commitment to accessibility.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement" updated="[Insert Date]">
      <p>
        Whobela is committed to making our platform usable by as many people as possible,
        including people with disabilities.
      </p>

      <h2>1. Our Commitment</h2>
      <p>
        We aim to design Whobela to be accessible across a range of devices and abilities, and
        we continually work to improve usability for everyone, including people who rely on
        assistive technology.
      </p>

      <h2>2. Mobile Accessibility</h2>
      <p>
        Whobela is built mobile-first. We aim to ensure that core flows — creating an account,
        building a page, sharing a link, and responding to an invitation — work well on small
        screens, with readable text sizes, adequate touch-target spacing, and support for
        standard mobile accessibility features provided by your device&apos;s operating
        system.
      </p>

      <h2>3. Usability Improvements</h2>
      <p>
        We are working toward aligning with recognized accessibility standards such as the Web
        Content Accessibility Guidelines (WCAG), including improvements such as sufficient
        color contrast, keyboard navigability, descriptive alt text for images where
        applicable, and clear form labeling. Accessibility is an ongoing effort, and we
        welcome feedback on areas where we can do better.
      </p>

      <h2>4. Contact</h2>
      <p>
        If you experience an accessibility barrier while using Whobela, or have suggestions
        for improvement, please contact{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>. We will do our best to
        address the issue and respond to your feedback.
      </p>
    </LegalPage>
  );
}
