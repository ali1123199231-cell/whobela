import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "AI / Automation Disclosure — whobela",
  description: "Where and how whobela uses automated systems.",
};

export default function AiDisclosurePage() {
  return (
    <LegalPage title="AI / Automation Disclosure" updated="[Insert Date]">
      <p>
        Whobela uses automated systems in limited parts of the Service. This page explains
        where and how, so you have a clear picture of what is automated and what is not.
      </p>

      <h2>1. Personalization</h2>
      <p>
        We may use automated logic to suggest page layouts, design options, or content prompts
        based on the information you provide, to help you build your invitation page more
        quickly. These are suggestions only — you control the final content and design of your
        page.
      </p>

      <h2>2. Recommendations</h2>
      <p>
        Where Whobela surfaces recommendations (for example, template or feature suggestions),
        these are generated using automated rules or models based on your usage and
        preferences, and are not a substitute for your own judgment.
      </p>

      <h2>3. Analytics</h2>
      <p>
        We use automated analytics tools to understand aggregate usage patterns, such as page
        views and feature engagement, in order to improve the product. This processing does
        not involve automated decisions that produce legal effects or otherwise significantly
        affect you.
      </p>

      <h2>4. Automated Features</h2>
      <p>Certain operational features are automated, including:</p>
      <ul>
        <li>Email notifications triggered by account or booking activity;</li>
        <li>Spam and abuse detection signals used to flag potentially violating content for review;</li>
        <li>Image processing (such as resizing or formatting) applied to uploaded photos.</li>
      </ul>
      <p>
        Where automated abuse-detection signals are used, decisions that affect your account
        (such as suspension) involve human review before being finalized, except in cases of
        clear, high-confidence policy violations where immediate action is necessary to
        protect users.
      </p>

      <h2>5. No Fully Automated Profiling Decisions</h2>
      <p>
        Whobela does not use fully automated processing to make decisions about you that
        produce legal effects or similarly significant effects without the possibility of
        human review, as described under GDPR Article 22.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about our use of automation can be sent to{" "}
        <a href="mailto:privacy@whobela.com">privacy@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
