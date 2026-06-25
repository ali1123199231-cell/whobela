import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy — whobela",
  description: "How whobela uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="[Insert Date]">
      <p>
        This Cookie Policy explains how Whobela uses cookies and similar technologies on
        whobela.com and on invitation pages hosted on our platform.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a website. They
        allow a site to remember information about your visit, such as your login state or
        preferences, and are widely used to make websites work, or work more efficiently, as
        well as to provide analytics.
      </p>

      <h2>2. Why We Use Cookies</h2>
      <p>We use cookies to:</p>
      <ul>
        <li>Keep you securely signed in to your account;</li>
        <li>Remember your preferences and settings;</li>
        <li>Understand how the Service is used so we can improve it;</li>
        <li>Protect the Service against fraud and abuse.</li>
      </ul>

      <h2>3. Types of Cookies We Use</h2>
      <h3>Essential cookies</h3>
      <p>
        Required for core functionality such as authentication, session management, and
        security. These cannot be disabled without affecting how the Service works.
      </p>
      <h3>Analytics cookies</h3>
      <p>
        Help us understand how Users and Visitors interact with Whobela, such as which pages
        are viewed and which features are used, so we can improve the product. These are used
        only with your consent where required by law.
      </p>
      <h3>Preference cookies</h3>
      <p>
        Remember choices you&apos;ve made, such as display settings or dismissed
        notifications, so you don&apos;t have to set them again on each visit.
      </p>

      <h2>4. Third-Party Cookies</h2>
      <p>
        Some cookies may be set by third-party services we use to operate or analyze the
        Service (for example, analytics or payment providers). These third parties have their
        own privacy and cookie policies, which govern their use of any data collected through
        their cookies.
      </p>

      <h2>5. Managing Cookies</h2>
      <p>
        You can control or delete cookies through your browser settings. Most browsers let you
        refuse cookies, delete existing cookies, or be notified when a cookie is set. Disabling
        essential cookies may prevent parts of the Service — such as staying logged in — from
        working correctly. Where required by law, we will provide a cookie consent banner
        allowing you to manage non-essential cookies when you first visit the site.
      </p>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in the cookies
        we use or for legal reasons. Material changes will be communicated through the
        Service.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about our use of cookies can be sent to{" "}
        <a href="mailto:privacy@whobela.com">privacy@whobela.com</a>.
      </p>
    </LegalPage>
  );
}
