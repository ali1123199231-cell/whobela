import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE, siteOrigin } from "@/lib/seo/site";
import { AttributionTracker } from "@/components/attribution-tracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: "whobela — Create a magical way to ask someone out",
    template: "%s",
  },
  description: SITE.defaultDescription,
  applicationName: SITE.name,
  robots: { index: true, follow: true },
  // iOS has no manifest support worth relying on: the home-screen icon and the
  // standalone behaviour both come from these instead.
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  icons: { apple: "/apple-touch-icon.png" },
  openGraph: {
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: SITE.twitter },
};

// Tints the browser chrome on Android to match the app, so an installed
// Whobela doesn't sit under a stock white bar.
export const viewport: Viewport = {
  themeColor: "#e11d48",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AttributionTracker />
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18015500784"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18015500784');`}
        </Script>
      </body>
    </html>
  );
}
