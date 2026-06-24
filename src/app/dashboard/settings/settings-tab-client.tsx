"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "../logout-button";

type Subscription = { status: string; provider: string } | null;

export function SettingsTabClient({
  email: initialEmail,
  emailNotificationsEnabled: initialNotifications,
  username,
  customDomain: initialDomain,
  customDomainVerified: initialVerified,
  serverIp,
  subscription,
  bypassBilling,
  isShowcase,
}: {
  email: string;
  emailNotificationsEnabled: boolean;
  username: string;
  customDomain: string | null;
  customDomainVerified: boolean;
  serverIp: string | null;
  subscription: Subscription;
  bypassBilling: boolean;
  isShowcase: boolean;
}) {
  const router = useRouter();
  const isActive = subscription?.status === "ACTIVE";

  // Notifications
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(initialNotifications);

  // Custom domain
  const [domainInput, setDomainInput] = useState(initialDomain ?? "");
  const [customDomain, setCustomDomain] = useState(initialDomain);
  const [domainVerified, setDomainVerified] = useState(initialVerified);
  const [domainMessage, setDomainMessage] = useState<string | null>(null);
  const [domainBusy, setDomainBusy] = useState(false);
  const [domainVerifyFailed, setDomainVerifyFailed] = useState(false);

  // Account security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  async function toggleNotifications(checked: boolean) {
    setEmailNotificationsEnabled(checked);
    await fetch("/api/settings/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailNotificationsEnabled: checked }),
    });
  }

  async function handleConnectDomain(e: React.FormEvent) {
    e.preventDefault();
    setDomainBusy(true);
    setDomainMessage(null);
    const res = await fetch("/api/settings/domain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: domainInput.trim().toLowerCase() }),
    });
    const data = await res.json().catch(() => ({}));
    setDomainBusy(false);
    if (res.ok) {
      setCustomDomain(data.datePage.customDomain);
      setDomainVerified(false);
      setDomainVerifyFailed(false);
      setDomainMessage("Domain connected — now point its DNS at the address below and verify.");
    } else {
      setDomainMessage(data.error ?? "Something went wrong");
    }
  }

  async function handleVerifyDomain() {
    setDomainBusy(true);
    setDomainMessage(null);
    const res = await fetch("/api/settings/domain/verify", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setDomainBusy(false);
    if (res.ok) {
      setDomainVerified(true);
      setDomainVerifyFailed(false);
      setDomainMessage("Verified! Your page is live on this domain. ❤️");
    } else {
      setDomainVerifyFailed(true);
      setDomainMessage(data.error ?? "Verification failed");
    }
  }

  async function handleRemoveDomain() {
    setDomainBusy(true);
    setDomainMessage(null);
    const res = await fetch("/api/settings/domain", { method: "DELETE" });
    setDomainBusy(false);
    if (res.ok) {
      setCustomDomain(null);
      setDomainVerified(false);
      setDomainVerifyFailed(false);
      setDomainInput("");
      setDomainMessage(null);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);
    const res = await fetch("/api/settings/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setPasswordMessage("Password updated ❤️");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setPasswordMessage(data.error ?? "Something went wrong");
    }
  }

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailMessage(null);
    const res = await fetch("/api/settings/email", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: emailCurrentPassword, newEmail }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setEmail(newEmail);
      setEmailMessage("Email updated ❤️");
      setEmailCurrentPassword("");
      setNewEmail("");
    } else {
      setEmailMessage(data.error ?? "Something went wrong");
    }
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleteMessage(null);
    const res = await fetch("/api/settings/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameConfirmation: deleteConfirmation }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      router.push("/login");
      router.refresh();
    } else {
      setDeleteMessage(data.error ?? "Something went wrong");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-rose-950">Settings</h1>

      <Section title="Subscription">
        {isActive ? (
          <p className="font-semibold text-rose-600">You are subscribed ❤️ via {subscription?.provider}</p>
        ) : isShowcase ? (
          <p className="text-sm text-rose-700/70">This is the showcase account — it stays live without subscribing.</p>
        ) : bypassBilling ? (
          <p className="text-sm text-rose-700/70">
            Billing bypass is enabled for local development — your page stays live without subscribing.
          </p>
        ) : (
          <p className="text-sm text-rose-700/70">
            Your page stays live for <strong>30 minutes</strong> after you first publish it. Subscribe for{" "}
            <strong>$2.99/month</strong> to keep it running after that.
          </p>
        )}
        <Link
          href="/dashboard/billing"
          className="mt-1 w-fit rounded-full border border-rose-300 bg-white px-4 py-1.5 text-sm font-semibold text-rose-600"
        >
          Manage billing
        </Link>
      </Section>

      <Section title="Custom domain">
        <p className="text-sm text-rose-700/70">
          Use your own domain (e.g. <code>yourname.com</code>) instead of{" "}
          <code>{username}.whobela.com</code>. Included with your subscription.
        </p>

        {!customDomain ? (
          <form onSubmit={handleConnectDomain} className="mt-3 flex gap-2">
            <input
              className="field flex-1"
              placeholder="yourname.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={domainBusy || !domainInput.trim()}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Connect
            </button>
          </form>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-rose-900">{customDomain}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  domainVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {domainVerified ? "Verified & live" : "Pending DNS"}
              </span>
            </div>
            {!domainVerified && (
              <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700/80">
                <p className="font-semibold text-rose-800">How to connect {customDomain}:</p>
                <ol className="mt-2 list-decimal space-y-1.5 pl-4">
                  <li>Log into your domain registrar (where you bought the domain) and find its DNS settings.</li>
                  <li>
                    Add a new <strong>A record</strong> — Host/Name: <code>@</code>, Value/Points to:{" "}
                    <strong>{serverIp ?? "your server's IP (not configured in this environment)"}</strong>.
                  </li>
                  <li>
                    Want <code>www.{customDomain}</code> to work too? Add a second <strong>A record</strong> with
                    Host/Name <code>www</code> pointing at the same address.
                  </li>
                  <li>DNS changes can take a few minutes to a few hours to take effect.</li>
                  <li>Come back here and click Verify.</li>
                </ol>
                {domainVerifyFailed && (
                  <p className="mt-2 text-rose-600">
                    Still not verifying? Double-check the record type is <strong>A</strong> (not AAAA or CNAME) and
                    that there&apos;s only one A record for that host.
                  </p>
                )}
              </div>
            )}
            <div className="flex gap-3">
              {!domainVerified && (
                <button
                  onClick={handleVerifyDomain}
                  disabled={domainBusy}
                  className="w-fit rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {domainBusy ? "Checking..." : "Verify"}
                </button>
              )}
              <button onClick={handleRemoveDomain} disabled={domainBusy} className="text-sm text-rose-400">
                Remove domain
              </button>
            </div>
          </div>
        )}
        {domainMessage && <p className="mt-2 text-sm text-rose-600">{domainMessage}</p>}
      </Section>

      <Section title="Notifications">
        <label className="flex items-center gap-2 text-sm font-medium text-rose-800">
          <input
            type="checkbox"
            checked={emailNotificationsEnabled}
            onChange={(e) => toggleNotifications(e.target.checked)}
          />
          Email me when someone says yes
        </label>
      </Section>

      <Section title="Account security">
        <form onSubmit={handleChangePassword} className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-rose-800">Change password</p>
          <input
            type="password"
            className="field"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            className="field"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="text-xs text-rose-500">At least 8 characters, with a letter, a number, and a symbol.</p>
          <button type="submit" className="w-fit rounded-full border border-rose-300 px-4 py-1.5 text-sm font-semibold text-rose-600">
            Update password
          </button>
          {passwordMessage && <p className="text-sm text-rose-600">{passwordMessage}</p>}
        </form>

        <form onSubmit={handleChangeEmail} className="mt-6 flex flex-col gap-2">
          <p className="text-sm font-semibold text-rose-800">Change email ({email})</p>
          <input
            type="password"
            className="field"
            placeholder="Current password"
            value={emailCurrentPassword}
            onChange={(e) => setEmailCurrentPassword(e.target.value)}
          />
          <input
            type="email"
            className="field"
            placeholder="New email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button type="submit" className="w-fit rounded-full border border-rose-300 px-4 py-1.5 text-sm font-semibold text-rose-600">
            Update email
          </button>
          {emailMessage && <p className="text-sm text-rose-600">{emailMessage}</p>}
        </form>

        <form onSubmit={handleDeleteAccount} className="mt-6 flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">Delete account</p>
          <p className="text-sm text-red-600">
            This permanently deletes your account, page, photos, and responses. Type{" "}
            <strong>{username}</strong> to confirm.
          </p>
          <input
            className="field"
            placeholder={username}
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
          <button
            type="submit"
            disabled={deleteConfirmation !== username}
            className="w-fit rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Delete my account
          </button>
          {deleteMessage && <p className="text-sm text-red-600">{deleteMessage}</p>}
        </form>
      </Section>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm shadow-rose-100">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-rose-400">{title}</h2>
      {children}
    </section>
  );
}
