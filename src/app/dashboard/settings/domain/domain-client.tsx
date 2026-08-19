"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const REGISTRARS = [
  { name: "GoDaddy", url: "https://dcc.godaddy.com/manage/dns" },
  { name: "Namecheap", url: "https://ap.www.namecheap.com/Domains/DomainControlPanel" },
  { name: "Cloudflare", url: "https://dash.cloudflare.com" },
  { name: "Porkbun", url: "https://porkbun.com/account/domainsSpeedy" },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="shrink-0 rounded-lg px-1.5 py-0.5 text-xs text-rose-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function Modal({ title, subtitle, onClose, children }: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-rose-950/30 backdrop-blur-sm" />
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-rose-100 p-5">
          <div>
            <h2 className="text-base font-semibold text-rose-950">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-rose-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg px-2 py-1 text-rose-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function DnsRecordTable({ cnameTarget }: { cnameTarget: string }) {
  const rows = [
    { label: "Type", value: "CNAME", mono: true, copy: false },
    { label: "Name / Host", value: "www", mono: true, copy: false },
    { label: "Value / Points to", value: cnameTarget, mono: true, copy: true },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-rose-100 text-sm">
      {/* Stacked on phones: the target is long and a three-column grid at this
          width truncates it to something the owner cannot read or retype. */}
      <dl className="divide-y divide-rose-100 sm:hidden">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3 px-3 py-2">
            <dt className="w-28 shrink-0 pt-0.5 text-xs font-semibold text-rose-400">{row.label}</dt>
            <dd className="flex min-w-0 flex-1 items-start gap-1">
              <code className="break-all font-mono text-xs text-rose-900">{row.value}</code>
              {row.copy && <CopyButton text={row.value} label="CNAME target" />}
            </dd>
          </div>
        ))}
      </dl>

      <div className="hidden sm:block">
        <div className="grid grid-cols-3 gap-2 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-400">
          {rows.map((row) => (
            <span key={row.label}>{row.label}</span>
          ))}
        </div>
        <div className="grid grid-cols-3 items-start gap-2 px-3 py-2.5">
          <span className="font-mono text-xs font-bold text-rose-600">CNAME</span>
          <code className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-xs text-rose-900">www</code>
          <div className="flex min-w-0 items-start gap-1">
            <code className="break-all rounded bg-rose-50 px-1.5 py-0.5 font-mono text-xs text-rose-900">
              {cnameTarget}
            </code>
            <CopyButton text={cnameTarget} label="CNAME target" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpModal({ cnameTarget, onClose }: { cnameTarget: string; onClose: () => void }) {
  return (
    <Modal title="How to connect your domain" subtitle="Step by step — no technical skills needed" onClose={onClose}>
      <ol className="flex flex-col gap-5">
        {[
          {
            title: "Make sure you own the domain",
            body: (
              <>
                You need to have <strong>bought</strong>{" "}
                the domain already. Typing a name here doesn&apos;t reserve
                it — if you don&apos;t own one yet, buy it first at any registrar.
              </>
            ),
          },
          {
            title: "Log in to your registrar",
            body: <>That&apos;s wherever you bought the domain. Look for <strong>DNS</strong> or <strong>DNS settings</strong>.</>,
          },
          {
            title: "Add a CNAME record",
            body: (
              <>
                <p className="mb-2">In the DNS settings, add exactly this:</p>
                <DnsRecordTable cnameTarget={cnameTarget} />
              </>
            ),
          },
          {
            title: "Point the bare domain at it (optional)",
            body: (
              <>
                In your registrar&apos;s <strong>Redirect</strong> or <strong>Forwarding</strong> section — usually
                separate from DNS — forward the bare domain to the <code>www</code> version with a{" "}
                <strong>301 (permanent)</strong>{" "}
                redirect. This is what makes the address work when someone leaves
                off the &quot;www&quot;.
              </>
            ),
          },
          {
            title: "Come back and check",
            body: <>DNS can take a few minutes to a few hours to spread. Then press <strong>Check DNS</strong> — we handle the SSL certificate for you.</>,
          },
        ].map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
              {i + 1}
            </span>
            <div className="text-sm text-rose-700/80">
              <p className="font-semibold text-rose-900">{step.title}</p>
              <div className="mt-1">{step.body}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 border-t border-rose-100 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-rose-400">
          Jump to DNS settings
        </p>
        <div className="grid grid-cols-2 gap-2">
          {REGISTRARS.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50"
            >
              {r.name} <span className="text-rose-300">↗</span>
            </a>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function FindDomainModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  function search() {
    const domain = query.trim().replace(/^https?:\/\//i, "").split("/")[0];
    if (!domain) return;
    window.open(
      `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domain)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
  return (
    <Modal title="Find a domain" subtitle="Check whether the name you want is free" onClose={onClose}>
      <p className="text-sm text-rose-700/80">
        A domain of your own — like <strong>marryme.com</strong> — makes the invitation feel like yours. Type the
        name you have in mind and we&apos;ll check if it&apos;s available.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          className="field flex-1"
          placeholder="e.g. askingyouout.com"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          autoFocus
        />
        <button
          onClick={search}
          disabled={!query.trim()}
          className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Search ↗
        </button>
      </div>
      <p className="mt-3 text-xs text-rose-400">
        Opens a domain search in a new tab. Domains usually cost around $10–15 a year — whobela itself stays free.
      </p>
    </Modal>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm shadow-rose-100">{children}</section>;
}

function Badge({ tone, children }: { tone: "live" | "pending" | "warn"; children: React.ReactNode }) {
  const tones = {
    live: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    warn: "bg-red-100 text-red-700",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function DomainClient({
  username,
  rootDomain,
  cnameTarget,
  customDomain: initialDomain,
  verified: initialVerified,
  redirectVerified: initialRedirect,
}: {
  username: string;
  rootDomain: string;
  cnameTarget: string;
  customDomain: string | null;
  verified: boolean;
  redirectVerified: boolean;
}) {
  const [customDomain, setCustomDomain] = useState(initialDomain);
  const [verified, setVerified] = useState(initialVerified);
  const [redirectVerified, setRedirectVerified] = useState(initialRedirect);
  const [domainInput, setDomainInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notRegistered, setNotRegistered] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFind, setShowFind] = useState(false);
  const [editing, setEditing] = useState(false);

  const freeAddress = `${username}.${rootDomain}`;
  const wwwDomain = customDomain ? `www.${customDomain}` : "";

  async function connect(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/settings/domain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: domainInput.trim().toLowerCase() }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    setCustomDomain(data.datePage.customDomain);
    setVerified(false);
    setRedirectVerified(false);
    setNotRegistered(data.registered === false);
    setEditing(false);
    setDomainInput("");
    setMessage("Saved. Now add the DNS record below, then press Check DNS.");
  }

  async function checkDns() {
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/settings/domain/verify", { method: "POST" });
    const data = await res.json();
    setBusy(false);
    if (!res.ok || !data.verified) {
      setError(data.error ?? "Not verified yet");
      return;
    }
    setVerified(true);
    setRedirectVerified(Boolean(data.datePage?.customDomainRedirectVerifiedAt));
    setNotRegistered(false);
    setMessage("Your domain is live. ❤️");
  }

  async function remove() {
    if (!window.confirm(`Disconnect ${customDomain}? Your free ${freeAddress} address keeps working.`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/settings/domain", { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setError("Couldn't disconnect that domain");
      return;
    }
    setCustomDomain(null);
    setVerified(false);
    setRedirectVerified(false);
    setNotRegistered(false);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <div>
        <Link href="/dashboard/settings" className="text-sm text-rose-400 hover:text-rose-600">
          ← Settings
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-rose-950">Your address</h1>
        <p className="mt-1 text-sm text-rose-700/70">Choose the link you send to the person you&apos;re asking.</p>
      </div>

      {/* Free address — always works, no setup */}
      <Card>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-400">Your free address</h2>
          <Badge tone="live">Ready</Badge>
        </div>
        <p className="text-xs text-rose-400">This link works right now — nothing to set up.</p>
        <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2.5">
          <span className="flex-1 truncate font-mono text-sm text-rose-900">{freeAddress}</span>
          <CopyButton text={`https://${freeAddress}`} label="free address" />
          <a
            href={`https://${freeAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg px-1.5 py-0.5 text-xs text-rose-400 hover:text-rose-600"
          >
            Open ↗
          </a>
        </div>
      </Card>

      {/* Custom domain */}
      <Card>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-400">
            Your own domain <span className="font-normal normal-case tracking-normal text-rose-300">(optional)</span>
          </h2>
          {customDomain && <Badge tone={verified ? "live" : "pending"}>{verified ? "Live" : "Waiting for DNS"}</Badge>}
        </div>

        {!customDomain || editing ? (
          <>
            <p className="text-xs text-rose-400">
              Already own a domain? Point it here.{" "}
              <button onClick={() => setShowFind(true)} className="text-rose-500 underline underline-offset-2">
                Don&apos;t have one yet?
              </button>
            </p>
            <form onSubmit={connect} className="flex gap-2">
              <input
                className="field flex-1"
                placeholder="yourname.com"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                autoFocus={editing}
              />
              <button
                type="submit"
                disabled={busy || !domainInput.trim()}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save"}
              </button>
            </form>
            {editing && (
              <button onClick={() => setEditing(false)} className="w-fit text-xs text-rose-400 hover:text-rose-600">
                Cancel
              </button>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2.5">
              <span className="flex-1 truncate font-mono text-sm text-rose-900">{wwwDomain}</span>
              {verified && (
                <a
                  href={`https://${wwwDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg px-1.5 py-0.5 text-xs text-rose-400 hover:text-rose-600"
                >
                  Open ↗
                </a>
              )}
            </div>
            <div className="flex gap-3 text-xs">
              <button onClick={() => setEditing(true)} className="text-rose-500 hover:text-rose-700">
                Change
              </button>
              <button onClick={remove} disabled={busy} className="text-rose-400 hover:text-red-600 disabled:opacity-50">
                Disconnect
              </button>
            </div>
          </>
        )}

        {notRegistered && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            <p className="font-semibold">We can&apos;t find that domain.</p>
            <p className="mt-1">
              <strong>{customDomain}</strong> doesn&apos;t look registered yet — typing it here doesn&apos;t reserve
              it. You need to buy it first, then come back and add the DNS record.
            </p>
            <button onClick={() => setShowFind(true)} className="mt-2 font-semibold underline underline-offset-2">
              Check if it&apos;s available →
            </button>
          </div>
        )}
        {message && <p className="text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </Card>

      {/* DNS setup — only while a domain is connected but not live */}
      {customDomain && !verified && (
        <Card>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-400">Add this DNS record</h2>
            <button onClick={() => setShowHelp(true)} className="text-xs text-rose-500 hover:text-rose-700">
              How do I do this?
            </button>
          </div>

          <p className="text-xs text-rose-400">
            In your registrar&apos;s DNS settings, add this record. Then press Check DNS below.
          </p>
          <DnsRecordTable cnameTarget={cnameTarget} />

          <div className="rounded-xl bg-rose-50/60 p-3 text-xs text-rose-700/80">
            <p className="font-semibold text-rose-800">Optional: make {customDomain} work too</p>
            <p className="mt-1">
              A CNAME can&apos;t sit on the bare domain, so in your registrar&apos;s <strong>Redirect</strong> or{" "}
              <strong>Forwarding</strong> section, send <code>{customDomain}</code> to{" "}
              <code>{wwwDomain}</code> as a <strong>301</strong>. We detect it automatically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={checkDns}
              disabled={busy}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Checking…" : "Check DNS"}
            </button>
            <span className="text-xs text-rose-400">DNS can take a few minutes to a few hours.</span>
          </div>
        </Card>
      )}

      {/* Live state — show whether the bare domain also reaches them */}
      {customDomain && verified && (
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-400">Bare domain</h2>
          {redirectVerified ? (
            <p className="text-sm text-rose-700/80">
              <span className="font-semibold text-green-700">✓ Working.</span> Someone typing{" "}
              <code>{customDomain}</code> without the &quot;www&quot; still reaches your page.
            </p>
          ) : (
            <>
              <p className="text-sm text-rose-700/80">
                <code>{customDomain}</code> without the &quot;www&quot; doesn&apos;t reach your page yet. It&apos;s
                optional — but if you want it, add a <strong>301 redirect</strong> from{" "}
                <code>{customDomain}</code> to <code>{wwwDomain}</code> at your registrar.
              </p>
              <button
                onClick={checkDns}
                disabled={busy}
                className="w-fit rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 disabled:opacity-60"
              >
                {busy ? "Checking…" : "Check again"}
              </button>
            </>
          )}
        </Card>
      )}

      {showHelp && <HelpModal cnameTarget={cnameTarget} onClose={() => setShowHelp(false)} />}
      {showFind && <FindDomainModal onClose={() => setShowFind(false)} />}
    </div>
  );
}
