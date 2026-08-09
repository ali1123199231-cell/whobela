"use client";

import { useState } from "react";

// Ordered by how likely each is to matter rather than alphabetically, with the
// child-safety option given its own wording so a reporter doesn't have to decide
// whether it counts as "sexual content" — the category that most needs to be
// easy to pick is the one people hesitate over.
const REASONS = [
  { value: "HARASSMENT", label: "It's harassing, threatening, or unwanted" },
  { value: "IMPERSONATION", label: "It's pretending to be someone else" },
  { value: "SEXUAL_CONTENT", label: "It contains sexual or explicit content" },
  { value: "CHILD_SAFETY", label: "It involves someone under 18" },
  { value: "SPAM", label: "It's spam or a scam" },
  { value: "OTHER", label: "Something else" },
] as const;

export function ReportDialog({ username, onClose }: { username?: string; onClose: () => void }) {
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setError("Please choose what's wrong");
      return;
    }
    setError(null);
    setSending(true);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, reason, details, reporterEmail }),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Couldn't send that report. Please email support@whobela.com.");
      return;
    }
    setSent(true);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Report this page"
    >
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
        {sent ? (
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-xl font-semibold text-rose-950">Thank you for telling us</h2>
            <p className="text-sm text-rose-700/80">
              We&apos;ve received your report and a person will read it. Reports involving
              someone under 18 are reviewed first.
            </p>
            <p className="text-sm text-rose-700/80">
              If you&apos;re in immediate danger, please contact your local emergency services.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-rose-500 px-6 py-2.5 font-semibold text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold text-rose-950">Report this page</h2>
              <p className="mt-1 text-sm text-rose-700/70">
                You don&apos;t need an account, and you can stay anonymous.
              </p>
            </div>

            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-sm font-medium text-rose-900">What&apos;s wrong?</legend>
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-rose-100 px-3 py-2 text-sm text-rose-800 transition hover:bg-rose-50 has-[:checked]:border-rose-300 has-[:checked]:bg-rose-50"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="mt-0.5 flex-none accent-rose-500"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </fieldset>

            <label className="flex flex-col gap-1 text-sm font-medium text-rose-900">
              Anything else we should know?
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={2000}
                className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-normal outline-none focus:border-rose-400"
                placeholder="Optional"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-rose-900">
              Your email, if you&apos;d like a reply
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-normal outline-none focus:border-rose-400"
                placeholder="Optional"
              />
            </label>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-rose-200 px-5 py-2.5 font-medium text-rose-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 rounded-full bg-rose-500 px-5 py-2.5 font-semibold text-white disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
