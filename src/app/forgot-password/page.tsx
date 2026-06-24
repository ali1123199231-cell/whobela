"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setStage("reset");
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }
    router.push("/login");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-rose-50 px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-600">
          🌸 whobela
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-rose-100">
          {stage === "request" ? (
            <>
              <h1 className="text-2xl font-semibold text-rose-950">Reset your password</h1>
              <p className="mt-1 text-sm text-rose-700/70">Enter your email and we&apos;ll send you a reset code.</p>

              <form onSubmit={handleRequestCode} className="mt-6 flex flex-col gap-4">
                <input
                  type="email"
                  className="rounded-xl border border-rose-200 px-4 py-2 outline-none focus:border-rose-400"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send reset code"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-rose-950">Check your email</h1>
              <p className="mt-1 text-sm text-rose-700/70">
                If an account exists for <strong>{email}</strong>, we sent a 6-digit code.
              </p>

              <form onSubmit={handleResetPassword} className="mt-6 flex flex-col gap-4">
                <input
                  className="rounded-xl border border-rose-200 px-4 py-2 text-center text-lg tracking-widest outline-none focus:border-rose-400"
                  placeholder="000000"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
                <input
                  type="password"
                  className="rounded-xl border border-rose-200 px-4 py-2 outline-none focus:border-rose-400"
                  placeholder="New password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="-mt-2 text-xs text-rose-500">At least 8 characters, with a letter, a number, and a symbol.</p>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="mt-2 rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </form>

              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="mt-4 text-sm font-medium text-rose-600 underline disabled:no-underline disabled:text-rose-300"
              >
                {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
              </button>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-rose-700/70">
          <Link href="/login" className="font-medium text-rose-600">
            Back to log in
          </Link>
        </p>
      </div>
    </main>
  );
}
