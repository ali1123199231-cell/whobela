"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-rose-50 px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 inline-block rounded-full bg-rose-100 px-4 py-1 text-sm font-medium text-rose-600">
          🌸 whobela
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-rose-100">
          <h1 className="text-2xl font-semibold text-rose-950">Welcome back</h1>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <input
              type="email"
              className="rounded-xl border border-rose-200 px-4 py-2 outline-none focus:border-rose-400"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              className="rounded-xl border border-rose-200 px-4 py-2 outline-none focus:border-rose-400"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="font-medium text-rose-500">
              Forgot password?
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-rose-700/70">
          New here?{" "}
          <Link href="/signup" className="font-medium text-rose-600">
            Create your date page
          </Link>
        </p>
      </div>
    </main>
  );
}
