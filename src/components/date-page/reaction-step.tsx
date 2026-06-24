"use client";

import { useState } from "react";
import { EditableText } from "./editable-text";
import type { ReactionConfig } from "@/lib/date-page-defaults";

export function ReactionStep({
  config,
  editable = false,
  onChange,
  onContinue,
}: {
  config: ReactionConfig;
  editable?: boolean;
  onChange?: (patch: Partial<ReactionConfig>) => void;
  onContinue: () => void;
}) {
  const [editingButton, setEditingButton] = useState(false);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="text-5xl">😭❤️</span>
      <EditableText
        as="h1"
        className="text-2xl font-semibold text-[var(--dp-heading)]"
        value={config.message}
        editable={editable}
        onChange={(value) => onChange?.({ message: value })}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={onContinue}
          className="rounded-full bg-[var(--dp-accent)] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[var(--dp-accent-hover)]"
        >
          {config.buttonText}
        </button>
        {editable && (
          <button
            type="button"
            onClick={() => setEditingButton((v) => !v)}
            aria-label="Edit button text"
            className="rounded-full bg-white/80 p-1.5 text-rose-500 shadow-sm"
          >
            ✏️
          </button>
        )}
      </div>

      {editable && editingButton && (
        <input
          className="field w-full max-w-xs"
          value={config.buttonText}
          onChange={(e) => onChange?.({ buttonText: e.target.value })}
          autoFocus
        />
      )}
    </div>
  );
}
