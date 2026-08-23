import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookie Policy — whobela",
  description: "How whobela uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated={LEGAL.lastUpdated}>
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

      <h2>2. What We Actually Use</h2>
      <p>
        Very little. Whobela sets <strong>one cookie</strong>, and uses your browser&apos;s
        local storage for two purposes. We run no analytics service, no advertising tags, and
        nothing that follows you to other websites.
      </p>

      <h2>3. The One Cookie</h2>
      <h3>Your session cookie</h3>
      <p>
        Set when you log in, and it is what keeps you signed in as you move between pages. It
        is strictly necessary for the Service to work, so it does not require consent — but it
        is only ever set once you have chosen to log in. Logging out clears it.
      </p>
      <p>
        Visitors who open an invitation page and never log in are not given a cookie at all.
      </p>
      <h3>Similar technologies (local storage)</h3>
      <p>
        Alongside cookies we use your browser&apos;s local storage to record, on your first
        visit, how you arrived at Whobela — the referring site and any campaign parameters in
        the link you followed, together with the first page you landed on. If you later create
        an account, that record is attached to it so we can understand which channels bring
        people to the Service. It holds no information about you personally, is never sold or
        shared with advertisers, and clearing your browser storage removes it.
      </p>
      <p>
        We also use local storage to remember if you dismiss the banner offering our Android
        app, so that it stays dismissed for thirty days rather than reappearing on every page.
        It records only that you closed it, and the date.
      </p>

      <h3>Counting taps on the Android app link</h3>
      <p>
        Links to our app on Google Play pass through our own server so we can count how many
        people tap them, and whether they were using an Android phone, an iPhone or a
        computer. That count is anonymous: we record the button, that coarse device type and
        the time, and nothing else. No cookie is set, nothing is stored in your browser, your
        IP address is not recorded, and the figures never leave our own systems. We do this to
        see whether the app is worth continuing to build — including whether enough people on
        iPhones want one to justify making it.
      </p>

      <h2>4. Third-Party Cookies</h2>
      <p>
        None. No third party sets a cookie through Whobela. We previously ran a Google Ads
        conversion tag on the site; it was removed on {LEGAL.lastUpdated}, along with the
        cookies it set.
      </p>

      <h2>5. Managing Cookies</h2>
      <p>
        You can control or delete cookies through your browser settings, and clear local
        storage the same way. Because the only cookie we set is the one keeping you signed in,
        refusing it means you will not be able to stay logged in — but you can still open and
        answer an invitation page.
      </p>
      <p>
        We do not show a cookie consent banner, because we do not set anything that requires
        consent. If that changes, we will ask before setting it.
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
