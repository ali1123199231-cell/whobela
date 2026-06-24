"use client";

import { useState } from "react";

export type BookerInfo = {
  recipientName: string;
  instagram: string;
  whatsapp: string;
  facebook: string;
  phone: string;
  email: string;
  recipientMessage: string;
};

export function BookerStep({ onContinue }: { onContinue: (info: BookerInfo) => void }) {
  const [info, setInfo] = useState<BookerInfo>({
    recipientName: "",
    instagram: "",
    whatsapp: "",
    facebook: "",
    phone: "",
    email: "",
    recipientMessage: "",
  });
  const [error, setError] = useState<string | null>(null);

  function hasContact() {
    return [info.instagram, info.whatsapp, info.facebook, info.phone, info.email].some(
      (v) => v.trim().length > 0
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!info.recipientName.trim()) {
      setError("Your name is required");
      return;
    }
    if (!hasContact()) {
      setError("Add at least one way to reach you");
      return;
    }
    setError(null);
    onContinue(info);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-10 text-center"
    >
      <h1 className="text-2xl font-semibold text-rose-950">Almost there!</h1>
      <p className="text-rose-700/70">Just need a way to reach you 💌</p>

      <input
        className="field w-full max-w-xs"
        placeholder="Your name"
        value={info.recipientName}
        onChange={(e) => setInfo({ ...info, recipientName: e.target.value })}
      />
      <input
        className="field w-full max-w-xs"
        placeholder="Instagram"
        value={info.instagram}
        onChange={(e) => setInfo({ ...info, instagram: e.target.value })}
      />
      <input
        className="field w-full max-w-xs"
        placeholder="WhatsApp"
        value={info.whatsapp}
        onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
      />
      <input
        className="field w-full max-w-xs"
        placeholder="Phone"
        value={info.phone}
        onChange={(e) => setInfo({ ...info, phone: e.target.value })}
      />
      <input
        className="field w-full max-w-xs"
        placeholder="Email"
        value={info.email}
        onChange={(e) => setInfo({ ...info, email: e.target.value })}
      />
      <textarea
        className="field w-full max-w-xs"
        rows={2}
        placeholder="Can't wait ❤️ (optional message)"
        value={info.recipientMessage}
        onChange={(e) => setInfo({ ...info, recipientMessage: e.target.value })}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        className="rounded-full bg-rose-500 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
      >
        Confirm
      </button>
    </form>
  );
}
