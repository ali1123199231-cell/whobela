"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { reportConversion } from "@/lib/gtag";

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  if (base.length >= 3) return base;
  return (base + Math.floor(100 + Math.random() * 900)).slice(0, 30);
}

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [manualUsername, setManualUsername] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [checkedUsername, setCheckedUsername] = useState<string | null>(null);
  const [checkedAvailable, setCheckedAvailable] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const checkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const username = usernameTouched ? manualUsername : (firstName ? slugify(firstName) : "");

  useEffect(() => {
    if (checkTimeout.current) clearTimeout(checkTimeout.current);
    if (!username || username.length < 3) return;
    checkTimeout.current = setTimeout(async () => {
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
      const data = await res.json().catch(() => ({ available: false }));
      setCheckedUsername(username);
      setCheckedAvailable(Boolean(data.available));
      setSuggestions(
        data.available
          ? []
          : [
              `${username}${Math.floor(10 + Math.random() * 89)}`,
              `${username}${Math.floor(10 + Math.random() * 89)}`,
            ]
      );
    }, 400);
    return () => {
      if (checkTimeout.current) clearTimeout(checkTimeout.current);
    };
  }, [username]);

  const isLongEnough = username.length >= 3;
  const isChecking = isLongEnough && checkedUsername !== username;
  const isAvailable = isLongEnough && checkedUsername === username && checkedAvailable === true;
  const isTaken = isLongEnough && checkedUsername === username && checkedAvailable === false;

  function pickSuggestion(suggestion: string) {
    setUsernameTouched(true);
    setManualUsername(suggestion);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, username, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }
    reportConversion("AW-18015500784/SVoYCIqh57McEPDzuo5D");
    router.push("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-rose-50 px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-600">
          🌸 whobela
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-rose-100">
          <h1 className="text-2xl font-semibold text-rose-950">Create your account</h1>
          <p className="mt-1 text-sm text-rose-700/70">Start building your date page ❤️</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-1">
            <input
              className="rounded-xl border border-rose-200 px-4 py-2 outline-none focus:border-rose-400"
              placeholder="First name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              className="mt-3 rounded-xl border border-rose-200 px-4 py-2 outline-none focus:border-rose-400"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => {
                setUsernameTouched(true);
                setManualUsername(e.target.value.toLowerCase());
              }}
            />
            <p className="mt-1 text-xs text-rose-500">
              Your page will live at <strong>{username || "yourname"}.whobela.com</strong>
              {isChecking && " · checking availability..."}
              {isAvailable && " · available ✓"}
              {isTaken && " · already taken"}
            </p>
            {isTaken && suggestions.length > 0 && (
              <div className="mt-1 flex gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => pickSuggestion(s)}
                    className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <input
              type="email"
              className="mt-3 rounded-xl border border-rose-200 px-4 py-2 outline-none focus:border-rose-400"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="mt-3 rounded-xl border border-rose-200 px-4 py-2 outline-none focus:border-rose-400"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-rose-500">At least 8 characters, with a letter, a number, and a symbol.</p>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <p className="mt-3 text-xs text-rose-500">
              By creating an account, you agree to our{" "}
              <Link href="/legal/terms" className="font-medium text-rose-600 underline">
                Terms
              </Link>{" "}
              &{" "}
              <Link href="/legal/community-guidelines" className="font-medium text-rose-600 underline">
                Community Guidelines
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create your date page"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-rose-700/70">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-rose-600">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
