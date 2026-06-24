"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function VerifyEmailClient({
  email,
  initialNow,
  cooldownRemainingMs,
}: {
  email: string;
  initialNow: number;
  cooldownRemainingMs: number;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  // Seeded from the server's clock (via prop) rather than calling Date.now()
  // in the initializer, to avoid a hydration mismatch in the countdown below.
  const [now, setNow] = useState(initialNow);
  const [cooldownEndsAt] = useState(initialNow + cooldownRemainingMs);

  useEffect(() => {
    if (now >= cooldownEndsAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [now, cooldownEndsAt]);

  const cooldownSecondsLeft = Math.max(0, Math.ceil((cooldownEndsAt - now) / 1000));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }
    router.push("/dashboard/page");
    router.refresh();
  }

  async function handleResend() {
    setResending(true);
    setResendMessage(null);
    setError(null);
    const res = await fetch("/api/auth/resend-verification", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setResending(false);
    if (res.ok) {
      setResendMessage("New code sent ❤️");
      setNow(Date.now());
    } else {
      setResendMessage(data.error ?? "Something went wrong");
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-rose-50 px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-600">
          🌸 whobela
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-rose-100">
          <h1 className="text-2xl font-semibold text-rose-950">Check your email</h1>
          <p className="mt-1 text-sm text-rose-700/70">
            We sent a 6-digit code to <strong>{email}</strong>.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <input
              className="rounded-xl border border-rose-200 px-4 py-2 text-center text-lg tracking-widest outline-none focus:border-rose-400"
              placeholder="000000"
              inputMode="numeric"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="mt-2 rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-rose-700/70">
            <button
              onClick={handleResend}
              disabled={resending || cooldownSecondsLeft > 0}
              className="font-medium text-rose-600 underline disabled:no-underline disabled:text-rose-300"
            >
              {cooldownSecondsLeft > 0 ? `Resend code (${cooldownSecondsLeft}s)` : resending ? "Sending..." : "Resend code"}
            </button>
            {resendMessage && <p className="mt-2 text-rose-600">{resendMessage}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
