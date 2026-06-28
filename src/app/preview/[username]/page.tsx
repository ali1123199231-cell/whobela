import type { Metadata } from "next";
import Link from "next/link";
import { PublicDatePage } from "@/components/date-page/public-page";

// Internal preview surface — never index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Local/dev fallback so the full recipient flow can be tested without
// wildcard subdomain DNS on localhost (middleware handles real subdomains
// in staging/production).
export default async function PreviewByUsernamePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return (
    <>
      <Link
        href="/"
        className="fixed left-3 top-3 z-50 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-rose-600 shadow-sm"
      >
        🌸 whobela
      </Link>
      <PublicDatePage username={username} />
    </>
  );
}
