"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "../logout-button";
import { PushToggle } from "@/components/push-toggle";
import { InstallApp } from "@/components/install-app";

export function SettingsTabClient({
  email: initialEmail,
  emailNotificationsEnabled: initialNotifications,
  username,
  customDomain: initialDomain,
  customDomainVerified: initialVerified,
  vapidPublicKey,
  inApp,
}: {
  email: string;
  emailNotificationsEnabled: boolean;
  username: string;
  customDomain: string | null;
  customDomainVerified: boolean;
  vapidPublicKey: string | null;
  inApp?: boolean;
}) {
  const router = useRouter();

  // Notifications
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(initialNotifications);

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

      <Section title="Your address">
        <p className="text-sm text-rose-700/70">
          Your page is live at <code>{username}.whobela.com</code>
          {initialDomain ? <> and <code>www.{initialDomain}</code></> : null}.
        </p>
        <Link
          href="/dashboard/settings/domain"
          className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
        >
          <span>
            {initialDomain
              ? initialVerified
                ? "Your own domain is live"
                : "Finish connecting your domain"
              : "Use your own domain instead"}
          </span>
          <span className="text-rose-300">›</span>
        </Link>
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
        <div className="text-sm font-medium">
          {/* The WebView has no Notification API, so this could only ever
              report that it cannot work. The app has its own control. */}
          {!inApp && <PushToggle vapidPublicKey={vapidPublicKey} />}
          {inApp && (
            <p className="text-sm text-rose-700/80">
              Notifications are handled by the app — turn them on in Settings.
            </p>
          )}
        </div>
      </Section>

      <Section title="Get the app">
        <p className="text-sm text-rose-700/70">
          Install Whobela on your phone to open your page in one tap and get answers the moment
          they arrive.
        </p>
        {!inApp && <InstallApp />}
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
