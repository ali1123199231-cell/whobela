import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "About — whobela",
  description: "What whobela is and why we built it.",
};

export default function AboutPage() {
  return (
    <LegalPage title="About Whobela" backHref="/" backLabel="Home">
      <p>
        Whobela helps you create personalized, interactive invitation pages to ask someone on
        a date — design a page, share your unique link, and let the other person respond,
        accept, and book a time, all in one place.
      </p>
      <p>
        We built Whobela because asking someone out should feel a little more special than a
        text message. Whobela is a technology platform: we provide the tools to create and
        share invitations, but we don&apos;t control or guarantee what happens after you hit
        send.
      </p>
      <p>
        Have feedback or a question? Reach us at{" "}
        <a href="mailto:support@whobela.com">support@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
